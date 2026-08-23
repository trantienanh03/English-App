import Constants from 'expo-constants';
import { Alert } from 'react-native';
import { supabase } from '@/lib/supabase';
import { VocabularyWord } from '@/types';

const getHostIp = () => {
  const hostUri = Constants.expoConfig?.hostUri || (Constants as any).manifest?.debuggerHost;
  if (hostUri) {
    return hostUri.split(':')[0];
  }
  return '192.168.1.22';
};

const HOST_IP = getHostIp();
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || `http://${HOST_IP}:8080`;

export interface UserProfileDto {
  userId: string;
  displayName: string;
  role: 'LEARNER' | 'ADMIN';
  locked: boolean;
  wordsSaved: number;
  wordsLearned: number;
}

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
  imageUrl?: string;
}

export interface SyncPayload {
  displayName?: string;
  wordsSaved: number;
  wordsLearned: number;
}

export interface SyncResponseDto {
  status: string;
}

export interface AdminUserEntry {
  userId: string;
  displayName: string;
  role: string;
  locked: boolean;
  wordsSaved: number;
  wordsLearned: number;
}

/**
 * Centralized API Fetcher wrapper with automatic Supabase JWT Bearer token injection
 * & global error interceptor for 401 and 403 ACCOUNT_LOCKED.
 */
async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const session = (await supabase.auth.getSession()).data.session;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as any),
  };

  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }
  if (session?.user?.id) {
    headers['X-User-Id'] = session.user.id;
    headers['X-User-Email'] = session.user.email || '';
    headers['X-User-Name'] = session.user.user_metadata?.display_name || '';
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    await supabase.auth.refreshSession();
  }

  if (res.status === 403) {
    const text = await res.text();
    if (text.includes('ACCOUNT_LOCKED')) {
      Alert.alert(
        'Tài khoản bị khóa',
        'Tài khoản của bạn đã bị khóa bởi Quản trị viên. Vui lòng liên hệ hỗ trợ.',
        [{ text: 'Đóng', onPress: () => supabase.auth.signOut() }]
      );
      await supabase.auth.signOut();
      throw new Error('ACCOUNT_LOCKED');
    } else {
      Alert.alert('Không có quyền', 'Bạn không có quyền thực hiện thao tác này.');
      throw new Error('FORBIDDEN');
    }
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : (null as any);
}

function mapWordDtoToVocabularyWord(dto: BackendWordDto): VocabularyWord {
  return {
    id: String(dto.id),
    word: dto.enWord,
    phonetic: dto.phonetic || '',
    vn: dto.translation,
    pos: dto.pos || 'Noun',
    sentence: dto.exampleEn || '',
    sentenceVn: dto.exampleVn || '',
    difficulty: 'easy',
    imageUrl: dto.imageUrl || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=60',
  };
}

export const api = {
  /** GET /api/me — Fetch User Profile & Role from backend */
  async fetchMe(): Promise<UserProfileDto> {
    return apiClient<UserProfileDto>('/api/me');
  },

  /** POST /api/sync/progress — Sync learning stats securely */
  async syncProgress(payload: SyncPayload): Promise<SyncResponseDto> {
    return apiClient<SyncResponseDto>('/api/sync/progress', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /** GET /api/words — Fetch all 365 words */
  async fetchAllWords(): Promise<VocabularyWord[]> {
    const dtos = await apiClient<BackendWordDto[]>('/api/words');
    return dtos.map(mapWordDtoToVocabularyWord);
  },

  async getAllWords(): Promise<VocabularyWord[]> {
    return this.fetchAllWords();
  },

  /** GET /api/words/{cocoClass} */
  async fetchWordByCocoClass(cocoClass: string): Promise<VocabularyWord | null> {
    try {
      const dto = await apiClient<BackendWordDto>(`/api/words/${cocoClass}`);
      return mapWordDtoToVocabularyWord(dto);
    } catch {
      return null;
    }
  },

  async getWordByClass(cocoClass: string): Promise<VocabularyWord | null> {
    return this.fetchWordByCocoClass(cocoClass);
  },

  /** POST /api/scan — Upload image file to Spring Boot Gateway */
  async scanImage(fileUri: string): Promise<any> {
    const session = (await supabase.auth.getSession()).data.session;
    const formData = new FormData();
    formData.append('file', {
      uri: fileUri,
      type: 'image/jpeg',
      name: 'scan.jpg',
    } as any);

    const headers: Record<string, string> = {};
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }
    if (session?.user?.id) {
      headers['X-User-Id'] = session.user.id;
    }

    const res = await fetch(`${API_BASE_URL}/api/scan`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (res.status === 403) {
      Alert.alert('Tài khoản bị khóa', 'Tài khoản của bạn đã bị khóa bởi Quản trị viên.');
      await supabase.auth.signOut();
      throw new Error('ACCOUNT_LOCKED');
    }

    if (!res.ok) {
      throw new Error(`Scan API error: ${res.status}`);
    }

    return res.json();
  },

  // Admin APIs
  async fetchAdminStats(): Promise<{ totalUsers: number; activeUsers: number; lockedUsers: number; totalWords: number }> {
    return apiClient('/api/admin/stats');
  },

  async updateCanonicalWord(id: number, data: Partial<BackendWordDto>): Promise<BackendWordDto> {
    return apiClient(`/api/admin/words/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async toggleUserLock(userId: string): Promise<{ userId: string; status: string }> {
    return apiClient(`/api/admin/users/${userId}/toggle-lock`, {
      method: 'POST',
    });
  },
};
