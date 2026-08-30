import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Palette, Fonts, Spacing } from '@/constants/theme';
import { VocabularyWord, Lesson } from '@/types';
import { playAudio } from '@/utils/audio';
import WordDetailScreen from '@/components/flashcards/word-detail-screen';
import LessonDetailScreen from '@/components/lessons/lesson-detail-screen';

interface SearchScreenProps {
  words: VocabularyWord[];
  lessons: Lesson[];
  onClose: () => void;
  onStartLesson: (lessonId: string) => void;
  onSaveWord?: (word: VocabularyWord) => void | Promise<void>;
}

type FilterTab = 'all' | 'words' | 'lessons';

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'words', label: 'Từ vựng' },
  { key: 'lessons', label: 'Bài học' },
];

export default function SearchScreen({
  words,
  lessons,
  onClose,
  onStartLesson,
  onSaveWord,
}: SearchScreenProps) {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [selectedWord, setSelectedWord] = useState<VocabularyWord | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const q = query.toLowerCase().trim();

  const matchedWords = useMemo(() => {
    if (!q) return [];
    return words.filter(
      (w) =>
        w.word.toLowerCase().includes(q) ||
        w.vn.toLowerCase().includes(q) ||
        w.phonetic.toLowerCase().includes(q)
    );
  }, [q, words]);

  const matchedLessons = useMemo(() => {
    if (!q) return [];
    return lessons.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q)
    );
  }, [q, lessons]);

  const showWords = activeFilter === 'all' || activeFilter === 'words';
  const showLessons = activeFilter === 'all' || activeFilter === 'lessons';
  const hasResults = (showWords && matchedWords.length > 0) || (showLessons && matchedLessons.length > 0);

  // Highlight matched substring in a string
  const highlight = (text: string): React.ReactNode => {
    if (!q) return <Text style={styles.resultText}>{text}</Text>;
    const idx = text.toLowerCase().indexOf(q);
    if (idx === -1) return <Text style={styles.resultText}>{text}</Text>;

    const before = text.slice(0, idx);
    const match = text.slice(idx, idx + q.length);
    const after = text.slice(idx + q.length);

    return (
      <Text style={styles.resultText}>
        {before ? <Text>{before}</Text> : null}
        <Text style={styles.resultHighlight}>{match}</Text>
        {after ? <Text>{after}</Text> : null}
      </Text>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* SEARCH BAR */}
      <View style={styles.searchBar}>
        <View style={styles.inputWrapper}>
          <Feather name="search" size={18} color={Palette.text.muted} style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="Tìm từ vựng, bài học..."
            placeholderTextColor={Palette.text.muted}
            value={query}
            onChangeText={setQuery}
            autoFocus
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} style={styles.clearBtn}>
              <Feather name="x-circle" size={16} color={Palette.text.muted} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
          <Text style={styles.cancelText}>Huỷ</Text>
        </TouchableOpacity>
      </View>

      {/* FILTER TABS */}
      <View style={styles.filterRow}>
        {FILTER_TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.filterTab, activeFilter === tab.key && styles.filterTabActive]}
            onPress={() => setActiveFilter(tab.key)}
          >
            <Text style={[styles.filterTabText, activeFilter === tab.key && styles.filterTabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* EMPTY / PLACEHOLDER STATE */}
        {!q && (
          <View style={styles.emptyState}>
            <Feather name="search" size={48} color={Palette.primary[200]} />
            <Text style={styles.emptyTitle}>Tìm kiếm Vocam</Text>
            <Text style={styles.emptySubtitle}>
              Nhập từ tiếng Anh, nghĩa tiếng Việt hoặc tên bài học
            </Text>
          </View>
        )}

        {/* NO RESULTS */}
        {Boolean(q && !hasResults) && (
          <View style={styles.emptyState}>
            <Feather name="frown" size={48} color={Palette.text.muted} />
            <Text style={styles.emptyTitle}>Không tìm thấy</Text>
            <Text style={styles.emptySubtitle}>{`Không có kết quả nào khớp với "${query}"`}</Text>
          </View>
        )}

        {/* WORD RESULTS */}
        {Boolean(showWords && matchedWords.length > 0) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{`TỪ VỰNG (${matchedWords.length})`}</Text>
            {matchedWords.map((word) => (
              <TouchableOpacity
                key={word.id}
                style={styles.wordCard}
                onPress={() => setSelectedWord(word)}
              >
                <View style={styles.wordInfo}>
                  <View style={styles.wordTitleRow}>
                    {highlight(word.word)}
                    <View style={styles.posBadge}>
                      <Text style={styles.posText}>{word.pos}</Text>
                    </View>
                  </View>
                  <Text style={styles.wordIpa}>{word.phonetic}</Text>
                  <Text style={styles.wordVn} numberOfLines={1}>{word.vn}</Text>
                </View>
                <View style={styles.wordActions}>
                  <TouchableOpacity onPress={() => playAudio(word.word)} style={styles.speakBtn}>
                    <Feather name="volume-2" size={15} color={Palette.primary[500]} />
                  </TouchableOpacity>
                  <Feather name="chevron-right" size={16} color={Palette.text.muted} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* LESSON RESULTS */}
        {Boolean(showLessons && matchedLessons.length > 0) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{`BÀI HỌC (${matchedLessons.length})`}</Text>
            {matchedLessons.map((lesson) => (
              <TouchableOpacity
                key={lesson.id}
                style={styles.lessonCard}
                onPress={() => setSelectedLesson(lesson)}
              >
                <Text style={styles.lessonIcon}>{lesson.icon}</Text>
                <View style={styles.lessonInfo}>
                  {highlight(lesson.name)}
                  <Text style={styles.lessonMeta} numberOfLines={1}>{`${lesson.category} · ${lesson.wordCount} từ`}</Text>
                </View>
                <Feather name="chevron-right" size={16} color={Palette.text.muted} />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* WORD DETAIL MODAL */}
      <Modal visible={!!selectedWord} animationType="slide">
        {selectedWord && (
          <WordDetailScreen
            word={selectedWord}
            onClose={() => setSelectedWord(null)}
            onSaveToFlashcards={onSaveWord}
          />
        )}
      </Modal>

      {/* LESSON DETAIL MODAL */}
      <Modal visible={!!selectedLesson} animationType="slide">
        {selectedLesson && (
          <LessonDetailScreen
            lesson={selectedLesson}
            onClose={() => setSelectedLesson(null)}
            onStartLesson={(lessonId) => {
              setSelectedLesson(null);
              onClose();
              onStartLesson(lessonId);
            }}
            onSaveWord={onSaveWord}
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

  // Search bar
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    backgroundColor: Palette.surfaceWhite,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.canvas,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Palette.border,
    paddingHorizontal: Spacing.two,
    height: 44,
    gap: 6,
  },
  searchIcon: {
    flexShrink: 0,
  },
  input: {
    flex: 1,
    fontFamily: Fonts.sans,
    fontSize: 15,
    color: Palette.text.primary,
  },
  clearBtn: {
    padding: 2,
  },
  cancelBtn: {
    paddingHorizontal: 4,
  },
  cancelText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '600',
    color: Palette.primary[500],
  },

  // Filter tabs
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    gap: Spacing.two,
    backgroundColor: Palette.surfaceWhite,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
  },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: Palette.canvas,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  filterTabActive: {
    backgroundColor: Palette.primary[100],
    borderColor: Palette.primary[300],
  },
  filterTabText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '600',
    color: Palette.text.muted,
  },
  filterTabTextActive: {
    color: Palette.primary[500],
    fontWeight: '800',
  },

  scroll: { flex: 1 },
  scrollContent: {
    padding: Spacing.three,
    paddingBottom: 40,
    gap: Spacing.three,
  },

  // Empty states
  emptyState: {
    alignItems: 'center',
    paddingTop: 80,
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
  },
  emptyTitle: {
    fontFamily: Fonts.sans,
    fontSize: 18,
    fontWeight: '800',
    color: Palette.text.primary,
  },
  emptySubtitle: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    color: Palette.text.muted,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Section
  section: {
    gap: Spacing.two,
  },
  sectionTitle: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '800',
    color: Palette.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.one,
  },

  // Word card
  wordCard: {
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
  wordTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  resultText: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '700',
    color: Palette.text.primary,
  },
  resultHighlight: {
    color: Palette.primary[500],
    backgroundColor: Palette.primary[100],
    borderRadius: 4,
  },
  posBadge: {
    backgroundColor: Palette.secondary[100],
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  posText: {
    fontFamily: Fonts.sans,
    fontSize: 9,
    fontWeight: '700',
    color: Palette.secondary[600],
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
  wordActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  speakBtn: {
    padding: 4,
    backgroundColor: Palette.primary[100],
    borderRadius: 8,
  },

  // Lesson card
  lessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.surfaceWhite,
    borderRadius: 16,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: Palette.border,
    gap: Spacing.two,
  },
  lessonIcon: {
    fontSize: 28,
  },
  lessonInfo: {
    flex: 1,
    gap: 3,
  },
  lessonMeta: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Palette.text.muted,
  },
});
