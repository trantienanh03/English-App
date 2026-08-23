CREATE TABLE saved_flashcards (
    id               BIGSERIAL PRIMARY KEY,
    user_id          UUID NOT NULL REFERENCES app_users(user_id) ON DELETE CASCADE,
    word_id          BIGINT NOT NULL REFERENCES words(id) ON DELETE CASCADE,
    easiness_factor  DOUBLE PRECISION NOT NULL DEFAULT 2.5 CHECK (easiness_factor >= 1.3),
    repetitions      INTEGER NOT NULL DEFAULT 0 CHECK (repetitions >= 0),
    interval_days    INTEGER NOT NULL DEFAULT 0 CHECK (interval_days >= 0),
    next_review_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_saved_flashcard_user_word UNIQUE (user_id, word_id)
);

CREATE INDEX idx_saved_flashcards_due ON saved_flashcards (user_id, next_review_at);

CREATE TABLE lessons (
    id          VARCHAR(50) PRIMARY KEY,
    name        VARCHAR(120) NOT NULL,
    description TEXT NOT NULL,
    difficulty  VARCHAR(30) NOT NULL,
    category    VARCHAR(50) NOT NULL,
    icon        VARCHAR(50) NOT NULL
);

CREATE TABLE lesson_words (
    lesson_id VARCHAR(50) NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    word_id   BIGINT NOT NULL REFERENCES words(id) ON DELETE CASCADE,
    position  INTEGER NOT NULL,
    PRIMARY KEY (lesson_id, word_id),
    UNIQUE (lesson_id, position)
);

CREATE TABLE user_lesson_progress (
    user_id     UUID NOT NULL REFERENCES app_users(user_id) ON DELETE CASCADE,
    lesson_id   VARCHAR(50) NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    best_score  INTEGER NOT NULL DEFAULT 0 CHECK (best_score BETWEEN 0 AND 100),
    last_score  INTEGER NOT NULL DEFAULT 0 CHECK (last_score BETWEEN 0 AND 100),
    completed_at TIMESTAMPTZ,
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, lesson_id)
);

INSERT INTO lessons (id, name, description, difficulty, category, icon) VALUES
('office', 'Đồ dùng học tập & Văn phòng', 'Từ vựng vật thể quen thuộc trong lớp học và văn phòng.', 'Sơ cấp', 'Văn phòng', 'book-open'),
('kitchen', 'Thực phẩm & Đồ dùng Nhà bếp', 'Từ vựng thực phẩm và vật dụng phổ biến trong nhà bếp.', 'Sơ cấp', 'Nhà bếp', 'coffee'),
('transport', 'Phương tiện Giao thông', 'Tên gọi các phương tiện di chuyển phổ biến.', 'Trung cấp', 'Giao thông', 'truck'),
('animals', 'Thế giới Động vật', 'Từ vựng về các loài động vật.', 'Sơ cấp', 'Động vật', 'heart');

INSERT INTO lesson_words (lesson_id, word_id, position)
SELECT mapping.lesson_id, w.id, mapping.position
FROM (VALUES
    ('office', 'laptop', 0), ('office', 'book', 1), ('office', 'pen/pencil', 2), ('office', 'chair', 3), ('office', 'calculator', 4),
    ('kitchen', 'cup', 0), ('kitchen', 'bottle', 1), ('kitchen', 'plate', 2), ('kitchen', 'apple', 3), ('kitchen', 'banana', 4),
    ('transport', 'car', 0), ('transport', 'bicycle', 1), ('transport', 'bus', 2), ('transport', 'motorcycle', 3), ('transport', 'airplane', 4),
    ('animals', 'cat', 0), ('animals', 'dog', 1), ('animals', 'wild bird', 2), ('animals', 'horse', 3), ('animals', 'bear', 4)
) AS mapping(lesson_id, detection_label, position)
JOIN words w ON w.detection_label = mapping.detection_label;
