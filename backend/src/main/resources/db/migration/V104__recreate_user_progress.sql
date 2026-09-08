-- ============================================================
-- V104: Recreate user_progress table with user_id UUID primary & foreign key
-- ============================================================

DROP TABLE IF EXISTS user_progress CASCADE;

CREATE TABLE user_progress (
    user_id        UUID PRIMARY KEY REFERENCES app_users(user_id) ON DELETE CASCADE,
    words_saved    INTEGER      NOT NULL DEFAULT 0,
    words_learned  INTEGER      NOT NULL DEFAULT 0,
    last_sync_at   TIMESTAMPTZ,
    created_at     TIMESTAMPTZ  DEFAULT NOW(),
    updated_at     TIMESTAMPTZ  DEFAULT NOW()
);
