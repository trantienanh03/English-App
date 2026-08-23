import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { api, BackendWordDto, AdminUserEntry } from '@/services/api';
import { supabase } from '@/lib/supabase';

interface AdminNavigatorProps {
  adminEmail: string;
  onLogout: () => void;
}

type AdminTab = 'dashboard' | 'words' | 'users';

export default function AdminNavigator({ adminEmail, onLogout }: AdminNavigatorProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [stats, setStats] = useState<{ totalUsers: number; activeUsers: number; lockedUsers: number; totalWords: number } | null>(null);
  const [words, setWords] = useState<BackendWordDto[]>([]);
  const [users, setUsers] = useState<AdminUserEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [editWord, setEditWord] = useState<Partial<BackendWordDto> | null>(null);
  const [savingWord, setSavingWord] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [s, w] = await Promise.all([
        api.fetchAdminStats().catch(() => ({ totalUsers: 0, activeUsers: 0, lockedUsers: 0, totalWords: 365 })),
        api.fetchAllWords().catch(() => []),
      ]);
      setStats(s);
      setWords(w as any);
    } catch (e: any) {
      console.warn('Error loading admin data:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggleLock = async (user: AdminUserEntry) => {
    try {
      const res = await api.toggleUserLock(user.userId);
      setUsers(prev => prev.map(u => u.userId === user.userId ? { ...u, locked: res.status === 'LOCKED' } : u));
      Alert.alert('Thành công', `Đã ${res.status === 'LOCKED' ? 'khóa' : 'mở khóa'} tài khoản.`);
    } catch (err: any) {
      Alert.alert('Lỗi', err.message);
    }
  };

  const handlePickAndUploadImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0] && editWord) {
      try {
        setSavingWord(true);
        const uri = result.assets[0].uri;
        const filename = `word_${editWord.id || Date.now()}_${Date.now()}.jpg`;
        const blob = await (await fetch(uri)).blob();

        const { data, error } = await supabase.storage
          .from('vocabulary-images')
          .upload(`vocab/${filename}`, blob, { contentType: 'image/jpeg', upsert: true });

        if (error) throw error;

        const publicUrlData = supabase.storage.from('vocabulary-images').getPublicUrl(`vocab/${filename}`);
        setEditWord(prev => prev ? ({ ...prev, imageUrl: publicUrlData.data.publicUrl }) : null);
        Alert.alert('Thành công', 'Đã tải ảnh lên Supabase Storage!');
      } catch (err: any) {
        Alert.alert('Lỗi Upload', err.message);
      } finally {
        setSavingWord(false);
      }
    }
  };

  const handleSaveWord = async () => {
    if (!editWord || !editWord.id) return;
    setSavingWord(true);
    try {
      await api.updateCanonicalWord(editWord.id, editWord);
      Alert.alert('Thành công', 'Đã cập nhật từ vựng!');
      setEditWord(null);
      await loadData();
    } catch (e: any) {
      Alert.alert('Lỗi', e.message);
    } finally {
      setSavingWord(false);
    }
  };

  const filteredWords = words.filter(w =>
    w.enWord?.toLowerCase().includes(search.toLowerCase()) ||
    w.cocoClass?.toLowerCase().includes(search.toLowerCase()) ||
    w.translation?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Admin Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Vocam Mobile Admin</Text>
          <Text style={styles.headerSub}>{adminEmail}</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <Feather name="log-out" size={18} color="#EF4444" />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Navigation Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'dashboard' && styles.tabActive]}
          onPress={() => setActiveTab('dashboard')}
        >
          <Feather name="grid" size={16} color={activeTab === 'dashboard' ? '#4F46E5' : '#64748B'} />
          <Text style={[styles.tabText, activeTab === 'dashboard' && styles.tabTextActive]}>Tổng quan</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'words' && styles.tabActive]}
          onPress={() => setActiveTab('words')}
        >
          <Feather name="book-open" size={16} color={activeTab === 'words' ? '#4F46E5' : '#64748B'} />
          <Text style={[styles.tabText, activeTab === 'words' && styles.tabTextActive]}>Kho 365 Từ</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'users' && styles.tabActive]}
          onPress={() => setActiveTab('users')}
        >
          <Feather name="users" size={16} color={activeTab === 'users' ? '#4F46E5' : '#64748B'} />
          <Text style={[styles.tabText, activeTab === 'users' && styles.tabTextActive]}>Người dùng</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📊 Thống kê Hệ thống</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Text style={styles.statVal}>{stats?.totalUsers ?? 0}</Text>
                  <Text style={styles.statLbl}>Tổng người dùng</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={[styles.statVal, { color: '#10B981' }]}>{stats?.activeUsers ?? 0}</Text>
                  <Text style={styles.statLbl}>Hoạt động</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={[styles.statVal, { color: '#EF4444' }]}>{stats?.lockedUsers ?? 0}</Text>
                  <Text style={styles.statLbl}>Đã khóa</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={[styles.statVal, { color: '#6366F1' }]}>{stats?.totalWords ?? 365}</Text>
                  <Text style={styles.statLbl}>Từ Canonical</Text>
                </View>
              </View>
            </View>
          )}

          {/* WORDS CANONICAL TAB */}
          {activeTab === 'words' && (
            <View style={styles.section}>
              <View style={styles.rowBetween}>
                <Text style={styles.sectionTitle}>📖 Từ vựng Canonical (365 nhãn)</Text>
              </View>
              <TextInput
                style={styles.searchInput}
                placeholder="🔍 Tìm theo nhãn YOLO hoặc nghĩa..."
                value={search}
                onChangeText={setSearch}
              />
              {filteredWords.slice(0, 30).map(w => (
                <View key={w.id} style={styles.wordCard}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.wordTitle}>{w.enWord} <Text style={styles.wordPhonetic}>{w.phonetic}</Text></Text>
                    <Text style={styles.wordSub}>{w.translation} • <Text style={styles.cocoBadge}>{w.cocoClass}</Text></Text>
                  </View>
                  <TouchableOpacity style={styles.editBtn} onPress={() => setEditWord(w)}>
                    <Feather name="edit-2" size={16} color="#4F46E5" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* USERS TAB */}
          {activeTab === 'users' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>👥 Quản lý Người dùng</Text>
              {users.map(u => (
                <View key={u.userId} style={styles.userCard}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.userName}>{u.displayName || 'Học Viên Vocam'}</Text>
                    <Text style={styles.userMeta}>Từ đã lưu: {u.wordsSaved} • Từ đã thuộc: {u.wordsLearned} • {u.locked ? '🔒 LOCKED' : '🟢 ACTIVE'}</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.lockBtn, u.locked && styles.unlockBtn]}
                    onPress={() => handleToggleLock(u)}
                  >
                    <Text style={styles.lockBtnText}>{u.locked ? '🔓 Mở khóa' : '🔒 Khóa'}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}

      {/* WORD EDIT MODAL */}
      <Modal visible={!!editWord} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>✏️ Cập nhật Từ vựng Canonical</Text>
            {editWord && (
              <ScrollView>
                <Text style={styles.inputLbl}>Nhãn YOLO (Cố định): <Text style={{ fontWeight: 'bold' }}>{editWord.cocoClass}</Text></Text>
                
                <Text style={styles.inputLbl}>Từ tiếng Anh</Text>
                <TextInput style={styles.input} value={editWord.enWord} onChangeText={t => setEditWord(p => ({ ...p!, enWord: t }))} />

                <Text style={styles.inputLbl}>Phiên âm IPA</Text>
                <TextInput style={styles.input} value={editWord.phonetic} onChangeText={t => setEditWord(p => ({ ...p!, phonetic: t }))} />

                <Text style={styles.inputLbl}>Nghĩa tiếng Việt</Text>
                <TextInput style={styles.input} value={editWord.translation} onChangeText={t => setEditWord(p => ({ ...p!, translation: t }))} />

                <Text style={styles.inputLbl}>Định nghĩa</Text>
                <TextInput style={styles.input} value={editWord.definition} onChangeText={t => setEditWord(p => ({ ...p!, definition: t }))} />

                <Text style={styles.inputLbl}>Ảnh minh họa (Supabase Storage)</Text>
                {editWord.imageUrl ? (
                  <Image source={{ uri: editWord.imageUrl }} style={{ width: 100, height: 100, borderRadius: 8, marginBottom: 8 }} />
                ) : null}
                <TouchableOpacity style={styles.uploadBtn} onPress={handlePickAndUploadImage}>
                  <Feather name="upload" size={16} color="#FFFFFF" />
                  <Text style={styles.uploadBtnText}>Tải ảnh lên Supabase Storage</Text>
                </TouchableOpacity>

                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditWord(null)}>
                    <Text style={styles.cancelText}>Hủy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.saveBtn} onPress={handleSaveWord} disabled={savingWord}>
                    <Text style={styles.saveText}>{savingWord ? 'Đang lưu...' : 'Lưu thay đổi'}</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderColor: '#E2E8F0' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B' },
  headerSub: { fontSize: 12, color: '#64748B' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  logoutText: { fontSize: 12, fontWeight: '600', color: '#EF4444' },

  tabBar: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderColor: '#E2E8F0' },
  tabItem: { flex: 1, paddingVertical: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 },
  tabActive: { borderBottomWidth: 2, borderColor: '#4F46E5' },
  tabText: { fontSize: 13, color: '#64748B' },
  tabTextActive: { color: '#4F46E5', fontWeight: '700' },

  scrollContent: { padding: 16 },
  section: { gap: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1E293B', marginBottom: 8 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: { width: '48%', backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  statVal: { fontSize: 24, fontWeight: '800', color: '#1E293B' },
  statLbl: { fontSize: 12, color: '#64748B', marginTop: 4 },

  searchInput: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 10, padding: 10, marginBottom: 12 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  wordCard: { flexDirection: 'row', backgroundColor: '#FFFFFF', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 8, alignItems: 'center' },
  wordTitle: { fontSize: 15, fontWeight: '700', color: '#1E293B' },
  wordPhonetic: { fontSize: 12, fontWeight: '400', fontStyle: 'italic', color: '#64748B' },
  wordSub: { fontSize: 13, color: '#475569', marginTop: 2 },
  cocoBadge: { fontSize: 11, color: '#4F46E5', fontWeight: '600' },
  editBtn: { padding: 8 },

  userCard: { flexDirection: 'row', backgroundColor: '#FFFFFF', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 8, alignItems: 'center' },
  userName: { fontSize: 15, fontWeight: '700', color: '#1E293B' },
  userMeta: { fontSize: 12, color: '#64748B', marginTop: 2 },
  lockBtn: { backgroundColor: '#EF4444', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  unlockBtn: { backgroundColor: '#10B981' },
  lockBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },

  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '80%' },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B', marginBottom: 16 },
  inputLbl: { fontSize: 12, fontWeight: '600', color: '#475569', marginTop: 8, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, padding: 10, fontSize: 14, marginBottom: 8 },
  uploadBtn: { backgroundColor: '#4F46E5', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 12, borderRadius: 8, marginTop: 8 },
  uploadBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },

  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 16 },
  cancelBtn: { padding: 12 },
  cancelText: { color: '#64748B', fontWeight: '600' },
  saveBtn: { backgroundColor: '#10B981', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8 },
  saveText: { color: '#FFFFFF', fontWeight: '700' },
});
