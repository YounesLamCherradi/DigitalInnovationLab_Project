# PostgreSQL setup and Supabase migration

## 1. Configure and create the schema

Copy `.env.example` to `.env`, set `DATABASE_URL` and a strong random `SESSION_SECRET`, then run:

```bash
npm run db:schema
npm run create-admin -- admin@example.com 'a-long-temporary-password'
```

The administrator can sign in at `/admin-login` and create additional dashboard users.

## 2. Copy existing Supabase data

Use the direct database connection strings from Supabase and the destination PostgreSQL host. The table-only dump avoids Supabase's internal Auth and Storage schemas:

```bash
pg_dump "$SUPABASE_DATABASE_URL" --data-only --no-owner --no-privileges \
  --table=public.projects --table=public.opportunities --table=public.team_members \
  --table=public.news --table=public.applications --table=public.contact_submissions \
  > dil-data.sql
psql "$DATABASE_URL" -f dil-data.sql
```

Supabase Auth password hashes are intentionally not imported. Recreate dashboard users with `npm run create-admin` or through the Dashboard Users screen.

## 3. Move uploaded images

Download the `team-members` and `news` buckets from Supabase Storage and place the files in `UPLOAD_DIR` (defaults to `uploads`). Existing database image URLs still point to Supabase; update those rows to `/uploads/<filename>` after copying. New images are stored by the Express server automatically.

For production, mount `UPLOAD_DIR` on persistent storage or replace the upload adapter with an S3-compatible object store.
