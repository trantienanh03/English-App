import React, { useState } from 'react';
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

interface ProfileScreenProps {
  progress: UserProgress;
  onLogout: () => void;
}

export default function ProfileScreen({ progress, onLogout }: ProfileScreenProps) {
  const [dailyGoal, setDailyGoal] = useState<string>('10 mins daily');

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
            <MaterialCommunityIcons name="crown" size={14} color="#D97706" />
            <Text style={styles.proBadgeText}>THÀNH VIÊN PRO</Text>
          </View>
        </View>

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
});
