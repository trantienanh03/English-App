import {
  getOrCreateDeviceUuid,
  getUnsyncedEvents,
  markEventsSynced,
  cacheWordsBulk,
  getLocalFlashcards,
} from '@/db/database';
import { api, SyncPayload, SyncResponseDto } from './api';
import { UserProgress } from '@/types';

/**
 * Main Sync Manager:
 * 1. Downloads latest COCO word dictionary from server (caches in SQLite)
 * 2. Collects unsynced local events and pushes progress to Spring Boot server
 */
export async function syncWithBackend(
  currentProgress: UserProgress,
  displayName: string = 'Người dùng'
): Promise<SyncResponseDto | null> {
  const deviceUuid = getOrCreateDeviceUuid();

  // 1. Initial dictionary sync (download 80 words if available)
  try {
    const remoteWords = await api.getAllWords();
    if (remoteWords.length > 0) {
      cacheWordsBulk(remoteWords);
    }
  } catch (err) {
    console.warn('Skipped remote dictionary sync:', err);
  }

  // 2. Offline queue sync (push progress to server)
  const unsyncedEvents = getUnsyncedEvents();
  const flashcards = getLocalFlashcards();

  const payload: SyncPayload = {
    deviceUuid,
    displayName,
    totalXp: currentProgress.xp,
    currentStreak: currentProgress.streak,
    longestStreak: currentProgress.streak,
    wordsLearned: flashcards.length,
  };

  const response = await api.syncProgress(payload);

  if (response && response.status === 'ok') {
    const eventIds = unsyncedEvents.map((e) => e.id);
    markEventsSynced(eventIds);
  }

  return response;
}
