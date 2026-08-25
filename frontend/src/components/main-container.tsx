import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Palette, Fonts, Spacing } from '@/constants/theme';
import { Lesson, VocabularyWord } from '@/types';
import { api, ReviewRating, UserProfileDto } from '@/services/api';
import * as Notifications from 'expo-notifications';

import AdminNavigator from './admin/admin-navigator';
import DashboardScreen from './dashboard/dashboard-screen';
import FlashcardDeckScreen from './flashcards/flashcard-deck-screen';
import ObjectScannerScreen from './scanner/object-scanner-screen';
import LessonGridScreen from './lessons/lesson-grid-screen';
import LessonDetailScreen from './lessons/lesson-detail-screen';
import PracticeQuizScreen from './quiz/practice-quiz-screen';
import ProfileScreen from './profile/profile-screen';
import SearchScreen from './ui/search-screen';

interface MainContainerProps {
  userName: string;
  userEmail: string;
  onLogout: () => void;
}

type Tab = 'home' | 'learn' | 'scan' | 'cards' | 'profile';

export default function MainContainer({ userName, userEmail, onLogout }: MainContainerProps) {
  const insets = useSafeAreaInsets();
  const [profile, setProfile] = useState<UserProfileDto | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [allWords, setAllWords] = useState<VocabularyWord[]>([]);
  const [savedWords, setSavedWords] = useState<VocabularyWord[]>([]);
  const [dueWords, setDueWords] = useState<VocabularyWord[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [me, words, cards, due, lessonData] = await Promise.all([
        api.fetchMe(), api.fetchAllWords(), api.fetchFlashcards(), api.fetchFlashcards(true), api.fetchLessons(),
      ]);
      setProfile(me);
      setAllWords(words);
      setSavedWords(cards);
      setDueWords(due);
      setLessons(lessonData);
    } catch (error) {
      console.error('loadData error details:', error);
      const message = error instanceof Error && error.message === 'NETWORK_UNAVAILABLE'
        ? 'Không thể kết nối máy chủ. Kiểm tra mạng rồi thử lại.'
        : 'Không thể tải dữ liệu học tập. Vui lòng thử lại.';
      setLoadError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => void loadData(), 0);
    return () => clearTimeout(timer);
  }, [loadData]);

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      if (response.notification.request.content.data?.destination === 'cards') setActiveTab('cards');
    });
    return () => subscription.remove();
  }, []);

  const refreshProfile = useCallback(async () => setProfile(await api.fetchMe()), []);

  const handleSaveWord = useCallback(async (word: VocabularyWord) => {
    if (!/^\d+$/.test(word.id)) throw new Error('VOCABULARY_NOT_MAPPED');
    // Kiểm tra từ đã có trong sổ từ chưa (dựa theo vocabulary id, không phải flashcardId)
    const alreadySaved = savedWords.some(item => item.id === word.id);
    if (alreadySaved) throw new Error('ALREADY_SAVED');
    const saved = await api.saveFlashcard(word.id);
    setSavedWords(previous => [saved, ...previous.filter(item => item.flashcardId !== saved.flashcardId)]);
    setDueWords(previous => previous.some(item => item.flashcardId === saved.flashcardId) ? previous : [saved, ...previous]);
    await refreshProfile();
  }, [refreshProfile, savedWords]);

  const handleReview = useCallback(async (flashcardId: string, rating: ReviewRating) => {
    const updated = await api.reviewFlashcard(flashcardId, rating);
    setSavedWords(previous => previous.map(item => item.flashcardId === flashcardId ? updated : item));
    setDueWords(previous => previous.filter(item => item.flashcardId !== flashcardId));
    await refreshProfile();
  }, [refreshProfile]);

  const handleRemove = useCallback(async (flashcardId: string) => {
    await api.deleteFlashcard(flashcardId);
    setSavedWords(previous => previous.filter(item => item.flashcardId !== flashcardId));
    setDueWords(previous => previous.filter(item => item.flashcardId !== flashcardId));
    await refreshProfile();
  }, [refreshProfile]);

  const handleLessonProgress = useCallback(async (lessonId: string, score: number) => {
    const updated = await api.saveLessonProgress(lessonId, score);
    setLessons(previous => previous.map(lesson => lesson.id === lessonId ? updated : lesson));
    setSelectedLesson(previous => previous?.id === lessonId ? updated : previous);
  }, []);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={Palette.primary[500]} /><Text style={styles.loadingText}>Đang tải dữ liệu...</Text></View>;
  }

  if (loadError || !profile) {
    return (
      <View style={styles.center}>
        <Feather name="wifi-off" size={38} color={Palette.error.text} />
        <Text style={styles.errorText}>{loadError}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => void loadData()}><Text style={styles.retryText}>Thử lại</Text></TouchableOpacity>
        <TouchableOpacity onPress={onLogout}><Text style={styles.logoutText}>Đăng xuất</Text></TouchableOpacity>
      </View>
    );
  }

  if (profile.role === 'ADMIN') return <AdminNavigator adminEmail={userEmail} onLogout={onLogout} />;

  const openLesson = (lessonId: string) => setSelectedLesson(lessons.find(lesson => lesson.id === lessonId) ?? null);
  const startLessonFromSearch = (lessonId: string) => {
    const lesson = lessons.find(item => item.id === lessonId) ?? null;
    setSelectedLesson(lesson);
    setShowQuiz(Boolean(lesson));
  };
  const wordOfTheDay = allWords.length ? allWords[new Date().getDate() % allWords.length] : null;

  const screen = (() => {
    switch (activeTab) {
      case 'home':
        return (
          <DashboardScreen
            userName={profile.displayName || userName}
            userEmail={userEmail}
            wordsSavedCount={profile.wordsSaved}
            wordsLearnedCount={profile.wordsLearned}
            dueCardsCount={profile.dueCards}
            lessons={lessons}
            wordOfTheDay={wordOfTheDay}
            onNavigate={tab => setActiveTab(tab as Tab)}
            onSelectLesson={openLesson}
            onOpenWordDetail={() => setActiveTab('cards')}
            onOpenSearch={() => setShowSearch(true)}
          />
        );
      case 'learn':
        return <LessonGridScreen lessons={lessons} onStartLesson={openLesson} />;
      case 'scan':
        return <ObjectScannerScreen onAddWordToFlashcards={handleSaveWord} />;
      case 'cards':
        return (
          <FlashcardDeckScreen
            words={savedWords}
            dueWords={dueWords}
            onReview={handleReview}
            onRemoveWord={handleRemove}
            onStartQuiz={() => {
              const lesson = selectedLesson ?? lessons[0] ?? null;
              setSelectedLesson(lesson);
              if (lesson) setShowQuiz(true);
            }}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            userName={profile.displayName || userName}
            userEmail={userEmail}
            wordsSavedCount={profile.wordsSaved}
            wordsLearnedCount={profile.wordsLearned}
            dueCardsCount={profile.dueCards}
            onLogout={onLogout}
          />
        );
    }
  })();

  return (
    <View style={styles.container}>
      {screen}
      <View style={[styles.bottomTabContainer, { bottom: insets.bottom > 0 ? insets.bottom + 8 : 16 }]}>
        <View style={styles.floatingTabBar}>
          {([
            ['home', 'home', 'Trang chủ'],
            ['learn', 'book-open', 'Bài học'],
            ['scan', 'camera', 'Quét AI'],
            ['cards', 'layers', 'Sổ từ'],
            ['profile', 'user', 'Cá nhân'],
          ] as const).map(([key, icon, label]) =>
            key === 'scan' ? (
              <TouchableOpacity
                key={key}
                style={styles.scannerTabBtn}
                onPress={() => setActiveTab(key)}
              >
                <Feather name={icon} size={24} color="#FFFFFF" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                key={key}
                style={[styles.tabItem, activeTab === key && styles.tabItemActive]}
                onPress={() => setActiveTab(key)}
              >
                <Feather
                  name={icon}
                  size={20}
                  color={activeTab === key ? Palette.primary[500] : Palette.text.muted}
                />
                <Text style={[styles.tabLabel, activeTab === key && styles.tabLabelActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>
      </View>

      <Modal visible={!!selectedLesson && !showQuiz} animationType="slide">
        {selectedLesson && (
          <LessonDetailScreen
            lesson={selectedLesson}
            onClose={() => setSelectedLesson(null)}
            onStartLesson={() => setShowQuiz(true)}
            onSaveWord={handleSaveWord}
          />
        )}
      </Modal>
      <Modal visible={showQuiz} animationType="slide">
        {selectedLesson && (
          <PracticeQuizScreen
            lessonTitle={selectedLesson.name}
            words={selectedLesson.words}
            onClose={() => setShowQuiz(false)}
            onQuizComplete={score => handleLessonProgress(selectedLesson.id, score)}
          />
        )}
      </Modal>
      <Modal visible={showSearch} animationType="slide">
        <SearchScreen
          words={allWords}
          lessons={lessons}
          onClose={() => setShowSearch(false)}
          onStartLesson={startLessonFromSearch}
          onSaveWord={handleSaveWord}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Palette.canvas },
  center: { flex: 1, backgroundColor: Palette.canvas, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 28 },
  loadingText: { fontFamily: Fonts.sans, fontSize: 14, color: Palette.text.muted },
  errorText: { fontFamily: Fonts.sans, fontSize: 14, color: Palette.text.secondary, textAlign: 'center' },
  retryButton: { backgroundColor: Palette.primary[500], borderRadius: 12, paddingHorizontal: 22, paddingVertical: 11 },
  retryText: { color: '#FFFFFF', fontWeight: '700' },
  logoutText: { color: Palette.error.text, fontWeight: '600' },
  bottomTabContainer: { position: 'absolute', left: 0, right: 0, alignItems: 'center', zIndex: 100 },
  floatingTabBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: Palette.surfaceWhite, borderRadius: 32, paddingHorizontal: Spacing.two, paddingVertical: 6, borderWidth: 1, borderColor: Palette.border, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.1, shadowRadius: 16, elevation: 8, gap: 4 },
  tabItem: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  tabItemActive: { backgroundColor: Palette.primary[100] },
  tabLabel: { fontFamily: Fonts.sans, fontSize: 10, fontWeight: '600', color: Palette.text.muted, marginTop: 2 },
  tabLabelActive: { color: Palette.primary[500], fontWeight: '800' },
  scannerTabBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: Palette.primary[500], justifyContent: 'center', alignItems: 'center', shadowColor: Palette.primary[500], shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 6, marginHorizontal: 4 },
  searchPill: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Palette.surfaceWhite, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 9, marginBottom: 8, borderWidth: 1, borderColor: Palette.border, width: 220 },
  searchPillText: { fontFamily: Fonts.sans, fontSize: 13, color: Palette.text.muted, flex: 1 },
});
