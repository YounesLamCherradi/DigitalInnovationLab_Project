CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role text NOT NULL DEFAULT 'manager' CHECK (role IN ('administrator', 'manager')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  last_sign_in_at timestamptz
);

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL, category text NOT NULL,
  description text NOT NULL, image text NOT NULL, technologies text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'planning' CHECK (status IN ('completed','in-progress','planning')),
  website_link text, github_link text, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL, department text NOT NULL, level text NOT NULL,
  type text NOT NULL, description text NOT NULL, requirements text[] NOT NULL DEFAULT '{}', deadline date NOT NULL,
  school text, term text, education_level text, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, role text NOT NULL, bio text NOT NULL, image text NOT NULL,
  section text NOT NULL CHECK (section IN ('board','research','lab-staff')), keywords text[] NOT NULL DEFAULT '{}',
  linkedin_url text, twitter_url text, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL, content text NOT NULL, image text, category text, author text,
  featured boolean NOT NULL DEFAULT false, published_at timestamptz NOT NULL DEFAULT now(), link text,
  publication_status text NOT NULL DEFAULT 'published' CHECK (publication_status IN ('draft','published','scheduled')),
  scheduled_for timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), full_name text NOT NULL, email text NOT NULL, phone text NOT NULL, position text NOT NULL,
  opportunity_id uuid REFERENCES opportunities(id) ON DELETE SET NULL, cover_letter text NOT NULL, resume_url text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','rejected')), internal_notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS application_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), application_id uuid NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  previous_status text NOT NULL, new_status text NOT NULL, changed_by uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, email text NOT NULL, phone text, subject text NOT NULL,
  message text NOT NULL, status text NOT NULL DEFAULT 'new', created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS projects_created_at_idx ON projects (created_at DESC);
CREATE INDEX IF NOT EXISTS opportunities_deadline_idx ON opportunities (deadline ASC);
CREATE INDEX IF NOT EXISTS team_members_name_idx ON team_members (name ASC);
CREATE INDEX IF NOT EXISTS news_published_at_idx ON news (published_at DESC);
CREATE INDEX IF NOT EXISTS applications_created_at_idx ON applications (created_at DESC);
CREATE INDEX IF NOT EXISTS application_status_history_application_idx ON application_status_history (application_id, created_at DESC);

-- Create the first administrator with the setup command documented in README.md.
