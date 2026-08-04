import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Palette, Fonts, Spacing } from '@/constants/theme';
import { mockQuizzes } from '@/data/mock-data';
import { playAudio, playSoundEffect } from '@/utils/audio';

interface PracticeQuizScreenProps {
  onClose: () => void;
  onAddXp: (amount: number) => void;
}

export default function PracticeQuizScreen({
  onClose,
  onAddXp,
}: PracticeQuizScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQuiz = mockQuizzes[currentIndex];

  const handleSelectOption = (opt: string) => {
    if (isAnswered) return;
    setSelectedOption(opt);
    setIsAnswered(true);

    const correct = opt === currentQuiz.answer;
    setIsCorrect(correct);

    if (correct) {
      setScore(prev => prev + 1);
      playSoundEffect('correct');
    } else {
      playSoundEffect('incorrect');
    }
  };

  const handleNext = () => {
    if (currentIndex < mockQuizzes.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
    } else {
      setQuizFinished(true);
      onAddXp(score * 15 + 10);
      playSoundEffect('success');
    }
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* HEADER BAR */}
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Feather name="x" size={24} color={Palette.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Thử thách Luyện tập Quiz 🎯</Text>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>{score} Điểm</Text>
          </View>
        </View>

        {!quizFinished ? (
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            {/* Progress */}
            <View style={styles.progressRow}>
              <Text style={styles.progressText}>Câu hỏi {currentIndex + 1} / {mockQuizzes.length}</Text>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${((currentIndex + 1) / mockQuizzes.length) * 100}%` }]} />
              </View>
            </View>

            {/* QUESTION CARD */}
            <View style={styles.questionCard}>
              <Text style={styles.typeBadge}>
                {currentQuiz.type === 'multiple-choice' ? 'CHỌN ĐÁP ÁN ĐÚNG' : 'ĐIỀN TỪ CÒN THIẾU'}
              </Text>
              <Text style={styles.questionText}>{currentQuiz.question}</Text>

              <TouchableOpacity style={styles.hintBtn} onPress={() => playAudio(currentQuiz.question)}>
                <Feather name="volume-2" size={16} color={Palette.primary[500]} />
                <Text style={styles.hintText}>{currentQuiz.vnHint}</Text>
              </TouchableOpacity>
            </View>

            {/* OPTIONS LIST */}
            <View style={styles.optionsList}>
              {currentQuiz.options?.map((opt, idx) => {
                const isSelected = selectedOption === opt;
                const isCorrectOption = opt === currentQuiz.answer;

                let optionStyle = styles.optionNormal;
                if (isAnswered) {
                  if (isCorrectOption) optionStyle = styles.optionCorrect;
                  else if (isSelected && !isCorrect) optionStyle = styles.optionWrong;
                }

                return (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.optionItem, optionStyle]}
                    onPress={() => handleSelectOption(opt)}
                    disabled={isAnswered}
                  >
                    <Text style={styles.optionIndex}>{String.fromCharCode(65 + idx)}</Text>
                    <Text style={styles.optionText}>{opt}</Text>
                    {isAnswered && isCorrectOption && (
                      <Ionicons name="checkmark-circle" size={20} color="#1E6B3A" />
                    )}
                    {isAnswered && isSelected && !isCorrect && (
                      <Ionicons name="close-circle" size={20} color="#B03535" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* ANSWER FEEDBACK SHEET */}
            {isAnswered && (
              <View style={[styles.feedbackBox, isCorrect ? styles.feedbackCorrect : styles.feedbackWrong]}>
                <View style={styles.feedbackTextRow}>
                  <MaterialCommunityIcons
                    name={isCorrect ? "emoticon-happy-outline" : "emoticon-sad-outline"}
                    size={24}
                    color={isCorrect ? "#1E6B3A" : "#B03535"}
                  />
                  <Text style={[styles.feedbackTitle, isCorrect ? styles.txtCorrect : styles.txtWrong]}>
                    {isCorrect ? 'Chính xác! Giỏi lắm! 🎉' : 'Rất tiếc, chưa đúng rồi! 😅'}
                  </Text>
                </View>
                {!isCorrect && (
                  <Text style={styles.correctAnswerLabel}>Đáp án đúng: {currentQuiz.answer}</Text>
                )}

                <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
                  <Text style={styles.nextBtnText}>CÂU TIẾP THEO</Text>
                  <Feather name="arrow-right" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        ) : (
          /* QUIZ FINISHED CELEBRATION */
          <View style={styles.finishedWrapper}>
            <View style={styles.celebrationCard}>
              <MaterialCommunityIcons name="trophy-award" size={64} color="#EAB308" />
              <Text style={styles.celebrationTitle}>Hoàn thành Quiz! 🌟</Text>
              <Text style={styles.celebrationSub}>
                Bạn trả lời đúng <Text style={styles.boldScore}>{score}/{mockQuizzes.length}</Text> câu hỏi.
              </Text>

              <View style={styles.xpBonusCard}>
                <MaterialCommunityIcons name="lightning-bolt" size={20} color="#EAB308" />
                <Text style={styles.xpBonusText}>Thưởng: +{score * 15 + 10} XP!</Text>
              </View>

              <View style={styles.finishedBtnGroup}>
                <TouchableOpacity style={styles.restartBtn} onPress={resetQuiz}>
                  <Text style={styles.restartBtnText}>Làm lại bài này</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.closeMainBtn} onPress={onClose}>
                  <Text style={styles.closeMainBtnText}>VỀ DẠO DIỆN CHÍNH</Text>
                </TouchableOpacity>
              </View>
            </View>
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
    marginBottom: Spacing.three,
  },
  closeBtn: {
    padding: 4,
  },
  headerTitle: {
    fontFamily: Fonts.sans,
    fontSize: 16,
    fontWeight: '800',
    color: Palette.text.primary,
  },
  scoreBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scoreText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '800',
    color: '#D97706',
  },

  content: {
    paddingBottom: 40,
  },
  progressRow: {
    gap: 6,
    marginBottom: Spacing.three,
  },
  progressText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '700',
    color: Palette.text.muted,
  },
  progressTrack: {
    height: 8,
    backgroundColor: Palette.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Palette.primary[500],
    borderRadius: 4,
  },

  questionCard: {
    backgroundColor: Palette.surfaceWhite,
    borderRadius: 24,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: Palette.border,
    marginBottom: Spacing.three,
  },
  typeBadge: {
    fontFamily: Fonts.sans,
    fontSize: 10,
    fontWeight: '900',
    color: Palette.primary[500],
    letterSpacing: 0.5,
    marginBottom: Spacing.one,
  },
  questionText: {
    fontFamily: Fonts.sans,
    fontSize: 18,
    fontWeight: '800',
    color: Palette.text.primary,
    lineHeight: 26,
    marginBottom: Spacing.two,
  },
  hintBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Palette.canvas,
    padding: Spacing.two,
    borderRadius: 12,
  },
  hintText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Palette.text.secondary,
  },

  optionsList: {
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: 16,
    borderWidth: 1.5,
    gap: Spacing.two,
  },
  optionNormal: {
    backgroundColor: Palette.surfaceWhite,
    borderColor: Palette.border,
  },
  optionCorrect: {
    backgroundColor: Palette.success.bg,
    borderColor: Palette.success.text,
  },
  optionWrong: {
    backgroundColor: Palette.error.bg,
    borderColor: Palette.error.text,
  },
  optionIndex: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '800',
    color: Palette.text.muted,
    width: 24,
  },
  optionText: {
    flex: 1,
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '600',
    color: Palette.text.primary,
  },

  feedbackBox: {
    padding: Spacing.three,
    borderRadius: 20,
    gap: Spacing.two,
  },
  feedbackCorrect: {
    backgroundColor: Palette.success.bg,
    borderWidth: 1,
    borderColor: Palette.success.text,
  },
  feedbackWrong: {
    backgroundColor: Palette.error.bg,
    borderWidth: 1,
    borderColor: Palette.error.text,
  },
  feedbackTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  feedbackTitle: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '800',
  },
  txtCorrect: {
    color: Palette.success.text,
  },
  txtWrong: {
    color: Palette.error.text,
  },
  correctAnswerLabel: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '700',
    color: Palette.text.primary,
  },
  nextBtn: {
    backgroundColor: Palette.primary[500],
    height: 48,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 4,
  },
  nextBtnText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  finishedWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  celebrationCard: {
    width: '100%',
    backgroundColor: Palette.surfaceWhite,
    borderRadius: 28,
    padding: Spacing.five,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Palette.border,
  },
  celebrationTitle: {
    fontFamily: Fonts.sans,
    fontSize: 22,
    fontWeight: '900',
    color: Palette.text.primary,
    marginTop: Spacing.two,
  },
  celebrationSub: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    color: Palette.text.secondary,
    marginTop: 4,
    marginBottom: Spacing.three,
  },
  boldScore: {
    fontWeight: '900',
    color: Palette.primary[500],
  },
  xpBonusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
    marginBottom: Spacing.four,
  },
  xpBonusText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '800',
    color: '#D97706',
  },
  finishedBtnGroup: {
    width: '100%',
    gap: Spacing.two,
  },
  restartBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
  },
  restartBtnText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '700',
    color: Palette.text.secondary,
  },
  closeMainBtn: {
    backgroundColor: Palette.primary[500],
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeMainBtnText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});
