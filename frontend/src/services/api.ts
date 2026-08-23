import Constants from 'expo-constants';
import { Alert } from 'react-native';
import { supabase } from '@/lib/supabase';
import { Lesson, VocabularyWord } from '@/types';

const getHostIp = () => {
  const hostUri = Constants.expoConfig?.hostUri || (Constants as any).manifest?.debuggerHost;
  return hostUri ? hostUri.split(':')[0] : 'localhost';
};

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || `http://${getHostIp()}:8080`;

export interface UserProfileDto {
  userId: string;
  displayName: string;
  role: 'LEARNER' | 'ADMIN';
  locked: boolean;
  wordsSaved: number;
  wordsLearned: number;
  dueCards: number;
}

export interface BackendWordDto {
  id: number;
  detectionLabel: string;
  enWord: string;
  phonetic: string;
  pos: string;
  definition: string;
  translation: string;
  exampleEn: string;
  exampleVn: string;
  imageUrl?: string;
}

export interface BackendFlashcardDto {
  id: number;
  word: BackendWordDto;
  easinessFactor: number;
  repetitions: number;
  intervalDays: number;
  nextReviewAt: string;
  createdAt: string;
}

interface BackendLessonDto {
  id: string;
  name: string;
  description: string;
  difficulty: Lesson['difficulty'];
  category: string;
  icon: string;
  progress: number;
  words: BackendWordDto[];
}

export interface AdminUserEntry {
  userId: string;
  displayName: string;
  role: string;
  locked: boolean;
  wordsSaved: number;
  wordsLearned: number;
}

export type ReviewRating = 'AGAIN' | 'GOOD' | 'EASY';

async function apiClient<T>(endpoint: string, options: RequestInit = {}, retryUnauthorized = true): Promise<T> {
  const session = (await supabase.auth.getSession()).data.session;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };
  if (session?.access_token) headers.Authorization = `Bearer ${session.access_token}`;

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
  } catch {
    throw new Error('NETWORK_UNAVAILABLE');
  }

  if (response.status === 401 && retryUnauthorized) {
    const { data } = await supabase.auth.refreshSession();
    if (data.session) return apiClient<T>(endpoint, options, false);
  }

  if (response.status === 403) {
    const body = await response.text();
    if (body.includes('ACCOUNT_LOCKED')) {
      Alert.alert('Tài khoản bị khóa', 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.');
      await supabase.auth.signOut();
      throw new Error('ACCOUNT_LOCKED');
    }
    throw new Error('FORBIDDEN');
  }

  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `HTTP_${response.status}`);
  }
  const body = await response.text();
  return body ? JSON.parse(body) as T : undefined as T;
}

function mapWord(dto: BackendWordDto): VocabularyWord {
  return {
    id: String(dto.id),
    word: dto.enWord,
    phonetic: dto.phonetic || '',
    vn: dto.translation,
    pos: dto.pos || 'Noun',
    definition: dto.definition || undefined,
    sentence: dto.exampleEn || '',
    sentenceVn: dto.exampleVn || '',
    difficulty: 'easy',
    detectionLabel: dto.detectionLabel,
    imageUrl: dto.imageUrl,
  };
}

function mapFlashcard(dto: BackendFlashcardDto): VocabularyWord {
  return {
    ...mapWord(dto.word),
    flashcardId: String(dto.id),
    easinessFactor: dto.easinessFactor,
    repetitions: dto.repetitions,
    intervalDays: dto.intervalDays,
    nextReviewAt: dto.nextReviewAt,
    difficulty: dto.easinessFactor < 2 ? 'hard' : dto.repetitions >= 2 ? 'easy' : 'medium',
  };
}

function mapLesson(dto: BackendLessonDto): Lesson {
  return { ...dto, wordCount: dto.words.length, words: dto.words.map(mapWord) };
}

export const api = {
  fetchMe: () => apiClient<UserProfileDto>('/api/me'),

  async fetchAllWords(): Promise<VocabularyWord[]> {
    return (await apiClient<BackendWordDto[]>('/api/words')).map(mapWord);
  },

  async scanImage(fileUri: string): Promise<any> {
    let session = (await supabase.auth.getSession()).data.session;
    if (!session) throw new Error('AUTH_REQUIRED');
    const send = async (accessToken: string) => {
      const formData = new FormData();
      formData.append('file', { uri: fileUri, type: 'image/jpeg', name: 'scan.jpg' } as any);
      try {
        return await fetch(`${API_BASE_URL}/api/scan`, {
          method: 'POST', headers: { Authorization: `Bearer ${accessToken}` }, body: formData,
        });
      } catch { throw new Error('NETWORK_UNAVAILABLE'); }
    };
    let response = await send(session.access_token);
    if (response.status === 401) {
      session = (await supabase.auth.refreshSession()).data.session;
      if (!session) {
        await supabase.auth.signOut();
        throw new Error('AUTH_REQUIRED');
      }
      response = await send(session.access_token);
    }
    if (response.status === 403) {
      Alert.alert('Tài khoản bị khóa', 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.');
      await supabase.auth.signOut();
      throw new Error('ACCOUNT_LOCKED');
    }
    if (!response.ok) throw new Error(response.status === 503 ? 'AI_SERVICE_UNAVAILABLE' : `HTTP_${response.status}`);
    return response.json();
  },

  async fetchFlashcards(dueOnly = false): Promise<VocabularyWord[]> {
    return (await apiClient<BackendFlashcardDto[]>(`/api/flashcards?due=${dueOnly}`)).map(mapFlashcard);
  },
  async saveFlashcard(vocabularyId: string): Promise<VocabularyWord> {
    return mapFlashcard(await apiClient<BackendFlashcardDto>('/api/flashcards', {
      method: 'POST', body: JSON.stringify({ vocabularyId: Number(vocabularyId) }),
    }));
  },
  async reviewFlashcard(flashcardId: string, rating: ReviewRating): Promise<VocabularyWord> {
    return mapFlashcard(await apiClient<BackendFlashcardDto>(`/api/flashcards/${flashcardId}/review`, {
      method: 'POST', body: JSON.stringify({ rating }),
    }));
  },
  deleteFlashcard: (flashcardId: string) => apiClient<void>(`/api/flashcards/${flashcardId}`, { method: 'DELETE' }),

  async fetchLessons(): Promise<Lesson[]> {
    return (await apiClient<BackendLessonDto[]>('/api/lessons')).map(mapLesson);
  },
  async saveLessonProgress(lessonId: string, score: number): Promise<Lesson> {
    return mapLesson(await apiClient<BackendLessonDto>(`/api/lessons/${encodeURIComponent(lessonId)}/progress`, {
      method: 'PUT', body: JSON.stringify({ score }),
    }));
  },

  fetchAdminStats: () => apiClient<{ totalUsers: number; activeUsers: number; lockedUsers: number; totalWords: number }>('/api/admin/stats'),
  fetchAllWordDtos: () => apiClient<BackendWordDto[]>('/api/words'),
  fetchAdminUsers: () => apiClient<AdminUserEntry[]>('/api/admin/users'),
  updateCanonicalWord: (id: number, data: Partial<BackendWordDto>) => apiClient<BackendWordDto>(`/api/admin/words/${id}`, {
    method: 'PUT', body: JSON.stringify(data),
  }),
  toggleUserLock: (userId: string) => apiClient<{ userId: string; status: string }>(`/api/admin/users/${userId}/toggle-lock`, { method: 'POST' }),
};
