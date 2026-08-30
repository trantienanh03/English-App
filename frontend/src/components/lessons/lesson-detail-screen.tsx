import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Palette, Fonts, Spacing } from '@/constants/theme';
import { Lesson, VocabularyWord } from '@/types';
import { playAudio } from '@/utils/audio';
import WordDetailScreen from '@/components/flashcards/word-detail-screen';

interface LessonDetailScreenProps {
  lesson: Lesson;
  onClose: () => void;
  onStartLesson: (lessonId: string) => void;
  onSaveWord?: (word: VocabularyWord) => void | Promise<void>;
}

const DIFFICULTY_COLOR: Record<string, string> = {
  'Sơ cấp': Palette.success.text,
  'Trung cấp': Palette.warning.text,
  'Cao cấp': Palette.error.text,
};

const DIFFICULTY_BG: Record<string, string> = {
  'Sơ cấp': Palette.success.bg,
  'Trung cấp': Palette.warning.bg,
  'Cao cấp': Palette.error.bg,
};

export default function LessonDetailScreen({
  lesson,
  onClose,
  onStartLesson,
  onSaveWord,
}: LessonDetailScreenProps) {
  const [selectedWord, setSelectedWord] = useState<VocabularyWord | null>(null);

  const handleSaveWord = async (word: VocabularyWord) => {
    await onSaveWord?.(word);
  };

  const progressColor = lesson.progress >= 80
    ? Palette.success.text
    : lesson.progress >= 40
    ? Palette.warning.text
    : Palette.primary[500];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onClose}>
          <Feather name="arrow-left" size={22} color={Palette.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{lesson.name}</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* LESSON META CARD */}
        <View style={styles.metaCard}>
          <Text style={styles.lessonIcon}>{lesson.icon}</Text>
          <Text style={styles.lessonName}>{lesson.name}</Text>
          <Text style={styles.lessonDesc}>{lesson.description}</Text>

          <View style={styles.badgeRow}>
            <View style={[styles.badge, { backgroundColor: DIFFICULTY_BG[lesson.difficulty] ?? Palette.canvas }]}>
              <Text style={[styles.badgeText, { color: DIFFICULTY_COLOR[lesson.difficulty] ?? Palette.text.muted }]}>
                {lesson.difficulty}
              </Text>
            </View>
            <View style={styles.badge}>
              <Feather name="file-text" size={12} color={Palette.text.muted} />
              <Text style={styles.badgeText}>{lesson.wordCount} từ</Text>
            </View>
          </View>

          {/* Progress bar */}
          <View style={styles.progressSection}>
            <View style={styles.progressLabelRow}>
              <Text style={styles.progressLabel}>Tiến độ</Text>
              <Text style={[styles.progressPct, { color: progressColor }]}>{lesson.progress}%</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${lesson.progress}%` as any, backgroundColor: progressColor }]} />
            </View>
          </View>
        </View>

        {/* START BUTTON */}
        <TouchableOpacity style={styles.startBtn} onPress={() => onStartLesson(lesson.id)}>
          <Feather name="play" size={18} color="#FFFFFF" />
          <Text style={styles.startBtnText}>
            {lesson.progress > 0 ? 'TIẾP TỤC HỌC' : 'BẮT ĐẦU HỌC'}
          </Text>
        </TouchableOpacity>

        {/* WORD LIST */}
        <View style={styles.wordListSection}>
          <Text style={styles.sectionTitle}>Từ vựng trong bài ({lesson.words.length})</Text>

          {lesson.words.length === 0 ? (
            <View style={styles.emptyState}>
              <Feather name="layers" size={36} color={Palette.text.muted} />
              <Text style={styles.emptyText}>Bài học này chưa có từ vựng</Text>
            </View>
          ) : (
            lesson.words.map((word) => (
              <TouchableOpacity
                key={word.id}
                style={styles.wordRow}
                onPress={() => setSelectedWord(word)}
              >
                <View style={styles.wordInfo}>
                  <Text style={styles.wordText}>{word.word}</Text>
                  <Text style={styles.wordIpa}>{word.phonetic}</Text>
                  <Text style={styles.wordVn} numberOfLines={1}>{word.vn}</Text>
                </View>

                <View style={styles.wordMeta}>
                  <TouchableOpacity onPress={() => playAudio(word.word)} style={styles.speakBtn}>
                    <Feather name="volume-2" size={16} color={Palette.primary[500]} />
                  </TouchableOpacity>
                  <Feather name="chevron-right" size={16} color={Palette.text.muted} />
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* WORD DETAIL MODAL */}
      <Modal visible={!!selectedWord} animationType="slide">
        {selectedWord && (
          <WordDetailScreen
            word={selectedWord}
            onClose={() => setSelectedWord(null)}
            onSaveToFlashcards={handleSaveWord}
          />
        )}
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Palette.canvas,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
    backgroundColor: Palette.surfaceWhite,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontFamily: Fonts.sans,
    fontSize: 16,
    fontWeight: '700',
    color: Palette.text.primary,
    textAlign: 'center',
    marginHorizontal: Spacing.two,
  },

  scroll: { flex: 1 },
  scrollContent: {
    padding: Spacing.four,
    paddingBottom: 40,
    gap: Spacing.three,
  },

  // Meta card
  metaCard: {
    backgroundColor: Palette.surfaceWhite,
    borderRadius: 24,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: Palette.border,
    alignItems: 'center',
    gap: Spacing.two,
  },
  lessonIcon: {
    fontSize: 48,
  },
  lessonName: {
    fontFamily: Fonts.sans,
    fontSize: 20,
    fontWeight: '900',
    color: Palette.text.primary,
    textAlign: 'center',
  },
  lessonDesc: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    color: Palette.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Palette.canvas,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  badgeText: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    fontWeight: '700',
    color: Palette.text.muted,
  },
  progressSection: {
    width: '100%',
    gap: 6,
    marginTop: Spacing.one,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Palette.text.muted,
  },
  progressPct: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '800',
  },
  progressTrack: {
    height: 8,
    backgroundColor: Palette.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },

  // Start button
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    backgroundColor: Palette.primary[500],
    borderRadius: 20,
    paddingVertical: 16,
    shadowColor: Palette.primary[500],
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  startBtnText: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },

  // Word list
  wordListSection: {
    gap: Spacing.two,
  },
  sectionTitle: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '800',
    color: Palette.text.primary,
    marginBottom: Spacing.one,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.five,
    gap: Spacing.two,
  },
  emptyText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    color: Palette.text.muted,
  },
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.surfaceWhite,
    borderRadius: 16,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: Palette.border,
    gap: Spacing.two,
  },
  wordInfo: {
    flex: 1,
    gap: 2,
  },
  wordText: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '800',
    color: Palette.text.primary,
  },
  wordIpa: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Palette.text.ipa,
  },
  wordVn: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Palette.text.secondary,
  },
  wordMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  speakBtn: {
    padding: 4,
    backgroundColor: Palette.primary[100],
    borderRadius: 8,
  },
});
