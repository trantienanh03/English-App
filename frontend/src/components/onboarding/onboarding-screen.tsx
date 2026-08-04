import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Fonts, Spacing } from '@/constants/theme';

export const DropsPalette = {
  bgDark: '#361968',
  bgCard: 'rgba(255, 255, 255, 0.12)',
  bgCardSelected: 'rgba(255, 255, 255, 0.25)',
  accentLime: '#E5F554',
  accentLimeDark: '#D4E738',
  textDark: '#251048',
  textLight: '#FFFFFF',
  textMuted: '#D0C2E8',
  borderSelected: '#E5F554',
  progressBarBg: 'rgba(255, 255, 255, 0.15)',
};

export interface OnboardingData {
  level: string;
  goals: string[];
  dailyTime: string;
}

interface OnboardingScreenProps {
  onComplete: (data: OnboardingData) => void;
  onLoginPress: () => void;
}

export default function OnboardingScreen({ onComplete, onLoginPress }: OnboardingScreenProps) {
  // Step 0: Welcome, Step 1: Level, Step 2: Goals, Step 3: Time, Step 4: Ready Summary
  const [step, setStep] = useState<number>(0);

  // User Selections
  const [selectedLevel, setSelectedLevel] = useState<string>('I know some');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([
    'Master the basics',
    'Speak more fluently',
  ]);
  const [selectedTime, setSelectedTime] = useState<string>('10 mins daily');

  const levelsList = [
    { key: 'Nonexistent', label: 'Nonexistent', sub: 'Mới bắt đầu từ con số 0' },
    { key: 'I know some', label: 'I know some', sub: 'Đã biết một chút cơ bản' },
    { key: 'I know a good amount', label: 'I know a good amount', sub: 'Đã có nền tảng vững chắc' },
  ];

  const goalsList = [
    { key: 'Master the basics', label: 'Master the basics', sub: 'Nắm vững từ vựng cơ bản' },
    { key: 'Chat with English speakers', label: 'Chat with English speakers', sub: 'Giao tiếp với người bản xứ' },
    { key: 'Watch movies without subtitles', label: 'Watch movies without subtitles', sub: 'Xem phim không cần phụ đề' },
    { key: 'Learn about culture & travel', label: 'Learn about culture & travel', sub: 'Phục vụ du lịch & khám phá' },
    { key: 'Connect with family and friends', label: 'Connect with family and friends', sub: 'Kết nối bạn bè quốc tế' },
    { key: 'Impress my colleagues', label: 'Impress my colleagues', sub: 'Nâng cao khả năng công sở' },
    { key: 'Ace my next English test', label: 'Ace my next English test', sub: 'Luyện thi chứng chỉ' },
    { key: 'Speak more fluently', label: 'Speak more fluently', sub: 'Phản xạ phát âm tự nhiên' },
  ];

  const timeList = [
    { key: '5 mins daily', label: '5 mins daily', sub: '5 phút mỗi ngày (Duy trì thói quen)' },
    { key: '10 mins daily', label: '10 mins daily', sub: '10 phút mỗi ngày (Vừa sức & hiệu quả)' },
    { key: '15 mins or more', label: '15 mins or more', sub: '15 phút trở lên (Bứt phá nhanh chóng)' },
  ];

  const handleToggleGoal = (goalKey: string) => {
    if (selectedGoals.includes(goalKey)) {
      setSelectedGoals(selectedGoals.filter((g) => g !== goalKey));
    } else {
      setSelectedGoals([...selectedGoals, goalKey]);
    }
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      onComplete({
        level: selectedLevel,
        goals: selectedGoals,
        dailyTime: selectedTime,
      });
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  // Progress percentage calculation
  const getProgress = () => {
    if (step === 0) return 0;
    if (step === 1) return 33;
    if (step === 2) return 66;
    if (step === 3) return 100;
    return 100;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header bar for Steps 1-3 */}
      {step > 0 && step < 4 && (
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Feather name="chevron-left" size={28} color={DropsPalette.textLight} />
          </TouchableOpacity>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${getProgress()}%` }]} />
          </View>
        </View>
      )}

      {/* STEP 0: Welcome Screen */}
      {step === 0 && (
        <View style={styles.welcomeWrapper}>
          {/* Top Login Link */}
          <View style={styles.welcomeTopBar}>
            <Text style={styles.loginQuestion}>
              Already using Vocam?{' '}
              <Text style={styles.loginLink} onPress={onLoginPress}>
                Log in
              </Text>
            </Text>
          </View>

          {/* Decorative Circle Blobs */}
          <View style={styles.blobGreen} />
          <View style={styles.blobPurple} />
          <View style={styles.blobPink} />

          {/* Illustration Avatar */}
          <View style={styles.illustrationContainer}>
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={80} color="#FFFFFF" />
              <View style={styles.waveBadge}>
                <Text style={styles.waveEmoji}>👋</Text>
              </View>
            </View>
          </View>

          {/* Main Title & Subtitle */}
          <View style={styles.welcomeTextSection}>
            <Text style={styles.welcomeTitle}>
              Hi! Ready to learn English{'\n'}the fun way?
            </Text>
            <Text style={styles.welcomeSubtitle}>Let&apos;s set up your profile.</Text>
          </View>

          {/* GET STARTED Button */}
          <TouchableOpacity style={styles.limeButton} onPress={() => setStep(1)}>
            <Text style={styles.limeButtonText}>GET STARTED</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* STEP 1: How is your English? */}
      {step === 1 && (
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scrollStepContent} showsVerticalScrollIndicator={false}>
            <View style={styles.questionSection}>
              <Text style={styles.questionTitle}>How is your English?</Text>
              <Text style={styles.questionSubtitle}>Trình độ tiếng Anh hiện tại của bạn thế nào?</Text>
            </View>

            <View style={styles.optionsList}>
              {levelsList.map((item) => {
                const isSelected = selectedLevel === item.key;
                return (
                  <TouchableOpacity
                    key={item.key}
                    style={[styles.pillOption, isSelected && styles.pillOptionSelected]}
                    onPress={() => setSelectedLevel(item.key)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.pillTextContainer}>
                      <Text style={styles.pillLabel}>{item.label}</Text>
                      <Text style={styles.pillSub}>{item.sub}</Text>
                    </View>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={24} color={DropsPalette.accentLime} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          <View style={styles.stickyFooter}>
            <TouchableOpacity style={styles.limeButton} onPress={() => setStep(2)}>
              <Text style={styles.limeButtonText}>CONTINUE</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* STEP 2: What are your goals? */}
      {step === 2 && (
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scrollStepContent} showsVerticalScrollIndicator={false}>
            <View style={styles.questionSection}>
              <Text style={styles.questionTitle}>What are your goals?</Text>
              <Text style={styles.questionSubtitle}>Select all that apply (Chọn tất cả những mục tiêu phù hợp)</Text>
            </View>

            <View style={styles.optionsList}>
              {goalsList.map((item) => {
                const isSelected = selectedGoals.includes(item.key);
                return (
                  <TouchableOpacity
                    key={item.key}
                    style={[styles.pillOption, isSelected && styles.pillOptionSelected]}
                    onPress={() => handleToggleGoal(item.key)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.pillTextContainer}>
                      <Text style={styles.pillLabel}>{item.label}</Text>
                      <Text style={styles.pillSub}>{item.sub}</Text>
                    </View>
                    {isSelected && (
                      <Feather name="check" size={22} color={DropsPalette.accentLime} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          <View style={styles.stickyFooter}>
            <TouchableOpacity
              style={[styles.limeButton, selectedGoals.length === 0 && { opacity: 0.5 }]}
              onPress={() => setStep(3)}
              disabled={selectedGoals.length === 0}
            >
              <Text style={styles.limeButtonText}>CONTINUE</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* STEP 3: How much time will you devote to learning? */}
      {step === 3 && (
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scrollStepContent} showsVerticalScrollIndicator={false}>
            <View style={styles.questionSection}>
              <Text style={styles.questionTitle}>
                How much time will you devote to learning?
              </Text>
              <Text style={styles.questionSubtitle}>
                Bạn muốn dành bao nhiêu thời gian học mỗi ngày?
              </Text>
            </View>

            <View style={styles.optionsList}>
              {timeList.map((item) => {
                const isSelected = selectedTime === item.key;
                return (
                  <TouchableOpacity
                    key={item.key}
                    style={[styles.pillOption, isSelected && styles.pillOptionSelected]}
                    onPress={() => setSelectedTime(item.key)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.pillTextContainer}>
                      <Text style={styles.pillLabel}>{item.label}</Text>
                      <Text style={styles.pillSub}>{item.sub}</Text>
                    </View>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={24} color={DropsPalette.accentLime} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          <View style={styles.stickyFooter}>
            <TouchableOpacity style={styles.limeButton} onPress={() => setStep(4)}>
              <Text style={styles.limeButtonText}>CONTINUE</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* STEP 4: Ready Summary & Start */}
      {step === 4 && (
        <View style={styles.readyWrapper}>
          <View style={styles.readyCard}>
            <View style={styles.sparkleIconWrapper}>
              <Ionicons name="sparkles" size={48} color={DropsPalette.accentLime} />
            </View>
            <Text style={styles.readyTitle}>Your English Plan is Ready! 🎉</Text>
            <Text style={styles.readySubtitle}>
              Vocam đã cá nhân hóa lộ trình học phù hợp nhất cho bạn.
            </Text>

            <View style={styles.summaryBox}>
              <View style={styles.summaryRow}>
                <Feather name="bar-chart-2" size={18} color={DropsPalette.accentLime} />
                <Text style={styles.summaryText}>Trình độ: <Text style={styles.summaryHighlight}>{selectedLevel}</Text></Text>
              </View>
              <View style={styles.summaryRow}>
                <Feather name="target" size={18} color={DropsPalette.accentLime} />
                <Text style={styles.summaryText}>Mục tiêu: <Text style={styles.summaryHighlight}>{selectedGoals.length} mục tiêu</Text></Text>
              </View>
              <View style={styles.summaryRow}>
                <Feather name="clock" size={18} color={DropsPalette.accentLime} />
                <Text style={styles.summaryText}>Thời lượng: <Text style={styles.summaryHighlight}>{selectedTime}</Text></Text>
              </View>
            </View>

            <TouchableOpacity style={styles.limeButton} onPress={handleNext}>
              <Text style={styles.limeButtonText}>START LEARNING NOW</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DropsPalette.bgDark,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Platform.OS === 'android' ? Spacing.four : Spacing.two,
    paddingBottom: Spacing.three,
  },
  backButton: {
    padding: Spacing.one,
    marginRight: Spacing.two,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: DropsPalette.progressBarBg,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: DropsPalette.accentLime,
    borderRadius: 3,
  },

  // Welcome Step Styles
  welcomeWrapper: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.five,
    paddingTop: Spacing.three,
    position: 'relative',
  },
  welcomeTopBar: {
    alignItems: 'flex-end',
    zIndex: 10,
  },
  loginQuestion: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    color: DropsPalette.textMuted,
  },
  loginLink: {
    fontFamily: Fonts.sans,
    color: DropsPalette.textLight,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.four,
    zIndex: 5,
  },
  avatarCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    position: 'relative',
  },
  waveBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  waveEmoji: {
    fontSize: 22,
  },
  welcomeTextSection: {
    alignItems: 'center',
    marginBottom: Spacing.four,
    zIndex: 5,
  },
  welcomeTitle: {
    fontFamily: Fonts.sans,
    fontSize: 28,
    fontWeight: '800',
    color: DropsPalette.textLight,
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: Spacing.two,
  },
  welcomeSubtitle: {
    fontFamily: Fonts.sans,
    fontSize: 16,
    color: DropsPalette.textMuted,
    textAlign: 'center',
  },

  // Decorative blobs
  blobGreen: {
    position: 'absolute',
    top: -40,
    left: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#3FB984',
    opacity: 0.8,
  },
  blobPurple: {
    position: 'absolute',
    top: '30%',
    right: -80,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#A855F7',
    opacity: 0.6,
  },
  blobPink: {
    position: 'absolute',
    bottom: 80,
    left: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#EC4899',
    opacity: 0.5,
  },

  // Question Step Styles
  scrollStepContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: 100,
    paddingTop: Spacing.two,
  },
  questionSection: {
    marginBottom: Spacing.four,
  },
  questionTitle: {
    fontFamily: Fonts.sans,
    fontSize: 26,
    fontWeight: '800',
    color: DropsPalette.textLight,
    lineHeight: 34,
    marginBottom: Spacing.one,
  },
  questionSubtitle: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    color: DropsPalette.textMuted,
  },
  optionsList: {
    gap: Spacing.three,
  },
  pillOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: DropsPalette.bgCard,
    borderRadius: 30,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderWidth: 1.5,
    borderColor: 'transparent',
    minHeight: 64,
  },
  pillOptionSelected: {
    backgroundColor: DropsPalette.bgCardSelected,
    borderColor: DropsPalette.borderSelected,
  },
  pillTextContainer: {
    flex: 1,
    paddingRight: Spacing.two,
  },
  pillLabel: {
    fontFamily: Fonts.sans,
    fontSize: 17,
    fontWeight: '700',
    color: DropsPalette.textLight,
  },
  pillSub: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    color: DropsPalette.textMuted,
    marginTop: 2,
  },

  // Sticky Footer
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    backgroundColor: DropsPalette.bgDark,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },

  // Lime Action Button
  limeButton: {
    backgroundColor: DropsPalette.accentLime,
    borderRadius: 30,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: DropsPalette.accentLime,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  limeButtonText: {
    fontFamily: Fonts.sans,
    fontSize: 16,
    fontWeight: '900',
    color: DropsPalette.textDark,
    letterSpacing: 0.8,
  },

  // Summary Step 4 Styles
  readyWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
  },
  readyCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 32,
    padding: Spacing.four,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  sparkleIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(229, 245, 84, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  readyTitle: {
    fontFamily: Fonts.sans,
    fontSize: 22,
    fontWeight: '800',
    color: DropsPalette.textLight,
    textAlign: 'center',
    marginBottom: Spacing.one,
  },
  readySubtitle: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    color: DropsPalette.textMuted,
    textAlign: 'center',
    marginBottom: Spacing.four,
  },
  summaryBox: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 20,
    padding: Spacing.three,
    marginBottom: Spacing.four,
    gap: Spacing.two,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  summaryText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    color: DropsPalette.textLight,
  },
  summaryHighlight: {
    fontFamily: Fonts.sans,
    fontWeight: 'bold',
    color: DropsPalette.accentLime,
  },
});
