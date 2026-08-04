export interface VocabularyWord {
  id: string;
  word: string;
  phonetic: string;
  vn: string;
  pos: 'Noun' | 'Verb' | 'Adjective' | 'Adverb' | string;
  sentence: string;
  sentenceVn?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  imageUrl?: string;
  captured?: boolean; // scanned via object scanner
}

export interface Lesson {
  id: string;
  name: string;
  description: string;
  difficulty: 'Sơ cấp' | 'Trung cấp' | 'Cao cấp';
  category: string;
  icon: string;
  wordCount: number;
  progress: number; // 0 to 100%
  words: VocabularyWord[];
}

export interface UserProgress {
  streak: number;
  xp: number;
  level: number;
  nextLevelXp: number;
  weeklyXp: { day: string; xp: number; active: boolean }[];
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'fill-blank';
  question: string;
  options?: string[];
  answer: string;
  vnHint: string;
  audioUrl?: string;
}

export interface AppUser {
  name: string;
  email: string;
  avatar?: string;
  provider: 'google' | 'password';
  createdAt: string;
}

export interface OnboardingData {
  level: string;
  goals: string[];
  dailyTime: string;
}