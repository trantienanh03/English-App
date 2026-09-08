import { useCallback, useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import * as api from './api';
import './App.css';

type Tab = 'overview' | 'users' | 'words';

export default function App() {
  const [authenticated, setAuthenticated] = useState(Boolean(api.getToken()));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('overview');
  const [stats, setStats] = useState<Awaited<ReturnType<typeof api.getStats>> | null>(null);
  const [users, setUsers] = useState<api.AdminUser[]>([]);
  const [words, setWords] = useState<api.Word[]>([]);
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<api.Word | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!api.getToken()) return;
    setBusy(true);
    setError(null);
    try {
      const me = await api.getMe();
      if (me.role !== 'ADMIN') throw new Error('Tài khoản không có quyền quản trị.');
      const [nextStats, nextUsers, nextWords] = await Promise.all([api.getStats(), api.getUsers(), api.getWords()]);
      setStats(nextStats);
      setUsers(nextUsers);
      setWords(nextWords);
      setAuthenticated(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Không thể tải dữ liệu.');
      api.setToken(null);
      setAuthenticated(false);
    } finally { setBusy(false); }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  const submitLogin = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const session = await api.login(email, password);
      api.setToken(session.access_token);
      await load();
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Đăng nhập thất bại.'); }
    finally { setBusy(false); }
  };

  const filteredWords = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return words.filter(word => !normalized || [word.enWord, word.translation, word.detectionLabel].some(value => value?.toLowerCase().includes(normalized)));
  }, [query, words]);

  if (!authenticated) return (
    <main className="login-page"><form className="login-card" onSubmit={submitLogin}>
      <h1>Vocam Admin</h1><p>Đăng nhập bằng tài khoản ADMIN.</p>
      {error && <div className="error-msg">{error}</div>}
      <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email" required />
      <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Mật khẩu" required minLength={6} />
      <button disabled={busy}>{busy ? 'Đang xác thực...' : 'Đăng nhập'}</button>
    </form></main>
  );

  const toggleLock = async (user: api.AdminUser) => {
    try {
      const result = await api.toggleUserLock(user.userId);
      setUsers(previous => previous.map(item => item.userId === user.userId ? { ...item, locked: result.status === 'LOCKED' } : item));
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Không thể cập nhật người dùng.'); }
  };

  const saveWord = async () => {
    if (!editing) return;
    setBusy(true);
    try {
      const updated = await api.updateWord(editing.id, editing);
      setWords(previous => previous.map(word => word.id === updated.id ? updated : word));
      setEditing(null);
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Không thể cập nhật từ vựng.'); }
    finally { setBusy(false); }
  };

  return (
    <div className="app-shell">
      <aside className="sidebar"><h2>Vocam</h2>
        {(['overview', 'users', 'words'] as Tab[]).map(item => <button key={item} className={tab === item ? 'active' : ''} onClick={() => setTab(item)}>{item === 'overview' ? 'Tổng quan' : item === 'users' ? 'Người dùng' : 'Từ vựng'}</button>)}
        <button onClick={() => { api.setToken(null); setAuthenticated(false); }}>Đăng xuất</button>
      </aside>
      <main className="main-content">
        {error && <div className="error-msg">{error}</div>}
        {tab === 'overview' && <><h1>Tổng quan</h1><div className="stats-grid">
          <div className="stat-card"><strong>{stats?.totalUsers ?? 0}</strong><span>Người dùng</span></div>
          <div className="stat-card"><strong>{stats?.activeUsers ?? 0}</strong><span>Đang hoạt động</span></div>
          <div className="stat-card"><strong>{stats?.lockedUsers ?? 0}</strong><span>Đã khóa</span></div>
          <div className="stat-card"><strong>{stats?.totalWords ?? 0}</strong><span>Nhãn canonical</span></div>
        </div></>}
        {tab === 'users' && <><h1>Quản lý người dùng</h1><table><thead><tr><th>Tên</th><th>Vai trò</th><th>Đã lưu</th><th>Đã thuộc</th><th>Trạng thái</th><th /></tr></thead><tbody>
          {users.map(user => <tr key={user.userId}><td>{user.displayName}</td><td>{user.role}</td><td>{user.wordsSaved}</td><td>{user.wordsLearned}</td><td>{user.locked ? 'Đã khóa' : 'Hoạt động'}</td><td><button onClick={() => void toggleLock(user)}>{user.locked ? 'Mở khóa' : 'Khóa'}</button></td></tr>)}
        </tbody></table></>}
        {tab === 'words' && <><h1>Từ vựng canonical</h1><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Tìm nhãn, từ hoặc nghĩa..." /><table><thead><tr><th>Nhãn</th><th>Từ</th><th>Nghĩa</th><th /></tr></thead><tbody>
          {filteredWords.map(word => <tr key={word.id}><td>{word.detectionLabel}</td><td>{word.enWord}</td><td>{word.translation}</td><td><button onClick={() => setEditing(word)}>Sửa</button></td></tr>)}
        </tbody></table></>}
      </main>
      {editing && <div className="modal-overlay"><div className="modal"><h2>{editing.detectionLabel}</h2>
        {(['enWord', 'phonetic', 'translation', 'definition', 'exampleEn', 'exampleVn', 'imageUrl'] as const).map(field => <label key={field}>{field}<input value={editing[field] || ''} onChange={e => setEditing({ ...editing, [field]: e.target.value })} /></label>)}
        <div><button onClick={() => setEditing(null)}>Hủy</button><button disabled={busy} onClick={() => void saveWord()}>Lưu</button></div>
      </div></div>}
    </div>
  );
}
