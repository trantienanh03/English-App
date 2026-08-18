import Constants from 'expo-constants';

const getHostIp = () => {
  const hostUri = Constants.expoConfig?.hostUri || (Constants as any).manifest?.debuggerHost;
  if (hostUri) {
    return hostUri.split(':')[0];
  }
  return '192.168.1.22';
};

const HOST_IP = getHostIp();
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || `http://${HOST_IP}:8080`;

export interface BackendWordDto {
  id: number;
  cocoClass: string;
  enWord: string;
  phonetic: string;
  pos: string;
  definition: string;
  translation: string;
  exampleEn: string;
  exampleVn: string;
}

export interface SyncPayload {
  deviceUuid: string;
  displayName: string;
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  wordsLearned: number;
}

export interface SyncResponseDto {
  status: string;
  rank: number;
}

export interface LeaderboardEntry {
  rank: number;
  deviceUuid: string;
  displayName: string;
  totalXp: number;
  currentStreak: number;
  wordsLearned: number;
}

/**
 * Maps Backend Word DTO to Frontend VocabularyWord type
 */
function mapWordDtoToVocabularyWord(dto: BackendWordDto): VocabularyWord {
  return {
    id: String(dto.id),
    word: dto.enWord,
    phonetic: dto.phonetic || '',
    vn: dto.translation,
    pos: dto.pos || 'Noun',
    sentence: dto.exampleEn || '',
    sentenceVn: dto.exampleVn || '',
    difficulty: 'medium',
    imageUrl: `https://images.unsplash.com/photo-1546483875-ad9014c88eba?auto=format&fit=crop&q=80&w=400`,
  };
}

export const api = {
  /**
   * Fetch all 80 COCO vocabulary items from backend
   */
  async getAllWords(): Promise<VocabularyWord[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/words`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data: BackendWordDto[] = await response.json();
      return data.map(mapWordDtoToVocabularyWord);
    } catch (err) {
      console.warn('Backend unavailable, returning empty word list:', err);
      return [];
    }
  },

  /**
   * Look up a word by YOLO class name
   */
  async getWordByClass(cocoClass: string): Promise<VocabularyWord | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/words/${encodeURIComponent(cocoClass)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        return null;
      }

      const dto: BackendWordDto = await response.json();
      return mapWordDtoToVocabularyWord(dto);
    } catch (err) {
      console.warn(`Failed to fetch word ${cocoClass} from server:`, err);
      return null;
    }
  },

  /**
   * Push local user progress & learning metrics to Spring Boot backend
   */
  async syncProgress(payload: SyncPayload): Promise<SyncResponseDto | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/sync/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Sync failed with status ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      console.warn('Sync failed (will retry when online):', err);
      return null;
    }
  },

  /**
   * Fetch global top 50 leaderboard from backend
   */
  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/leaderboard`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      console.warn('Failed to fetch leaderboard:', err);
      return [];
    }
  },
};
