-- REFERENCE ONLY: not applied or wired to the current SQLite runtime.
-- Requires Supabase Auth. Use a separate schema to preserve V1 tables.
BEGIN;
CREATE SCHEMA IF NOT EXISTS cofolio_v2;
GRANT USAGE ON SCHEMA cofolio_v2 TO authenticated;

CREATE TABLE cofolio_v2.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE cofolio_v2.target_roles (
  id text PRIMARY KEY,
  label text NOT NULL
);
INSERT INTO cofolio_v2.target_roles VALUES
  ('backend', '백엔드 개발자'), ('frontend', '프론트엔드 개발자'),
  ('ai', 'AI 엔지니어'), ('game', '게임 프로그래머');

CREATE TABLE cofolio_v2.portfolios (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE REFERENCES cofolio_v2.users(id) ON DELETE CASCADE,
  role_id text NOT NULL REFERENCES cofolio_v2.target_roles(id),
  document jsonb NOT NULL,
  revision integer NOT NULL DEFAULT 0 CHECK (revision >= 0),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id, user_id)
);
CREATE TABLE cofolio_v2.projects (
  id uuid PRIMARY KEY,
  portfolio_id uuid NOT NULL,
  user_id uuid NOT NULL,
  position integer NOT NULL CHECK (position >= 0),
  document jsonb NOT NULL,
  FOREIGN KEY (portfolio_id, user_id) REFERENCES cofolio_v2.portfolios(id, user_id) ON DELETE CASCADE,
  UNIQUE (id, user_id)
);
CREATE TABLE cofolio_v2.evidence (
  id text PRIMARY KEY,
  project_id uuid NOT NULL,
  user_id uuid NOT NULL,
  document jsonb NOT NULL,
  FOREIGN KEY (project_id, user_id) REFERENCES cofolio_v2.projects(id, user_id) ON DELETE CASCADE
);
CREATE TABLE cofolio_v2.analyses (
  id uuid PRIMARY KEY,
  project_id uuid NOT NULL,
  user_id uuid NOT NULL,
  role_id text NOT NULL REFERENCES cofolio_v2.target_roles(id),
  document jsonb NOT NULL,
  FOREIGN KEY (project_id, user_id) REFERENCES cofolio_v2.projects(id, user_id) ON DELETE CASCADE
);
CREATE TABLE cofolio_v2.suggestions (
  id uuid PRIMARY KEY,
  project_id uuid NOT NULL,
  user_id uuid NOT NULL,
  document jsonb NOT NULL,
  FOREIGN KEY (project_id, user_id) REFERENCES cofolio_v2.projects(id, user_id) ON DELETE CASCADE
);
CREATE INDEX ON cofolio_v2.projects(portfolio_id);
CREATE INDEX ON cofolio_v2.evidence(project_id);
CREATE INDEX ON cofolio_v2.analyses(project_id);
CREATE INDEX ON cofolio_v2.suggestions(project_id);

ALTER TABLE cofolio_v2.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY own_profile ON cofolio_v2.users FOR ALL TO authenticated
  USING ((SELECT auth.uid()) = id) WITH CHECK ((SELECT auth.uid()) = id);
ALTER TABLE cofolio_v2.target_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY read_roles ON cofolio_v2.target_roles FOR SELECT TO authenticated USING (true);
GRANT SELECT, INSERT, UPDATE, DELETE ON cofolio_v2.users TO authenticated;
GRANT SELECT ON cofolio_v2.target_roles TO authenticated;

-- Owner IDs cannot be changed to another user, including through a parent FK.
DO $$
DECLARE relation_name text;
BEGIN
  FOREACH relation_name IN ARRAY ARRAY['portfolios', 'projects', 'evidence', 'analyses', 'suggestions'] LOOP
    EXECUTE format('ALTER TABLE cofolio_v2.%I ENABLE ROW LEVEL SECURITY', relation_name);
    EXECUTE format('CREATE POLICY own_rows ON cofolio_v2.%I FOR ALL TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id)', relation_name);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON cofolio_v2.%I TO authenticated', relation_name);
    EXECUTE format('CREATE INDEX ON cofolio_v2.%I(user_id)', relation_name);
  END LOOP;
END $$;
COMMIT;

-- Before use: expose this schema, implement Supabase Auth and a transactional
-- revision-checked save adapter, then test two-user RLS with real JWTs.
-- Never put service-role credentials in the browser. SQL alone is not an adapter.
