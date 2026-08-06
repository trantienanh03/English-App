import NetInfo from '@react-native-community/netinfo';
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
 * Checks if the device currently has a working internet connection.
 */
async function isOnline(): Promise<boolean> {
  const state = await NetInfo.fetch();
  return state.isConnected === true && state.isInternetReachable !== false;
}

/**
 * Main Sync Manager:
 * 1. Skips silently when offline — no error thrown.
 * 2. Downloads latest 80-word COCO dictionary and caches in SQLite.
 * 3. Pushes accumulated local events and progress to the Spring Boot server.
 */
export async function syncWithBackend(
  currentProgress: UserProgress,
  displayName: string = 'Người dùng'
): Promise<SyncResponseDto | null> {
  const online = await isOnline();
  if (!online) {
    return null;
  }

  const deviceUuid = getOrCreateDeviceUuid();

  // 1. Download word dictionary from server and cache locally
  try {
    const remoteWords = await api.getAllWords();
    if (remoteWords.length > 0) {
      cacheWordsBulk(remoteWords);
    }
  } catch (err) {
    console.warn('Skipped remote dictionary sync:', err);
  }

  // 2. Push offline-accumulated progress to leaderboard server
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

  if (response?.status === 'ok') {
    const eventIds = unsyncedEvents.map((e) => e.id);
    markEventsSynced(eventIds);
  }

  return response;
}

/**
 * Lightweight check-and-sync triggered after earning XP.
 * Fire-and-forget — never throws.
 */
export function triggerBackgroundSync(
  currentProgress: UserProgress,
  displayName?: string
): void {
  syncWithBackend(currentProgress, displayName).catch(() => {});
}
