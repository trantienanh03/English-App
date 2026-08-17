import * as Crypto from 'expo-crypto';
import { VocabularyWord } from '@/types';

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

function getWebItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined' || !window.localStorage) return defaultValue;
  try {
    const raw = localStorage.getItem(`vocam_${key}`);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setWebItem(key: string, value: any): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    localStorage.setItem(`vocam_${key}`, JSON.stringify(value));
  } catch (e) {
    console.warn('localStorage set error:', e);
  }
}

export function initDatabase(): void {
  // Web mode uses localStorage
}

export function getOrCreateDeviceUuid(): string {
  let uuid = getWebItem<string>('device_uuid', '');
  if (!uuid) {
    uuid = Crypto.randomUUID ? Crypto.randomUUID() : `web_${Date.now()}`;
    setWebItem('device_uuid', uuid);
  }
  return uuid;
}

export function getLocalFlashcards(): LocalFlashcard[] {
  return getWebItem<LocalFlashcard[]>('flashcards', []);
}

export function saveLocalFlashcard(word: VocabularyWord): void {
  const now = Date.now();
  const nextReview = now + 86400000;
  const cards = getWebItem<LocalFlashcard[]>('flashcards', []);
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
    next_review_at: nextReview,
    added_at: now,
  };
  const filtered = cards.filter((c) => c.id !== word.id);
  setWebItem('flashcards', [newCard, ...filtered]);
  logLearningEvent('WORD_LEARNED', JSON.stringify({ wordId: word.id, word: word.word }));
}

export function deleteLocalFlashcard(id: string): void {
  const cards = getWebItem<LocalFlashcard[]>('flashcards', []);
  setWebItem('flashcards', cards.filter((c) => c.id !== id));
}

export function updateFlashcardSM2(id: string, rating: 'easy' | 'medium' | 'hard'): void {
  const cards = getWebItem<LocalFlashcard[]>('flashcards', []);
  const idx = cards.findIndex((c) => c.id === id);
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
  setWebItem('flashcards', cards);
}

export function cacheWordsBulk(words: VocabularyWord[]): void {
  const cache = getWebItem<Record<string, VocabularyWord>>('word_cache', {});
  for (const w of words) {
    cache[w.word.toLowerCase()] = w;
  }
  setWebItem('word_cache', cache);
}

export function getCachedWordByClass(cocoClass: string): VocabularyWord | null {
  const cache = getWebItem<Record<string, VocabularyWord>>('word_cache', {});
  return cache[cocoClass.toLowerCase()] || null;
}

export function getAllCachedWords(): VocabularyWord[] {
  const cache = getWebItem<Record<string, VocabularyWord>>('word_cache', {});
  return Object.values(cache);
}

export function logLearningEvent(type: 'WORD_LEARNED' | 'QUIZ_DONE' | 'STREAK_UPDATE', payload: string): void {
  const id = Crypto.randomUUID ? Crypto.randomUUID() : `evt_${Date.now()}`;
  const now = Date.now();
  const events = getWebItem<LearningEvent[]>('events', []);
  events.push({ id, type, payload, created_at: now, synced_at: null });
  setWebItem('events', events);
}

export function getUnsyncedEvents(): LearningEvent[] {
  const events = getWebItem<LearningEvent[]>('events', []);
  return events.filter((e) => e.synced_at === null);
}

export function markEventsSynced(eventIds: string[]): void {
  if (eventIds.length === 0) return;
  const events = getWebItem<LearningEvent[]>('events', []);
  const now = Date.now();
  const updated = events.map((e) => (eventIds.includes(e.id) ? { ...e, synced_at: now } : e));
  setWebItem('events', updated);
}
