export interface VocabularyWord {
  id: string;
  word: string;
  phonetic: string;
  vn: string;
  pos: 'Noun' | 'Verb' | 'Adjective' | 'Adverb' | string;
  definition?: string;        // English definition (e.g. "A small domesticated furry animal")
  sentence: string;
  sentenceVn?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  imageUrl?: string;
  captured?: boolean; // scanned via object scanner
  detectionLabel?: string;
  flashcardId?: string;
  easinessFactor?: number;
  repetitions?: number;
  intervalDays?: number;
  nextReviewAt?: string;
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

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'fill-blank';
  question: string;
  options?: string[];
  answer: string;
  vnHint?: string;
  audioUrl?: string;
}

export interface AppUser {
  name: string;
  email: string;
  avatar?: string;
  provider: 'google' | 'password';
  createdAt: string;
}
