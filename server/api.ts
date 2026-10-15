import { Router } from "express";
import multer from "multer";
import path from "path";
import { mkdirSync } from "fs";
import { writeFile, unlink } from "fs/promises";
import { randomUUID } from "crypto";
import { z } from "zod";
import { rateLimit } from "express-rate-limit";
import { pool } from "./database";
import { clearSession, hashPassword, readSession, requireAdministrator, requireContentAccess, setSession, verifyPassword } from "./auth";
import { sendEmail } from "./email";

const router = Router();
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: "draft-8", legacyHeaders: false, message: { error: "Too many login attempts. Please try again later." } });
const submissionLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 8, standardHeaders: "draft-8", legacyHeaders: false, message: { error: "Too many submissions. Please try again later." } });
const privateResumeRoot = path.resolve(process.env.RESUME_DIR || "private/resumes");
mkdirSync(privateResumeRoot, { recursive: true });
const publicTables = new Set(["projects", "opportunities", "team_members", "news"]);
const writableTables = new Set(["projects", "opportunities", "team_members", "news"]);
const insertOnlyTables = new Set(["contact_submissions"]);
const adminOnlyTables = new Set(["applications"]);
const columns: Record<string, Set<string>> = {
  projects: new Set(["title", "category", "description", "image", "technologies", "status", "website_link", "github_link"]),
  opportunities: new Set(["title", "department", "level", "type", "description", "requirements", "deadline", "school", "term", "education_level"]),
  team_members: new Set(["name", "role", "bio", "image", "section", "keywords", "linkedin_url", "twitter_url"]),
  news: new Set(["title", "content", "image", "category", "author", "featured", "published_at", "link", "publication_status", "scheduled_for"]),
  applications: new Set(["full_name", "email", "phone", "position", "opportunity_id", "cover_letter", "resume_url", "status", "updated_at"]),
  contact_submissions: new Set(["name", "email", "phone", "subject", "message"]),
};
const orderColumns: Record<string, Set<string>> = {
  projects: new Set(["created_at"]), opportunities: new Set(["deadline"]), team_members: new Set(["name"]),
  news: new Set(["published_at"]), applications: new Set(["created_at"]),
};

function cleanPayload(table: string, body: unknown) {
  const input = (Array.isArray(body) ? body[0] : body) as Record<string, unknown>;
  if (!input || typeof input !== "object") throw new Error("Invalid request body");
  return Object.fromEntries(Object.entries(input).filter(([key]) => columns[table]?.has(key)));
}

router.get("/auth/session", async (req, res) => {
  const session = readSession(req);
  if (!session) return res.json({ user: null });
  const result = await pool.query("SELECT id, email, role FROM admin_users WHERE id = $1", [session.id]);
  res.json({ user: result.rows[0] || null });
});

router.post("/auth/login", loginLimiter, async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const result = await pool.query("SELECT id, email, role, password_hash FROM admin_users WHERE email = $1", [email]);
  const user = result.rows[0];
  if (!user || !verifyPassword(String(req.body.password || ""), user.password_hash)) return res.status(401).json({ error: "Invalid email or password" });
  await pool.query("UPDATE admin_users SET last_sign_in_at = now() WHERE id = $1", [user.id]);
  setSession(res, { id: user.id, email: user.email, role: user.role });
  res.json({ user: { id: user.id, email: user.email, role: user.role } });
});

router.post("/auth/logout", (_req, res) => { clearSession(res); res.status(204).end(); });
router.put("/auth/password", requireContentAccess, async (req, res) => {
  const password = String(req.body.password || "");
  if (password.length < 8) return res.status(400).json({ error: "Password must contain at least 8 characters" });
  await pool.query("UPDATE admin_users SET password_hash = $1, updated_at = now() WHERE id = $2", [hashPassword(password), req.admin!.id]);
  res.status(204).end();
});

const applicationUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1, fields: 10 },
  fileFilter: (_req, file, cb) => cb(null, file.mimetype === "application/pdf"),
});
const applicationInput = z.object({
  full_name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  phone: z.string().trim().min(5).max(30),
  position: z.string().trim().min(1).max(200),
  opportunity_id: z.string().uuid().optional().or(z.literal("")),
  cover_letter: z.string().trim().min(20).max(5000),
});

