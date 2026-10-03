-- Vercel V2: Supabase Auth + isolated tables. Existing V1 tables are preserved.
-- Apply once, then the migration is recorded below.
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

-- Keep the private schema out of the Data API. Only these authenticated RPCs
-- are exposed through public. SECURITY INVOKER preserves all RLS policies.
CREATE FUNCTION public.cofolio_v2_load() RETURNS jsonb
LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
DECLARE result jsonb;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'AUTH_REQUIRED' USING ERRCODE = '42501'; END IF;
  SELECT jsonb_build_object('workspace', document, 'revision', revision)
    INTO result FROM cofolio_v2.portfolios WHERE user_id = auth.uid();
  RETURN result;
END $$;

CREATE FUNCTION public.cofolio_v2_save(payload jsonb, expected_revision integer) RETURNS integer
LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
<<workspace_save>>
DECLARE
  owner_id uuid := auth.uid();
  portfolio_id uuid;
  saved_id uuid;
  saved_revision integer;
  next_revision integer;
  project jsonb;
  entry jsonb;
  project_id uuid;
  project_position integer := 0;
BEGIN
  IF owner_id IS NULL THEN RAISE EXCEPTION 'AUTH_REQUIRED' USING ERRCODE = '42501'; END IF;
  IF expected_revision < 0 OR expected_revision IS NULL OR
    payload->>'version' IS DISTINCT FROM '2' OR
    jsonb_typeof(payload->'projects') IS DISTINCT FROM 'array' OR
    jsonb_array_length(payload->'projects') > 40 OR octet_length(payload::text) > 2000000
    THEN RAISE EXCEPTION 'INVALID_WORKSPACE' USING ERRCODE = '22023'; END IF;
  portfolio_id := (payload->>'id')::uuid;
  -- Serializes first saves as well as updates for a single owner.
  PERFORM pg_advisory_xact_lock(hashtextextended(owner_id::text, 0));
  SELECT id, revision INTO saved_id, saved_revision FROM cofolio_v2.portfolios
    WHERE user_id = owner_id FOR UPDATE;
  IF (saved_id IS NOT NULL AND (saved_id <> portfolio_id OR saved_revision <> expected_revision)) OR
    (saved_id IS NULL AND expected_revision <> 0)
    THEN RAISE EXCEPTION 'WORKSPACE_CONFLICT' USING ERRCODE = 'PT409'; END IF;
  next_revision := expected_revision + 1;
  INSERT INTO cofolio_v2.users(id, name)
    VALUES(owner_id, left(coalesce(nullif(payload->'profile'->>'name', ''), '개발자'), 100))
    ON CONFLICT(id) DO NOTHING;
  IF saved_id IS NULL THEN
    INSERT INTO cofolio_v2.portfolios(id, user_id, role_id, document, revision)
      VALUES(portfolio_id, owner_id, payload->>'role', payload, next_revision);
  ELSE
    UPDATE cofolio_v2.portfolios SET role_id = payload->>'role', document = payload,
      revision = next_revision, updated_at = now() WHERE id = portfolio_id AND user_id = owner_id;
  END IF;
  DELETE FROM cofolio_v2.projects WHERE projects.portfolio_id = workspace_save.portfolio_id AND user_id = owner_id;
  FOR project IN SELECT value FROM jsonb_array_elements(payload->'projects') LOOP
    project_id := (project->>'id')::uuid;
    IF jsonb_array_length(coalesce(project->'evidence', '[]'::jsonb)) > 60 OR
      jsonb_array_length(coalesce(project->'suggestions', '[]'::jsonb)) > 50
      THEN RAISE EXCEPTION 'INVALID_PROJECT' USING ERRCODE = '22023'; END IF;
    INSERT INTO cofolio_v2.projects(id, portfolio_id, user_id, position, document)
      VALUES(project_id, portfolio_id, owner_id, project_position, project);
    project_position := project_position + 1;
    FOR entry IN SELECT value FROM jsonb_array_elements(coalesce(project->'evidence', '[]'::jsonb)) LOOP
      INSERT INTO cofolio_v2.evidence(id, project_id, user_id, document) VALUES(entry->>'id', project_id, owner_id, entry);
    END LOOP;
    IF jsonb_typeof(project->'analysis') = 'object' THEN
      entry := project->'analysis';
      INSERT INTO cofolio_v2.analyses(id, project_id, user_id, role_id, document)
        VALUES((entry->>'id')::uuid, project_id, owner_id, entry->>'role', entry);
    END IF;
    FOR entry IN SELECT value FROM jsonb_array_elements(coalesce(project->'suggestions', '[]'::jsonb)) LOOP
      INSERT INTO cofolio_v2.suggestions(id, project_id, user_id, document)
        VALUES((entry->>'id')::uuid, project_id, owner_id, entry);
    END LOOP;
  END LOOP;
  RETURN next_revision;
END $$;

REVOKE ALL ON FUNCTION public.cofolio_v2_load() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.cofolio_v2_save(jsonb, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.cofolio_v2_load() TO authenticated;
GRANT EXECUTE ON FUNCTION public.cofolio_v2_save(jsonb, integer) TO authenticated;

CREATE TABLE cofolio_v2.schema_migrations (version text PRIMARY KEY, applied_at timestamptz DEFAULT now());
INSERT INTO cofolio_v2.schema_migrations(version) VALUES ('202609110001');
ALTER TABLE cofolio_v2.schema_migrations ENABLE ROW LEVEL SECURITY;
NOTIFY pgrst, 'reload schema';
COMMIT;
