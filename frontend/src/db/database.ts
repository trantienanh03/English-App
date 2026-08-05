import * as SQLite from 'expo-sqlite';
import * as Crypto from 'expo-crypto';
import { VocabularyWord } from '@/types';

// Open SQLite database
const db = SQLite.openDatabaseSync('vocam.db');

export interface LocalFlashcard {
  id: string;
  coco_class: string;
  en_word: string;
  phonetic: string;
  pos: string;
  translation: string;
  example_en: string;
  example_vn: string;
  ease_factor: number;
  interval_days: number;
  repetitions: number;
  next_review_at: number;
  added_at: number;
}

export interface LearningEvent {
  id: string;
  type: 'WORD_LEARNED' | 'QUIZ_DONE' | 'STREAK_UPDATE';
  payload: string;
  created_at: number;
  synced_at: number | null;
}

/**
 * Initialize local tables in SQLite
 */
export function initDatabase(): void {
  db.execSync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS flashcards (
      id              TEXT PRIMARY KEY,
      coco_class      TEXT NOT NULL,
      en_word         TEXT NOT NULL,
      phonetic        TEXT,
      pos             TEXT,
      translation     TEXT NOT NULL,
      example_en      TEXT,
      example_vn      TEXT,
      ease_factor     REAL DEFAULT 2.5,
      interval_days   INTEGER DEFAULT 1,
      repetitions     INTEGER DEFAULT 0,
      next_review_at  INTEGER,
      added_at        INTEGER
    );

    CREATE TABLE IF NOT EXISTS cached_words (
      coco_class  TEXT PRIMARY KEY,
      data_json   TEXT NOT NULL,
      cached_at   INTEGER
    );

    CREATE TABLE IF NOT EXISTS learning_events (
      id          TEXT PRIMARY KEY,
      type        TEXT NOT NULL,
      payload     TEXT NOT NULL,
      created_at  INTEGER,
      synced_at   INTEGER
    );

    CREATE TABLE IF NOT EXISTS app_config (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
}

/**
 * Get or create unique device UUID for offline identity
 */
export function getOrCreateDeviceUuid(): string {
  initDatabase();
  const row = db.getFirstSync<{ value: string }>(
    'SELECT value FROM app_config WHERE key = ?',
    ['device_uuid']
  );

  if (row?.value) {
    return row.value;
  }

  const newUuid = Crypto.randomUUID();
  db.runSync(
    'INSERT INTO app_config (key, value) VALUES (?, ?)',
    ['device_uuid', newUuid]
  );
  return newUuid;
}

/**
 * Flashcard Database Operations
 */
export function getLocalFlashcards(): LocalFlashcard[] {
  initDatabase();
  return db.getAllSync<LocalFlashcard>(
    'SELECT * FROM flashcards ORDER BY added_at DESC'
  );
}

export function saveLocalFlashcard(word: VocabularyWord): void {
  initDatabase();
  const now = Date.now();
  const nextReview = now + 86400000; // default 1 day

  db.runSync(
    `INSERT OR REPLACE INTO flashcards (
      id, coco_class, en_word, phonetic, pos, translation, example_en, example_vn,
      ease_factor, interval_days, repetitions, next_review_at, added_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 2.5, 1, 0, ?, ?)`,
    [
      word.id,
      word.word.toLowerCase(),
      word.word,
      word.phonetic || '',
      word.pos || 'Noun',
      word.vn,
      word.sentence || '',
      word.sentenceVn || '',
      nextReview,
      now,
    ]
  );

  logLearningEvent('WORD_LEARNED', JSON.stringify({ wordId: word.id, word: word.word }));
}

export function deleteLocalFlashcard(id: string): void {
  initDatabase();
  db.runSync('DELETE FROM flashcards WHERE id = ?', [id]);
}

/**
 * Update SM-2 spaced repetition fields after a review
 * rating: 0 = hard, 1 = medium, 2 = easy
 */
export function updateFlashcardSM2(id: string, rating: 'easy' | 'medium' | 'hard'): void {
  initDatabase();
  const card = db.getFirstSync<LocalFlashcard>(
    'SELECT * FROM flashcards WHERE id = ?',
    [id]
  );

  if (!card) return;

  let easeFactor = card.ease_factor;
  let interval = card.interval_days;
  let reps = card.repetitions;

  if (rating === 'hard') {
    reps = 0;
    interval = 1;
    easeFactor = Math.max(1.3, easeFactor - 0.2);
  } else if (rating === 'medium') {
    reps += 1;
    interval = Math.round(interval * 1.5);
  } else {
    reps += 1;
    easeFactor += 0.15;
    interval = reps === 1 ? 1 : reps === 2 ? 6 : Math.round(interval * easeFactor);
  }

  const nextReview = Date.now() + interval * 86400000;

  db.runSync(
    `UPDATE flashcards SET ease_factor = ?, interval_days = ?, repetitions = ?, next_review_at = ? WHERE id = ?`,
    [easeFactor, interval, reps, nextReview, id]
  );
}

/**
 * Word Cache Operations (80 COCO words cache)
 */
export function cacheWordsBulk(words: VocabularyWord[]): void {
  initDatabase();
  const now = Date.now();
  db.withTransactionSync(() => {
    for (const w of words) {
      db.runSync(
        `INSERT OR REPLACE INTO cached_words (coco_class, data_json, cached_at) VALUES (?, ?, ?)`,
        [w.word.toLowerCase(), JSON.stringify(w), now]
      );
    }
  });
}

export function getCachedWordByClass(cocoClass: string): VocabularyWord | null {
  initDatabase();
  const row = db.getFirstSync<{ data_json: string }>(
    'SELECT data_json FROM cached_words WHERE coco_class = ?',
    [cocoClass.toLowerCase()]
  );

  if (!row) return null;
  try {
    return JSON.parse(row.data_json);
  } catch {
    return null;
  }
}

export function getAllCachedWords(): VocabularyWord[] {
  initDatabase();
  const rows = db.getAllSync<{ data_json: string }>('SELECT data_json FROM cached_words');
  return rows.map((r) => JSON.parse(r.data_json));
}

/**
 * Event Logging & Offline Sync Operations
 */
export function logLearningEvent(type: 'WORD_LEARNED' | 'QUIZ_DONE' | 'STREAK_UPDATE', payload: string): void {
  initDatabase();
  const id = Crypto.randomUUID();
  const now = Date.now();
  db.runSync(
    'INSERT INTO learning_events (id, type, payload, created_at, synced_at) VALUES (?, ?, ?, ?, NULL)',
    [id, type, payload, now]
  );
}

export function getUnsyncedEvents(): LearningEvent[] {
  initDatabase();
  return db.getAllSync<LearningEvent>(
    'SELECT * FROM learning_events WHERE synced_at IS NULL ORDER BY created_at ASC'
  );
}

export function markEventsSynced(eventIds: string[]): void {
  if (eventIds.length === 0) return;
  initDatabase();
  const now = Date.now();
  db.withTransactionSync(() => {
    for (const id of eventIds) {
      db.runSync('UPDATE learning_events SET synced_at = ? WHERE id = ?', [now, id]);
    }
  });
}
