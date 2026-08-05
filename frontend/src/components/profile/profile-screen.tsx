import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Palette, Fonts, Spacing } from '@/constants/theme';
import { UserProgress } from '@/types';
import { api, LeaderboardEntry } from '@/services/api';
import { getOrCreateDeviceUuid } from '@/db/database';

interface ProfileScreenProps {
  progress: UserProgress;
  onLogout: () => void;
  onOpenSettings?: () => void;
}

export default function ProfileScreen({ progress, onLogout, onOpenSettings }: ProfileScreenProps) {
  const [dailyGoal, setDailyGoal] = useState<string>('10 mins daily');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [currentUuid, setCurrentUuid] = useState<string>('');

  useEffect(() => {
    try {
      const uuid = getOrCreateDeviceUuid();
      setCurrentUuid(uuid);

      api.getLeaderboard().then((entries) => {
        if (entries.length > 0) {
          setLeaderboard(entries);
        }
      });
    } catch (err) {
      console.warn('Leaderboard fetch warning:', err);
    }
  }, []);

  const stats = [
    { icon: 'fire', color: Palette.error.text, label: 'Streak hiện tại', value: `${progress.streak} ngày` },
    { icon: 'lightning-bolt', color: Palette.warning.text, label: 'Tổng số XP', value: `${progress.xp} XP` },
    { icon: 'target', color: Palette.info.text, label: 'Cấp độ học tập', value: `Lv.${progress.level}` },
    { icon: 'cards-outline', color: Palette.primary[500], label: 'Huy hiệu mở khóa', value: `${progress.badges.filter(b => b.unlocked).length}/${progress.badges.length}` },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* AVATAR & USER INFO */}
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256' }}
            style={styles.avatar}
          />
          <Text style={styles.userName}>Thành Trần</Text>
          <Text style={styles.userEmail}>thanhtran.dev@example.com</Text>

          <View style={styles.proBadge}>
            <MaterialCommunityIcons name="crown" size={14} color={Palette.warning.text} />
            <Text style={styles.proBadgeText}>THÀNH VIÊN PRO</Text>
          </View>
        </View>

        {onOpenSettings && (
          <TouchableOpacity style={styles.settingsBtn} onPress={onOpenSettings}>
            <Feather name="settings" size={18} color={Palette.text.muted} />
            <Text style={styles.settingsBtnText}>Cài đặt</Text>
          </TouchableOpacity>
        )}

        {/* OVERVIEW STATS GRID */}
        <View style={styles.statsGrid}>
          {stats.map((stat, idx) => (
            <View key={idx} style={styles.statCard}>
              <MaterialCommunityIcons name={stat.icon as any} size={22} color={stat.color} />
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
            <MaterialCommunityIcons name="trophy" size={20} color={Palette.warning.text} />
            <Text style={styles.sectionTitle}>Bảng xếp hạng toàn cầu 🏆</Text>
          </View>

          {leaderboard.length === 0 ? (
            <View style={styles.emptyLeaderboard}>
              <Text style={styles.emptyLeaderboardText}>Chưa có kết nối server hoặc chưa có xếp hạng</Text>
            </View>
          ) : (
            <View style={styles.leaderboardList}>
              {leaderboard.slice(0, 10).map((item) => {
                const isMe = item.deviceUuid === currentUuid;
                const medalColor = item.rank === 1 ? '#FFD700' : item.rank === 2 ? '#C0C0C0' : item.rank === 3 ? '#CD7F32' : Palette.text.muted;
                return (
                  <View key={item.rank + item.deviceUuid} style={[styles.leaderboardRow, isMe && styles.leaderboardRowMe]}>
                    <View style={styles.rankBadge}>
                      {item.rank <= 3 ? (
                        <MaterialCommunityIcons name="crown" size={16} color={medalColor} />
                      ) : (
                        <Text style={styles.rankNumber}>#{item.rank}</Text>
                      )}
                    </View>
                    <Text style={[styles.leaderboardName, isMe && styles.leaderboardNameMe]} numberOfLines={1}>
                      {item.displayName} {isMe ? '(Tôi)' : ''}
                    </Text>
                    <Text style={styles.leaderboardXp}>{item.totalXp} XP</Text>
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
    paddingTop: Spacing.two,
    paddingBottom: 110,
  },

  profileHeader: {
    alignItems: 'center',
    marginBottom: Spacing.four,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: Spacing.two,
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
  proBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Palette.warning.bg,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: Spacing.two,
  },
  proBadgeText: {
    fontFamily: Fonts.sans,
    fontSize: 10,
    fontWeight: '900',
    color: Palette.warning.text,
    letterSpacing: 0.5,
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
  },
  statValue: {
    fontFamily: Fonts.sans,
    fontSize: 16,
    fontWeight: '800',
    color: Palette.text.primary,
    marginTop: 4,
  },
  statLabel: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    color: Palette.text.muted,
    marginTop: 2,
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
  },

  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
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
  },
  badgeDesc: {
    fontFamily: Fonts.sans,
    fontSize: 10,
    color: Palette.text.muted,
    textAlign: 'center',
    marginTop: 2,
  },

  // Goals
  goalRow: {
    gap: 8,
    marginTop: Spacing.two,
  },
  goalBtn: {
    backgroundColor: Palette.canvas,
    padding: Spacing.two,
    borderRadius: 12,
    alignItems: 'center',
  },
  goalBtnActive: {
    backgroundColor: Palette.primary[500],
  },
  goalBtnText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
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
  },
  logoutBtnText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '700',
    color: Palette.error.text,
  },
  settingsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Palette.canvas,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Palette.border,
    marginBottom: Spacing.two,
  },
  settingsBtnText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '600',
    color: Palette.text.muted,
  },
  // Leaderboard styles
  leaderboardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.two,
  },
  emptyLeaderboard: {
    paddingVertical: Spacing.two,
    alignItems: 'center',
  },
  emptyLeaderboardText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Palette.text.muted,
  },
  leaderboardList: {
    gap: Spacing.one,
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
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankNumber: {
    fontFamily: Fonts.sans,
    fontSize: 13,
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
  leaderboardXp: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '800',
    color: Palette.warning.text,
  },
});
