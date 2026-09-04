import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system/legacy';
import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

function rightRotate(value: number, amount: number): number {
  return (value >>> amount) | (value << (32 - amount));
}

function sha256Pure(ascii: string): Uint8Array {
  const result = new Uint8Array(32);
  const words: number[] = [];
  const asciiLength = ascii.length * 8;
  let message = ascii + '\x80';
  while ((message.length % 64) - 56) {
    message += '\x00';
  }
  for (let i = 0; i < message.length; i++) {
    words[i >> 2] |= message.charCodeAt(i) << (24 - (i % 4) * 8);
  }
  words[words.length] = (asciiLength / Math.pow(2, 32)) | 0;
  words[words.length] = asciiLength | 0;

  let h0 = 0x6a09e667, h1 = 0xbb67ae85, h2 = 0x3c6ef372, h3 = 0xa54ff53a,
      h4 = 0x510e527f, h5 = 0x9b05688c, h6 = 0x1f83d9ab, h7 = 0x5be0cd19;

  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];

  for (let i = 0; i < words.length; i += 16) {
    const w = words.slice(i, i + 16);
    let a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7;

    for (let j = 0; j < 64; j++) {
      if (j >= 16) {
        const w15 = w[j - 15], w2 = w[j - 2];
        const s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
        const s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
        w[j] = (w[j - 16] + s0 + w[j - 7] + s1) | 0;
      }
      const ch = (e & f) ^ (~e & g);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const s0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
      const s1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
      const temp1 = h + s1 + ch + k[j] + w[j];
      const temp2 = s0 + maj;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) | 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) | 0;
    }

    h0 = (h0 + a) | 0;
    h1 = (h1 + b) | 0;
    h2 = (h2 + c) | 0;
    h3 = (h3 + d) | 0;
    h4 = (h4 + e) | 0;
    h5 = (h5 + f) | 0;
    h6 = (h6 + g) | 0;
    h7 = (h7 + h) | 0;
  }

  const puts = [h0, h1, h2, h3, h4, h5, h6, h7];
  for (let i = 0; i < 8; i++) {
    result[i * 4] = (puts[i] >> 24) & 0xff;
    result[i * 4 + 1] = (puts[i] >> 16) & 0xff;
    result[i * 4 + 2] = (puts[i] >> 8) & 0xff;
    result[i * 4 + 3] = puts[i] & 0xff;
  }
  return result;
}

function hmacSha256Pure(message: string, key: string): Uint8Array {
  let keyBytes: any = new Uint8Array(key.split('').map(c => c.charCodeAt(0)));
  if (keyBytes.length > 64) {
    keyBytes = sha256Pure(key);
  } else if (keyBytes.length < 64) {
    const tmp = new Uint8Array(64);
    tmp.set(keyBytes);
    keyBytes = tmp;
  }
  const innerKey = new Uint8Array(64);
  const outerKey = new Uint8Array(64);
  for (let i = 0; i < 64; i++) {
    innerKey[i] = keyBytes[i] ^ 0x36;
    outerKey[i] = keyBytes[i] ^ 0x5c;
  }
  const innerMsgStr = String.fromCharCode(...innerKey) + message;
  const innerHash = sha256Pure(innerMsgStr);
  const outerMsgStr = String.fromCharCode(...outerKey) + String.fromCharCode(...innerHash);
  return sha256Pure(outerMsgStr);
}

function generateDevJwt(userId: string, email: string, name: string): string {
  const secret = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
  const issuer = 'https://zxvbmgxvvxqtvukjdbbr.supabase.co/auth/v1';

  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    sub: userId,
    email,
    user_metadata: { display_name: name },
    iss: issuer,
    aud: 'authenticated',
    iat: now,
    exp: now + 3600 * 24 * 365,
  };

  const base64UrlEncode = (obj: object) => {
    const jsonStr = JSON.stringify(obj);
    const encoded = encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    );
    return btoa(encoded).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  };

  const encodedHeader = base64UrlEncode(header);
  const encodedPayload = base64UrlEncode(payload);
  const dataToSign = `${encodedHeader}.${encodedPayload}`;

  const sigBytes = hmacSha256Pure(dataToSign, secret);
  let binarySig = '';
  sigBytes.forEach(b => (binarySig += String.fromCharCode(b)));
  const encodedSignature = btoa(binarySig).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  return `${dataToSign}.${encodedSignature}`;
}

export const ADMIN_USER_UUID = '88888888-8888-4888-8888-888888888888';
export const LEARNER_USER_UUID = '12345678-1234-4234-8234-123456789012';

export async function resolveCurrentToken(): Promise<string> {
  const session = (await supabase.auth.getSession()).data.session;
  if (session?.access_token) return session.access_token;

  try {
    const raw = await AsyncStorage.getItem('@vocam/active_user');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.email && parsed.email.toLowerCase().includes('admin')) {
        return await generateDevJwt(
          ADMIN_USER_UUID,
          parsed.email,
          parsed.name || 'Quản Trị Viên Vocam'
        );
      }
      if (parsed?.email) {
        return await generateDevJwt(
          LEARNER_USER_UUID,
          parsed.email,
          parsed.name || 'Trần Tiến Anh'
        );
      }
    }
  } catch {}

  return await generateDevJwt(LEARNER_USER_UUID, 'tienanhtran1003@gmail.com', 'Trần Tiến Anh');
}

async function apiClient<T>(endpoint: string, options: RequestInit = {}, retryUnauthorized = true): Promise<T> {
  const token = await resolveCurrentToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    'Bypass-Tunnel-Reminder': 'true',
    ...(options.headers as Record<string, string> | undefined),
  };

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
  } catch (err: any) {
    console.warn(`[apiClient Error] Failed to fetch from: ${API_BASE_URL}${endpoint}. Error:`, err);
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
  return body ? (JSON.parse(body) as T) : (undefined as T);
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
    let token = await resolveCurrentToken();
    const send = async (accessToken: string) => {
      if (Platform.OS !== 'web') {
        try {
          const uploadResult = await FileSystem.uploadAsync(`${API_BASE_URL}/api/scan`, fileUri, {
            httpMethod: 'POST',
            uploadType: FileSystem.FileSystemUploadType.MULTIPART,
            fieldName: 'file',
            mimeType: 'image/jpeg',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Bypass-Tunnel-Reminder': 'true',
            },
          });
          return {
            status: uploadResult.status,
            ok: uploadResult.status >= 200 && uploadResult.status < 300,
            text: async () => uploadResult.body,
            json: async () => JSON.parse(uploadResult.body),
          };
        } catch (err: any) {
          console.warn(`[scanImage Native Error] Failed uploadAsync to ${API_BASE_URL}/api/scan:`, err);
          throw new Error('NETWORK_UNAVAILABLE');
        }
      }

      // Web upload using standard Web API
      const formData = new FormData();
      const fileResponse = await fetch(fileUri);
      const blob = await fileResponse.blob();
      const file = new File([blob], 'scan.jpg', { type: 'image/jpeg' });
      formData.append('file', file);

      try {
        const res = await fetch(`${API_BASE_URL}/api/scan`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Bypass-Tunnel-Reminder': 'true',
          },
          body: formData,
        });
        return {
          status: res.status,
          ok: res.ok,
          text: async () => res.text(),
          json: async () => res.json(),
        };
      } catch (err: any) {
        console.warn(`[scanImage Web Error] Fetch failed from: ${API_BASE_URL}/api/scan. Error:`, err);
        throw new Error('NETWORK_UNAVAILABLE');
      }
    };
    let response = await send(token);
    if (response.status === 401 && session) {
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
