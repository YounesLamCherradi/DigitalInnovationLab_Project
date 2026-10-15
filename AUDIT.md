# Digital Innovation Lab audit

## Completed in this source tree

- Confirmed there is no Builder.io SDK, API key, import, runtime request, or package dependency.
- Replaced generic starter branding and metadata.
- Fixed TypeScript models that had drifted from the fields used by the UI.
- Added server-side administrator and manager authorization.
- Replaced Supabase Auth with signed, HTTP-only cookie sessions.
- Made the application decision dialog honest: it updates status, but does not claim to send email.
- Fixed the Express 5 SPA fallback that previously crashed the production server.
- Added basic SEO metadata, environment-file protection, reduced-motion handling, and background-tab animation throttling.

## Required PostgreSQL setup

1. Back up the source database.
2. Set `DATABASE_URL` and a strong `SESSION_SECRET` in `.env`.
3. Run `npm run db:schema`.
4. Run `npm run create-admin -- admin@example.com 'a-long-temporary-password'`.
5. Follow `POSTGRES_MIGRATION.md` to copy existing records and uploaded images.

### Dashboard roles

- `administrator`: all content tabs, Applications, and Dashboard Users.
- `manager`: News, Projects, Opportunities, and Team Members only.
- Existing Supabase Auth accounts must be recreated because password hashes are not exported.

## Still needs product/infrastructure decisions

- **Decision emails:** no email provider is implemented. Add a trusted server endpoint that verifies administrator access and keeps provider credentials server-side.
- **Resumes:** the form accepts a PDF in the UI, but the submit path stores neither the file nor a URL. Use private object storage, file validation, signed admin downloads, and retention rules.
- **Spam protection:** public application/contact endpoints should have rate limiting and CAPTCHA/Turnstile verification.
- **Live verification:** authentication and real data flows require a reachable PostgreSQL instance configured through `DATABASE_URL`.
- **Newsletter:** the email field on the News page is presentation-only and does not subscribe anyone.

## Deployment requirements

- If deploying the included Node server, use `npm run build` then `npm start`; it serves SPA route fallbacks correctly.
- If deploying only `dist/spa` to static hosting, configure all non-file routes to rewrite to `/index.html` or browser refreshes will return 404.
- Configure `ALLOWED_ORIGINS` for the production domain if the server APIs are retained.

## Verification performed

- `npm run typecheck`
- `npm test` (5 tests passed)
- `npm run build` (client and server passed)
- `npm audit --omit=dev` (0 known vulnerabilities)
- Production server startup
- Direct requests to `/`, `/admin`, and `/projects` returned the SPA; `/api/ping` returned JSON and an unknown API route returned 404 JSON.
