import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { VocabularyWord } from '@/types';
import { playSoundEffect } from '@/utils/audio';

interface PracticeQuizScreenProps {
  lessonTitle?: string;
  words?: VocabularyWord[];
  onClose: () => void;
  onQuizComplete?: (percentage: number) => void | Promise<void>;
}

interface QuizQuestionItem {
  id: string;
  question: string;
  options: string[];
  answer: string;
}

interface WrongAnswerItem {
  question: string;
  selectedOption: string;
  correctAnswer: string;
}

export default function PracticeQuizScreen({
  lessonTitle = 'Bài học Chủ đề',
  words = [],
  onClose,
  onQuizComplete,
}: PracticeQuizScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswerItem[]>([]);
  const [savingResult, setSavingResult] = useState(false);
  const [resultError, setResultError] = useState<string | null>(null);

  // Dynamically generate quiz questions specifically for the selected Lesson's words!
  const questions: QuizQuestionItem[] = useMemo(() => {
    if (!words || words.length === 0) {
      return [];
    }

    const allVn = words.map(w => w.vn);
    const allEn = words.map(w => w.word);

    return words.map((w, idx) => {
      // Type 1: English word -> select VN meaning
      if (idx % 2 === 0) {
        const otherVn = allVn.filter(v => v !== w.vn);
        const distractors = otherVn.sort(() => 0.5 - Math.random()).slice(0, 3);
        const options = [w.vn, ...distractors].sort(() => 0.5 - Math.random());
        return {
          id: `q_${w.id}_1`,
          question: `Từ "${w.word}" trong tiếng Anh có nghĩa tiếng Việt là gì?`,
          options,
          answer: w.vn,
        };
      } else {
        // Type 2: VN meaning -> select English word
        const otherEn = allEn.filter(e => e !== w.word);
        const distractors = otherEn.sort(() => 0.5 - Math.random()).slice(0, 3);
        const options = [w.word, ...distractors].sort(() => 0.5 - Math.random());
        return {
          id: `q_${w.id}_2`,
          question: `Từ tiếng Anh nào mang nghĩa "${w.vn}"?`,
          options,
          answer: w.word,
        };
      }
    });
  }, [words]);

  const currentQuiz = questions.length ? questions[currentIndex % questions.length] : null;
  const totalQuestions = questions.length;

  const handleSelectOption = (opt: string) => {
    if (isAnswered || !currentQuiz) return;
    setSelectedOption(opt);
    setIsAnswered(true);

    const correct = opt === currentQuiz.answer;
    setIsCorrect(correct);

    if (correct) {
      setScore(prev => prev + 1);
      playSoundEffect('correct');
    } else {
      playSoundEffect('incorrect');
      setWrongAnswers(prev => [
        ...prev,
        {
          question: currentQuiz.question,
          selectedOption: opt,
          correctAnswer: currentQuiz.answer,
        },
      ]);
    }
  };

  const handleNext = async () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
    } else {
      const percentage = totalQuestions ? Math.round((score / totalQuestions) * 100) : 0;
      setSavingResult(true);
      setResultError(null);
      try {
        await onQuizComplete?.(percentage);
        setQuizFinished(true);
        playSoundEffect('success');
      } catch {
        setResultError('Không thể lưu tiến độ bài học. Kiểm tra mạng và thử lại.');
      } finally {
        setSavingResult(false);
      }
    }
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setScore(0);
    setQuizFinished(false);
    setWrongAnswers([]);
    setResultError(null);
  };

  const percentageScore = Math.round((score / totalQuestions) * 100);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* HEADER BAR */}
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Feather name="x" size={24} color="#1E293B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Quiz: {lessonTitle}</Text>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreBadgeText}>Điểm: {score}/{totalQuestions}</Text>
          </View>
        </View>

        {totalQuestions === 0 ? (
          <View style={styles.content}>
            <Text style={styles.questionText}>Bài học này chưa có từ vựng để tạo câu hỏi.</Text>
          </View>
        ) : !quizFinished ? (
          <ScrollView contentContainerStyle={styles.content}>
            {/* PROGRESS BAR */}
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${((currentIndex + 1) / totalQuestions) * 100}%` }]} />
            </View>
            <Text style={styles.progressText}>Câu hỏi {currentIndex + 1} / {totalQuestions}</Text>

            {/* QUESTION CARD */}
            <View style={styles.questionCard}>
              <Text style={styles.questionText}>{currentQuiz?.question}</Text>
            </View>

            {/* OPTIONS LIST */}
            <View style={styles.optionsContainer}>
              {(currentQuiz?.options || []).map((opt: string, i: number) => {
                const isSelected = selectedOption === opt;
                const isAnswer = opt === currentQuiz?.answer;

                let btnStyle: any = styles.optionBtn;
                let textStyle: any = styles.optionText;

                if (isAnswered) {
                  if (isAnswer) {
                    btnStyle = [styles.optionBtn, styles.optionCorrect];
                    textStyle = [styles.optionText, styles.optionTextCorrect];
                  } else if (isSelected && !isCorrect) {
                    btnStyle = [styles.optionBtn, styles.optionIncorrect];
                    textStyle = [styles.optionText, styles.optionTextIncorrect];
                  }
                }

                return (
                  <TouchableOpacity
                    key={i}
                    style={btnStyle}
                    onPress={() => handleSelectOption(opt)}
                    disabled={isAnswered}
                  >
                    <Text style={textStyle}>{opt}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* NEXT BUTTON */}
            {isAnswered && (
              <TouchableOpacity style={styles.nextBtn} onPress={() => void handleNext()} disabled={savingResult}>
                <Text style={styles.nextBtnText}>{savingResult ? 'Đang lưu tiến độ...' : currentIndex === totalQuestions - 1 ? 'Xem kết quả Quiz' : 'Câu tiếp theo'}</Text>
                <Feather name="arrow-right" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            )}
            {resultError && <Text style={styles.resultError}>{resultError}</Text>}
          </ScrollView>
        ) : (
          /* QUIZ FINISHED RESULTS SCREEN */
          <ScrollView contentContainerStyle={styles.resultsContent}>
            <View style={styles.resultCard}>
              <Feather name="award" size={56} color="#4F46E5" />
              <Text style={styles.resultTitle}>Hoàn thành bài luyện tập</Text>
              <Text style={styles.resultScoreText}>{score} / {totalQuestions} câu đúng ({percentageScore}%)</Text>

              {wrongAnswers.length > 0 ? (
                <View style={styles.wrongSection}>
                  <Text style={styles.wrongTitle}>Xem lại câu trả lời chưa chính xác ({wrongAnswers.length}):</Text>
                  {wrongAnswers.map((w, idx) => (
                    <View key={idx} style={styles.wrongCard}>
                      <Text style={styles.wrongQuestion}>• {w.question}</Text>
                      <Text style={styles.wrongUserAns}>Đã chọn: {w.selectedOption}</Text>
                      <Text style={styles.wrongCorrectAns}>Đáp án chính xác: {w.correctAnswer}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={styles.perfectBox}>
                  <Text style={styles.perfectText}>Xuất sắc! Bạn đã hoàn thành chính xác 100% các câu hỏi.</Text>
                </View>
              )}

              <View style={styles.resultActions}>
                <TouchableOpacity style={styles.retryBtn} onPress={resetQuiz}>
                  <Feather name="refresh-cw" size={16} color="#4F46E5" />
                  <Text style={styles.retryText}>Làm lại Quiz</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.finishBtn} onPress={onClose}>
                  <Text style={styles.finishText}>Hoàn tất</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  container: { flex: 1 },

  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  closeBtn: { padding: 4 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  scoreBadge: { backgroundColor: '#EEF2FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  scoreBadgeText: { color: '#4F46E5', fontSize: 12, fontWeight: '700' },

  content: { padding: 20, gap: 16 },
  progressBarBg: { height: 6, backgroundColor: '#E2E8F0', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#4F46E5' },
  progressText: { fontSize: 12, color: '#64748B', fontWeight: '600' },

  questionCard: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  questionText: { fontSize: 18, fontWeight: '700', color: '#1E293B', lineHeight: 26 },

  optionsContainer: { gap: 10 },
  optionBtn: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#CBD5E1', padding: 16, borderRadius: 12 },
  optionText: { fontSize: 15, fontWeight: '600', color: '#334155' },
  optionCorrect: { backgroundColor: '#ECFDF5', borderColor: '#10B981' },
  optionTextCorrect: { color: '#047857', fontWeight: '700' },
  optionIncorrect: { backgroundColor: '#FEF2F2', borderColor: '#EF4444' },
  optionTextIncorrect: { color: '#B91C1C', fontWeight: '700' },

  nextBtn: { backgroundColor: '#4F46E5', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, borderRadius: 12, marginTop: 12 },
  nextBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  resultError: { color: '#B91C1C', fontSize: 13, textAlign: 'center' },

  resultsContent: { padding: 20 },
  resultCard: { backgroundColor: '#FFFFFF', padding: 24, borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', gap: 12 },
  resultTitle: { fontSize: 20, fontWeight: '800', color: '#1E293B' },
  resultScoreText: { fontSize: 18, fontWeight: '700', color: '#10B981' },

  wrongSection: { width: '100%', gap: 10, marginTop: 12 },
  wrongTitle: { fontSize: 14, fontWeight: '700', color: '#1E293B' },
  wrongCard: { backgroundColor: '#FEF2F2', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#FCA5A5', gap: 4 },
  wrongQuestion: { fontSize: 13, fontWeight: '700', color: '#991B1B' },
  wrongUserAns: { fontSize: 12, color: '#DC2626' },
  wrongCorrectAns: { fontSize: 12, color: '#059669', fontWeight: '700' },

  perfectBox: { backgroundColor: '#ECFDF5', padding: 14, borderRadius: 12, marginTop: 8 },
  perfectText: { color: '#047857', fontSize: 13, fontWeight: '700', textAlign: 'center' },

  resultActions: { flexDirection: 'row', gap: 12, width: '100%', marginTop: 16 },
  retryBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 1, borderColor: '#4F46E5', padding: 12, borderRadius: 10 },
  retryText: { color: '#4F46E5', fontWeight: '700' },
  finishBtn: { flex: 1, backgroundColor: '#4F46E5', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 10 },
  finishText: { color: '#FFFFFF', fontWeight: '700' },
});
