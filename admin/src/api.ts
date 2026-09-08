const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let token: string | null = sessionStorage.getItem('vocam_admin_token');

export function setToken(value: string | null) {
  token = value;
  if (value) sessionStorage.setItem('vocam_admin_token', value);
  else sessionStorage.removeItem('vocam_admin_token');
}
export function getToken() { return token; }

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `HTTP ${response.status}`);
  }
  const body = await response.text();
  return body ? JSON.parse(body) as T : undefined as T;
}

export async function login(email: string, password: string) {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: SUPABASE_ANON_KEY },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error('Email hoặc mật khẩu không đúng.');
  return response.json() as Promise<{ access_token: string }>;
}

export interface AdminUser {
  userId: string;
  displayName: string;
  role: string;
  locked: boolean;
  wordsSaved: number;
  wordsLearned: number;
}

export interface Word {
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

export const getMe = () => apiFetch<{ role: string }>('/api/me');
export const getStats = () => apiFetch<{ totalUsers: number; activeUsers: number; lockedUsers: number; totalWords: number }>('/api/admin/stats');
export const getUsers = () => apiFetch<AdminUser[]>('/api/admin/users');
export const toggleUserLock = (userId: string) => apiFetch<{ userId: string; status: string }>(`/api/admin/users/${userId}/toggle-lock`, { method: 'POST' });
export const getWords = () => apiFetch<Word[]>('/api/words');
export const updateWord = (id: number, data: Partial<Word>) => apiFetch<Word>(`/api/admin/words/${id}`, { method: 'PUT', body: JSON.stringify(data) });
