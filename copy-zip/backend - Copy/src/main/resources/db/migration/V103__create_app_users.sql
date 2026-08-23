-- ============================================================
-- V103: Create app_users table for Supabase Auth identity link & roles
-- ============================================================

CREATE TABLE IF NOT EXISTS app_users (
    user_id      UUID PRIMARY KEY,
    display_name VARCHAR(100),
    role         VARCHAR(20)  NOT NULL DEFAULT 'LEARNER',
    locked       BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at   TIMESTAMPTZ  DEFAULT NOW(),
    updated_at   TIMESTAMPTZ  DEFAULT NOW()
);

-- Seed default admin account placeholder UUID if needed (can be updated via DB)
-- Insert sample learner and admin placeholders
