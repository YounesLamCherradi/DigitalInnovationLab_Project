import type { NextFunction, Request, Response } from "express";
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { pool } from "./database";

export type AdminRole = "administrator" | "manager";
export type AuthUser = { id: string; email: string; role: AdminRole };

const COOKIE = "dil_session";
const TTL_SECONDS = 60 * 60 * 24 * 7;

function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value && process.env.NODE_ENV === "production") throw new Error("SESSION_SECRET is required in production");
  return value || "development-only-session-secret-change-me";
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function makeSession(user: AuthUser) {
  const payload = Buffer.from(JSON.stringify({ ...user, exp: Math.floor(Date.now() / 1000) + TTL_SECONDS })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function readSession(req: Request): AuthUser | null {
  const raw = req.headers.cookie?.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1);
  if (!raw) return null;
  const [payload, signature] = raw.split(".");
  if (!payload || !signature) return null;
  const expected = sign(payload);
  if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString()) as AuthUser & { exp: number };
    return parsed.exp > Date.now() / 1000 ? { id: parsed.id, email: parsed.email, role: parsed.role } : null;
  } catch { return null; }
}

export function setSession(res: Response, user: AuthUser) {
  res.cookie(COOKIE, makeSession(user), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: TTL_SECONDS * 1000, path: "/" });
}

export function clearSession(res: Response) { res.clearCookie(COOKIE, { path: "/" }); }

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

export function verifyPassword(password: string, encoded: string) {
  const [salt, stored] = encoded.split(":");
  if (!salt || !stored) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(stored, "hex");
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}

declare global { namespace Express { interface Request { admin?: AuthUser } } }

export async function requireContentAccess(req: Request, res: Response, next: NextFunction) {
  const session = readSession(req);
  if (!session) return res.status(401).json({ error: "Authentication required" });
  const result = await pool.query("SELECT id, email, role FROM admin_users WHERE id = $1", [session.id]);
  if (!result.rowCount) return res.status(401).json({ error: "Session is no longer valid" });
  req.admin = result.rows[0];
  next();
}

export function requireAdministrator(req: Request, res: Response, next: NextFunction) {
  requireContentAccess(req, res, () => req.admin?.role === "administrator" ? next() : res.status(403).json({ error: "Administrator access required" }));
}

