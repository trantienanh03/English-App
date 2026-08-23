-- ============================================================
-- V104: Recreate user_progress table with user_id UUID primary & foreign key
-- ============================================================

DROP TABLE IF EXISTS user_progress CASCADE;

CREATE TABLE user_progress (
    user_id        UUID PRIMARY KEY REFERENCES app_users(user_id) ON DELETE CASCADE,
    total_xp       INTEGER      NOT NULL DEFAULT 0,
    current_streak INTEGER      NOT NULL DEFAULT 0,
    longest_streak INTEGER      NOT NULL DEFAULT 0,
    words_saved    INTEGER      NOT NULL DEFAULT 0,
    words_learned  INTEGER      NOT NULL DEFAULT 0,
    last_sync_at   TIMESTAMPTZ,
    created_at     TIMESTAMPTZ  DEFAULT NOW(),
    updated_at     TIMESTAMPTZ  DEFAULT NOW()
);

-- Index for global leaderboard by total_xp
CREATE INDEX idx_user_progress_xp ON user_progress (total_xp DESC);
