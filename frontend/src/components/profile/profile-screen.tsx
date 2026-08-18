import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Palette, Fonts, Spacing } from '@/constants/theme';
import { UserProgress } from '@/types';
import { api, LeaderboardEntry } from '@/services/api';
import { getOrCreateDeviceUuid } from '@/db/database';

interface ProfileScreenProps {
  progress: UserProgress;
  userName: string;
  userEmail: string;
  onLogout: () => void;
  onOpenSettings?: () => void;
}

export default function ProfileScreen({ progress, userName, userEmail, onLogout, onOpenSettings }: ProfileScreenProps) {
  const [dailyGoal, setDailyGoal] = useState<string>('10 mins daily');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [currentUuid, setCurrentUuid] = useState<string>('');
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState<boolean>(true);

  useEffect(() => {
    const load = async () => {
      try {
        const uuid = getOrCreateDeviceUuid();
        setCurrentUuid(uuid);
        const entries = await api.getLeaderboard();
        if (entries.length > 0) {
          setLeaderboard(entries);
        }
      } catch (err) {
        console.warn('Leaderboard fetch warning:', err);
      } finally {
        setIsLoadingLeaderboard(false);
      }
    };
    load();
  }, []);

  // Derive initials from userName
  const initials = userName
    ? userName.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
    : 'V';

  const stats = [
    { icon: 'zap' as const, color: Palette.warning.text, label: 'Tổng số XP', value: `${progress.xp} XP` },
    { icon: 'trending-up' as const, color: Palette.info.text, label: 'Cấp độ học tập', value: `Lv.${progress.level}` },
    { icon: 'bookmark' as const, color: Palette.primary[500], label: 'Từ đã học', value: `${progress.wordsLearned} từ` },
    { icon: 'award' as const, color: Palette.secondary[500], label: 'Huy hiệu mở khóa', value: `${progress.badges.filter(b => b.unlocked).length}/${progress.badges.length}` },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* AVATAR & USER INFO */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitials}>{initials}</Text>
          </View>
          <Text style={styles.userName}>{userName || 'Học Viên Vocam'}</Text>
          {userEmail ? (
            <Text style={styles.userEmail}>{userEmail}</Text>
          ) : null}

          <View style={styles.streakBadge}>
            <Text style={styles.streakFire}>🔥</Text>
            <Text style={styles.streakText}>{progress.streak} ngày streak</Text>
          </View>
        </View>

        {/* SETTINGS BUTTON */}
        {onOpenSettings && (
          <TouchableOpacity style={styles.settingsBtn} onPress={onOpenSettings}>
            <Feather name="settings" size={16} color={Palette.text.muted} />
            <Text style={styles.settingsBtnText}>Cài đặt</Text>
            <Feather name="chevron-right" size={14} color={Palette.text.muted} style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>
        )}

        {/* OVERVIEW STATS GRID */}
        <View style={styles.statsGrid}>
          {stats.map((stat, idx) => (
            <View key={idx} style={styles.statCard}>
              <Feather name={stat.icon} size={20} color={stat.color} />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* ACHIEVEMENTS & BADGES */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Huy hiệu & Thành tích 🎉</Text>
          <Text style={styles.sectionSub}>Mở khóa huy hiệu khi đạt mốc học tập</Text>

          <View style={styles.badgesGrid}>
            {progress.badges.map(badge => (
              <View key={badge.id} style={[styles.badgeCard, !badge.unlocked && styles.badgeLocked]}>
                <Text style={styles.badgeIcon}>{badge.icon}</Text>
                <Text style={styles.badgeName}>{badge.name}</Text>
                <Text style={styles.badgeDesc}>{badge.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* GLOBAL LEADERBOARD */}
        <View style={styles.sectionCard}>
          <View style={styles.leaderboardTitleRow}>
            <Feather name="award" size={18} color={Palette.warning.text} />
            <Text style={styles.sectionTitle}>Bảng xếp hạng toàn cầu 🏆</Text>
          </View>

          {isLoadingLeaderboard ? (
            <View style={styles.leaderboardLoading}>
              <ActivityIndicator size="small" color={Palette.primary[500]} />
              <Text style={styles.leaderboardLoadingText}>Đang tải bảng xếp hạng...</Text>
            </View>
          ) : leaderboard.length === 0 ? (
            <View style={styles.emptyLeaderboard}>
              <Feather name="wifi-off" size={24} color={Palette.text.muted} />
              <Text style={styles.emptyLeaderboardText}>Chưa có kết nối server</Text>
            </View>
          ) : (
            <View style={styles.leaderboardList}>
              {leaderboard.slice(0, 10).map((item) => {
                const isMe = item.deviceUuid === currentUuid;
                const medalEmoji = item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : item.rank === 3 ? '🥉' : null;
                return (
                  <View key={item.rank + item.deviceUuid} style={[styles.leaderboardRow, isMe && styles.leaderboardRowMe]}>
                    <View style={styles.rankBadge}>
                      {medalEmoji ? (
                        <Text style={styles.rankMedal}>{medalEmoji}</Text>
                      ) : (
                        <Text style={styles.rankNumber}>#{item.rank}</Text>
                      )}
                    </View>
                    <Text style={[styles.leaderboardName, isMe && styles.leaderboardNameMe]} numberOfLines={1}>
                      {item.displayName} {isMe ? '(Tôi)' : ''}
                    </Text>
                    <View style={styles.leaderboardXpBadge}>
                      <Feather name="zap" size={10} color={Palette.warning.text} />
                      <Text style={styles.leaderboardXp}>{item.totalXp}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* DAILY GOAL SETTINGS */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Mục tiêu học mỗi ngày</Text>
          <View style={styles.goalRow}>
            {['5 mins daily', '10 mins daily', '15 mins or more'].map(goal => (
              <TouchableOpacity
                key={goal}
                style={[styles.goalBtn, dailyGoal === goal && styles.goalBtnActive]}
                onPress={() => setDailyGoal(goal)}
              >
                <Text style={[styles.goalBtnText, dailyGoal === goal && styles.goalBtnTextActive]}>{goal}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* LOGOUT */}
        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <Feather name="log-out" size={16} color={Palette.error.text} />
          <Text style={styles.logoutBtnText}>Đăng xuất tài khoản</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Palette.canvas,
  },
  content: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: 110,
  },

  // Profile Header
  profileHeader: {
    alignItems: 'center',
    marginBottom: Spacing.three,
    paddingVertical: Spacing.four,
    backgroundColor: Palette.surfaceWhite,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Palette.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.two,
    shadowColor: Palette.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarInitials: {
    fontFamily: Fonts.sans,
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  userName: {
    fontFamily: Fonts.sans,
    fontSize: 20,
    fontWeight: '800',
    color: Palette.text.primary,
  },
  userEmail: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Palette.text.secondary,
    marginTop: 2,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Palette.warning.bg,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    marginTop: Spacing.two,
  },
  streakFire: {
    fontSize: 16,
  },
  streakText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '800',
    color: Palette.warning.text,
  },

  // Settings Button
  settingsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: Spacing.three,
    paddingVertical: 12,
    backgroundColor: Palette.surfaceWhite,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Palette.border,
    marginBottom: Spacing.three,
  },
  settingsBtnText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '600',
    color: Palette.text.secondary,
    flex: 1,
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  statCard: {
    width: '48%',
    backgroundColor: Palette.surfaceWhite,
    padding: Spacing.three,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Palette.border,
    gap: 4,
  },
  statValue: {
    fontFamily: Fonts.sans,
    fontSize: 18,
    fontWeight: '800',
    color: Palette.text.primary,
    marginTop: 4,
  },
  statLabel: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    color: Palette.text.muted,
  },

  // Section Card
  sectionCard: {
    backgroundColor: Palette.surfaceWhite,
    borderRadius: 20,
    padding: Spacing.three,
    marginBottom: Spacing.three,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  sectionTitle: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '800',
    color: Palette.text.primary,
  },
  sectionSub: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    color: Palette.text.secondary,
    marginBottom: Spacing.two,
    marginTop: 2,
  },

  // Badges
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  badgeCard: {
    width: '48%',
    backgroundColor: Palette.canvas,
    padding: Spacing.two,
    borderRadius: 14,
    alignItems: 'center',
  },
  badgeLocked: {
    opacity: 0.4,
  },
  badgeIcon: {
    fontSize: 24,
    marginBottom: 2,
  },
  badgeName: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '700',
    color: Palette.text.primary,
    textAlign: 'center',
  },
  badgeDesc: {
    fontFamily: Fonts.sans,
    fontSize: 10,
    color: Palette.text.muted,
    textAlign: 'center',
    marginTop: 2,
  },

  // Leaderboard
  leaderboardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.two,
  },
  leaderboardLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: Spacing.three,
  },
  leaderboardLoadingText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Palette.text.muted,
  },
  emptyLeaderboard: {
    alignItems: 'center',
    paddingVertical: Spacing.three,
    gap: Spacing.two,
  },
  emptyLeaderboardText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Palette.text.muted,
  },
  leaderboardList: {
    gap: 4,
  },
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.two,
    paddingVertical: 10,
    backgroundColor: Palette.canvas,
    borderRadius: 12,
    gap: Spacing.two,
  },
  leaderboardRowMe: {
    backgroundColor: Palette.primary[100],
    borderWidth: 1,
    borderColor: Palette.primary[300],
  },
  rankBadge: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankMedal: {
    fontSize: 18,
  },
  rankNumber: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '800',
    color: Palette.text.muted,
  },
  leaderboardName: {
    flex: 1,
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '600',
    color: Palette.text.primary,
  },
  leaderboardNameMe: {
    fontWeight: '800',
    color: Palette.primary[500],
  },
  leaderboardXpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Palette.warning.bg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  leaderboardXp: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '800',
    color: Palette.warning.text,
  },

  // Daily Goal
  goalRow: {
    gap: 8,
    marginTop: Spacing.two,
  },
  goalBtn: {
    backgroundColor: Palette.canvas,
    padding: Spacing.two,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Palette.border,
  },
  goalBtnActive: {
    backgroundColor: Palette.primary[500],
    borderColor: Palette.primary[500],
  },
  goalBtnText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '600',
    color: Palette.text.primary,
  },
  goalBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  // Logout
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.three,
    backgroundColor: Palette.error.bg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  logoutBtnText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '700',
    color: Palette.error.text,
  },
});
