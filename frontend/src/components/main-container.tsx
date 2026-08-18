import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Palette, Fonts, Spacing } from '@/constants/theme';
import { UserProgress, VocabularyWord, Lesson } from '@/types';
import { mockWords, mockLessons, mockUserProgress } from '@/data/mock-data';
import {
  initDatabase,
  getOrCreateDeviceUuid,
  getLocalFlashcards,
  saveLocalFlashcard,
  deleteLocalFlashcard,
  updateFlashcardSM2,
  LocalFlashcard,
} from '@/db/database';
import { triggerBackgroundSync } from '@/services/sync-service';

import DashboardScreen from './dashboard/dashboard-screen';
import FlashcardDeckScreen from './flashcards/flashcard-deck-screen';
import ObjectScannerScreen from './scanner/object-scanner-screen';
import LessonGridScreen from './lessons/lesson-grid-screen';
import LessonDetailScreen from './lessons/lesson-detail-screen';
import PracticeQuizScreen from './quiz/practice-quiz-screen';
import ProfileScreen from './profile/profile-screen';
import SettingsScreen from './profile/settings-screen';
import SearchScreen from './ui/search-screen';
import StreakCelebrationModal from './ui/streak-celebration-modal';

interface MainContainerProps {
  onLogout: () => void;
}

