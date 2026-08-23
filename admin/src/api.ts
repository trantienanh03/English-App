/* ─── API Client ───────────────────────────────────────────────────────────── */
const BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8080';
const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

let _token: string | null = null;

export function setToken(t: string) { _token = t; }
export function clearToken() { _token = null; }
export function getToken() { return _token; }

async function apiFetch(path: string, opts: RequestInit = {}): Promise<any> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(opts.headers as any),
  };
  if (_token) headers['Authorization'] = `Bearer ${_token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...opts, headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

/* ─── Supabase Auth ────────────────────────────────────────────────────────── */
export async function supabaseLogin(email: string, password: string): Promise<{ access_token: string; user: any }> {
  const res = await fetch(
    `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ email, password }),
    }
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error_description || 'Login failed');
  }
  return res.json();
}

/* ─── Stats ────────────────────────────────────────────────────────────────── */
export async function getStats(): Promise<{ users: number; words: number; totalXp: number }> {
  return apiFetch('/api/admin/stats');
}

/* ─── Users / Leaderboard ──────────────────────────────────────────────────── */
export async function getLeaderboard(): Promise<any[]> {
  return apiFetch('/api/leaderboard');
}

/* ─── Words ────────────────────────────────────────────────────────────────── */
export async function getAllWords(): Promise<any[]> {
  return apiFetch('/api/words');
}

export async function createWord(data: any): Promise<any> {
  return apiFetch('/api/admin/words', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateWord(id: number, data: any): Promise<any> {
  return apiFetch(`/api/admin/words/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteWord(id: number): Promise<void> {
  return apiFetch(`/api/admin/words/${id}`, { method: 'DELETE' });
}