router.post("/applications", submissionLimiter, applicationUpload.single("resume"), async (req, res, next) => {
  const parsed = applicationInput.safeParse(req.body);
  if (!parsed.success || !req.file || req.file.buffer.subarray(0, 5).toString() !== "%PDF-") {
    return res.status(400).json({ error: "A valid application and PDF résumé (maximum 5 MB) are required" });
  }
  const id = randomUUID();
  const resumePath = path.join(privateResumeRoot, `${id}.pdf`);
  try {
    await writeFile(resumePath, req.file.buffer, { flag: "wx", mode: 0o600 });
    await pool.query(
      `INSERT INTO applications (id, full_name, email, phone, position, opportunity_id, cover_letter, resume_url, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'pending')`,
      [id, parsed.data.full_name, parsed.data.email, parsed.data.phone, parsed.data.position,
       parsed.data.opportunity_id || null, parsed.data.cover_letter, `/api/applications/${id}/resume`],
    );
    const receipt = `Dear ${parsed.data.full_name},\n\nWe received your application for ${parsed.data.position}. Our team will review it and contact you if further information is needed.\n\nDigital Innovation Laboratory`;
    await sendEmail({ to: parsed.data.email, subject: "Application received", text: receipt }).catch((error) => console.error("Application receipt email failed", error));
    if (process.env.ADMIN_NOTIFICATION_EMAIL) {
      await sendEmail({ to: process.env.ADMIN_NOTIFICATION_EMAIL, subject: `New application: ${parsed.data.position}`, text: `${parsed.data.full_name} (${parsed.data.email}) submitted a new application.` }).catch((error) => console.error("Admin notification email failed", error));
    }
    res.status(201).json({ id });
  } catch (error) {
    await unlink(resumePath).catch(() => undefined);
    next(error);
  }
});

router.get("/applications/:id/resume", requireAdministrator, async (req, res) => {
  const id = String(req.params.id);
  if (!z.string().uuid().safeParse(id).success) return res.status(400).json({ error: "Invalid application" });
  const result = await pool.query("SELECT full_name, resume_url FROM applications WHERE id = $1", [id]);
  if (!result.rowCount || !result.rows[0].resume_url) return res.status(404).json({ error: "Résumé not found" });
  const safeName = String(result.rows[0].full_name).replace(/[^a-zA-Z0-9_-]+/g, "-").slice(0, 80) || "applicant";
  res.download(path.join(privateResumeRoot, `${id}.pdf`), `${safeName}-resume.pdf`);
});

router.get("/applications/:id/history", requireAdministrator, async (req, res) => {
  const id = String(req.params.id);
  if (!z.string().uuid().safeParse(id).success) return res.status(400).json({ error: "Invalid application" });
  const result = await pool.query(
    `SELECT h.id, h.previous_status, h.new_status, h.created_at, u.email AS changed_by
     FROM application_status_history h LEFT JOIN admin_users u ON u.id = h.changed_by
     WHERE h.application_id = $1 ORDER BY h.created_at DESC`, [id],
  );
  res.json(result.rows);
});

router.patch("/applications/:id/notes", requireAdministrator, async (req, res) => {
  const id = String(req.params.id);
  const input = z.object({ notes: z.string().max(10000) }).safeParse(req.body);
  if (!z.string().uuid().safeParse(id).success || !input.success) return res.status(400).json({ error: "Invalid notes" });
  const result = await pool.query("UPDATE applications SET internal_notes = $1, updated_at = now() WHERE id = $2 RETURNING internal_notes, updated_at", [input.data.notes, id]);
  if (!result.rowCount) return res.status(404).json({ error: "Application not found" });
  res.json(result.rows[0]);
});

router.post("/applications/:id/decision", requireAdministrator, async (req, res) => {
  const id = String(req.params.id);
  const input = z.object({ status: z.enum(["pending", "accepted", "rejected"]), emailBody: z.string().max(10000).optional().default("") }).safeParse(req.body);
  if (!z.string().uuid().safeParse(id).success || !input.success) return res.status(400).json({ error: "Invalid decision" });
  if (input.data.status !== "pending" && input.data.emailBody.length < 20) return res.status(400).json({ error: "An applicant message is required" });
  const client = await pool.connect();
  let result;
  try {
    await client.query("BEGIN");
    const current = await client.query("SELECT status, email FROM applications WHERE id = $1 FOR UPDATE", [id]);
    if (!current.rowCount) { await client.query("ROLLBACK"); return res.status(404).json({ error: "Application not found" }); }
    result = await client.query("UPDATE applications SET status = $1, updated_at = now() WHERE id = $2 RETURNING email", [input.data.status, id]);
    if (current.rows[0].status !== input.data.status) await client.query(
      "INSERT INTO application_status_history (application_id, previous_status, new_status, changed_by) VALUES ($1,$2,$3,$4)",
      [id, current.rows[0].status, input.data.status, req.admin!.id],
    );
    await client.query("COMMIT");
  } catch (error) { await client.query("ROLLBACK"); throw error; } finally { client.release(); }
  const emailSent = input.data.status === "pending" ? false : await sendEmail({ to: result.rows[0].email, subject: `Application ${input.data.status}`, text: input.data.emailBody }).catch((error) => { console.error("Decision email failed", error); return false; });
  res.json({ status: input.data.status, emailSent });
});

