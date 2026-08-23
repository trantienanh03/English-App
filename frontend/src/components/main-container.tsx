import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Palette, Fonts, Spacing } from '@/constants/theme';
import { UserProgress, VocabularyWord, Lesson, Badge } from '@/types';
import { mockLessons, mockUserProgress } from '@/data/mock-data';
import {
  initDatabase,
  initDeviceUuid,
  getLocalFlashcards,
  saveLocalFlashcard,
  deleteLocalFlashcard,
  updateFlashcardSM2,
  saveUserProgress,
  loadUserProgress,
  saveBadges,
  loadBadges,
  getScanCount,
  saveLessonProgress,
  loadAllLessonProgress,
  cacheWordsBulk,
  LocalFlashcard,
} from '@/db/database';
import { triggerBackgroundSync } from '@/services/sync-service';
import { api } from '@/services/api';

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
  userName: string;
  userEmail: string;
  onLogout: () => void;
}

// ─── Badge auto-unlock rules ─────────────────────────────────────────────────
function computeUnlockedBadges(
  progress: UserProgress,
  scanCount: number,
  quizPerfect: boolean
): Badge[] {
  return progress.badges.map(badge => {
    if (badge.unlocked) return badge; // already unlocked — keep date
    let shouldUnlock = false;
    if (badge.id === 'b1') shouldUnlock = progress.streak >= 3;
    if (badge.id === 'b2') shouldUnlock = scanCount >= 3;
    if (badge.id === 'b3') shouldUnlock = progress.wordsLearned >= 15;
    if (badge.id === 'b4') shouldUnlock = quizPerfect;

    if (shouldUnlock) {
      return { ...badge, unlocked: true, unlockedAt: new Date().toISOString().slice(0, 10) };
    }
    return badge;
  });
}

