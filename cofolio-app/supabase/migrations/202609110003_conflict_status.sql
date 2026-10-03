-- Use HTTP 409 to avoid PostgREST serialization-failure retries.
BEGIN;
CREATE OR REPLACE FUNCTION public.cofolio_v2_save(payload jsonb, expected_revision integer) RETURNS integer
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
INSERT INTO cofolio_v2.schema_migrations(version) VALUES ('202609110003') ON CONFLICT DO NOTHING;
NOTIFY pgrst, 'reload schema';
COMMIT;
