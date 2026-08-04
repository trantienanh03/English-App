import React, { useState } from 'react';
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

import DashboardScreen from './dashboard/dashboard-screen';
import FlashcardDeckScreen from './flashcards/flashcard-deck-screen';
import ObjectScannerScreen from './scanner/object-scanner-screen';
import LessonGridScreen from './lessons/lesson-grid-screen';
import PracticeQuizScreen from './quiz/practice-quiz-screen';
import ProfileScreen from './profile/profile-screen';

interface MainContainerProps {
  onLogout: () => void;
}

export default function MainContainer({ onLogout }: MainContainerProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'learn' | 'scan' | 'cards' | 'profile'>('home');
  const [showQuizModal, setShowQuizModal] = useState<boolean>(false);

  // App State Data
  const [userProgress, setUserProgress] = useState<UserProgress>(mockUserProgress);
  const [savedWords, setSavedWords] = useState<VocabularyWord[]>(mockWords);
  const [lessons, setLessons] = useState<Lesson[]>(mockLessons);

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
      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        nextLevelXp: newNextXp,
      };
    });
  };

  // Add Word to Flashcards
  const handleAddWordToFlashcards = (newWord: VocabularyWord) => {
    setSavedWords(prev => {
      if (prev.some(w => w.word.toLowerCase() === newWord.word.toLowerCase())) {
        return prev;
      }
      return [newWord, ...prev];
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
    setSavedWords(prev =>
      prev.map(w => (w.id === id ? { ...w, difficulty } : w))
    );
  };

  // Remove Word
  const handleRemoveWord = (id: string) => {
    setSavedWords(prev => prev.filter(w => w.id !== id));
  };

  // Start Lesson
  const handleStartLesson = (lessonId: string) => {
    setActiveTab('cards');
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
          onAddXp={handleAddXp}
        />
      </Modal>
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
});
