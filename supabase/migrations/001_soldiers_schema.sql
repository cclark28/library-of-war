-- ============================================================
-- Hallowed Ground — Core Schema
-- Migration 001: soldiers table + spatial index + RLS
-- ============================================================

-- Enable PostGIS for geographic queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- Enable trigram search for fuzzy name matching
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ── soldiers ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS soldiers (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identity
  first_name        TEXT        NOT NULL,
  last_name         TEXT        NOT NULL,
  rank              TEXT,
  branch            TEXT        NOT NULL
                    CHECK (branch IN ('army','navy','marines','air_force','coast_guard','special_forces')),

  -- Casualty
  status            TEXT        NOT NULL
                    CHECK (status IN ('kia','mia','wia','pow')),
  era               TEXT        NOT NULL
                    CHECK (era IN ('wwi','wwii','korea','vietnam','gulf','iraq','afghanistan')),
  date_of_casualty  DATE        NOT NULL,

  -- Birth — used for duplicate detection
  date_of_birth     DATE,
  age_at_casualty   INT,

  -- Location of loss
  battle_location   TEXT        NOT NULL,
  battle_lat        DOUBLE PRECISION NOT NULL,
  battle_lng        DOUBLE PRECISION NOT NULL,

  -- Generated spatial column (PostGIS)
  location          GEOGRAPHY(POINT, 4326)
                    GENERATED ALWAYS AS (
                      ST_SetSRID(ST_MakePoint(battle_lng, battle_lat), 4326)
                    ) STORED,

  -- Unit & service
  unit              TEXT,
  service_number    TEXT,

  -- Optional hometown (never shown publicly, for internal data only)
  hometown_city     TEXT,
  hometown_state    TEXT,

  -- Media & source
  photo_url         TEXT,
  photo_credit      TEXT,
  source_url        TEXT,
  source_label      TEXT,
  notes             TEXT,

  -- Audit
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ── Duplicate prevention ──────────────────────────────────────────────────────
-- Primary dedup key: last_name + first_name + date_of_casualty + rank + branch + battle_location
-- Covers the "same person, same record" case across bulk imports.
-- NULLS NOT DISTINCT means two NULL ranks are treated as equal (not unique).
CREATE UNIQUE INDEX IF NOT EXISTS idx_soldiers_dedup
  ON soldiers (
    lower(last_name),
    lower(first_name),
    date_of_casualty,
    lower(COALESCE(rank, '')),
    branch,
    lower(battle_location)
  );

-- Secondary: if date_of_birth is present, enforce uniqueness on birth + name + branch
CREATE UNIQUE INDEX IF NOT EXISTS idx_soldiers_dedup_dob
  ON soldiers (
    lower(last_name),
    lower(first_name),
    date_of_birth,
    branch
  )
  WHERE date_of_birth IS NOT NULL;

-- ── Spatial & filter indexes ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_soldiers_location ON soldiers USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_soldiers_era       ON soldiers (era);
CREATE INDEX IF NOT EXISTS idx_soldiers_status    ON soldiers (status);
CREATE INDEX IF NOT EXISTS idx_soldiers_branch    ON soldiers (branch);
CREATE INDEX IF NOT EXISTS idx_soldiers_casualty_date ON soldiers (date_of_casualty);

-- Trigram indexes for fuzzy search
CREATE INDEX IF NOT EXISTS idx_soldiers_last_trgm  ON soldiers USING GIN (last_name  gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_soldiers_first_trgm ON soldiers USING GIN (first_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_soldiers_unit_trgm  ON soldiers USING GIN (unit       gin_trgm_ops);

-- ── updated_at auto-trigger ───────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER soldiers_updated_at
  BEFORE UPDATE ON soldiers
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── RLS — public read, authenticated write ────────────────────────────────────
ALTER TABLE soldiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read soldiers"
  ON soldiers FOR SELECT TO anon
  USING (true);

CREATE POLICY "Authenticated write soldiers"
  ON soldiers FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated update soldiers"
  ON soldiers FOR UPDATE TO authenticated
  USING (true);

-- ── Viewport query function ───────────────────────────────────────────────────
-- Called from lib/soldiers.ts — returns soldiers within a bounding box.
-- p_era = NULL returns all eras.
CREATE OR REPLACE FUNCTION soldiers_in_viewport(
  min_lat DOUBLE PRECISION,
  max_lat DOUBLE PRECISION,
  min_lng DOUBLE PRECISION,
  max_lng DOUBLE PRECISION,
  p_era   TEXT DEFAULT NULL
)
RETURNS SETOF soldiers
LANGUAGE SQL STABLE
AS $$
  SELECT *
  FROM soldiers
  WHERE ST_Within(
    location::geometry,
    ST_MakeEnvelope(min_lng, min_lat, max_lng, max_lat, 4326)
  )
  AND (p_era IS NULL OR era = p_era)
  LIMIT 3000;
$$;

-- ── Duplicate check helper ────────────────────────────────────────────────────
-- Returns TRUE if a record with this identity already exists.
-- Used by the import script before inserting.
CREATE OR REPLACE FUNCTION soldier_is_duplicate(
  p_last_name       TEXT,
  p_first_name      TEXT,
  p_date_of_casualty DATE,
  p_rank            TEXT,
  p_branch          TEXT,
  p_battle_location TEXT
)
RETURNS BOOLEAN
LANGUAGE SQL STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM soldiers
    WHERE lower(last_name)       = lower(p_last_name)
      AND lower(first_name)      = lower(p_first_name)
      AND date_of_casualty       = p_date_of_casualty
      AND lower(COALESCE(rank,'')) = lower(COALESCE(p_rank,''))
      AND branch                 = p_branch
      AND lower(battle_location) = lower(p_battle_location)
  );
$$;
