import { api, SyncPayload } from '@/services/api';
import { getLocalFlashcards } from '@/db/database';

export async function syncProgressWithServer(displayName?: string): Promise<boolean> {
  try {
    const flashcards = await getLocalFlashcards();

    const payload: SyncPayload = {
      displayName,
      wordsSaved: flashcards.length,
      wordsLearned: flashcards.filter(c => c.repetitions >= 2 && c.interval_days >= 6).length,
    };

    await api.syncProgress(payload);
    return true;
  } catch (err) {
    console.warn('Skipped progress sync:', err);
    return false;
  }
}
