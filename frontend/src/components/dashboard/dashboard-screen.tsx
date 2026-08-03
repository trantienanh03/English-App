import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Palette, Fonts, Spacing } from '@/constants/theme';

interface DashboardScreenProps {
  onLogout: () => void;
}

export default function DashboardScreen({ onLogout }: DashboardScreenProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'learn' | 'scan' | 'cards' | 'profile'>('home');
  
  // States for scanner simulation
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'success'>('idle');
  const [scannedResult, setScannedResult] = useState<{ word: string; ipa: string; definition: string; icon: string } | null>(null);

  // Simulate AI scanning
  const startScanning = () => {
    setScanState('scanning');
    setScannedResult(null);
    setTimeout(() => {
      const items = [
        { word: 'Laptop', ipa: '/ˈlæptɒp/', definition: 'Máy tính xách tay', icon: 'laptop' },
        { word: 'Coffee Cup', ipa: '/ˈkɒfi kʌp/', definition: 'Tách cà phê', icon: 'cup-water' },
        { word: 'Headphones', ipa: '/ˈhedfəʊnz/', definition: 'Tai nghe', icon: 'headphones' },
        { word: 'Notebook', ipa: '/ˈnəʊtbʊk/', definition: 'Cuốn sổ tay', icon: 'book-open' },
        { word: 'Smartphone', ipa: '/ˈsmɑːtfəʊn/', definition: 'Điện thoại thông minh', icon: 'cellphone' }
      ];
      const randomItem = items[Math.floor(Math.random() * items.length)];
      setScannedResult(randomItem);
      setScanState('success');
    }, 2000);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header Section */}
            <View style={styles.headerRow}>
              <View style={styles.profileSection}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256' }}
                  style={styles.avatar}
                />
                <Text style={styles.appName}>Vocam</Text>
              </View>
              
              <View style={styles.xpStreakBadge}>
                <Text style={styles.xpText}>1,240 XP</Text>
                <Text style={styles.badgeDivider}>•</Text>
                <Text style={styles.streakText}>7</Text>
                <MaterialCommunityIcons name="fire" size={16} color="#EF4444" style={styles.fireIcon} />
              </View>
            </View>

            {/* Greeting */}
            <View style={styles.greetingSection}>
              <Text style={styles.greetingTitle}>Chào buổi sáng!</Text>
              <Text style={styles.greetingSubtitle}>Let&apos;s keep your streak alive today.</Text>
            </View>

            {/* Daily Goal Card */}
            <View style={styles.dailyGoalCard}>
              <View style={styles.goalInfo}>
                <Text style={styles.goalTitle}>Daily Goal</Text>
                <Text style={styles.goalSubtitle}>Complete 2 more lessons</Text>
                <TouchableOpacity style={styles.continueButton} onPress={() => setActiveTab('learn')}>
                  <Text style={styles.continueButtonText}>Continue Learning</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.progressContainer}>
                <View style={styles.progressRingOuter}>
                  <Text style={styles.progressPercentage}>75%</Text>
                </View>
              </View>
            </View>

            {/* Up Next Section */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Up Next</Text>
            </View>

            {/* Vocabulary Card */}
            <View style={styles.contentCard}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1583085204743-af79e5c3e14b?q=80&w=500' }}
                style={styles.cardImage}
              />
              <View style={styles.cardInfo}>
                <View style={styles.cardHeaderRow}>
                  <View style={styles.badgeEasy}>
                    <Text style={styles.badgeTextEasy}>Easy</Text>
                  </View>
                  <Feather name="coffee" size={16} color="#64748B" />
                </View>
                <Text style={styles.cardTitle}>Vocabulary</Text>
                <Text style={styles.cardSubtitle}>Food & Dining</Text>
              </View>
            </View>

            {/* Listening Card */}
            <View style={styles.contentCard}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=500' }}
                style={styles.cardImage}
              />
              <View style={styles.cardInfo}>
                <View style={styles.cardHeaderRow}>
                  <View style={styles.badgeMedium}>
                    <Text style={styles.badgeTextMedium}>Medium</Text>
                  </View>
                  <MaterialCommunityIcons name="airplane" size={16} color="#64748B" />
                </View>
                <Text style={styles.cardTitle}>Listening</Text>
                <Text style={styles.cardSubtitle}>At the Airport</Text>
              </View>
            </View>

            {/* Grammar Card */}
            <View style={styles.grammarCardRow}>
              <View style={styles.grammarIconBox}>
                <Feather name="book-open" size={20} color={Palette.primary[500]} />
              </View>
              <View style={styles.grammarInfo}>
                <View style={styles.grammarHeaderRow}>
                  <Text style={styles.grammarTitle}>Grammar</Text>
                  <View style={styles.badgeHard}>
                    <Text style={styles.badgeTextHard}>Hard</Text>
                  </View>
                </View>
                <Text style={styles.grammarSubtitle}>Simple Past Tense</Text>
              </View>
            </View>

            {/* Extra padding at the bottom to avoid tab overlap */}
            <View style={{ height: 100 }} />
          </ScrollView>
        );

      case 'learn':
        return (
          <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
            <View style={styles.placeholderHeader}>
              <Text style={styles.placeholderTitle}>Khoá học của bạn</Text>
              <Text style={styles.placeholderSubtitle}>Học tiếng Anh theo lộ trình bài bản cùng Vocam</Text>
            </View>

            <View style={styles.courseItem}>
              <View style={[styles.courseIcon, { backgroundColor: Palette.primary[100] }]}>
                <Feather name="compass" size={24} color={Palette.primary[500]} />
              </View>
              <View style={styles.courseDetails}>
                <Text style={styles.courseTitle}>Giao tiếp cơ bản</Text>
                <Text style={styles.courseDesc}>15 bài học • 35 từ vựng</Text>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: '80%' }]} />
                </View>
              </View>
              <Feather name="chevron-right" size={20} color={Palette.text.muted} />
            </View>

            <View style={styles.courseItem}>
              <View style={[styles.courseIcon, { backgroundColor: Palette.secondary[100] }]}>
                <Feather name="briefcase" size={24} color={Palette.secondary[500]} />
              </View>
              <View style={styles.courseDetails}>
                <Text style={styles.courseTitle}>Tiếng Anh Công sở</Text>
                <Text style={styles.courseDesc}>24 bài học • 80 từ vựng</Text>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: '40%' }]} />
                </View>
              </View>
              <Feather name="chevron-right" size={20} color={Palette.text.muted} />
            </View>

            <View style={styles.courseItem}>
              <View style={[styles.courseIcon, { backgroundColor: Palette.error.bg }]}>
                <Feather name="plane" size={24} color={Palette.error.text} />
              </View>
              <View style={styles.courseDetails}>
                <Text style={styles.courseTitle}>Du lịch bụi</Text>
                <Text style={styles.courseDesc}>10 bài học • 25 từ vựng</Text>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: '10%' }]} />
                </View>
              </View>
              <Feather name="chevron-right" size={20} color={Palette.text.muted} />
            </View>

            <View style={{ height: 100 }} />
          </ScrollView>
        );

      case 'scan':
        return (
          <View style={styles.scannerContainer}>
            <View style={styles.scannerHeader}>
              <Text style={styles.scannerTitle}>Nhận diện vật thể</Text>
              <Text style={styles.scannerSubtitle}>Hướng camera vào vật thể để học từ vựng</Text>
            </View>

            <View style={styles.viewfinderContainer}>
              {scanState === 'idle' && (
                <TouchableOpacity style={styles.scanTriggerButton} onPress={startScanning}>
                  <Feather name="camera" size={48} color="#FFFFFF" />
                  <Text style={styles.scanTriggerText}>Bấm để bắt đầu quét</Text>
                </TouchableOpacity>
              )}

              {scanState === 'scanning' && (
                <View style={styles.scanningIndicatorContainer}>
                  <ActivityIndicator size="large" color={Palette.primary[300]} />
                  <Text style={styles.scanningText}>Đang nhận dạng vật thể bằng AI...</Text>
                </View>
              )}

              {scanState === 'success' && scannedResult && (
                <View style={styles.scanSuccessContainer}>
                  <MaterialCommunityIcons name={scannedResult.icon as any} size={72} color={Palette.primary[500]} />
                  <Text style={styles.scanResultWord}>{scannedResult.word}</Text>
                  <Text style={styles.scanResultIpa}>{scannedResult.ipa}</Text>
                  <Text style={styles.scanResultDef}>{scannedResult.definition}</Text>
                  
                  <View style={styles.scanActionsRow}>
                    <TouchableOpacity style={styles.addToCardsBtn} onPress={() => {
                      alert('Đã thêm từ vựng vào kho Flashcard ôn tập!');
                      setScanState('idle');
                    }}>
                      <Feather name="plus" size={16} color="#FFF" style={{ marginRight: 6 }} />
                      <Text style={styles.addToCardsBtnText}>Lưu Flashcard</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.scanAgainBtn} onPress={() => setScanState('idle')}>
                      <Text style={styles.scanAgainBtnText}>Quét lại</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Decorative borders for viewfinder */}
              <View style={[styles.viewfinderCorner, styles.cornerTL]} />
              <View style={[styles.viewfinderCorner, styles.cornerTR]} />
              <View style={[styles.viewfinderCorner, styles.cornerBL]} />
              <View style={[styles.viewfinderCorner, styles.cornerBR]} />
            </View>

            <View style={styles.scanTipBox}>
              <MaterialCommunityIcons name="lightbulb-on" size={20} color="#F59E0B" />
              <Text style={styles.scanTipText}>
                Hệ thống nhận diện offline (Edge AI) tức thời dưới 50ms chạy trực tiếp trên thiết bị của bạn.
              </Text>
            </View>
          </View>
        );

      case 'cards':
        return (
          <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
            <View style={styles.placeholderHeader}>
              <Text style={styles.placeholderTitle}>Thẻ ghi nhớ (Flashcards)</Text>
              <Text style={styles.placeholderSubtitle}>Luyện tập ghi nhớ ngắt quãng bằng thuật toán SM-2</Text>
            </View>

            <View style={styles.statsSummaryRow}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>Cần ôn tập</Text>
              </View>
              <View style={[styles.statBox, { borderColor: '#10B981' }]}>
                <Text style={[styles.statNumber, { color: '#10B981' }]}>84</Text>
                <Text style={styles.statLabel}>Đã thuộc</Text>
              </View>
              <View style={[styles.statBox, { borderColor: '#1D7DF0' }]}>
                <Text style={[styles.statNumber, { color: '#1D7DF0' }]}>96</Text>
                <Text style={styles.statLabel}>Tổng số thẻ</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.practiceBtn} onPress={() => alert('Bắt đầu ôn tập 12 từ vựng hôm nay!')}>
              <Text style={styles.practiceBtnText}>Luyện tập ngay hôm nay</Text>
              <Feather name="play" size={16} color="#FFF" style={{ marginLeft: 8 }} />
            </TouchableOpacity>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Từ vựng gần đây</Text>
            </View>

            <View style={styles.cardItem}>
              <View>
                <Text style={styles.cardItemWord}>Banh mi</Text>
                <Text style={styles.cardItemIpa}>/ˈbɑːn miː/</Text>
                <Text style={styles.cardItemDef}>Bánh mì Việt Nam</Text>
              </View>
              <View style={styles.cardItemBadgeGreen}>
                <Text style={styles.cardItemBadgeTextGreen}>Đã nhớ</Text>
              </View>
            </View>

            <View style={styles.cardItem}>
              <View>
                <Text style={styles.cardItemWord}>Airport</Text>
                <Text style={styles.cardItemIpa}>/ˈeəpɔːt/</Text>
                <Text style={styles.cardItemDef}>Sân bay</Text>
              </View>
              <View style={styles.cardItemBadgeOrange}>
                <Text style={styles.cardItemBadgeTextOrange}>Đang học</Text>
              </View>
            </View>

            <View style={{ height: 100 }} />
          </ScrollView>
        );

      case 'profile':
        return (
          <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
            <View style={styles.profileHeaderCard}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256' }}
                style={styles.profileAvatarLarge}
              />
              <Text style={styles.profileName}>Nguyễn Anh Thư</Text>
              <Text style={styles.profileEmail}>thu.nguyen@example.com</Text>

              <View style={styles.profileStatsRow}>
                <View style={styles.profileStatItem}>
                  <Text style={styles.profileStatVal}>Level 5</Text>
                  <Text style={styles.profileStatLbl}>Cấp độ học</Text>
                </View>
                <View style={styles.profileStatItem}>
                  <Text style={styles.profileStatVal}>1,240</Text>
                  <Text style={styles.profileStatLbl}>Tổng XP</Text>
                </View>
                <View style={styles.profileStatItem}>
                  <Text style={styles.profileStatVal}>7 Ngày</Text>
                  <Text style={styles.profileStatLbl}>Chuỗi học</Text>
                </View>
              </View>
            </View>

            <View style={styles.settingsGroup}>
              <TouchableOpacity style={styles.settingItem} onPress={() => alert('Tính năng hồ sơ cá nhân')}>
                <View style={styles.settingLeft}>
                  <Feather name="user" size={18} color="#475569" style={{ marginRight: 12 }} />
                  <Text style={styles.settingText}>Thông tin cá nhân</Text>
                </View>
                <Feather name="chevron-right" size={18} color="#94A3B8" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingItem} onPress={() => alert('Cài đặt nhắc nhở học tập')}>
                <View style={styles.settingLeft}>
                  <Feather name="bell" size={18} color="#475569" style={{ marginRight: 12 }} />
                  <Text style={styles.settingText}>Nhắc nhở học tập</Text>
                </View>
                <Feather name="chevron-right" size={18} color="#94A3B8" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingItem} onPress={() => alert('Cài đặt ngôn ngữ hiển thị')}>
                <View style={styles.settingLeft}>
                  <Feather name="globe" size={18} color="#475569" style={{ marginRight: 12 }} />
                  <Text style={styles.settingText}>Ngôn ngữ (Tiếng Việt)</Text>
                </View>
                <Feather name="chevron-right" size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
              <Feather name="log-out" size={18} color="#EF4444" style={{ marginRight: 8 }} />
              <Text style={styles.logoutBtnText}>Đăng xuất tài khoản</Text>
            </TouchableOpacity>

            <View style={{ height: 100 }} />
          </ScrollView>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Content wrapper */}
      <View style={styles.contentWrapper}>
        {renderContent()}
      </View>

      {/* Floating Bottom Tab Bar */}
      <View style={styles.tabBarContainer}>
        <View style={styles.tabBar}>
          {/* Tab: Home */}
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'home' && styles.tabItemActive]}
            onPress={() => setActiveTab('home')}
          >
            <View style={[styles.tabIconWrapper, activeTab === 'home' && styles.tabIconWrapperActive]}>
              <Feather name="home" size={20} color={activeTab === 'home' ? Palette.primary[500] : Palette.text.muted} />
              {activeTab === 'home' && <Text style={styles.tabLabelActive}>Home</Text>}
            </View>
            {activeTab !== 'home' && <Text style={styles.tabLabel}>Home</Text>}
          </TouchableOpacity>

          {/* Tab: Learn */}
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'learn' && styles.tabItemActive]}
            onPress={() => setActiveTab('learn')}
          >
            <View style={[styles.tabIconWrapper, activeTab === 'learn' && styles.tabIconWrapperActive]}>
              <Feather name="book" size={20} color={activeTab === 'learn' ? Palette.primary[500] : Palette.text.muted} />
              {activeTab === 'learn' && <Text style={styles.tabLabelActive}>Learn</Text>}
            </View>
            {activeTab !== 'learn' && <Text style={styles.tabLabel}>Learn</Text>}
          </TouchableOpacity>

          {/* Prominent Tab: SCAN */}
          <TouchableOpacity
            style={styles.scanTabItem}
            onPress={() => setActiveTab('scan')}
          >
            <View style={[
              styles.scanFab,
              activeTab === 'scan' && styles.scanFabActive
            ]}>
              <MaterialCommunityIcons 
                name="line-scan" 
                size={28} 
                color={activeTab === 'scan' ? Palette.primary[500] : Palette.secondary[500]} 
              />
            </View>
            <Text style={[styles.scanLabel, activeTab === 'scan' && styles.scanLabelActive]}>SCAN</Text>
          </TouchableOpacity>

          {/* Tab: Cards */}
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'cards' && styles.tabItemActive]}
            onPress={() => setActiveTab('cards')}
          >
            <View style={[styles.tabIconWrapper, activeTab === 'cards' && styles.tabIconWrapperActive]}>
              <MaterialCommunityIcons name="card-multiple-outline" size={20} color={activeTab === 'cards' ? Palette.primary[500] : Palette.text.muted} />
              {activeTab === 'cards' && <Text style={styles.tabLabelActive}>Cards</Text>}
            </View>
            {activeTab !== 'cards' && <Text style={styles.tabLabel}>Cards</Text>}
          </TouchableOpacity>

          {/* Tab: Profile */}
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'profile' && styles.tabItemActive]}
            onPress={() => setActiveTab('profile')}
          >
            <View style={[styles.tabIconWrapper, activeTab === 'profile' && styles.tabIconWrapperActive]}>
              <Feather name="user" size={20} color={activeTab === 'profile' ? Palette.primary[500] : Palette.text.muted} />
              {activeTab === 'profile' && <Text style={styles.tabLabelActive}>Profile</Text>}
            </View>
            {activeTab !== 'profile' && <Text style={styles.tabLabel}>Profile</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.canvas,
  },
  contentWrapper: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.six,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.four,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1.5,
    borderColor: Palette.border,
    marginRight: Spacing.two,
  },
  appName: {
    fontFamily: Fonts.sans,
    fontSize: 24,
    fontWeight: 'bold',
    color: Palette.primary[500],
  },
  xpStreakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.surface,
    paddingHorizontal: Spacing.three,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  xpText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: 'bold',
    color: Palette.text.primary,
  },
  badgeDivider: {
    fontSize: 13,
    color: Palette.text.muted,
    marginHorizontal: Spacing.one,
  },
  streakText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: 'bold',
    color: Palette.text.primary,
    marginRight: 2,
  },
  fireIcon: {
    marginTop: -2,
  },
  greetingSection: {
    marginBottom: Spacing.four,
  },
  greetingTitle: {
    fontFamily: Fonts.sans,
    fontSize: 28,
    fontWeight: 'bold',
    color: Palette.text.primary,
    marginBottom: Spacing.one,
  },
  greetingSubtitle: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    color: Palette.text.secondary,
  },
  dailyGoalCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Palette.surfaceWhite,
    borderRadius: 24,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: Palette.border,
    shadowColor: Palette.text.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 3,
    marginBottom: Spacing.five,
  },
  goalInfo: {
    flex: 1.2,
    justifyContent: 'center',
  },
  goalTitle: {
    fontFamily: Fonts.sans,
    fontSize: 18,
    fontWeight: 'bold',
    color: Palette.text.primary,
    marginBottom: Spacing.one,
  },
  goalSubtitle: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    color: Palette.text.secondary,
    marginBottom: Spacing.three,
  },
  continueButton: {
    backgroundColor: Palette.primary[500],
    borderRadius: 14,
    paddingHorizontal: Spacing.three,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  continueButtonText: {
    fontFamily: Fonts.sans,
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  progressContainer: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressRingOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 8,
    borderColor: Palette.primary[100],
    borderTopColor: Palette.primary[500],
    borderRightColor: Palette.primary[500],
    borderLeftColor: Palette.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressPercentage: {
    fontFamily: Fonts.sans,
    fontSize: 16,
    fontWeight: 'bold',
    color: Palette.primary[500],
  },
  sectionHeader: {
    marginBottom: Spacing.three,
  },
  sectionTitle: {
    fontFamily: Fonts.sans,
    fontSize: 20,
    fontWeight: 'bold',
    color: Palette.text.primary,
  },
  contentCard: {
    backgroundColor: Palette.surfaceWhite,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Palette.border,
    shadowColor: Palette.text.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 3,
    marginBottom: Spacing.four,
  },
  cardImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  cardInfo: {
    padding: Spacing.three,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.one,
  },
  badgeEasy: {
    backgroundColor: Palette.success.bg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeTextEasy: {
    fontFamily: Fonts.sans,
    color: Palette.success.text,
    fontSize: 11,
    fontWeight: 'bold',
  },
  badgeMedium: {
    backgroundColor: Palette.warning.bg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeTextMedium: {
    fontFamily: Fonts.sans,
    color: Palette.warning.text,
    fontSize: 11,
    fontWeight: 'bold',
  },
  cardTitle: {
    fontFamily: Fonts.sans,
    fontSize: 18,
    fontWeight: 'bold',
    color: Palette.text.primary,
    marginBottom: 2,
  },
  cardSubtitle: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    color: Palette.text.secondary,
  },
  grammarCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.surfaceWhite,
    borderRadius: 20,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: Palette.border,
    shadowColor: Palette.text.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 3,
    marginBottom: Spacing.four,
  },
  grammarIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Palette.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.three,
  },
  grammarInfo: {
    flex: 1,
  },
  grammarHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  grammarTitle: {
    fontFamily: Fonts.sans,
    fontSize: 16,
    fontWeight: 'bold',
    color: Palette.text.primary,
  },
  badgeHard: {
    backgroundColor: Palette.error.bg,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeTextHard: {
    fontFamily: Fonts.sans,
    color: Palette.error.text,
    fontSize: 10,
    fontWeight: 'bold',
  },
  grammarSubtitle: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    color: Palette.text.secondary,
  },

  // Floating Tab Bar Styling
  tabBarContainer: {
    position: 'absolute',
    bottom: Spacing.four,
    left: Spacing.three,
    right: Spacing.three,
    backgroundColor: 'transparent',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Palette.surfaceWhite,
    borderRadius: 24,
    height: 72,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.two,
    shadowColor: Palette.text.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  tabIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
    paddingHorizontal: Spacing.two,
    borderRadius: 18,
    flexDirection: 'row',
  },
  tabIconWrapperActive: {
    backgroundColor: Palette.primary[100],
  },
  tabLabel: {
    fontFamily: Fonts.sans,
    fontSize: 10,
    color: Palette.text.muted,
    fontWeight: '500',
    marginTop: 2,
  },
  tabLabelActive: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Palette.primary[500],
    fontWeight: 'bold',
    marginLeft: 6,
  },
  tabItemActive: {
    flex: 1.3,
  },
  scanTabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    top: -12,
    width: 68,
  },
  scanFab: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: Palette.primary[100],
    borderWidth: 2,
    borderColor: Palette.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Palette.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  scanFabActive: {
    backgroundColor: Palette.secondary[100],
    borderColor: Palette.secondary[500],
    shadowColor: Palette.secondary[500],
  },
  scanLabel: {
    fontFamily: Fonts.sans,
    fontSize: 10,
    color: Palette.primary[500],
    fontWeight: 'bold',
    marginTop: 4,
  },
  scanLabelActive: {
    color: Palette.secondary[500],
  },

  // Learn tab styling
  placeholderHeader: {
    marginTop: Spacing.two,
    marginBottom: Spacing.four,
  },
  placeholderTitle: {
    fontFamily: Fonts.sans,
    fontSize: 24,
    fontWeight: 'bold',
    color: Palette.text.primary,
    marginBottom: 4,
  },
  placeholderSubtitle: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    color: Palette.text.secondary,
  },
  courseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.surfaceWhite,
    borderRadius: 20,
    padding: Spacing.three,
    marginBottom: Spacing.three,
    borderWidth: 1,
    borderColor: Palette.border,
    shadowColor: Palette.text.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  courseIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.three,
  },
  courseDetails: {
    flex: 1,
  },
  courseTitle: {
    fontFamily: Fonts.sans,
    fontSize: 16,
    fontWeight: 'bold',
    color: Palette.text.primary,
    marginBottom: 2,
  },
  courseDesc: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Palette.text.secondary,
    marginBottom: 6,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: Palette.surface,
    borderRadius: 3,
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Palette.primary[500],
    borderRadius: 3,
  },

  // Scanner Simulator Styling
  scannerContainer: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    justifyContent: 'space-between',
    paddingBottom: 110,
  },
  scannerHeader: {
    marginBottom: Spacing.three,
  },
  scannerTitle: {
    fontFamily: Fonts.sans,
    fontSize: 24,
    fontWeight: 'bold',
    color: Palette.text.primary,
    marginBottom: 4,
  },
  scannerSubtitle: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    color: Palette.text.secondary,
  },
  viewfinderContainer: {
    flex: 1,
    backgroundColor: Palette.canvasDark,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: Palette.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    minHeight: 280,
  },
  viewfinderCorner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: Palette.primary[300],
  },
  cornerTL: {
    top: 20,
    left: 20,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  cornerTR: {
    top: 20,
    right: 20,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  cornerBL: {
    bottom: 20,
    left: 20,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  cornerBR: {
    bottom: 20,
    right: 20,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  scanTriggerButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanTriggerText: {
    fontFamily: Fonts.sans,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: Spacing.two,
  },
  scanningIndicatorContainer: {
    alignItems: 'center',
  },
  scanningText: {
    fontFamily: Fonts.sans,
    color: Palette.primary[100],
    fontSize: 14,
    marginTop: Spacing.three,
    fontWeight: '500',
  },
  scanSuccessContainer: {
    backgroundColor: Palette.surfaceWhite,
    borderRadius: 20,
    padding: Spacing.four,
    alignItems: 'center',
    width: '85%',
    borderWidth: 1,
    borderColor: Palette.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  scanResultWord: {
    fontFamily: Fonts.sans,
    fontSize: 24,
    fontWeight: 'bold',
    color: Palette.text.primary,
    marginTop: Spacing.two,
  },
  scanResultIpa: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    color: Palette.text.ipa,
    fontWeight: '500',
    marginTop: 2,
  },
  scanResultDef: {
    fontFamily: Fonts.sans,
    fontSize: 16,
    color: Palette.text.secondary,
    marginTop: Spacing.one,
    textAlign: 'center',
  },
  scanActionsRow: {
    flexDirection: 'row',
    marginTop: Spacing.four,
    gap: Spacing.two,
  },
  addToCardsBtn: {
    backgroundColor: Palette.primary[500],
    borderRadius: 12,
    paddingHorizontal: Spacing.three,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  addToCardsBtnText: {
    fontFamily: Fonts.sans,
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  scanAgainBtn: {
    backgroundColor: Palette.surface,
    borderRadius: 12,
    paddingHorizontal: Spacing.three,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Palette.border,
  },
  scanAgainBtnText: {
    fontFamily: Fonts.sans,
    color: Palette.text.secondary,
    fontSize: 13,
    fontWeight: 'bold',
  },
  scanTipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.warning.bg,
    padding: Spacing.three,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3E5AB',
    marginTop: Spacing.three,
  },
  scanTipText: {
    flex: 1,
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Palette.warning.text,
    marginLeft: 8,
    lineHeight: 16,
  },

  // Cards tab styling
  statsSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.two,
    marginBottom: Spacing.four,
  },
  statBox: {
    flex: 1,
    backgroundColor: Palette.surfaceWhite,
    borderRadius: 16,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Palette.warning.text,
    shadowColor: Palette.text.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.01,
    shadowRadius: 6,
    elevation: 1,
  },
  statNumber: {
    fontFamily: Fonts.sans,
    fontSize: 20,
    fontWeight: 'bold',
    color: Palette.warning.text,
    marginBottom: 2,
  },
  statLabel: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    color: Palette.text.secondary,
    fontWeight: '500',
  },
  practiceBtn: {
    backgroundColor: Palette.primary[500],
    borderRadius: 16,
    height: 52,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.five,
    shadowColor: Palette.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  practiceBtnText: {
    fontFamily: Fonts.sans,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  cardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Palette.surfaceWhite,
    borderRadius: 18,
    padding: Spacing.three,
    marginBottom: Spacing.two,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  cardItemWord: {
    fontFamily: Fonts.sans,
    fontSize: 16,
    fontWeight: 'bold',
    color: Palette.text.primary,
  },
  cardItemIpa: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Palette.text.ipa,
    marginVertical: 1,
  },
  cardItemDef: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    color: Palette.text.secondary,
  },
  cardItemBadgeGreen: {
    backgroundColor: Palette.success.bg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  cardItemBadgeTextGreen: {
    fontFamily: Fonts.sans,
    color: Palette.success.text,
    fontSize: 11,
    fontWeight: 'bold',
  },
  cardItemBadgeOrange: {
    backgroundColor: Palette.warning.bg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  cardItemBadgeTextOrange: {
    fontFamily: Fonts.sans,
    color: Palette.warning.text,
    fontSize: 11,
    fontWeight: 'bold',
  },

  // Profile screen styling
  profileHeaderCard: {
    backgroundColor: Palette.surfaceWhite,
    borderRadius: 24,
    padding: Spacing.four,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Palette.border,
    shadowColor: Palette.text.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.03,
    shadowRadius: 16,
    elevation: 2,
    marginBottom: Spacing.four,
  },
  profileAvatarLarge: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: Palette.primary[100],
    marginBottom: Spacing.three,
  },
  profileName: {
    fontFamily: Fonts.sans,
    fontSize: 20,
    fontWeight: 'bold',
    color: Palette.text.primary,
  },
  profileEmail: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    color: Palette.text.secondary,
    marginTop: 2,
  },
  profileStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: Palette.border,
    marginTop: Spacing.four,
    paddingTop: Spacing.three,
  },
  profileStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  profileStatVal: {
    fontFamily: Fonts.sans,
    fontSize: 16,
    fontWeight: 'bold',
    color: Palette.primary[500],
  },
  profileStatLbl: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    color: Palette.text.muted,
    marginTop: 2,
  },
  settingsGroup: {
    backgroundColor: Palette.surfaceWhite,
    borderRadius: 20,
    paddingVertical: Spacing.one,
    borderWidth: 1,
    borderColor: Palette.border,
    shadowColor: Palette.text.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.01,
    shadowRadius: 10,
    elevation: 1,
    marginBottom: Spacing.four,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '500',
    color: Palette.text.primary,
  },
  logoutBtn: {
    flexDirection: 'row',
    backgroundColor: Palette.error.bg,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  logoutBtnText: {
    fontFamily: Fonts.sans,
    color: Palette.error.text,
    fontSize: 15,
    fontWeight: 'bold',
  },
});
