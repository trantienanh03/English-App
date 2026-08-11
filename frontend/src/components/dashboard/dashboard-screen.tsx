import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Palette, Fonts, Spacing } from '@/constants/theme';
import { UserProgress, VocabularyWord, Lesson } from '@/types';
import { playAudio } from '@/utils/audio';

interface DashboardScreenProps {
  progress: UserProgress;
  lessons: Lesson[];
  savedWords: VocabularyWord[];
  onNavigate: (tab: string) => void;
  onStartLesson: (lessonId: string) => void;
  onStartQuiz: () => void;
  onLogout: () => void;
}

export default function DashboardScreen({
  progress,
  lessons,
  savedWords,
  onNavigate,
  onStartLesson,
  onStartQuiz,
  onLogout,
}: DashboardScreenProps) {
  const [wordOfTheDay] = useState<VocabularyWord>({
    id: 'w8',
    word: 'Punctual',
    phonetic: '/ˈpʌŋktʃuəl/',
    vn: 'Đúng giờ, không trễ hẹn',
    pos: 'Adjective',
    sentence: 'Please be punctual for the meeting tomorrow.',
    sentenceVn: 'Xin vui lòng có mặt đúng giờ cho cuộc họp sáng mai.',
    difficulty: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?w=400&auto=format&fit=crop&q=60'
  });

  const xpPercentage = Math.min(Math.round((progress.xp / progress.nextLevelXp) * 100), 100);
  const activeLesson = lessons[0];

  const dailyQuests = [
    { id: 'q_scan', text: 'Quét 1 vật thể thực tế với Object Scanner', xp: 15, completed: savedWords.some(w => w.captured) },
    { id: 'q_flash', text: 'Ôn tập 3 thẻ Flashcards trong sổ từ', xp: 10, completed: savedWords.length >= 3 },
    { id: 'q_quiz', text: 'Làm bài Kiểm tra (Quiz) đạt điểm tối đa', xp: 25, completed: progress.xp >= 350 }
  ];

  const completedQuestsCount = dailyQuests.filter(q => q.completed).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER BAR: STREAK & LEVEL */}
        <View style={styles.topHeaderRow}>
          <View style={styles.profileBadge}>
            <View style={styles.avatarWrapper}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256' }}
                style={styles.avatar}
              />
              <View style={styles.proTag}>
                <Text style={styles.proTagText}>PRO</Text>
              </View>
            </View>
            <View>
              <Text style={styles.appName}>Vocam</Text>
              <View style={styles.xpRow}>
                <MaterialCommunityIcons name="lightning-bolt" size={14} color={Palette.warning.text} />
                <Text style={styles.xpText}>{progress.xp} XP • Lv.{progress.level}</Text>
              </View>
            </View>
          </View>

          <View style={styles.streakBadge}>
            <MaterialCommunityIcons name="fire" size={18} color={Palette.error.text} />
            <Text style={styles.streakText}>{progress.streak} ngày</Text>
          </View>
        </View>

        {/* XP LEVEL PROGRESS CARD */}
        <View style={styles.levelCard}>
          <View style={styles.levelCardHeader}>
            <View>
              <Text style={styles.levelCardCategory}>Tiến trình Cấp độ</Text>
              <Text style={styles.levelCardTitle}>Sắp thăng hạng rồi! 🚀</Text>
            </View>
            <TouchableOpacity style={styles.quizQuickBtn} onPress={onStartQuiz}>
              <MaterialCommunityIcons name="target" size={14} color="#FFFFFF" />
              <Text style={styles.quizQuickBtnText}>LÀM QUIZ</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.progressRowText}>
            <Text style={styles.progressLabel}>Cấp độ {progress.level}</Text>
            <Text style={styles.progressValue}>{progress.xp} / {progress.nextLevelXp} XP</Text>
          </View>
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: `${xpPercentage}%` }]} />
          </View>
          <Text style={styles.progressFootnote}>
            Cần thêm <Text style={styles.progressFootnoteBold}>{progress.nextLevelXp - progress.xp} XP</Text> để lên Level {progress.level + 1}!
          </Text>
        </View>

        {/* QUICK START LESSON */}
        {activeLesson && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <View style={styles.iconCircleGreen}>
                  <Feather name="book-open" size={16} color={Palette.primary[500]} />
                </View>
                <View>
                  <Text style={styles.sectionTitle}>Bài học hôm nay</Text>
                  <Text style={styles.sectionSubtitle}>Bắt đầu ngay để duy trì chuỗi học</Text>
                </View>
              </View>
              <View style={styles.difficultyChip}>
                <Text style={styles.difficultyText}>{activeLesson.difficulty}</Text>
              </View>
            </View>

            <View style={styles.lessonBox}>
              <Text style={styles.lessonIcon}>{activeLesson.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.lessonName}>{activeLesson.name}</Text>
                <Text style={styles.lessonDesc} numberOfLines={1}>{activeLesson.description}</Text>
                <View style={styles.lessonProgressRow}>
                  <View style={styles.miniProgressTrack}>
                    <View style={[styles.miniProgressFill, { width: `${activeLesson.progress}%` }]} />
                  </View>
                  <Text style={styles.miniProgressText}>{activeLesson.progress}% hoàn thành</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.continueButton}
                onPress={() => onStartLesson(activeLesson.id)}
              >
                <Text style={styles.continueButtonText}>HỌC TIẾP</Text>
                <Feather name="chevron-right" size={14} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* WORD OF THE DAY */}
        <View style={styles.sectionCard}>
          <View style={styles.wotdHeader}>
            <Ionicons name="sparkles" size={16} color={Palette.primary[500]} />
            <Text style={styles.wotdBadgeText}>TỪ VỰNG HÔM NAY</Text>
          </View>

          <View style={styles.wotdContent}>
            <Image source={{ uri: wordOfTheDay.imageUrl }} style={styles.wotdImage} />
            <View style={{ flex: 1 }}>
              <View style={styles.wordTitleRow}>
                <Text style={styles.wordTitle}>{wordOfTheDay.word}</Text>
                <View style={styles.posBadge}>
                  <Text style={styles.posText}>{wordOfTheDay.pos}</Text>
                </View>
              </View>
              <View style={styles.phoneticRow}>
                <Text style={styles.phoneticText}>{wordOfTheDay.phonetic}</Text>
                <TouchableOpacity onPress={() => playAudio(wordOfTheDay.word)} style={styles.audioBtn}>
                  <Feather name="volume-2" size={16} color={Palette.primary[500]} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.vnDefBox}>
            <Text style={styles.vnDefLabel}>Nghĩa tiếng Việt</Text>
            <Text style={styles.vnDefText}>🇻🇳 {wordOfTheDay.vn}</Text>
            <Text style={styles.sentenceText}>“{wordOfTheDay.sentence}”</Text>
          </View>
        </View>

        {/* RECENT CAPTURED WORDS SHORTCUT */}
        {savedWords.filter(w => w.captured).length > 0 && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Vật thể vừa quét ({savedWords.filter(w => w.captured).length})</Text>
              <TouchableOpacity onPress={() => onNavigate('cards')}>
                <Text style={styles.linkText}>Xem tất cả <Feather name="chevron-right" size={12} /></Text>
              </TouchableOpacity>
            </View>

            <View style={styles.capturedGrid}>
              {savedWords.filter(w => w.captured).slice(-2).map((word) => (
                <View key={word.id} style={styles.capturedItemCard}>
                  <Image source={{ uri: word.imageUrl }} style={styles.capturedThumb} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.capturedWord} numberOfLines={1}>{word.word}</Text>
                    <Text style={styles.capturedPhonetic} numberOfLines={1}>{word.phonetic}</Text>
                    <Text style={styles.capturedVn} numberOfLines={1}>🇻🇳 {word.vn}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* WEEKLY XP CHART */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Hoạt động tuần này</Text>
          <Text style={styles.sectionSubtitle}>Duy trì việc tích lũy XP hàng ngày</Text>

          <View style={styles.chartRow}>
            {progress.weeklyXp.map((day, idx) => {
              const maxVal = Math.max(...progress.weeklyXp.map(d => d.xp)) || 1;
              const barHeightPercent = Math.max(Math.round((day.xp / maxVal) * 100), 10);
              const isToday = idx === 5;

              return (
                <View key={day.day} style={styles.chartCol}>
                  <Text style={styles.chartXpVal}>{day.xp > 0 ? day.xp : ''}</Text>
                  <View style={styles.chartBarTrack}>
                    <View
                      style={[
                        styles.chartBarFill,
                        { height: `${barHeightPercent}%` },
                        day.active ? styles.barActive : styles.barInactive,
                        isToday && styles.barToday,
                      ]}
                    />
                  </View>
                  <Text style={[styles.chartDayLabel, isToday && styles.chartDayToday]}>{day.day}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* DAILY QUESTS */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Nhiệm vụ hàng ngày</Text>
              <Text style={styles.sectionSubtitle}>Hoàn thành để nhận thêm nhiều XP</Text>
            </View>
            <Text style={styles.questStatusText}>{completedQuestsCount}/{dailyQuests.length} xong</Text>
          </View>

          <View style={styles.questsList}>
            {dailyQuests.map((quest) => (
              <View
                key={quest.id}
                style={[
                  styles.questItem,
                  quest.completed ? styles.questCompleted : styles.questPending,
                ]}
              >
                <View style={styles.questLeft}>
                  <MaterialCommunityIcons
                    name={quest.completed ? "check-circle" : "checkbox-blank-circle-outline"}
                    size={20}
                    color={quest.completed ? Palette.primary[500] : Palette.text.muted}
                  />
                  <Text
                    style={[
                      styles.questText,
                      quest.completed && styles.questTextCompleted,
                    ]}
                  >
                    {quest.text}
                  </Text>
                </View>
                <View style={styles.xpRewardTag}>
                  <Text style={styles.xpRewardText}>+{quest.xp} XP</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* LOGOUT BUTTON */}
        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <Feather name="log-out" size={16} color={Palette.error.text} />
          <Text style={styles.logoutBtnText}>Đăng xuất</Text>
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
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: 110,
    paddingTop: Spacing.two,
  },

  // Header Row
  topHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Palette.surfaceWhite,
    borderRadius: 20,
    padding: Spacing.three,
    marginBottom: Spacing.three,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  profileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  proTag: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: Palette.primary[500],
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  proTagText: {
    fontFamily: Fonts.sans,
    fontSize: 8,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  appName: {
    fontFamily: Fonts.sans,
    fontSize: 16,
    fontWeight: '800',
    color: Palette.text.primary,
  },
  xpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  xpText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Palette.text.secondary,
    fontWeight: '600',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Palette.warning.bg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  streakText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '800',
    color: Palette.warning.text,
  },

  // Level Card
  levelCard: {
    backgroundColor: Palette.primary[500],
    borderRadius: 24,
    padding: Spacing.four,
    marginBottom: Spacing.three,
  },
  levelCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.three,
  },
  levelCardCategory: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    color: Palette.primary[100],
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  levelCardTitle: {
    fontFamily: Fonts.sans,
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  quizQuickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  quizQuickBtnText: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  progressRowText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Palette.primary[100],
    fontWeight: '600',
  },
  progressValue: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  progressBarTrack: {
    height: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: Spacing.two,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
  },
  progressFootnote: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    color: Palette.primary[100],
  },
  progressFootnoteBold: {
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  // Section Card Container
  sectionCard: {
    backgroundColor: Palette.surfaceWhite,
    borderRadius: 24,
    padding: Spacing.three,
    marginBottom: Spacing.three,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  iconCircleGreen: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Palette.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '800',
    color: Palette.text.primary,
  },
  sectionSubtitle: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Palette.text.muted,
  },
  difficultyChip: {
    backgroundColor: Palette.secondary[100],
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  difficultyText: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    fontWeight: '700',
    color: Palette.secondary[600],
  },
  linkText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '700',
    color: Palette.primary[500],
  },

  // Lesson Box
  lessonBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.canvas,
    borderRadius: 16,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  lessonIcon: {
    fontSize: 28,
  },
  lessonName: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '800',
    color: Palette.text.primary,
  },
  lessonDesc: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    color: Palette.text.secondary,
    marginTop: 2,
  },
  lessonProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  miniProgressTrack: {
    width: 80,
    height: 6,
    backgroundColor: Palette.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  miniProgressFill: {
    height: '100%',
    backgroundColor: Palette.primary[500],
    borderRadius: 3,
  },
  miniProgressText: {
    fontFamily: Fonts.sans,
    fontSize: 10,
    color: Palette.text.muted,
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: Palette.primary[500],
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  continueButtonText: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Word of the Day
  wotdHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: Spacing.two,
  },
  wotdBadgeText: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    fontWeight: '900',
    color: Palette.primary[500],
    letterSpacing: 0.5,
  },
  wotdContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    marginBottom: Spacing.two,
  },
  wotdImage: {
    width: 56,
    height: 56,
    borderRadius: 14,
  },
  wordTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  wordTitle: {
    fontFamily: Fonts.sans,
    fontSize: 18,
    fontWeight: '800',
    color: Palette.text.primary,
  },
  posBadge: {
    backgroundColor: Palette.warning.bg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  posText: {
    fontFamily: Fonts.sans,
    fontSize: 10,
    fontWeight: '800',
    color: Palette.warning.text,
  },
  phoneticRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  phoneticText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    color: Palette.text.ipa,
  },
  audioBtn: {
    padding: 2,
  },
  vnDefBox: {
    backgroundColor: Palette.canvas,
    borderRadius: 14,
    padding: Spacing.three,
  },
  vnDefLabel: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    color: Palette.text.muted,
  },
  vnDefText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '700',
    color: Palette.text.primary,
    marginTop: 2,
  },
  sentenceText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontStyle: 'italic',
    color: Palette.text.secondary,
    marginTop: 4,
  },

  // Captured items
  capturedGrid: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  capturedItemCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Palette.canvas,
    padding: 8,
    borderRadius: 14,
  },
  capturedThumb: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  capturedWord: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '800',
    color: Palette.text.primary,
  },
  capturedPhonetic: {
    fontFamily: Fonts.sans,
    fontSize: 10,
    color: Palette.text.muted,
  },
  capturedVn: {
    fontFamily: Fonts.sans,
    fontSize: 10,
    color: Palette.primary[500],
    fontWeight: '600',
  },

  // Chart
  chartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 100,
    marginTop: Spacing.three,
    paddingHorizontal: 4,
  },
  chartCol: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  chartXpVal: {
    fontFamily: Fonts.sans,
    fontSize: 9,
    fontWeight: 'bold',
    color: Palette.text.muted,
  },
  chartBarTrack: {
    width: 20,
    height: 60,
    backgroundColor: Palette.canvas,
    borderRadius: 10,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  chartBarFill: {
    width: '100%',
    borderRadius: 10,
  },
  barActive: {
    backgroundColor: Palette.primary[500],
  },
  barInactive: {
    backgroundColor: Palette.border,
  },
  barToday: {
    backgroundColor: Palette.secondary[500],
  },
  chartDayLabel: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    fontWeight: '600',
    color: Palette.text.muted,
  },
  chartDayToday: {
    fontWeight: '800',
    color: Palette.primary[500],
  },

  // Quests
  questsList: {
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  questStatusText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '800',
    color: Palette.primary[500],
  },
  questItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.three,
    borderRadius: 14,
    borderWidth: 1,
  },
  questPending: {
    backgroundColor: Palette.canvas,
    borderColor: Palette.border,
  },
  questCompleted: {
    backgroundColor: Palette.primary[100],
    borderColor: Palette.primary[200],
  },
  questLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    flex: 1,
    paddingRight: 8,
  },
  questText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '600',
    color: Palette.text.primary,
  },
  questTextCompleted: {
    textDecorationLine: 'line-through',
    color: Palette.text.muted,
  },
  xpRewardTag: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  xpRewardText: {
    fontFamily: Fonts.sans,
    fontSize: 10,
    fontWeight: '800',
    color: '#D97706',
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
    marginTop: Spacing.two,
  },
  logoutBtnText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '700',
    color: Palette.error.text,
  },
});
