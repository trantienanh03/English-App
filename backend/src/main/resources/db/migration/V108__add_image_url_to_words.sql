-- ============================================================
-- V108: Ensure image_url column exists in words table
-- ============================================================

ALTER TABLE words ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);
