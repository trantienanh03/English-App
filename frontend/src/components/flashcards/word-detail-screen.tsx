import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Palette, Fonts, Spacing } from '@/constants/theme';
import { VocabularyWord } from '@/types';
import { playAudio } from '@/utils/audio';

interface WordDetailScreenProps {
  word: VocabularyWord;
  onClose: () => void;
  onSaveToFlashcards?: (word: VocabularyWord) => void;
  onUpdateDifficulty?: (id: string, difficulty: 'easy' | 'medium' | 'hard') => void;
}

const DIFFICULTY_CONFIG = {
  easy: { label: 'Đã thuộc', bg: Palette.success.bg, text: Palette.success.text },
  medium: { label: 'Cần ôn', bg: Palette.warning.bg, text: Palette.warning.text },
  hard: { label: 'Khó nhớ', bg: Palette.error.bg, text: Palette.error.text },
} as const;

const EXAMPLE_SENTENCES = [
  { en: 'Can you give me an example of how to use this word?', vn: 'Bạn có thể cho tôi ví dụ về cách dùng từ này không?' },
  { en: 'Learning vocabulary in context helps you remember better.', vn: 'Học từ vựng trong ngữ cảnh giúp bạn ghi nhớ tốt hơn.' },
];

export default function WordDetailScreen({
  word,
  onClose,
  onSaveToFlashcards,
  onUpdateDifficulty,
}: WordDetailScreenProps) {
  const [showDifficultyPicker, setShowDifficultyPicker] = useState(false);
  const [currentDifficulty, setCurrentDifficulty] = useState(word.difficulty);

  const diffCfg = DIFFICULTY_CONFIG[currentDifficulty] ?? DIFFICULTY_CONFIG.medium;

  const handleSetDifficulty = (d: 'easy' | 'medium' | 'hard') => {
    setCurrentDifficulty(d);
    onUpdateDifficulty?.(word.id, d);
    setShowDifficultyPicker(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Feather name="x" size={22} color={Palette.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết từ vựng</Text>
        {onSaveToFlashcards && (
          <TouchableOpacity style={styles.saveBtn} onPress={() => onSaveToFlashcards(word)}>
            <Feather name="bookmark" size={20} color={Palette.primary[500]} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* WORD HERO */}
        <View style={styles.heroCard}>
          {word.imageUrl && (
            <Image source={{ uri: word.imageUrl }} style={styles.heroImage} />
          )}

          <View style={styles.wordRow}>
            <Text style={styles.wordText}>{word.word}</Text>
            <View style={[styles.posBadge, { backgroundColor: Palette.secondary[100] }]}>
              <Text style={[styles.posText, { color: Palette.secondary[600] }]}>{word.pos}</Text>
            </View>
          </View>

          <View style={styles.phoneticRow}>
            <Text style={styles.phoneticText}>{word.phonetic}</Text>
            <TouchableOpacity style={styles.audioBtn} onPress={() => playAudio(word.word)}>
              <Feather name="volume-2" size={18} color={Palette.primary[500]} />
            </TouchableOpacity>
          </View>

          {/* Difficulty badge — tappable */}
          <TouchableOpacity
            style={[styles.diffBadge, { backgroundColor: diffCfg.bg }]}
            onPress={() => setShowDifficultyPicker(true)}
          >
            <Text style={[styles.diffText, { color: diffCfg.text }]}>{diffCfg.label}</Text>
            <Feather name="chevron-down" size={12} color={diffCfg.text} />
          </TouchableOpacity>
        </View>

        {/* MEANING CARD */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <MaterialCommunityIcons name="translate" size={16} color={Palette.primary[500]} />
            <Text style={styles.sectionTitle}>Nghĩa tiếng Việt</Text>
          </View>
          <Text style={styles.meaningText}>🇻🇳 {word.vn}</Text>
        </View>

        {/* EXAMPLE SENTENCE CARD */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Feather name="message-square" size={15} color={Palette.primary[500]} />
            <Text style={styles.sectionTitle}>Câu ví dụ</Text>
          </View>
          <View style={styles.sentenceBox}>
            <Text style={styles.sentenceEn}>"{word.sentence}"</Text>
            {word.sentenceVn && (
              <Text style={styles.sentenceVn}>{word.sentenceVn}</Text>
            )}
          </View>

          {/* Extra example sentences */}
          {EXAMPLE_SENTENCES.map((ex, i) => (
            <View key={i} style={[styles.sentenceBox, styles.sentenceBoxAlt]}>
              <Text style={styles.sentenceEn}>"{ex.en}"</Text>
              <Text style={styles.sentenceVn}>{ex.vn}</Text>
            </View>
          ))}
        </View>

        {/* MEMORY TIP CARD */}
        <View style={[styles.sectionCard, styles.tipCard]}>
          <View style={styles.sectionHeaderRow}>
            <MaterialCommunityIcons name="lightbulb-on" size={16} color={Palette.warning.text} />
            <Text style={[styles.sectionTitle, { color: Palette.warning.text }]}>Mẹo ghi nhớ</Text>
          </View>
          <Text style={styles.tipText}>
            Hãy liên kết từ "{word.word}" với một hình ảnh hoặc cảm xúc cụ thể. Đọc to phiên âm {word.phonetic} mỗi lần ôn tập giúp não bộ ghi nhớ lâu hơn.
          </Text>
        </View>

        {/* SELF-RATE SECTION */}
        {onUpdateDifficulty && (
          <View style={styles.rateSection}>
            <Text style={styles.rateLabel}>Bạn nhớ từ này ở mức nào?</Text>
            <View style={styles.rateRow}>
              {(['easy', 'medium', 'hard'] as const).map((d) => {
                const cfg = DIFFICULTY_CONFIG[d];
                const isActive = currentDifficulty === d;
                return (
                  <TouchableOpacity
                    key={d}
                    style={[styles.rateBtn, { backgroundColor: isActive ? cfg.bg : Palette.canvas, borderColor: isActive ? cfg.text : Palette.border }]}
                    onPress={() => handleSetDifficulty(d)}
                  >
                    <Text style={[styles.rateBtnText, { color: isActive ? cfg.text : Palette.text.muted }]}>
                      {cfg.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>

      {/* DIFFICULTY PICKER MODAL */}
      <Modal visible={showDifficultyPicker} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowDifficultyPicker(false)}>
          <View style={styles.pickerCard}>
            <Text style={styles.pickerTitle}>Đánh giá độ khó</Text>
            {(['easy', 'medium', 'hard'] as const).map((d) => {
              const cfg = DIFFICULTY_CONFIG[d];
              return (
                <TouchableOpacity
                  key={d}
                  style={[styles.pickerItem, { backgroundColor: cfg.bg }]}
                  onPress={() => handleSetDifficulty(d)}
                >
                  <Text style={[styles.pickerItemText, { color: cfg.text }]}>{cfg.label}</Text>
                  {currentDifficulty === d && <Feather name="check" size={16} color={cfg.text} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
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
  closeBtn: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontFamily: Fonts.sans,
    fontSize: 16,
    fontWeight: '700',
    color: Palette.text.primary,
    textAlign: 'center',
  },
  saveBtn: {
    padding: 4,
  },

  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.four,
    paddingBottom: 40,
    gap: Spacing.three,
  },

  // Hero card
  heroCard: {
    backgroundColor: Palette.surfaceWhite,
    borderRadius: 24,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: Palette.border,
    alignItems: 'center',
    gap: Spacing.two,
  },
  heroImage: {
    width: 120,
    height: 120,
    borderRadius: 18,
    marginBottom: Spacing.two,
  },
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  wordText: {
    fontFamily: Fonts.sans,
    fontSize: 28,
    fontWeight: '900',
    color: Palette.text.primary,
  },
  posBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  posText: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    fontWeight: '700',
  },
  phoneticRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  phoneticText: {
    fontFamily: Fonts.sans,
    fontSize: 16,
    color: Palette.text.ipa,
    letterSpacing: 0.5,
  },
  audioBtn: {
    padding: 6,
    backgroundColor: Palette.primary[100],
    borderRadius: 12,
  },
  diffBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: Spacing.one,
  },
  diffText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '700',
  },

  // Section cards
  sectionCard: {
    backgroundColor: Palette.surfaceWhite,
    borderRadius: 20,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: Palette.border,
    gap: Spacing.two,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '800',
    color: Palette.text.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  meaningText: {
    fontFamily: Fonts.sans,
    fontSize: 16,
    fontWeight: '700',
    color: Palette.text.secondary,
    lineHeight: 24,
  },
  sentenceBox: {
    backgroundColor: Palette.canvas,
    borderRadius: 12,
    padding: Spacing.three,
    borderLeftWidth: 3,
    borderLeftColor: Palette.primary[400],
    gap: 4,
  },
  sentenceBoxAlt: {
    borderLeftColor: Palette.secondary[400],
  },
  sentenceEn: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontStyle: 'italic',
    color: Palette.text.primary,
    lineHeight: 20,
  },
  sentenceVn: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Palette.text.secondary,
  },

  // Memory tip
  tipCard: {
    backgroundColor: Palette.warning.bg,
    borderColor: Palette.border,
  },
  tipText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    color: Palette.text.secondary,
    lineHeight: 20,
  },

  // Self-rate
  rateSection: {
    gap: Spacing.two,
  },
  rateLabel: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '700',
    color: Palette.text.secondary,
    textAlign: 'center',
  },
  rateRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  rateBtn: {
    flex: 1,
    paddingVertical: Spacing.two,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  rateBtnText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '700',
  },

  // Difficulty modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
    paddingHorizontal: Spacing.four,
    paddingBottom: 40,
  },
  pickerCard: {
    backgroundColor: Palette.surfaceWhite,
    borderRadius: 24,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  pickerTitle: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '800',
    color: Palette.text.primary,
    marginBottom: Spacing.one,
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.three,
    borderRadius: 14,
  },
  pickerItemText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '700',
  },
});
