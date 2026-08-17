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

// Online-First In-Memory State (No SQLite native dependency)
let wordCacheStore: Record<string, VocabularyWord> = {};
let flashcardsStore: LocalFlashcard[] = [];
let eventsStore: LearningEvent[] = [];
let cachedDeviceUuid: string = '';

export function initDatabase(): void {
  // Online-First: All persistence is managed via Spring Boot REST APIs
}

export function getOrCreateDeviceUuid(): string {
  if (!cachedDeviceUuid) {
    try {
      cachedDeviceUuid = Crypto.randomUUID ? Crypto.randomUUID() : `device_${Date.now()}`;
    } catch {
      cachedDeviceUuid = `device_${Date.now()}`;
    }
  }
  return cachedDeviceUuid;
}

export function getLocalFlashcards(): LocalFlashcard[] {
  return flashcardsStore;
}

export function saveLocalFlashcard(word: VocabularyWord): void {
  const now = Date.now();
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
  flashcardsStore = [newCard, ...flashcardsStore.filter((c) => c.id !== word.id)];
}

export function deleteLocalFlashcard(id: string): void {
  flashcardsStore = flashcardsStore.filter((c) => c.id !== id);
}

export function updateFlashcardSM2(id: string, rating: 'easy' | 'medium' | 'hard'): void {
  const idx = flashcardsStore.findIndex((c) => c.id === id);
  if (idx === -1) return;

  const card = flashcardsStore[idx];
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

  flashcardsStore[idx] = {
    ...card,
    ease_factor: easeFactor,
    interval_days: interval,
    repetitions: reps,
    next_review_at: Date.now() + interval * 86400000,
  };
}

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

export function logLearningEvent(type: 'WORD_LEARNED' | 'QUIZ_DONE' | 'STREAK_UPDATE', payload: string): void {
  const id = Crypto.randomUUID ? Crypto.randomUUID() : `evt_${Date.now()}`;
  eventsStore.push({ id, type, payload, created_at: Date.now(), synced_at: Date.now() });
}

export function getUnsyncedEvents(): LearningEvent[] {
  return eventsStore.filter((e) => e.synced_at === null);
}

export function markEventsSynced(eventIds: string[]): void {
  const now = Date.now();
  eventsStore = eventsStore.map((e) => (eventIds.includes(e.id) ? { ...e, synced_at: now } : e));
}
