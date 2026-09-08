-- Learning statistics are derived from saved_flashcards and user_lesson_progress.
-- Remove the legacy duplicate counters so they cannot drift from the canonical data.
DROP TABLE IF EXISTS user_progress CASCADE;