export default function MainContainer({ onLogout }: MainContainerProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'learn' | 'scan' | 'cards' | 'profile'>('home');
  const [showQuizModal, setShowQuizModal] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showStreak, setShowStreak] = useState<boolean>(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  // App State Data — words & lessons start empty and are fetched from API
  const [userProgress, setUserProgress] = useState<UserProgress>(mockUserProgress);
  const [savedWords, setSavedWords] = useState<VocabularyWord[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>(mockLessons);

  // On app mount: restore in-memory flashcards and trigger background sync
  useEffect(() => {
    try {
      initDatabase();
      getOrCreateDeviceUuid();

      const localCards = getLocalFlashcards();
      if (localCards.length > 0) {
        const mapped: VocabularyWord[] = localCards.map((c: LocalFlashcard) => ({
          id: c.id,
          word: c.en_word,
          phonetic: c.phonetic || '',
          vn: c.translation,
          pos: c.pos || 'Noun',
          sentence: c.example_en || '',
          sentenceVn: c.example_vn || '',
          difficulty: c.ease_factor < 2.0 ? 'hard' : c.ease_factor < 2.6 ? 'medium' : 'easy',
          cocoClass: c.coco_class,
        }));
        setSavedWords(mapped);
      }

      // Update wordsLearned to reflect the in-memory flashcard count
      setUserProgress(prev => ({ ...prev, wordsLearned: localCards.length }));

      // Best-effort background sync — skips silently when no network
      triggerBackgroundSync(mockUserProgress);
    } catch (err) {
      console.warn('Database initialization warning:', err);
    }
  }, []);

  // XP Handler
  const handleAddXp = (amount: number) => {
    setUserProgress(prev => {
      const newXp = prev.xp + amount;
      let newLevel = prev.level;
      let newNextXp = prev.nextLevelXp;
      if (newXp >= prev.nextLevelXp) {
        newLevel += 1;
        newNextXp += 300;
      }
      const updated = { ...prev, xp: newXp, level: newLevel, nextLevelXp: newNextXp };
      triggerBackgroundSync(updated);
      return updated;
    });
  };

  // Add Word to Flashcards
  const handleAddWordToFlashcards = (newWord: VocabularyWord) => {
    saveLocalFlashcard(newWord);
    setSavedWords(prev => {
      if (prev.some(w => w.word.toLowerCase() === newWord.word.toLowerCase())) {
        return prev;
      }
      const updated = [newWord, ...prev];
      // Keep wordsLearned in sync with actual in-memory flashcard count
      setUserProgress(p => {
        const next = { ...p, wordsLearned: updated.length };
        triggerBackgroundSync(next);
        return next;
      });
      return updated;
    });
  };

  // Add Word to Lesson
  const handleAddWordToLesson = (lessonId: string, word: VocabularyWord) => {
    setLessons(prev =>
      prev.map(les => {
        if (les.id === lessonId) {
          return {
            ...les,
            words: [word, ...les.words],
            wordCount: les.words.length + 1,
          };
        }
        return les;
      })
    );
  };

  // Difficulty Update
  const handleUpdateWordDifficulty = (id: string, difficulty: 'easy' | 'medium' | 'hard') => {
    updateFlashcardSM2(id, difficulty);
    setSavedWords(prev =>
      prev.map(w => (w.id === id ? { ...w, difficulty } : w))
    );
  };

  // Remove Word
  const handleRemoveWord = (id: string) => {
    deleteLocalFlashcard(id);
    setSavedWords(prev => prev.filter(w => w.id !== id));
  };

  // Start Lesson — opens Lesson Detail instead of jumping to cards tab directly
  const handleStartLesson = (lessonId: string) => {
    const lesson = lessons.find((l) => l.id === lessonId) ?? null;
    setSelectedLesson(lesson);
  };

  const handleAddXpWithStreakCheck = (amount: number) => {
    handleAddXp(amount);
    // Show streak modal after earning XP if streak is a milestone
    const milestones = [3, 7, 14, 30];
    if (milestones.includes(userProgress.streak)) {
      setShowStreak(true);
    }
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return (
          <DashboardScreen
            progress={userProgress}
            lessons={lessons}
            savedWords={savedWords}
            onNavigate={(tab) => setActiveTab(tab as any)}
            onStartLesson={handleStartLesson}
            onStartQuiz={() => setShowQuizModal(true)}
            onLogout={onLogout}
          />
        );
      case 'learn':
        return (
          <LessonGridScreen
            lessons={lessons}
            onStartLesson={handleStartLesson}
          />
        );
      case 'scan':
        return (
          <ObjectScannerScreen
            lessons={lessons}
            onAddWordToFlashcards={handleAddWordToFlashcards}
            onAddWordToLesson={handleAddWordToLesson}
            onAddXp={handleAddXp}
            onNavigate={(tab) => setActiveTab(tab as any)}
          />
        );
      case 'cards':
        return (
          <FlashcardDeckScreen
            words={savedWords}
            onUpdateDifficulty={handleUpdateWordDifficulty}
            onRemoveWord={handleRemoveWord}
            onStartQuiz={() => setShowQuizModal(true)}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            progress={userProgress}
            onLogout={onLogout}
            onOpenSettings={() => setShowSettings(true)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* SCREEN CONTENT */}
      {renderActiveScreen()}

      {/* FLOATING BOTTOM TAB BAR */}
      <View style={styles.bottomTabContainer}>
        {/* Search pill button above the tab bar */}
        <TouchableOpacity style={styles.searchPill} onPress={() => setShowSearch(true)}>
          <Feather name="search" size={15} color={Palette.text.muted} />
          <Text style={styles.searchPillText}>Tìm từ vựng, bài học...</Text>
        </TouchableOpacity>

        <View style={styles.floatingTabBar}>
          {[
            { key: 'home', icon: 'home', label: 'Trang chủ' },
            { key: 'learn', icon: 'book-open', label: 'Bài học' },
            { key: 'scan', icon: 'aperture', label: 'Quét AI', isScanner: true },
            { key: 'cards', icon: 'layers', label: 'Sổ từ' },
            { key: 'profile', icon: 'user', label: 'Cá nhân' },
          ].map(tab => {
            const isActive = activeTab === tab.key;
            if (tab.isScanner) {
              return (
                <TouchableOpacity
                  key={tab.key}
                  style={styles.scannerTabBtn}
                  onPress={() => setActiveTab('scan')}
                >
                  <MaterialCommunityIcons name="camera-iris" size={26} color="#FFFFFF" />
                </TouchableOpacity>
              );
            }

            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tabItem, isActive && styles.tabItemActive]}
                onPress={() => setActiveTab(tab.key as any)}
              >
                <Feather
                  name={tab.icon as any}
                  size={20}
                  color={isActive ? Palette.primary[500] : Palette.text.muted}
                />
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* QUIZ MODAL */}
      <Modal visible={showQuizModal} animationType="slide">
        <PracticeQuizScreen
          onClose={() => setShowQuizModal(false)}
          onAddXp={handleAddXpWithStreakCheck}
        />
      </Modal>

      {/* LESSON DETAIL MODAL */}
      <Modal visible={!!selectedLesson} animationType="slide">
        {selectedLesson && (
          <LessonDetailScreen
            lesson={selectedLesson}
            onClose={() => setSelectedLesson(null)}
            onStartLesson={(id) => {
              setSelectedLesson(null);
              setActiveTab('cards');
            }}
            onSaveWord={handleAddWordToFlashcards}
          />
        )}
      </Modal>

      {/* SEARCH MODAL */}
      <Modal visible={showSearch} animationType="slide">
        <SearchScreen
          words={savedWords}
          lessons={lessons}
          onClose={() => setShowSearch(false)}
          onStartLesson={handleStartLesson}
          onSaveWord={handleAddWordToFlashcards}
        />
      </Modal>

      {/* SETTINGS MODAL */}
      <Modal visible={showSettings} animationType="slide">
        <SettingsScreen
          onClose={() => setShowSettings(false)}
          onLogout={() => {
            setShowSettings(false);
            onLogout();
          }}
        />
      </Modal>

      {/* STREAK CELEBRATION */}
      <StreakCelebrationModal
        visible={showStreak}
        streakDays={userProgress.streak}
        xpEarned={50}
        onClose={() => setShowStreak(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.canvas,
  },
  bottomTabContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  floatingTabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.surfaceWhite,
    borderRadius: 32,
    paddingHorizontal: Spacing.two,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Palette.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    gap: 4,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tabItemActive: {
    backgroundColor: Palette.primary[100],
  },
  tabLabel: {
    fontFamily: Fonts.sans,
    fontSize: 10,
    fontWeight: '600',
    color: Palette.text.muted,
    marginTop: 2,
  },
  tabLabelActive: {
    color: Palette.primary[500],
    fontWeight: '800',
  },
  scannerTabBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Palette.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Palette.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
    marginHorizontal: 4,
  },
  searchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Palette.surfaceWhite,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 9,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Palette.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 4,
    width: 220,
  },
  searchPillText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    color: Palette.text.muted,
    flex: 1,
  },
});
