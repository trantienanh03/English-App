import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Feather, AntDesign, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { Spacing } from '@/constants/theme';

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
              <Text style={styles.greetingSubtitle}>Let's keep your streak alive today.</Text>
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
                <Feather name="book-open" size={20} color="#1D7DF0" />
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
              <View style={[styles.courseIcon, { backgroundColor: '#E0F2FE' }]}>
                <Feather name="compass" size={24} color="#0284C7" />
              </View>
              <View style={styles.courseDetails}>
                <Text style={styles.courseTitle}>Giao tiếp cơ bản</Text>
                <Text style={styles.courseDesc}>15 bài học • 35 từ vựng</Text>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: '80%' }]} />
                </View>
              </View>
              <Feather name="chevron-right" size={20} color="#94A3B8" />
            </View>

            <View style={styles.courseItem}>
              <View style={[styles.courseIcon, { backgroundColor: '#DCFCE7' }]}>
                <Feather name="briefcase" size={24} color="#16A34A" />
              </View>
              <View style={styles.courseDetails}>
                <Text style={styles.courseTitle}>Tiếng Anh Công sở</Text>
                <Text style={styles.courseDesc}>24 bài học • 80 từ vựng</Text>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: '40%' }]} />
                </View>
              </View>
              <Feather name="chevron-right" size={20} color="#94A3B8" />
            </View>

            <View style={styles.courseItem}>
              <View style={[styles.courseIcon, { backgroundColor: '#FEE2E2' }]}>
                <Feather name="plane" size={24} color="#DC2626" />
              </View>
              <View style={styles.courseDetails}>
                <Text style={styles.courseTitle}>Du lịch bụi</Text>
                <Text style={styles.courseDesc}>10 bài học • 25 từ vựng</Text>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: '10%' }]} />
                </View>
              </View>
              <Feather name="chevron-right" size={20} color="#94A3B8" />
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
                  <ActivityIndicator size="large" color="#10B981" />
                  <Text style={styles.scanningText}>Đang nhận dạng vật thể bằng AI...</Text>
                </View>
              )}

              {scanState === 'success' && scannedResult && (
                <View style={styles.scanSuccessContainer}>
                  <MaterialCommunityIcons name={scannedResult.icon as any} size={72} color="#1D7DF0" />
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
              <Feather name="home" size={20} color={activeTab === 'home' ? '#1D7DF0' : '#64748B'} />
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
              <Feather name="book" size={20} color={activeTab === 'learn' ? '#1D7DF0' : '#64748B'} />
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
                color={activeTab === 'scan' ? '#1D7DF0' : '#10B981'} 
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
              <MaterialCommunityIcons name="card-multiple-outline" size={20} color={activeTab === 'cards' ? '#1D7DF0' : '#64748B'} />
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
              <Feather name="user" size={20} color={activeTab === 'profile' ? '#1D7DF0' : '#64748B'} />
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
    backgroundColor: '#F8FAFC',
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
    borderColor: '#E2E8F0',
    marginRight: Spacing.two,
  },
  appName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1D7DF0',
  },
  xpStreakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: Spacing.three,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  xpText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#475569',
  },
  badgeDivider: {
    fontSize: 13,
    color: '#94A3B8',
    marginHorizontal: Spacing.one,
  },
  streakText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#475569',
    marginRight: 2,
  },
  fireIcon: {
    marginTop: -2,
  },
  greetingSection: {
    marginBottom: Spacing.four,
  },
  greetingTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: Spacing.one,
  },
  greetingSubtitle: {
    fontSize: 15,
    color: '#64748B',
  },
  dailyGoalCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: Spacing.four,
    shadowColor: '#0F172A',
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: Spacing.one,
  },
  goalSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: Spacing.three,
  },
  continueButton: {
    backgroundColor: '#1D7DF0',
    borderRadius: 14,
    paddingHorizontal: Spacing.three,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  continueButtonText: {
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
    borderColor: '#E2E8F0',
    borderTopColor: '#0F172A',
    borderRightColor: '#0F172A',
    borderLeftColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1D7DF0',
  },
  sectionHeader: {
    marginBottom: Spacing.three,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  contentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#0F172A',
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
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeTextEasy: {
    color: '#15803D',
    fontSize: 11,
    fontWeight: 'bold',
  },
  badgeMedium: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeTextMedium: {
    color: '#B45309',
    fontSize: 11,
    fontWeight: 'bold',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#64748B',
  },
  grammarCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: Spacing.three,
    shadowColor: '#0F172A',
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
    backgroundColor: '#EFF6FF',
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  badgeHard: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeTextHard: {
    color: '#B91C1C',
    fontSize: 10,
    fontWeight: 'bold',
  },
  grammarSubtitle: {
    fontSize: 13,
    color: '#64748B',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    height: 72,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.two,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
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
    backgroundColor: '#EFF6FF',
  },
  tabLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 2,
  },
  tabLabelActive: {
    fontSize: 12,
    color: '#1D7DF0',
    fontWeight: 'bold',
    marginLeft: 6,
  },
  tabItemActive: {
    flex: 1.3, // Give more room for the expanded pill style active item
  },
  scanTabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    top: -12, // Rise above slightly
    width: 68,
  },
  scanFab: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#DCFCE7',
    borderWidth: 2,
    borderColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  scanFabActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#1D7DF0',
    shadowColor: '#1D7DF0',
  },
  scanLabel: {
    fontSize: 10,
    color: '#10B981',
    fontWeight: 'bold',
    marginTop: 4,
  },
  scanLabelActive: {
    color: '#1D7DF0',
  },

  // Learn tab styling
  placeholderHeader: {
    marginTop: Spacing.two,
    marginBottom: Spacing.four,
  },
  placeholderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  placeholderSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  courseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: Spacing.three,
    marginBottom: Spacing.three,
    shadowColor: '#0F172A',
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 2,
  },
  courseDesc: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 6,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10B981',
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  scannerSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  viewfinderContainer: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#334155',
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
    borderColor: '#10B981',
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
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: Spacing.two,
  },
  scanningIndicatorContainer: {
    alignItems: 'center',
  },
  scanningText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: Spacing.three,
    fontWeight: '500',
  },
  scanSuccessContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: Spacing.four,
    alignItems: 'center',
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  scanResultWord: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
    marginTop: Spacing.two,
  },
  scanResultIpa: {
    fontSize: 15,
    color: '#1D7DF0',
    fontWeight: '500',
    marginTop: 2,
  },
  scanResultDef: {
    fontSize: 16,
    color: '#475569',
    marginTop: Spacing.one,
    textAlign: 'center',
  },
  scanActionsRow: {
    flexDirection: 'row',
    marginTop: Spacing.four,
    gap: Spacing.two,
  },
  addToCardsBtn: {
    backgroundColor: '#1D7DF0',
    borderRadius: 12,
    paddingHorizontal: Spacing.three,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  addToCardsBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  scanAgainBtn: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: Spacing.three,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  scanAgainBtnText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: 'bold',
  },
  scanTipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: Spacing.three,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginTop: Spacing.three,
  },
  scanTipText: {
    flex: 1,
    fontSize: 12,
    color: '#B45309',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#F59E0B',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.01,
    shadowRadius: 6,
    elevation: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F59E0B',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  practiceBtn: {
    backgroundColor: '#1D7DF0',
    borderRadius: 16,
    height: 52,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.five,
    shadowColor: '#1D7DF0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  practiceBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  cardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: Spacing.three,
    marginBottom: Spacing.two,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardItemWord: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  cardItemIpa: {
    fontSize: 12,
    color: '#1D7DF0',
    marginVertical: 1,
  },
  cardItemDef: {
    fontSize: 13,
    color: '#64748B',
  },
  cardItemBadgeGreen: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  cardItemBadgeTextGreen: {
    color: '#16A34A',
    fontSize: 11,
    fontWeight: 'bold',
  },
  cardItemBadgeOrange: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  cardItemBadgeTextOrange: {
    color: '#D97706',
    fontSize: 11,
    fontWeight: 'bold',
  },

  // Profile screen styling
  profileHeaderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: Spacing.four,
    alignItems: 'center',
    shadowColor: '#0F172A',
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
    borderColor: '#EFF6FF',
    marginBottom: Spacing.three,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  profileEmail: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  profileStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    marginTop: Spacing.four,
    paddingTop: Spacing.three,
  },
  profileStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  profileStatVal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1D7DF0',
  },
  profileStatLbl: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  settingsGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: Spacing.one,
    shadowColor: '#0F172A',
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
    borderBottomColor: '#F8FAFC',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
  },
  logoutBtn: {
    flexDirection: 'row',
    backgroundColor: '#FEE2E2',
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  logoutBtnText: {
    color: '#EF4444',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
