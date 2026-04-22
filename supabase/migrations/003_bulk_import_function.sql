-- Migration 003: Bulk import RPC function
-- Lets the import script use the anon key (SECURITY DEFINER bypasses RLS).
-- An import secret prevents public abuse.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Private config table — no RLS policies means only service_role + SECURITY DEFINER functions can read it.
CREATE TABLE IF NOT EXISTS _import_config (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
ALTER TABLE _import_config ENABLE ROW LEVEL SECURITY;

-- Seed the import secret hash.  Rotate by updating this row.
-- Plaintext secret lives in .env.local as SUPABASE_IMPORT_SECRET.
INSERT INTO _import_config (key, value)
VALUES ('import_secret_hash', crypt('hg-import-k9mP3nQr7vX2', gen_salt('bf')))
ON CONFLICT (key) DO NOTHING;

-- ── bulk_import_soldiers ──────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION bulk_import_soldiers(
  p_records       jsonb,
  p_import_secret text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  _stored_hash  TEXT;
  _rec          jsonb;
  _inserted     integer := 0;
  _skipped      integer := 0;
  _errors       integer := 0;
BEGIN
  -- Verify import secret against stored bcrypt hash
  SELECT value INTO _stored_hash
  FROM   _import_config
  WHERE  key = 'import_secret_hash';

  IF _stored_hash IS NULL OR _stored_hash != extensions.crypt(p_import_secret, _stored_hash) THEN
    RAISE EXCEPTION 'Invalid import secret';
  END IF;

  -- Insert records one-by-one with ON CONFLICT DO NOTHING
  FOR _rec IN SELECT * FROM jsonb_array_elements(p_records)
  LOOP
    BEGIN
      INSERT INTO soldiers (
        last_name, first_name, rank, branch, status, era,
        date_of_casualty, date_of_birth, age_at_casualty,
        battle_location, battle_lat, battle_lng,
        unit, service_number, source_url, source_label, notes
      ) VALUES (
        _rec->>'last_name',
        _rec->>'first_name',
        NULLIF(trim(_rec->>'rank'),           ''),
        _rec->>'branch',
        _rec->>'status',
        _rec->>'era',
        (_rec->>'date_of_casualty')::date,
        NULLIF(trim(_rec->>'date_of_birth'),  '')::date,
        NULLIF(trim(_rec->>'age_at_casualty'),'')::integer,
        _rec->>'battle_location',
        (_rec->>'battle_lat')::double precision,
        (_rec->>'battle_lng')::double precision,
        NULLIF(trim(_rec->>'unit'),           ''),
        NULLIF(trim(_rec->>'service_number'), ''),
        NULLIF(trim(_rec->>'source_url'),     ''),
        NULLIF(trim(_rec->>'source_label'),   ''),
        NULLIF(trim(_rec->>'notes'),          '')
      )
      ON CONFLICT DO NOTHING;

      IF FOUND THEN
        _inserted := _inserted + 1;
      ELSE
        _skipped  := _skipped  + 1;
      END IF;

    EXCEPTION WHEN OTHERS THEN
      _errors := _errors + 1;
    END;
  END LOOP;

  RETURN jsonb_build_object(
    'inserted', _inserted,
    'skipped',  _skipped,
    'errors',   _errors
  );
END;
$$;

-- Grant execute to anon so the import script (anon key) can call it.
-- The secret check inside prevents public abuse.
GRANT EXECUTE ON FUNCTION bulk_import_soldiers(jsonb, text) TO anon;
GRANT EXECUTE ON FUNCTION bulk_import_soldiers(jsonb, text) TO authenticated;
