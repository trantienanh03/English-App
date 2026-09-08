import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Palette, Fonts, Spacing } from '@/constants/theme';

export const DropsPalette = {
  bgDark: Palette.canvasDark,
  bgCard: 'rgba(255, 255, 255, 0.10)',
  bgCardSelected: 'rgba(255, 255, 255, 0.22)',
  accentLime: Palette.primary[300],
  accentLimeDark: Palette.primary[400],
  textDark: Palette.text.primary,
  textLight: '#FFFFFF',
  textMuted: '#A3B8A3',
  borderSelected: Palette.primary[300],
  progressBarBg: 'rgba(255, 255, 255, 0.15)',
};

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const isSmallDevice = SCREEN_HEIGHT < 680;

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
  const [selectedLevel, setSelectedLevel] = useState<string>('Mới bắt đầu cơ bản');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([
    'Nắm vững từ vựng cơ bản',
    'Phản xạ giao tiếp tự nhiên',
  ]);
  const [selectedTime, setSelectedTime] = useState<string>('10 phút / ngày');

  const levelsList = [
    { key: 'Chưa biết gì', label: 'Chưa biết gì', sub: 'Mới bắt đầu từ con số 0' },
    { key: 'Mới bắt đầu cơ bản', label: 'Mới bắt đầu cơ bản', sub: 'Đã biết một số từ vựng đơn giản' },
    { key: 'Đã có nền tảng tốt', label: 'Đã có nền tảng tốt', sub: 'Có thể giao tiếp và đọc hiểu cơ bản' },
  ];

  const goalsList = [
    { key: 'Nắm vững từ vựng cơ bản', label: 'Nắm vững từ vựng cơ bản', sub: 'Xây dựng nền tảng từ vựng vững chắc' },
    { key: 'Giao tiếp với người nước ngoài', label: 'Giao tiếp với người nước ngoài', sub: 'Trò chuyện tự tin và tự nhiên' },
    { key: 'Xem phim không cần phụ đề', label: 'Xem phim không cần phụ đề', sub: 'Thưởng thức phim ảnh & âm nhạc' },
    { key: 'Phục vụ du lịch & khám phá', label: 'Phục vụ du lịch & khám phá', sub: 'Tự tin du lịch nước ngoài' },
    { key: 'Kết nối bạn bè quốc tế', label: 'Kết nối bạn bè quốc tế', sub: 'Giao lưu văn hóa toàn cầu' },
    { key: 'Tiếng Anh đi làm & văn phòng', label: 'Tiếng Anh đi làm & văn phòng', sub: 'Tự tin giao tiếp trong công việc' },
    { key: 'Luyện thi chứng chỉ', label: 'Luyện thi chứng chỉ', sub: 'Ôn thi các bằng cấp tiếng Anh' },
    { key: 'Phản xạ giao tiếp tự nhiên', label: 'Phản xạ giao tiếp tự nhiên', sub: 'Phát âm chuẩn và phản xạ nhanh' },
  ];

  const timeList = [
    { key: '5 phút / ngày', label: '5 phút / ngày', sub: 'Học nhẹ nhàng, duy trì thói quen' },
    { key: '10 phút / ngày', label: '10 phút / ngày', sub: 'Vừa sức & đạt hiệu quả cao nhất' },
    { key: '15+ phút / ngày', label: '15+ phút / ngày', sub: 'Bứt phá tốc độ nâng cao trình độ' },
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
              Đã có tài khoản Vocam?{' '}
              <Text style={styles.loginLink} onPress={onLoginPress}>
                Đăng nhập
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
              <Feather name="user" size={72} color="#FFFFFF" />
            </View>
          </View>

          {/* Main Title & Subtitle */}
          <View style={styles.welcomeTextSection}>
            <Text style={styles.welcomeTitle}>
              Xin chào! Sẵn sàng học{'\n'}tiếng Anh thú vị hơn chưa?
            </Text>
            <Text style={styles.welcomeSubtitle}>Hãy cùng thiết lập lộ trình học dành riêng cho bạn.</Text>
          </View>

          {/* GET STARTED Button */}
          <TouchableOpacity style={styles.limeButton} onPress={() => setStep(1)} activeOpacity={0.85}>
            <Text style={styles.limeButtonText}>BẮT ĐẦU NGAY</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* STEP 1: How is your English? */}
      {step === 1 && (
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scrollStepContent} showsVerticalScrollIndicator={false}>
            <View style={styles.questionSection}>
              <Text style={styles.questionTitle}>Trình độ tiếng Anh của bạn thế nào?</Text>
              <Text style={styles.questionSubtitle}>Lựa chọn mức độ phù hợp nhất với khả năng hiện tại</Text>
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
                      <Feather name="check-circle" size={22} color={DropsPalette.accentLime} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          <View style={styles.stickyFooter}>
            <TouchableOpacity style={styles.limeButton} onPress={() => setStep(2)} activeOpacity={0.85}>
              <Text style={styles.limeButtonText}>TIẾP TỤC</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* STEP 2: What are your goals? */}
      {step === 2 && (
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scrollStepContent} showsVerticalScrollIndicator={false}>
            <View style={styles.questionSection}>
              <Text style={styles.questionTitle}>Mục tiêu học tập của bạn là gì?</Text>
              <Text style={styles.questionSubtitle}>Chọn tất cả những mục tiêu bạn mong muốn đạt được</Text>
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
              activeOpacity={0.85}
            >
              <Text style={styles.limeButtonText}>TIẾP TỤC</Text>
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
                Bạn muốn dành bao nhiêu thời gian học mỗi ngày?
              </Text>
              <Text style={styles.questionSubtitle}>
                Duy trì thói quen hàng ngày để đạt kết quả tốt nhất
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
                      <Feather name="check-circle" size={22} color={DropsPalette.accentLime} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          <View style={styles.stickyFooter}>
            <TouchableOpacity style={styles.limeButton} onPress={() => setStep(4)} activeOpacity={0.85}>
              <Text style={styles.limeButtonText}>TIẾP TỤC</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* STEP 4: Ready Summary & Start */}
      {step === 4 && (
        <ScrollView
          contentContainerStyle={styles.readyScrollContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          <View style={styles.readyCard}>
            <View style={styles.sparkleIconWrapper}>
              <Feather name="star" size={44} color={DropsPalette.accentLime} />
            </View>

            <Text style={styles.readyTitle}>Lộ trình học đã sẵn sàng!</Text>

            <Text style={styles.readySubtitle}>
              Vocam đã cá nhân hóa lộ trình học phù hợp nhất cho bạn.
            </Text>

            <View style={styles.summaryBox}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryText}>
                  Trình độ: <Text style={styles.summaryHighlight}>{selectedLevel}</Text>
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryText}>
                  Mục tiêu: <Text style={styles.summaryHighlight}>{selectedGoals.length} mục tiêu</Text>
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryText}>
                  Thời lượng: <Text style={styles.summaryHighlight}>{selectedTime}</Text>
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.limeButton} onPress={handleNext} activeOpacity={0.85}>
              <Text style={styles.limeButtonText}>BẮT ĐẦU HỌC NGAY</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    paddingTop: Platform.OS === 'android' ? Spacing.four : (isSmallDevice ? Spacing.one : Spacing.two),
    paddingBottom: isSmallDevice ? Spacing.two : Spacing.three,
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
    paddingBottom: isSmallDevice ? Spacing.three : Spacing.five,
    paddingTop: isSmallDevice ? Spacing.two : Spacing.three,
    position: 'relative',
  },
  welcomeTopBar: {
    alignItems: 'flex-end',
    zIndex: 10,
  },
  loginQuestion: {
    fontFamily: Fonts.sans,
    fontSize: isSmallDevice ? 13 : 14,
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
    marginVertical: isSmallDevice ? Spacing.two : Spacing.four,
    zIndex: 5,
  },
  avatarCircle: {
    width: isSmallDevice ? 100 : 140,
    height: isSmallDevice ? 100 : 140,
    borderRadius: isSmallDevice ? 50 : 70,
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
    width: isSmallDevice ? 32 : 44,
    height: isSmallDevice ? 32 : 44,
    borderRadius: isSmallDevice ? 16 : 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  waveEmoji: {
    fontFamily: Platform.OS === 'ios' ? 'Apple Color Emoji' : undefined,
    fontSize: isSmallDevice ? 16 : 22,
  },
  welcomeTextSection: {
    alignItems: 'center',
    marginBottom: isSmallDevice ? Spacing.two : Spacing.four,
    zIndex: 5,
  },
  welcomeTitle: {
    fontFamily: Fonts.sans,
    fontSize: isSmallDevice ? 22 : 28,
    fontWeight: '800',
    color: DropsPalette.textLight,
    textAlign: 'center',
    lineHeight: isSmallDevice ? 30 : 36,
    marginBottom: isSmallDevice ? Spacing.one : Spacing.two,
  },
  welcomeSubtitle: {
    fontFamily: Fonts.sans,
    fontSize: isSmallDevice ? 14 : 16,
    color: DropsPalette.textMuted,
    textAlign: 'center',
  },

  // Decorative blobs
  blobGreen: {
    position: 'absolute',
    top: -40,
    left: -60,
    width: isSmallDevice ? 120 : 180,
    height: isSmallDevice ? 120 : 180,
    borderRadius: isSmallDevice ? 60 : 90,
    backgroundColor: Palette.primary[500],
    opacity: 0.6,
  },
  blobPurple: {
    position: 'absolute',
    top: '30%',
    right: -80,
    width: isSmallDevice ? 150 : 220,
    height: isSmallDevice ? 150 : 220,
    borderRadius: isSmallDevice ? 75 : 110,
    backgroundColor: Palette.secondary[500],
    opacity: 0.5,
  },
  blobPink: {
    position: 'absolute',
    bottom: 80,
    left: -40,
    width: isSmallDevice ? 100 : 140,
    height: isSmallDevice ? 100 : 140,
    borderRadius: isSmallDevice ? 50 : 70,
    backgroundColor: Palette.primary[400],
    opacity: 0.4,
  },

  // Question Step Styles
  scrollStepContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: isSmallDevice ? 80 : 100,
    paddingTop: isSmallDevice ? Spacing.one : Spacing.two,
  },
  questionSection: {
    marginBottom: isSmallDevice ? Spacing.two : Spacing.four,
  },
  questionTitle: {
    fontFamily: Fonts.sans,
    fontSize: isSmallDevice ? 20 : 26,
    fontWeight: '800',
    color: DropsPalette.textLight,
    lineHeight: isSmallDevice ? 28 : 34,
    marginBottom: Spacing.one,
  },
  questionSubtitle: {
    fontFamily: Fonts.sans,
    fontSize: isSmallDevice ? 13 : 14,
    color: DropsPalette.textMuted,
  },
  optionsList: {
    gap: isSmallDevice ? Spacing.two : Spacing.three,
  },
  pillOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: DropsPalette.bgCard,
    borderRadius: 30,
    paddingVertical: isSmallDevice ? Spacing.two : Spacing.three,
    paddingHorizontal: Spacing.four,
    borderWidth: 1.5,
    borderColor: 'transparent',
    minHeight: isSmallDevice ? 52 : 64,
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
    fontSize: isSmallDevice ? 15 : 17,
    fontWeight: '700',
    color: DropsPalette.textLight,
  },
  pillSub: {
    fontFamily: Fonts.sans,
    fontSize: isSmallDevice ? 11 : 13,
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
    paddingVertical: isSmallDevice ? Spacing.three : Spacing.four,
    backgroundColor: DropsPalette.bgDark,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },

  // Lime Action Button
  limeButton: {
    backgroundColor: DropsPalette.accentLime,
    borderRadius: 30,
    height: isSmallDevice ? 48 : 56,
    width: '100%',
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
    fontSize: isSmallDevice ? 15 : 16,
    fontWeight: '900',
    color: DropsPalette.textDark,
    letterSpacing: 0.8,
  },

  // Summary Step 4 Styles
  readyScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: isSmallDevice ? Spacing.four : Spacing.five,
  },
  readyCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 32,
    paddingHorizontal: Spacing.four,
    paddingVertical: isSmallDevice ? Spacing.four : Spacing.five,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.22)',
  },
  sparkleIconWrapper: {
    width: isSmallDevice ? 60 : 80,
    height: isSmallDevice ? 60 : 80,
    borderRadius: isSmallDevice ? 30 : 40,
    backgroundColor: 'rgba(229, 245, 84, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: isSmallDevice ? Spacing.two : Spacing.three,
  },
  readyTitle: {
    fontFamily: Fonts.sans,
    fontSize: isSmallDevice ? 18 : 22,
    fontWeight: '800',
    color: DropsPalette.textLight,
    textAlign: 'center',
    marginBottom: Spacing.one,
  },
  readySubtitle: {
    fontFamily: Fonts.sans,
    fontSize: isSmallDevice ? 12 : 14,
    color: DropsPalette.textMuted,
    textAlign: 'center',
    marginBottom: isSmallDevice ? Spacing.two : Spacing.four,
    lineHeight: isSmallDevice ? 18 : 20,
  },
  summaryBox: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 24,
    padding: isSmallDevice ? Spacing.two : Spacing.three,
    marginBottom: isSmallDevice ? Spacing.three : Spacing.four,
    gap: isSmallDevice ? Spacing.two : Spacing.three,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: isSmallDevice ? Spacing.two : Spacing.three,
  },
  summaryIconBadge: {
    width: isSmallDevice ? 28 : 32,
    height: isSmallDevice ? 28 : 32,
    borderRadius: isSmallDevice ? 14 : 16,
    backgroundColor: 'rgba(229, 245, 84, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryText: {
    fontFamily: Fonts.sans,
    fontSize: isSmallDevice ? 13 : 14,
    color: DropsPalette.textLight,
  },
  summaryHighlight: {
    fontFamily: Fonts.sans,
    fontWeight: 'bold',
    color: DropsPalette.accentLime,
  },
});
