import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Lesson, VocabularyWord } from '@/types';
import { Palette } from '@/constants/theme';

interface DashboardScreenProps {
  userName: string;
  userEmail?: string;
  wordsSavedCount: number;
  wordsLearnedCount: number;
  dueCardsCount: number;
  lessons: Lesson[];
  wordOfTheDay: VocabularyWord | null;
  onNavigate: (tab: string) => void;
  onSelectLesson: (lessonId: string) => void;
  onOpenWordDetail: (word: VocabularyWord) => void;
  onOpenSearch: () => void;
}

export default function DashboardScreen({
  userName,
  wordsSavedCount,
  wordsLearnedCount,
  dueCardsCount,
  lessons,
  wordOfTheDay,
  onNavigate,
  onSelectLesson,
  onOpenWordDetail,
  onOpenSearch,
}: DashboardScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greetingTitle}>
              Xin chào, {userName || 'Học viên'}!
            </Text>
            <Text style={styles.greetingSub}>Hôm nay bạn muốn khám phá từ vựng gì?</Text>
          </View>
        </View>

        {/* SEARCH BAR CTA */}
        <TouchableOpacity style={styles.searchBarCta} onPress={onOpenSearch} activeOpacity={0.8}>
          <Feather name="search" size={16} color="#94A3B8" />
          <Text style={styles.searchPlaceholder}>Tìm kiếm từ vựng, chủ đề học...</Text>
        </TouchableOpacity>

        {/* PROMINENT SCANNER AI CTA BANNER */}
        <TouchableOpacity style={styles.scannerBanner} onPress={() => onNavigate('scan')} activeOpacity={0.88}>
          <View style={styles.scannerBannerLeft}>
            <View style={styles.scannerIconBadge}>
              <Feather name="camera" size={28} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.scannerBannerTitle}>AI Object Scanner</Text>
              <Text style={styles.scannerBannerSub}>
                Hướng camera vào thế giới xung quanh để học từ vựng trực quan
              </Text>
            </View>
          </View>
          <View style={styles.scanNowBtn}>
            <Text style={styles.scanNowText}>Quét ngay</Text>
            <Feather name="arrow-right" size={16} color="#FFFFFF" />
          </View>
        </TouchableOpacity>

        {/* LEARNING STATS OVERVIEW CARDS */}
        <View style={styles.statsRow}>
          <TouchableOpacity style={[styles.statCard, styles.dueCard]} onPress={() => onNavigate('cards')}>
            <Text style={styles.statVal}>{dueCardsCount}</Text>
            <Text style={styles.statLbl}>Thẻ cần ôn hôm nay</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.statCard} onPress={() => onNavigate('cards')}>
            <Text style={styles.statVal}>{wordsSavedCount}</Text>
            <Text style={styles.statLbl}>Từ đã lưu vào Sổ từ</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.statCard} onPress={() => onNavigate('cards')}>
            <Text style={styles.statVal}>{wordsLearnedCount}</Text>
            <Text style={styles.statLbl}>Từ đã ghi nhớ</Text>
          </TouchableOpacity>
        </View>

        {/* WORD OF THE DAY */}
        {wordOfTheDay && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Từ vựng của ngày</Text>
            <TouchableOpacity
              style={styles.wordOfTheDayCard}
              onPress={() => onOpenWordDetail(wordOfTheDay)}
              activeOpacity={0.85}
            >
              <View style={styles.wordHeader}>
                <View>
                  <Text style={styles.wordTitle}>{wordOfTheDay.word}</Text>
                  <Text style={styles.wordPhonetic}>{wordOfTheDay.phonetic}</Text>
                </View>
                <View style={styles.posBadge}>
                  <Text style={styles.posBadgeText}>{wordOfTheDay.pos}</Text>
                </View>
              </View>
              <Text style={styles.wordTranslation}>
                {wordOfTheDay.vn}
              </Text>
              <Text style={styles.wordExample}>“{wordOfTheDay.sentence}”</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* TOPIC LESSONS */}
        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Bài học theo Chủ đề</Text>
            <TouchableOpacity onPress={() => onNavigate('learn')}>
              <Text style={styles.seeAllText}>Xem tất cả ({lessons.length})</Text>
            </TouchableOpacity>
          </View>

          {lessons.slice(0, 4).map((lesson) => (
            <TouchableOpacity
              key={lesson.id}
              style={styles.lessonCard}
              onPress={() => onSelectLesson(lesson.id)}
              activeOpacity={0.8}
            >
              <View style={[styles.lessonIconBadge, { backgroundColor: Palette.primary[100] }]}>
                <Feather name={(lesson.icon as any) || 'book-open'} size={24} color={Palette.primary[500]} />
              </View>
              <View style={styles.lessonInfo}>
                <Text style={styles.lessonTitle}>{lesson.name}</Text>
                <Text style={styles.lessonDesc}>{lesson.description}</Text>
                <View style={styles.lessonFooter}>
                  <Text style={styles.wordCountText}>{lesson.words.length} từ vựng</Text>
                  <Text style={styles.progressText}>{Math.round(lesson.progress)}% hoàn thành</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
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

  searchBarCta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    height: 48,
    gap: 8,
    marginBottom: 4,
  },
  searchPlaceholder: {
    fontSize: 14,
    color: '#94A3B8',
  },

  header: { marginBottom: 4 },
  greetingTitle: { fontSize: 22, fontWeight: '800', color: '#1E293B' },
  greetingSub: { fontSize: 13, color: '#64748B', marginTop: 2 },

  scannerBanner: {
    backgroundColor: Palette.primary[500],
    borderRadius: 18,
    padding: 18,
    gap: 14,
    shadowColor: Palette.primary[500],
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  scannerBannerLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  scannerIconBadge: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannerBannerTitle: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  scannerBannerSub: { fontSize: 12, color: 'rgba(255, 255, 255, 0.85)', marginTop: 2, lineHeight: 16 },
  scanNowBtn: {
    backgroundColor: Palette.primary[400],
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  scanNowText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },

  statsRow: { flexDirection: 'row', gap: 10 },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dueCard: { borderColor: '#FDE68A', backgroundColor: '#FFFBEB' },
  statVal: { fontSize: 22, fontWeight: '800', color: '#1E293B' },
  statLbl: { fontSize: 11, color: '#64748B', textAlign: 'center', marginTop: 4 },

  section: { gap: 10 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  seeAllText: { fontSize: 12, fontWeight: '600', color: Palette.primary[500] },

  wordOfTheDayCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  wordHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  wordTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B' },
  wordPhonetic: { fontSize: 12, color: '#64748B', fontStyle: 'italic' },
  posBadge: { backgroundColor: Palette.primary[100], paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  posBadgeText: { color: Palette.primary[500], fontSize: 11, fontWeight: '700' },
  wordTranslation: { fontSize: 14, fontWeight: '700', color: '#10B981' },
  wordExample: { fontSize: 13, color: '#475569', fontStyle: 'italic', marginTop: 4 },

  lessonCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    marginBottom: 8,
  },
  lessonIconBadge: { width: 70, height: 70, borderRadius: 12, alignItems: 'center', justifyContent: 'center', margin: 10 },
  lessonInfo: { flex: 1, padding: 12, justifyContent: 'center', gap: 4 },
  lessonTitle: { fontSize: 14, fontWeight: '700', color: '#1E293B' },
  lessonDesc: { fontSize: 12, color: '#64748B' },
  lessonFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  wordCountText: { fontSize: 11, fontWeight: '600', color: Palette.primary[500] },
  progressText: { fontSize: 11, color: '#10B981', fontWeight: '600' },
});
