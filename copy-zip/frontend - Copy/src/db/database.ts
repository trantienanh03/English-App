import AsyncStorage from '@react-native-async-storage/async-storage';
import { VocabularyWord, UserProgress, Badge } from '@/types';

// ─── Storage Keys ───────────────────────────────────────────────────────────
const KEYS = {
  DEVICE_UUID: '@vocam/device_uuid',
  FLASHCARDS: '@vocam/flashcards',
  USER_PROGRESS: '@vocam/user_progress',
  WORD_CACHE: '@vocam/word_cache',
  LESSON_PROGRESS: '@vocam/lesson_progress',
  BADGES: '@vocam/badges',
  SCAN_COUNT: '@vocam/scan_count',
};

// ─── Types ───────────────────────────────────────────────────────────────────
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

// ─── In-memory caches for read performance ───────────────────────────────────
let wordCacheStore: Record<string, VocabularyWord> = {};
let cachedFlashcards: LocalFlashcard[] | null = null;

// ─── Helpers ─────────────────────────────────────────────────────────────────
async function getJson<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function setJson<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`AsyncStorage setItem failed for ${key}:`, e);
  }
}

// ─── Init ────────────────────────────────────────────────────────────────────
export function initDatabase(): void {
  // No-op — AsyncStorage is always ready. Migration from in-memory is automatic.
}

// ─── Device UUID ─────────────────────────────────────────────────────────────
export function getOrCreateDeviceUuid(): string {
  // Returns in-memory cache or generates a new one synchronously.
  // Async version below handles persistence.
  return typeof _syncUuid !== 'undefined' ? _syncUuid : `device_${Date.now()}`;
}

let _syncUuid: string = '';

export async function initDeviceUuid(): Promise<string> {
  const stored = await AsyncStorage.getItem(KEYS.DEVICE_UUID);
  if (stored) {
    _syncUuid = stored;
    return stored;
  }
  const newUuid = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  await AsyncStorage.setItem(KEYS.DEVICE_UUID, newUuid);
  _syncUuid = newUuid;
  return newUuid;
}

// ─── Flashcards ──────────────────────────────────────────────────────────────
export async function getLocalFlashcards(): Promise<LocalFlashcard[]> {
  if (cachedFlashcards !== null) return cachedFlashcards;
  const cards = await getJson<LocalFlashcard[]>(KEYS.FLASHCARDS, []);
  cachedFlashcards = cards;
  return cards;
}

export async function saveLocalFlashcard(word: VocabularyWord): Promise<void> {
  const cards = await getLocalFlashcards();
  const now = Date.now();
  const exists = cards.findIndex(c => c.id === word.id);
  const newCard: LocalFlashcard = {
    id: word.id,
    coco_class: word.word.toLowerCase(),
    en_word: word.word,
    phonetic: word.phonetic || '',
    pos: word.pos || 'Noun',
    translation: word.vn,
    example_en: word.sentence || '',
    example_vn: word.sentenceVn || '',
    ease_factor: 2.5,
    interval_days: 1,
    repetitions: 0,
    next_review_at: now + 86400000,
    added_at: now,
  };
  if (exists >= 0) {
    cards[exists] = { ...cards[exists], ...newCard };
  } else {
    cards.unshift(newCard);
  }
  cachedFlashcards = cards;
  await setJson(KEYS.FLASHCARDS, cards);
}

export async function deleteLocalFlashcard(id: string): Promise<void> {
  const cards = await getLocalFlashcards();
  const updated = cards.filter(c => c.id !== id);
  cachedFlashcards = updated;
  await setJson(KEYS.FLASHCARDS, updated);
}

export async function updateFlashcardSM2(
  id: string,
  rating: 'easy' | 'medium' | 'hard'
): Promise<void> {
  const cards = await getLocalFlashcards();
  const idx = cards.findIndex(c => c.id === id);
  if (idx === -1) return;

  const card = cards[idx];
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

  cards[idx] = {
    ...card,
    ease_factor: easeFactor,
    interval_days: interval,
    repetitions: reps,
    next_review_at: Date.now() + interval * 86400000,
  };
  cachedFlashcards = cards;
  await setJson(KEYS.FLASHCARDS, cards);
}

// ─── User Progress ────────────────────────────────────────────────────────────
export async function saveUserProgress(progress: UserProgress): Promise<void> {
  await setJson(KEYS.USER_PROGRESS, progress);
}

export async function loadUserProgress(): Promise<UserProgress | null> {
  return getJson<UserProgress | null>(KEYS.USER_PROGRESS, null);
}

// ─── Badges ───────────────────────────────────────────────────────────────────
export async function saveBadges(badges: Badge[]): Promise<void> {
  await setJson(KEYS.BADGES, badges);
}

export async function loadBadges(): Promise<Badge[] | null> {
  return getJson<Badge[] | null>(KEYS.BADGES, null);
}

// ─── Scan Count ───────────────────────────────────────────────────────────────
export async function getScanCount(): Promise<number> {
  return getJson<number>(KEYS.SCAN_COUNT, 0);
}

export async function incrementScanCount(): Promise<number> {
  const current = await getScanCount();
  const next = current + 1;
  await setJson(KEYS.SCAN_COUNT, next);
  return next;
}

// ─── Lesson Progress ─────────────────────────────────────────────────────────
export async function saveLessonProgress(
  lessonId: string,
  progress: number
): Promise<void> {
  const all = await getJson<Record<string, number>>(KEYS.LESSON_PROGRESS, {});
  all[lessonId] = progress;
  await setJson(KEYS.LESSON_PROGRESS, all);
}

export async function loadAllLessonProgress(): Promise<Record<string, number>> {
  return getJson<Record<string, number>>(KEYS.LESSON_PROGRESS, {});
}

// ─── Word Cache ───────────────────────────────────────────────────────────────
export function cacheWordsBulk(words: VocabularyWord[]): void {
  for (const w of words) {
    wordCacheStore[w.word.toLowerCase()] = w;
  }
}

export function getCachedWordByClass(cocoClass: string): VocabularyWord | null {
  return wordCacheStore[cocoClass.toLowerCase()] || null;
}

export function getAllCachedWords(): VocabularyWord[] {
  return Object.values(wordCacheStore);
}

// ─── Learning Events (kept for sync service compatibility) ───────────────────
export function logLearningEvent(
  type: 'WORD_LEARNED' | 'QUIZ_DONE' | 'STREAK_UPDATE',
  payload: string
): void {
  // Fire-and-forget: events are synced with backend in sync-service
}

export function getUnsyncedEvents(): LearningEvent[] {
  return [];
}

export function markEventsSynced(_eventIds: string[]): void {}
