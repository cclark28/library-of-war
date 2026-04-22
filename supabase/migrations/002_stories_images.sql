-- ============================================================
-- Hallowed Ground — Stories & Images
-- Migration 002: stories, soldier_images, storage bucket
-- ============================================================

-- ── stories ──────────────────────────────────────────────────────────────────
-- One soldier can have many stories (family accounts, unit history, etc.)
CREATE TABLE IF NOT EXISTS stories (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  soldier_id  UUID        NOT NULL REFERENCES soldiers(id) ON DELETE CASCADE,
  body        TEXT        NOT NULL,
  author      TEXT,
  source      TEXT,
  verified    BOOLEAN     DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stories_soldier ON stories (soldier_id);

-- Full-text search on story body
CREATE INDEX IF NOT EXISTS idx_stories_body_trgm ON stories USING GIN (body gin_trgm_ops);

ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read stories"
  ON stories FOR SELECT TO anon
  USING (true);

CREATE POLICY "Authenticated write stories"
  ON stories FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated update stories"
  ON stories FOR UPDATE TO authenticated
  USING (true);

CREATE TRIGGER stories_updated_at
  BEFORE UPDATE ON stories
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── soldier_images ────────────────────────────────────────────────────────────
-- Images stored in Supabase Storage; this table holds metadata + path.
CREATE TABLE IF NOT EXISTS soldier_images (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  soldier_id    UUID        NOT NULL REFERENCES soldiers(id) ON DELETE CASCADE,
  storage_path  TEXT        NOT NULL,   -- relative path in Supabase Storage bucket
  caption       TEXT,
  credit        TEXT,
  is_primary    BOOLEAN     DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_images_soldier    ON soldier_images (soldier_id);
CREATE INDEX IF NOT EXISTS idx_images_primary    ON soldier_images (soldier_id, is_primary);

-- Only one primary image per soldier
CREATE UNIQUE INDEX IF NOT EXISTS idx_images_one_primary
  ON soldier_images (soldier_id)
  WHERE is_primary = TRUE;

ALTER TABLE soldier_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read images"
  ON soldier_images FOR SELECT TO anon
  USING (true);

CREATE POLICY "Authenticated write images"
  ON soldier_images FOR INSERT TO authenticated
  WITH CHECK (true);

-- ── Storage bucket ────────────────────────────────────────────────────────────
-- Run this in Supabase Dashboard → Storage, or via Supabase CLI:
--
--   supabase storage buckets create soldier-images --public
--
-- Public bucket so images are served directly without signed URLs.
-- Bucket name: soldier-images
-- Path convention: {soldier_id}/{filename}
-- e.g. 3f1a9b2c-xxxx/portrait.jpg
