import "dotenv/config";
import express from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import expressStatic from "express";
import { apiRouter, uploadRoot } from "./api";

const ALLOWED_ORIGINS = [
  ...(process.env.NODE_ENV !== "production" ? ["http://localhost:8080", "http://localhost:3000"] : []),
  ...(process.env.ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),
];
const LOCAL_DEVELOPMENT_ORIGIN = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

export function createServer() {
  const app = express();
  const httpsOrigin = process.env.SITE_URL?.replace(/\/$/, "");
  if (process.env.NODE_ENV === "production" && process.env.ENFORCE_HTTPS === "true" && !httpsOrigin) throw new Error("SITE_URL is required when HTTPS enforcement is enabled");
  app.disable("x-powered-by");
  if (process.env.TRUST_PROXY === "true") app.set("trust proxy", 1);
  app.use(compression());
  const productionSecurity = process.env.NODE_ENV === "production";
  app.use(helmet({
    contentSecurityPolicy: productionSecurity ? {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'sha256-938Vk8XhQwQqMwpiDubZkJ3Lplr39P2NKwsIbUPfWLM='"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        mediaSrc: ["'self'", "blob:"],
        connectSrc: ["'self'"],
        frameSrc: ["'self'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests:
          process.env.NODE_ENV === "production" && process.env.ENFORCE_HTTPS === "true"
            ? []
            : null,
      },
    } : false,
    crossOriginEmbedderPolicy: false,
    hsts: process.env.NODE_ENV === "production" && process.env.ENFORCE_HTTPS === "true" ? { maxAge: 31536000, includeSubDomains: true, preload: true } : false,
  }));

  if (process.env.NODE_ENV === "production" && process.env.ENFORCE_HTTPS === "true") {
    app.use((req, res, next) => req.secure ? next() : res.redirect(308, `${httpsOrigin}${req.originalUrl}`));
  }

  // CORS — restrict to known origins in production
  app.use(
    cors({
      origin: (origin, cb) => {
        // Allow requests with no origin (server-to-server, curl) or known origins
        if (
          !origin ||
          ALLOWED_ORIGINS.includes(origin) ||
          (process.env.NODE_ENV !== "production" && LOCAL_DEVELOPMENT_ORIGIN.test(origin))
        ) {
          cb(null, true);
        } else {
          const error = new Error(`CORS: origin ${origin} not allowed`) as Error & { status: number };
          error.status = 403;
          cb(error);
        }
      },
      credentials: true,
    })
  );

  // Security headers
  app.use((_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    next();
  });

  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));

  app.use((req, res, next) => {
    if (!["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) return next();
    const origin = req.get("origin");
    if (!origin || ALLOWED_ORIGINS.includes(origin) || (process.env.NODE_ENV !== "production" && LOCAL_DEVELOPMENT_ORIGIN.test(origin))) return next();
    return res.status(403).json({ error: "Request origin is not allowed" });
  });

  const siteUrl = (process.env.SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  const publicRoutes = ["", "/apply", "/team", "/projects", "/partners", "/news", "/contact"];
  app.get("/sitemap.xml", (_req, res) => {
    res.type("application/xml").send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${publicRoutes.map((route) => `<url><loc>${siteUrl}${route || "/"}</loc></url>`).join("")}</urlset>`);
  });
  app.get("/robots.txt", (_req, res) => {
    res.type("text/plain").send(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /admin-login\nSitemap: ${siteUrl}/sitemap.xml\n`);
  });

  app.use("/uploads", expressStatic.static(uploadRoot, { maxAge: "1d", immutable: false }));
  app.use("/api", apiRouter);

  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error("Request failed", error);
    if (res.headersSent) return;
    const status = typeof error === "object" && error && "status" in error ? Number(error.status) : 500;
    res.status(status >= 400 && status < 600 ? status : 500).json({ error: status >= 500 ? "Internal server error" : "Request failed" });
  });

  return app;
}
