import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { cancelReviewNotification, hasScheduledReviewNotification, scheduleReviewNotification } from '@/utils/notification';

interface ProfileScreenProps {
  userName: string;
  userEmail?: string;
  wordsSavedCount: number;
  wordsLearnedCount: number;
  dueCardsCount: number;
  onLogout: () => void;
}

export default function ProfileScreen({
  userName,
  userEmail,
  wordsSavedCount,
  wordsLearnedCount,
  dueCardsCount,
  onLogout,
}: ProfileScreenProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => { void hasScheduledReviewNotification().then(setNotificationsEnabled); }, []);

  const handleToggleNotifications = async (value: boolean) => {
    try {
      if (value) {
        if (dueCardsCount === 0) {
          Alert.alert(
            'Thông báo thử nghiệm',
            'Hiện không có thẻ từ nào đến hạn ôn tập. Bạn có muốn nhận một thông báo thử nghiệm sau 5 giây để kiểm tra tính năng không?',
            [
              { text: 'Hủy', onPress: () => setNotificationsEnabled(false), style: 'cancel' },
              {
                text: 'Có, gửi thử',
                onPress: async () => {
                  const identifier = await scheduleReviewNotification(0, 5);
                  setNotificationsEnabled(Boolean(identifier));
                  if (identifier) {
                    Alert.alert('Đã lên lịch', 'Vui lòng khóa màn hình hoặc đưa ứng dụng về chạy ngầm (nút Home) để nhận thông báo sau 5 giây!');
                  }
                },
              },
            ]
          );
        } else {
          const identifier = await scheduleReviewNotification(dueCardsCount, 3600);
          setNotificationsEnabled(Boolean(identifier));
          if (identifier) {
            Alert.alert('Đã bật thông báo', 'Vocam sẽ nhắc bạn khi có thẻ từ đến hạn ôn tập.');
          } else {
            Alert.alert('Không thể bật thông báo', 'Quyền thông báo chưa được cấp trong cài đặt thiết bị.');
            setNotificationsEnabled(false);
          }
        }
      } else {
        await cancelReviewNotification();
        setNotificationsEnabled(false);
      }
    } catch {
      setNotificationsEnabled(false);
      Alert.alert('Không thể cập nhật thông báo', 'Vui lòng kiểm tra cài đặt hệ thống rồi thử lại.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* PROFILE CARD */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {userName ? userName.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{userName || 'Học viên Vocam'}</Text>
            <Text style={styles.userEmail}>{userEmail || 'learner@vocam.app'}</Text>
          </View>
        </View>

        {/* LEARNING PROGRESS SUMMARY */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tiến độ Học tập</Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{wordsSavedCount}</Text>
              <Text style={styles.statLabel}>Từ đã lưu vào Sổ từ</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{wordsLearnedCount}</Text>
              <Text style={styles.statLabel}>Từ đã ghi nhớ</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{dueCardsCount}</Text>
              <Text style={styles.statLabel}>Từ cần ôn hôm nay</Text>
            </View>
          </View>
        </View>

        {/* SETTINGS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cài đặt & Nhắc nhở</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View>
                <Text style={styles.settingTitle}>Thông báo Nhắc ôn tập</Text>
                <Text style={styles.settingSub}>Báo khi có từ SM-2 đến hạn ôn</Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: '#CBD5E1', true: '#818CF8' }}
              thumbColor={notificationsEnabled ? '#4F46E5' : '#F1F5F9'}
            />
          </View>

          <TouchableOpacity style={styles.settingItem} onPress={() => Alert.alert('Vocam App', 'Phiên bản 2.0.0 — Hệ thống Học Từ vựng Tiếng Anh AI Scanner & SM-2')}>
            <View style={styles.settingLeft}>
              <View>
                <Text style={styles.settingTitle}>Về ứng dụng Vocam</Text>
                <Text style={styles.settingSub}>Phiên bản 2.0.0 (Objects365 & SM-2)</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* LOGOUT BUTTON */}
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutText}>Đăng xuất khỏi ứng dụng</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { padding: 16, paddingBottom: 110, gap: 16 },
  emoji: {
    fontFamily: Platform.OS === 'ios' ? 'Apple Color Emoji' : undefined,
  },

  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 14,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 24, fontWeight: '800', color: '#FFFFFF' },
  profileInfo: { flex: 1 },
  userName: { fontSize: 18, fontWeight: '800', color: '#1E293B' },
  userEmail: { fontSize: 13, color: '#64748B', marginTop: 2 },

  section: { gap: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1E293B' },

  statsRow: { flexDirection: 'row', gap: 10 },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    gap: 4,
  },
  statNumber: { fontSize: 20, fontWeight: '800', color: '#1E293B' },
  statLabel: { fontSize: 11, color: '#64748B', textAlign: 'center' },

  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  settingTitle: { fontSize: 14, fontWeight: '700', color: '#1E293B' },
  settingSub: { fontSize: 12, color: '#64748B', marginTop: 2 },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    padding: 14,
    borderRadius: 12,
    marginTop: 8,
  },
  logoutText: { fontSize: 14, fontWeight: '700', color: '#EF4444' },
});