export default function MainContainer({ userName, userEmail, onLogout }: MainContainerProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'learn' | 'scan' | 'cards' | 'profile'>('home');
  const [showQuizModal, setShowQuizModal] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showStreak, setShowStreak] = useState<boolean>(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const [userProgress, setUserProgress] = useState<UserProgress>(mockUserProgress);
  const [savedWords, setSavedWords] = useState<VocabularyWord[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>(mockLessons);
  const [wordOfTheDay, setWordOfTheDay] = useState<VocabularyWord | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // ─── Init — restore all persisted state from AsyncStorage ─────────────────
  useEffect(() => {
    const init = async () => {
      try {
        initDatabase();
        await initDeviceUuid();

        // 1. Restore user progress
        const savedProgress = await loadUserProgress();
        const savedBadges = await loadBadges();

        let restoredProgress: UserProgress = mockUserProgress;
        if (savedProgress) {
          restoredProgress = {
            ...savedProgress,
            badges: savedBadges ?? savedProgress.badges,
          };
        }

        // 2. Restore flashcards
        const localCards = await getLocalFlashcards();
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
          restoredProgress = { ...restoredProgress, wordsLearned: mapped.length };
        }

        // 3. Restore lesson progress
        const lessonProgressMap = await loadAllLessonProgress();
        if (Object.keys(lessonProgressMap).length > 0) {
          setLessons(prev =>
            prev.map(l => ({
              ...l,
              progress: lessonProgressMap[l.id] ?? l.progress,
            }))
          );
        }

        setUserProgress(restoredProgress);

        // 4. Fetch word dictionary from backend
        try {
          const remoteWords = await api.getAllWords();
          if (remoteWords.length > 0) {
            cacheWordsBulk(remoteWords);
            const randomIdx = Math.floor(Math.random() * remoteWords.length);
            setWordOfTheDay(remoteWords[randomIdx]);
          }
        } catch {
          // Backend unavailable — skip
        }

        // 5. Background sync
        triggerBackgroundSync(restoredProgress, userName || 'Học Viên Vocam');
      } catch (err) {
        console.warn('App initialization warning:', err);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  // ─── Persist progress helper ───────────────────────────────────────────────
  const persistProgress = useCallback(async (progress: UserProgress) => {
    await saveUserProgress(progress);
    await saveBadges(progress.badges);
    triggerBackgroundSync(progress, userName || 'Học Viên Vocam');
  }, [userName]);

  // ─── Badge auto-unlock ─────────────────────────────────────────────────────
  const checkBadges = useCallback(async (
    progress: UserProgress,
    quizPerfect = false
  ): Promise<UserProgress> => {
    const currentScanCount = await getScanCount();
    const updatedBadges = computeUnlockedBadges(progress, currentScanCount, quizPerfect);

    // Check if any new badges were unlocked
    const newlyUnlocked = updatedBadges.filter(
      (b, i) => b.unlocked && !progress.badges[i]?.unlocked
    );

    const updatedProgress = { ...progress, badges: updatedBadges };

    if (newlyUnlocked.length > 0) {
      await saveBadges(updatedBadges);
    }

    return updatedProgress;
  }, []);

  // ─── XP Handler ───────────────────────────────────────────────────────────
  const handleAddXp = useCallback((amount: number) => {
    setUserProgress(prev => {
      const newXp = prev.xp + amount;
      let newLevel = prev.level;
      let newNextXp = prev.nextLevelXp;
      if (newXp >= prev.nextLevelXp) {
        newLevel += 1;
        newNextXp += 300;
      }
      const updated = { ...prev, xp: newXp, level: newLevel, nextLevelXp: newNextXp };
      // Check badges and persist (async, fire-and-forget)
      checkBadges(updated).then(withBadges => {
        setUserProgress(withBadges);
        persistProgress(withBadges);
      });
      return updated;
    });
  }, [checkBadges, persistProgress]);

  // ─── Add Word to Flashcards ───────────────────────────────────────────────
  const handleAddWordToFlashcards = useCallback((newWord: VocabularyWord) => {
    saveLocalFlashcard(newWord).then(async () => {
      setSavedWords(prev => {
        if (prev.some(w => w.word.toLowerCase() === newWord.word.toLowerCase())) {
          return prev;
        }
        const updated = [newWord, ...prev];
        setUserProgress(p => {
          const next = { ...p, wordsLearned: updated.length };
          checkBadges(next).then(withBadges => {
            setUserProgress(withBadges);
            persistProgress(withBadges);
          });
          return next;
        });
        return updated;
      });
    });
  }, [checkBadges, persistProgress]);

  // ─── Add Word to Lesson ────────────────────────────────────────────────────
  const handleAddWordToLesson = useCallback((lessonId: string, word: VocabularyWord) => {
    setLessons(prev =>
      prev.map(les => {
        if (les.id === lessonId) {
          return { ...les, words: [word, ...les.words], wordCount: les.words.length + 1 };
        }
        return les;
      })
    );
  }, []);

  // ─── Lesson Progress Update ────────────────────────────────────────────────
  const handleLessonProgressUpdate = useCallback(async (lessonId: string, progress: number) => {
    await saveLessonProgress(lessonId, progress);
    setLessons(prev =>
      prev.map(l => l.id === lessonId ? { ...l, progress } : l)
    );
  }, []);

  // ─── Difficulty / Remove ──────────────────────────────────────────────────
  const handleUpdateWordDifficulty = useCallback((id: string, difficulty: 'easy' | 'medium' | 'hard') => {
    updateFlashcardSM2(id, difficulty).then(() => {
      setSavedWords(prev => prev.map(w => w.id === id ? { ...w, difficulty } : w));
    });
  }, []);

  const handleRemoveWord = useCallback((id: string) => {
    deleteLocalFlashcard(id).then(() => {
      setSavedWords(prev => {
        const updated = prev.filter(w => w.id !== id);
        setUserProgress(p => {
          const next = { ...p, wordsLearned: updated.length };
          persistProgress(next);
          return next;
        });
        return updated;
      });
    });
  }, [persistProgress]);

  // ─── Lesson Navigation ────────────────────────────────────────────────────
  const handleStartLesson = useCallback((lessonId: string) => {
    const lesson = lessons.find(l => l.id === lessonId) ?? null;
    setSelectedLesson(lesson);
  }, [lessons]);

  // ─── XP with streak check ─────────────────────────────────────────────────
  const handleAddXpWithStreakCheck = useCallback((amount: number, quizPerfect = false) => {
    setUserProgress(prev => {
      const newXp = prev.xp + amount;
      let newLevel = prev.level;
      let newNextXp = prev.nextLevelXp;
      if (newXp >= prev.nextLevelXp) {
        newLevel += 1;
        newNextXp += 300;
      }
      const updated = { ...prev, xp: newXp, level: newLevel, nextLevelXp: newNextXp };

      checkBadges(updated, quizPerfect).then(withBadges => {
        setUserProgress(withBadges);
        persistProgress(withBadges);
      });

      const milestones = [3, 7, 14, 30];
      if (milestones.includes(prev.streak)) {
        setShowStreak(true);
      }
      return updated;
    });
  }, [checkBadges, persistProgress]);

  if (isLoading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color={Palette.primary[500]} />
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return (
          <DashboardScreen
            progress={userProgress}
            lessons={lessons}
            savedWords={savedWords}
            wordOfTheDay={wordOfTheDay}
            userName={userName}
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
            userName={userName}
            userEmail={userEmail}
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
      {renderActiveScreen()}

      {/* FLOATING BOTTOM TAB BAR */}
      <View style={styles.bottomTabContainer}>
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
                  <Feather name="aperture" size={24} color="#FFFFFF" />
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
          onAddXp={(xp) => handleAddXpWithStreakCheck(xp, xp >= 40)}
        />
      </Modal>

      {/* LESSON DETAIL MODAL */}
      <Modal visible={!!selectedLesson} animationType="slide">
        {selectedLesson && (
          <LessonDetailScreen
            lesson={selectedLesson}
            onClose={() => setSelectedLesson(null)}
            onStartLesson={(_id) => {
              setSelectedLesson(null);
              setActiveTab('cards');
            }}
            onSaveWord={handleAddWordToFlashcards}
            onLessonProgressUpdate={handleLessonProgressUpdate}
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
  container: { flex: 1, backgroundColor: Palette.canvas },
  loadingScreen: {
    flex: 1,
    backgroundColor: Palette.canvas,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    color: Palette.text.muted,
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
  tabItemActive: { backgroundColor: Palette.primary[100] },
  tabLabel: {
    fontFamily: Fonts.sans,
    fontSize: 10,
    fontWeight: '600',
    color: Palette.text.muted,
    marginTop: 2,
  },
  tabLabelActive: { color: Palette.primary[500], fontWeight: '800' },
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
