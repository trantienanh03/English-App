-- ============================================================
-- V1: Create core tables for Vocam demo
-- ============================================================

CREATE TABLE IF NOT EXISTS words (
    id          BIGSERIAL    PRIMARY KEY,
    coco_class  VARCHAR(50)  NOT NULL UNIQUE,   -- YOLO class name: "cup", "cat"
    en_word     VARCHAR(100) NOT NULL,
    phonetic    VARCHAR(100),                   -- IPA: /kʌp/
    pos         VARCHAR(20),                    -- Noun, Verb, Adjective
    definition  TEXT,                           -- Short English definition
    translation VARCHAR(200) NOT NULL,          -- Vietnamese meaning
    example_en  TEXT,
    example_vn  TEXT,
    created_at  TIMESTAMPTZ  DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_progress (
    id              BIGSERIAL    PRIMARY KEY,
    device_uuid     VARCHAR(36)  NOT NULL UNIQUE,   -- UUID generated on first app launch
    display_name    VARCHAR(100) NOT NULL DEFAULT 'Người dùng',
    total_xp        INTEGER      NOT NULL DEFAULT 0,
    current_streak  INTEGER      NOT NULL DEFAULT 0,
    longest_streak  INTEGER      NOT NULL DEFAULT 0,
    words_learned   INTEGER      NOT NULL DEFAULT 0,
    last_sync_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ  DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  DEFAULT NOW()
);

-- Sort leaderboard by XP efficiently
CREATE INDEX IF NOT EXISTS idx_user_progress_xp ON user_progress (total_xp DESC);