router.get("/tables/:table", async (req, res, next) => {
  const table = String(req.params.table);
  if (!columns[table]) return res.status(404).json({ error: "Unknown resource" });
  const continueRead = async () => {
    const order = String(req.query.order || "");
    const direction = req.query.ascending === "true" ? "ASC" : "DESC";
    const orderSql = order && orderColumns[table]?.has(order) ? ` ORDER BY ${order} ${direction}` : "";
    const adminScope = req.query.scope === "admin" && Boolean(readSession(req));
    const whereSql = table === "news" && !adminScope
      ? " WHERE publication_status = 'published' OR (publication_status = 'scheduled' AND scheduled_for <= now())"
      : "";
    const result = await pool.query(`SELECT * FROM ${table}${whereSql}${orderSql}`);
    if (publicTables.has(table)) res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
    res.json(result.rows);
  };
  if (publicTables.has(table)) return continueRead();
  (adminOnlyTables.has(table) ? requireAdministrator : requireContentAccess)(req, res, () => continueRead().catch(next));
});

router.post("/tables/:table", async (req, res, next) => {
  const table = String(req.params.table);
  if (!writableTables.has(table) && !insertOnlyTables.has(table)) return res.status(404).json({ error: "Unknown resource" });
  const insert = async () => {
    const data = cleanPayload(table, req.body);
    const keys = Object.keys(data);
    if (!keys.length) return res.status(400).json({ error: "No valid fields supplied" });
    const values = keys.map((key) => data[key]);
    const result = await pool.query(`INSERT INTO ${table} (${keys.join(",")}) VALUES (${keys.map((_, i) => `$${i + 1}`).join(",")}) RETURNING *`, values);
    res.status(201).json(result.rows);
  };
  if (insertOnlyTables.has(table)) return submissionLimiter(req, res, () => insert().catch(next));
  requireContentAccess(req, res, () => insert().catch(next));
});

router.patch("/tables/:table/:id", requireContentAccess, async (req, res) => {
  const table = String(req.params.table);
  if (!writableTables.has(table)) return res.status(404).json({ error: "Unknown resource" });
  const data = cleanPayload(table, req.body); const keys = Object.keys(data);
  const values = keys.map((key) => data[key]);
  const result = await pool.query(`UPDATE ${table} SET ${keys.map((key, i) => `${key} = $${i + 1}`).join(",")}, updated_at = now() WHERE id = $${keys.length + 1} RETURNING *`, [...values, req.params.id]);
  res.json(result.rows);
});

router.delete("/tables/:table/:id", requireContentAccess, async (req, res) => {
  const table = String(req.params.table);
  if (!writableTables.has(table)) return res.status(404).json({ error: "Unknown resource" });
  await pool.query(`DELETE FROM ${table} WHERE id = $1`, [req.params.id]); res.status(204).end();
});

router.post("/users/action", requireAdministrator, async (req, res) => {
  if (req.body.action === "list") {
    const result = await pool.query("SELECT id, email, role, created_at, last_sign_in_at FROM admin_users ORDER BY created_at ASC");
    return res.json({ users: result.rows });
  }
  if (req.body.action === "create") {
    const email = String(req.body.email || "").trim().toLowerCase(); const password = String(req.body.password || "");
    const role = req.body.role === "administrator" ? "administrator" : "manager";
    if (!email || password.length < 8) return res.status(400).json({ error: "A valid email and password of at least 8 characters are required" });
    const result = await pool.query("INSERT INTO admin_users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, role, created_at", [email, hashPassword(password), role]);
    return res.status(201).json({ user: result.rows[0] });
  }
  res.status(400).json({ error: "Unknown action" });
});

const uploadRoot = path.resolve(process.env.UPLOAD_DIR || "uploads"); mkdirSync(uploadRoot, { recursive: true });
const upload = multer({ storage: multer.diskStorage({ destination: uploadRoot, filename: (_req, file, cb) => cb(null, `${randomUUID()}${path.extname(file.originalname).toLowerCase()}`) }), limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: (_req, file, cb) => cb(null, ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(file.mimetype)) });
router.post("/uploads/:bucket", requireContentAccess, upload.single("file"), (req, res) => {
  if (!["team-members", "news"].includes(String(req.params.bucket)) || !req.file) return res.status(400).json({ error: "Invalid image upload" });
  res.status(201).json({ path: req.file.filename, publicUrl: `/uploads/${req.file.filename}` });
});

export { router as apiRouter, uploadRoot };
