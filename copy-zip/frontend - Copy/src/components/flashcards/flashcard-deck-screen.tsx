import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Palette, Fonts, Spacing } from '@/constants/theme';
import { VocabularyWord } from '@/types';
import { playAudio, playSoundEffect } from '@/utils/audio';

interface FlashcardDeckScreenProps {
  words: VocabularyWord[];
  onUpdateDifficulty: (id: string, difficulty: 'easy' | 'medium' | 'hard') => void;
  onRemoveWord: (id: string) => void;
  onStartQuiz: () => void;
}

export default function FlashcardDeckScreen({
  words,
  onUpdateDifficulty,
  onRemoveWord,
  onStartQuiz,
}: FlashcardDeckScreenProps) {
  // Modes: 'session' (Review Session) | 'library' (Card Library)
  const [activeMode, setActiveMode] = useState<'session' | 'library'>('session');
  const [filter, setFilter] = useState<'all' | 'easy' | 'medium' | 'hard' | 'captured'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Session State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionFinished, setSessionFinished] = useState(false);

  // Filtered Cards
  const filteredWords = words.filter(w => {
    let categoryMatch = true;
    if (filter === 'captured') categoryMatch = !!w.captured;
    else if (filter !== 'all') categoryMatch = w.difficulty === filter;

    let searchMatch = true;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      searchMatch = w.word.toLowerCase().includes(q) || w.vn.toLowerCase().includes(q);
    }
    return categoryMatch && searchMatch;
  });

  const currentCard = filteredWords[currentIndex];

  const handleNextCard = () => {
    if (currentIndex < filteredWords.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      setSessionFinished(true);
      playSoundEffect('success');
    }
  };

  const handlePrevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  };

  const handleRate = (difficulty: 'easy' | 'medium' | 'hard') => {
    if (!currentCard) return;
    onUpdateDifficulty(currentCard.id, difficulty);
    playSoundEffect('correct');
    handleNextCard();
  };

  const resetSession = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionFinished(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* TOP MODE TOGGLE & HEADER */}
        <View style={styles.headerBar}>
          <Text style={styles.headerTitle}>Sổ thẻ từ vựng ({words.length})</Text>

          <View style={styles.modeToggleRow}>
            <TouchableOpacity
              style={[styles.modeTab, activeMode === 'session' && styles.modeTabActive]}
              onPress={() => setActiveMode('session')}
            >
              <Feather name="layers" size={14} color={activeMode === 'session' ? Palette.primary[500] : Palette.text.muted} />
              <Text style={[styles.modeTabText, activeMode === 'session' && styles.modeTabTextActive]}>Ôn tập</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modeTab, activeMode === 'library' && styles.modeTabActive]}
              onPress={() => setActiveMode('library')}
            >
              <Feather name="grid" size={14} color={activeMode === 'library' ? Palette.primary[500] : Palette.text.muted} />
              <Text style={[styles.modeTabText, activeMode === 'library' && styles.modeTabTextActive]}>Thư viện</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* CATEGORY FILTERS */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContainer}>
          {[
            { key: 'all', label: 'Tất cả' },
            { key: 'easy', label: '🟢 Dễ' },
            { key: 'medium', label: '🟡 Vừa' },
            { key: 'hard', label: '🔴 Khó' },
            { key: 'captured', label: '📷 Từ vừa quét' },
          ].map(item => (
            <TouchableOpacity
              key={item.key}
              style={[styles.filterChip, filter === item.key && styles.filterChipActive]}
              onPress={() => {
                setFilter(item.key as any);
                resetSession();
              }}
            >
              <Text style={[styles.filterChipText, filter === item.key && styles.filterChipTextActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* MODE 1: REVIEW SESSION */}
        {activeMode === 'session' && (
          <View style={styles.sessionWrapper}>
            {filteredWords.length === 0 ? (
              <View style={styles.emptyState}>
                <Feather name="inbox" size={48} color={Palette.text.muted} />
                <Text style={styles.emptyText}>Không tìm thấy thẻ phù hợp bộ lọc.</Text>
              </View>
            ) : sessionFinished ? (
              <View style={styles.finishedCard}>
                <Feather name="award" size={52} color={Palette.warning.text} />
                <Text style={styles.finishedTitle}>Hoàn thành buổi ôn tập! 🎉</Text>
                <Text style={styles.finishedSub}>Bạn vừa luyện tập xong {filteredWords.length} thẻ từ vựng.</Text>

                <View style={styles.finishedBtnRow}>
                  <TouchableOpacity style={styles.restartBtn} onPress={resetSession}>
                    <Feather name="refresh-cw" size={16} color={Palette.primary[500]} />
                    <Text style={styles.restartBtnText}>Ôn lại lần nữa</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.quizBtn} onPress={onStartQuiz}>
                    <Text style={styles.quizBtnText}>THỬ SỨC VỚI QUIZ</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.cardContainer}>
                {/* Session Progress Header */}
                <View style={styles.sessionHeader}>
                  <Text style={styles.sessionProgressText}>
                    Thẻ {currentIndex + 1} / {filteredWords.length}
                  </Text>
                  <View style={styles.difficultyBadge}>
                    <Text style={styles.difficultyBadgeText}>{currentCard?.difficulty.toUpperCase()}</Text>
                  </View>
                </View>

                {/* THE FLASHCARD (FLIP) */}
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={styles.flashcard}
                  onPress={() => setIsFlipped(!isFlipped)}
                >
                  <View style={styles.flipHint}>
                    <Feather name="rotate-cw" size={14} color={Palette.text.muted} />
                    <Text style={styles.flipHintText}>{isFlipped ? 'Chạm để xem từ' : 'Chạm để lật mặt sau'}</Text>
                  </View>

                  {!isFlipped ? (
                    /* FRONT OF CARD */
                    <View style={styles.cardFront}>
                      {currentCard?.imageUrl && (
                        <Image source={{ uri: currentCard.imageUrl }} style={styles.cardImage} />
                      )}
                      <Text style={styles.frontWord}>{currentCard?.word}</Text>
                      <View style={styles.posChip}>
                        <Text style={styles.posChipText}>{currentCard?.pos}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.audioButton}
                        onPress={() => currentCard && playAudio(currentCard.word)}
                      >
                        <Feather name="volume-2" size={20} color={Palette.primary[500]} />
                        <Text style={styles.audioButtonText}>{currentCard?.phonetic}</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    /* BACK OF CARD */
                    <View style={styles.cardBack}>
                      <Text style={styles.backVnTitle}>Nghĩa tiếng Việt:</Text>
                      <Text style={styles.backVnText}>🇻🇳 {currentCard?.vn}</Text>

                      <View style={styles.sentenceBox}>
                        <Text style={styles.sentenceLabel}>Ví dụ câu:</Text>
                        <Text style={styles.sentenceEn}>“{currentCard?.sentence}”</Text>
                        {currentCard?.sentenceVn && (
                          <Text style={styles.sentenceVn}>“{currentCard.sentenceVn}”</Text>
                        )}
                      </View>
                    </View>
                  )}
                </TouchableOpacity>

                {/* SM-2 RATING ACTION BUTTONS */}
                <View style={styles.ratingBar}>
                  <TouchableOpacity style={[styles.rateBtn, styles.rateBtnAgain]} onPress={() => handleRate('hard')}>
                    <Text style={styles.rateEmoji}>🔴</Text>
                    <Text style={styles.rateLabel}>Chưa thuộc</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.rateBtn, styles.rateBtnGood]} onPress={() => handleRate('medium')}>
                    <Text style={styles.rateEmoji}>🟡</Text>
                    <Text style={styles.rateLabel}>Tạm nhớ</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.rateBtn, styles.rateBtnEasy]} onPress={() => handleRate('easy')}>
                    <Text style={styles.rateEmoji}>🟢</Text>
                    <Text style={styles.rateLabel}>Rất thuộc</Text>
                  </TouchableOpacity>
                </View>

                {/* PREV / NEXT NAVIGATION BAR */}
                <View style={styles.navRow}>
                  <TouchableOpacity
                    style={[styles.navBtn, currentIndex === 0 && styles.navBtnDisabled]}
                    onPress={handlePrevCard}
                    disabled={currentIndex === 0}
                  >
                    <Feather name="arrow-left" size={16} color={Palette.text.primary} />
                    <Text style={styles.navBtnText}>Thẻ trước</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.navBtn} onPress={handleNextCard}>
                    <Text style={styles.navBtnText}>Thẻ kế tiếp</Text>
                    <Feather name="arrow-right" size={16} color={Palette.text.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}

        {/* MODE 2: CARD LIBRARY GRID */}
        {activeMode === 'library' && (
          <View style={{ flex: 1 }}>
            {/* Search Input */}
            <View style={styles.searchBar}>
              <Feather name="search" size={16} color={Palette.text.muted} />
              <TextInput
                style={styles.searchInput}
                placeholder="Tìm kiếm từ vựng, nghĩa tiếng Việt..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor={Palette.text.muted}
              />
              {searchQuery !== '' && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Feather name="x" size={16} color={Palette.text.muted} />
                </TouchableOpacity>
              )}
            </View>

            <ScrollView contentContainerStyle={styles.libraryGrid} showsVerticalScrollIndicator={false}>
              {filteredWords.map((word) => (
                <View key={word.id} style={styles.libraryCard}>
                  <View style={styles.libCardTop}>
                    <Text style={styles.libWord}>{word.word}</Text>
                    <TouchableOpacity onPress={() => onRemoveWord(word.id)}>
                      <Feather name="trash-2" size={14} color={Palette.error.text} />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.libPhonetic}>{word.phonetic}</Text>
                  <Text style={styles.libVn}>🇻🇳 {word.vn}</Text>

                  <View style={styles.libCardFoot}>
                    <TouchableOpacity onPress={() => playAudio(word.word)}>
                      <Feather name="volume-2" size={16} color={Palette.primary[500]} />
                    </TouchableOpacity>
                    <View style={styles.libPosChip}>
                      <Text style={styles.libPosText}>{word.pos}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Palette.canvas,
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.two,
  },
  headerTitle: {
    fontFamily: Fonts.sans,
    fontSize: 18,
    fontWeight: '800',
    color: Palette.text.primary,
  },
  modeToggleRow: {
    flexDirection: 'row',
    backgroundColor: Palette.surfaceWhite,
    borderRadius: 14,
    padding: 2,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  modeTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  modeTabActive: {
    backgroundColor: Palette.primary[100],
  },
  modeTabText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '600',
    color: Palette.text.muted,
  },
  modeTabTextActive: {
    color: Palette.primary[500],
    fontWeight: '800',
  },

  // Filter Chips
  filterScroll: {
    maxHeight: 44,
    marginBottom: Spacing.three,
  },
  filterContainer: {
    gap: Spacing.two,
    alignItems: 'center',
  },
  filterChip: {
    backgroundColor: Palette.surfaceWhite,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  filterChipActive: {
    backgroundColor: Palette.primary[500],
    borderColor: Palette.primary[500],
  },
  filterChipText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '600',
    color: Palette.text.secondary,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  // Session Wrapper
  sessionWrapper: {
    flex: 1,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    gap: Spacing.two,
  },
  emptyText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    color: Palette.text.muted,
  },
  finishedCard: {
    backgroundColor: Palette.surfaceWhite,
    borderRadius: 24,
    padding: Spacing.five,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Palette.border,
    marginTop: Spacing.four,
  },
  finishedTitle: {
    fontFamily: Fonts.sans,
    fontSize: 20,
    fontWeight: '800',
    color: Palette.text.primary,
    marginTop: Spacing.two,
  },
  finishedSub: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    color: Palette.text.secondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: Spacing.four,
  },
  finishedBtnRow: {
    width: '100%',
    gap: Spacing.two,
  },
  restartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Palette.primary[100],
    height: 48,
    borderRadius: 14,
  },
  restartBtnText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '700',
    color: Palette.primary[500],
  },
  quizBtn: {
    backgroundColor: Palette.primary[500],
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quizBtnText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  // Flashcard
  cardContainer: {
    flex: 1,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  sessionProgressText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '700',
    color: Palette.text.secondary,
  },
  difficultyBadge: {
    backgroundColor: Palette.secondary[100],
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  difficultyBadgeText: {
    fontFamily: Fonts.sans,
    fontSize: 10,
    fontWeight: '800',
    color: Palette.secondary[600],
  },
  flashcard: {
    backgroundColor: Palette.surfaceWhite,
    borderRadius: 24,
    padding: Spacing.four,
    minHeight: 260,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Palette.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: Spacing.three,
  },
  flipHint: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  flipHintText: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    color: Palette.text.muted,
  },

  // Card Front
  cardFront: {
    alignItems: 'center',
    width: '100%',
  },
  cardImage: {
    width: 100,
    height: 100,
    borderRadius: 20,
    marginBottom: Spacing.two,
  },
  frontWord: {
    fontFamily: Fonts.sans,
    fontSize: 26,
    fontWeight: '900',
    color: Palette.text.primary,
    textAlign: 'center',
  },
  posChip: {
    backgroundColor: Palette.warning.bg,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 6,
    marginBottom: Spacing.two,
  },
  posChipText: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    fontWeight: '800',
    color: Palette.warning.text,
  },
  audioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Palette.primary[100],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  audioButtonText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    color: Palette.primary[500],
    fontWeight: '700',
  },

  // Card Back
  cardBack: {
    width: '100%',
  },
  backVnTitle: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Palette.text.muted,
  },
  backVnText: {
    fontFamily: Fonts.sans,
    fontSize: 20,
    fontWeight: '800',
    color: Palette.text.primary,
    marginTop: 2,
    marginBottom: Spacing.three,
  },
  sentenceBox: {
    backgroundColor: Palette.canvas,
    padding: Spacing.three,
    borderRadius: 14,
  },
  sentenceLabel: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    color: Palette.text.muted,
    marginBottom: 2,
  },
  sentenceEn: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '600',
    color: Palette.text.primary,
  },
  sentenceVn: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Palette.text.secondary,
    fontStyle: 'italic',
    marginTop: 2,
  },

  // Rating Bar
  ratingBar: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  rateBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.surfaceWhite,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  rateBtnAgain: {
    backgroundColor: Palette.error.bg,
    borderColor: Palette.error.text,
  },
  rateBtnGood: {
    backgroundColor: Palette.warning.bg,
    borderColor: Palette.warning.text,
  },
  rateBtnEasy: {
    backgroundColor: Palette.primary[100],
    borderColor: Palette.primary[300],
  },
  rateEmoji: {
    fontSize: 12,
  },
  rateLabel: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    fontWeight: '800',
    color: Palette.text.primary,
    marginTop: 1,
  },

  // Nav Row
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  navBtnDisabled: {
    opacity: 0.3,
  },
  navBtnText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '700',
    color: Palette.text.primary,
  },

  // Library Mode
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.surfaceWhite,
    borderRadius: 14,
    paddingHorizontal: Spacing.three,
    height: 44,
    borderWidth: 1,
    borderColor: Palette.border,
    marginBottom: Spacing.three,
  },
  searchInput: {
    flex: 1,
    fontFamily: Fonts.sans,
    fontSize: 13,
    color: Palette.text.primary,
    marginLeft: 8,
  },
  libraryGrid: {
    gap: Spacing.two,
    paddingBottom: 120,
  },
  libraryCard: {
    backgroundColor: Palette.surfaceWhite,
    borderRadius: 16,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  libCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  libWord: {
    fontFamily: Fonts.sans,
    fontSize: 16,
    fontWeight: '800',
    color: Palette.text.primary,
  },
  libPhonetic: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Palette.text.ipa,
    marginTop: 2,
  },
  libVn: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '600',
    color: Palette.text.secondary,
    marginTop: 4,
  },
  libCardFoot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  libPosChip: {
    backgroundColor: Palette.warning.bg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  libPosText: {
    fontFamily: Fonts.sans,
    fontSize: 10,
    fontWeight: '800',
    color: Palette.warning.text,
  },
});
