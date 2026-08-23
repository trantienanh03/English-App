import { useState, useEffect, useCallback } from 'react';
import './index.css';
import * as api from './api';

/* ══════════════════════════════════════════════════════════
   Types
══════════════════════════════════════════════════════════ */
interface Word {
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

interface LeaderboardEntry {
  rank: number;
  deviceUuid: string;
  displayName: string;
  totalXp: number;
  currentStreak: number;
  wordsLearned: number;
}

type Page = 'dashboard' | 'words' | 'users';

const DIFFICULTY_COLORS: Record<string, string> = {
  Noun: 'badge-learner',
  Verb: 'badge-success',
  Adjective: 'badge-medium',
  Adverb: 'badge-hard',
};

/* ══════════════════════════════════════════════════════════
   Login Screen
══════════════════════════════════════════════════════════ */
function LoginScreen({ onLogin }: { onLogin: (token: string, email: string) => void }) {
  const [email, setEmail] = useState('admin@vocam.app');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) { setError('Vui lòng nhập đầy đủ thông tin.'); return; }
    setLoading(true); setError('');
    try {
      const data = await api.supabaseLogin(email, password);
      api.setToken(data.access_token);
      onLogin(data.access_token, email);
    } catch (e: any) {
      setError(e.message || 'Đăng nhập thất bại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-logo">Vocam Admin</div>
        <div className="login-sub">Quản trị hệ thống học từ vựng</div>
        {error && <div className="login-error">{error}</div>}
        <div className="form-group">
          <label>Email quản trị viên</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@vocam.app" />
        </div>
        <div className="form-group">
          <label>Mật khẩu</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} placeholder="••••••••" />
        </div>
        <button className="login-btn" onClick={handleLogin} disabled={loading}>
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Dashboard Page
══════════════════════════════════════════════════════════ */
function DashboardPage() {
  const [stats, setStats] = useState<{ users: number; words: number; totalXp: number } | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [lb] = await Promise.all([api.getLeaderboard()]);
        const totalXp = lb.reduce((sum: number, e: any) => sum + e.totalXp, 0);
        setStats({ users: lb.length, words: 0, totalXp });
        setLeaderboard(lb);

        // Fetch word count
        const words = await api.getAllWords();
        setStats(s => s ? { ...s, words: words.length } : s);
      } catch {
        setStats({ users: 0, words: 0, totalXp: 0 });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="loading-bar" />;

  return (
    <>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-value">{stats?.users ?? 0}</div>
          <div className="stat-label">Người dùng</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-value">{stats?.words ?? 0}</div>
          <div className="stat-label">Mục từ vựng</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-value">{(stats?.totalXp ?? 0).toLocaleString()}</div>
          <div className="stat-label">Tổng XP toàn hệ thống</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-value">{leaderboard[0]?.displayName?.split(' ')[0] ?? '—'}</div>
          <div className="stat-label">Người dẫn đầu</div>
        </div>
      </div>

      <div className="table-card">
        <div className="table-header">
          <div className="table-title">🏅 Bảng xếp hạng Top 50</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Hạng</th>
              <th>Tên</th>
              <th>Tổng XP</th>
              <th>Streak</th>
              <th>Từ đã học</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map(e => (
              <tr key={e.rank}>
                <td>
                  {e.rank === 1 ? '🥇' : e.rank === 2 ? '🥈' : e.rank === 3 ? '🥉' : `#${e.rank}`}
                </td>
                <td style={{ fontWeight: 600 }}>{e.displayName || 'Ẩn danh'}</td>
                <td><span className="badge badge-learner">{e.totalXp} XP</span></td>
                <td>🔥 {e.currentStreak} ngày</td>
                <td>{e.wordsLearned} từ</td>
              </tr>
            ))}
          </tbody>
        </table>
        {leaderboard.length === 0 && <div className="empty-state">Chưa có dữ liệu người dùng</div>}
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════
   Words Page
══════════════════════════════════════════════════════════ */
const EMPTY_WORD: Partial<Word> = {
  cocoClass: '', enWord: '', phonetic: '', pos: 'Noun',
  definition: '', translation: '', exampleEn: '', exampleVn: '',
};

function WordsPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editWord, setEditWord] = useState<Partial<Word>>(EMPTY_WORD);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 25;

  const load = useCallback(async () => {
    try { setWords(await api.getAllWords()); }
    catch { /* Backend unavailable */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = words.filter(w =>
    w.enWord?.toLowerCase().includes(search.toLowerCase()) ||
    w.cocoClass?.toLowerCase().includes(search.toLowerCase()) ||
    w.translation?.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openCreate = () => { setEditWord(EMPTY_WORD); setShowModal(true); };
  const openEdit = (w: Word) => { setEditWord({ ...w }); setShowModal(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      if ((editWord as Word).id) {
        await api.updateWord((editWord as Word).id, editWord);
      } else {
        await api.createWord(editWord);
      }
      setShowModal(false);
      await load();
    } catch (e: any) {
      alert('Lỗi: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (w: Word) => {
    if (!window.confirm(`Xóa từ "${w.enWord}"?`)) return;
    try {
      await api.deleteWord(w.id);
      setWords(prev => prev.filter(x => x.id !== w.id));
    } catch (e: any) {
      alert('Lỗi xóa: ' + e.message);
    }
  };

  if (loading) return <div className="loading-bar" />;

  return (
    <>
      <div className="table-card">
        <div className="table-header">
          <div className="table-title">📖 Quản lý từ vựng ({words.length} mục)</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              className="table-search"
              placeholder="🔍 Tìm kiếm từ..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
            <button className="btn btn-primary" onClick={openCreate}>+ Thêm từ mới</button>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Từ tiếng Anh</th>
              <th>Phiên âm</th>
              <th>Loại từ</th>
              <th>Nghĩa tiếng Việt</th>
              <th>Nhãn YOLO</th>
              <th style={{ textAlign: 'right' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((w, i) => (
              <tr key={w.id}>
                <td style={{ color: 'var(--text-muted)' }}>{(page - 1) * PAGE_SIZE + i + 1}</td>
                <td style={{ fontWeight: 700 }}>{w.enWord}</td>
                <td style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>{w.phonetic}</td>
                <td><span className={`badge ${DIFFICULTY_COLORS[w.pos] || 'badge-learner'}`}>{w.pos}</span></td>
                <td>{w.translation}</td>
                <td><code style={{ fontSize: 11, background: 'var(--canvas)', padding: '2px 6px', borderRadius: 4 }}>{w.cocoClass}</code></td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn btn-ghost" style={{ marginRight: 6 }} onClick={() => openEdit(w)}>✏️</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(w)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && <div className="empty-state">Không tìm thấy từ nào</div>}

        {totalPages > 1 && (
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
            ))}
          </div>
        )}
      </div>

      {/* Word Form Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-card">
            <div className="modal-title">{(editWord as Word).id ? '✏️ Chỉnh sửa từ' : '➕ Thêm từ mới'}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
              <div className="form-group">
                <label>Nhãn YOLO (coco_class)</label>
                <input value={editWord.cocoClass || ''} onChange={e => setEditWord(p => ({ ...p, cocoClass: e.target.value }))} placeholder="vd: cup" />
              </div>
              <div className="form-group">
                <label>Từ tiếng Anh</label>
                <input value={editWord.enWord || ''} onChange={e => setEditWord(p => ({ ...p, enWord: e.target.value }))} placeholder="vd: Cup" />
              </div>
              <div className="form-group">
                <label>Phiên âm IPA</label>
                <input value={editWord.phonetic || ''} onChange={e => setEditWord(p => ({ ...p, phonetic: e.target.value }))} placeholder="vd: /kʌp/" />
              </div>
              <div className="form-group">
                <label>Loại từ</label>
                <select value={editWord.pos || 'Noun'} onChange={e => setEditWord(p => ({ ...p, pos: e.target.value }))}>
                  <option>Noun</option><option>Verb</option><option>Adjective</option><option>Adverb</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Định nghĩa tiếng Anh</label>
              <textarea value={editWord.definition || ''} onChange={e => setEditWord(p => ({ ...p, definition: e.target.value }))} placeholder="vd: A small open container for drinking" />
            </div>
            <div className="form-group">
              <label>Nghĩa tiếng Việt</label>
              <input value={editWord.translation || ''} onChange={e => setEditWord(p => ({ ...p, translation: e.target.value }))} placeholder="vd: cái cốc, tách uống" />
            </div>
            <div className="form-group">
              <label>Câu ví dụ tiếng Anh</label>
              <textarea value={editWord.exampleEn || ''} onChange={e => setEditWord(p => ({ ...p, exampleEn: e.target.value }))} placeholder="vd: She drank water from the cup." />
            </div>
            <div className="form-group">
              <label>Câu ví dụ tiếng Việt</label>
              <textarea value={editWord.exampleVn || ''} onChange={e => setEditWord(p => ({ ...p, exampleVn: e.target.value }))} placeholder="vd: Cô ấy uống nước từ cái cốc." />
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Hủy</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Đang lưu...' : '✅ Lưu'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ══════════════════════════════════════════════════════════
   Users Page (Leaderboard)
══════════════════════════════════════════════════════════ */
function UsersPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.getLeaderboard()
      .then(setEntries)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = entries.filter(e =>
    e.displayName?.toLowerCase().includes(search.toLowerCase()) ||
    e.deviceUuid?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loading-bar" />;

  return (
    <div className="table-card">
      <div className="table-header">
        <div className="table-title">👥 Danh sách người dùng ({entries.length})</div>
        <input
          className="table-search"
          placeholder="🔍 Tìm người dùng..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Hạng</th>
            <th>Tên hiển thị</th>
            <th>Tổng XP</th>
            <th>Streak hiện tại</th>
            <th>Từ đã học</th>
            <th>Device UUID</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(e => (
            <tr key={e.deviceUuid}>
              <td>{e.rank === 1 ? '🥇' : e.rank === 2 ? '🥈' : e.rank === 3 ? '🥉' : `#${e.rank}`}</td>
              <td style={{ fontWeight: 600 }}>{e.displayName || 'Ẩn danh'}</td>
              <td><span className="badge badge-learner">{e.totalXp} XP</span></td>
              <td>🔥 {e.currentStreak} ngày</td>
              <td>{e.wordsLearned} từ</td>
              <td style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-muted)' }}>
                {e.deviceUuid.slice(0, 16)}...
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filtered.length === 0 && <div className="empty-state">Chưa có dữ liệu người dùng</div>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Root App
══════════════════════════════════════════════════════════ */
export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const [adminEmail, setAdminEmail] = useState('');
  const [page, setPage] = useState<Page>('dashboard');

  const handleLogin = (t: string, email: string) => {
    setToken(t);
    setAdminEmail(email);
  };

  const handleLogout = () => {
    api.clearToken();
    setToken(null);
    setAdminEmail('');
  };

  if (!token) return <LoginScreen onLogin={handleLogin} />;

  const pageTitle: Record<Page, string> = {
    dashboard: '📊 Tổng quan',
    words: '📖 Quản lý từ vựng',
    users: '👥 Người dùng',
  };

  return (
    <div className="app">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-logo">
          <h1>Vocam</h1>
          <p>Admin Dashboard</p>
        </div>
        <nav className="sidebar-nav">
          {(['dashboard', 'words', 'users'] as Page[]).map(p => (
            <div
              key={p}
              className={`nav-item ${page === p ? 'active' : ''}`}
              onClick={() => setPage(p)}
            >
              <span>{p === 'dashboard' ? '📊' : p === 'words' ? '📖' : '👥'}</span>
              <span>{p === 'dashboard' ? 'Tổng quan' : p === 'words' ? 'Từ vựng' : 'Người dùng'}</span>
            </div>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>🚪 Đăng xuất</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main">
        <div className="topbar">
          <div className="topbar-title">{pageTitle[page]}</div>
          <div className="topbar-user">
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{adminEmail}</span>
            <div className="avatar-chip">{adminEmail[0]?.toUpperCase() || 'A'}</div>
          </div>
        </div>
        <div className="content">
          {page === 'dashboard' && <DashboardPage />}
          {page === 'words' && <WordsPage />}
          {page === 'users' && <UsersPage />}
        </div>
      </div>
    </div>
  );
}
