import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Palette, Fonts, Spacing } from '@/constants/theme';
import { Lesson } from '@/types';
import { playAudio } from '@/utils/audio';

interface LessonGridScreenProps {
  lessons: Lesson[];
  onStartLesson: (lessonId: string) => void;
}

export default function LessonGridScreen({
  lessons,
  onStartLesson,
}: LessonGridScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('Tất cả');
  const [selectedLessonPreview, setSelectedLessonPreview] = useState<Lesson | null>(null);

  const categories = ['Tất cả', 'Giao tiếp hàng ngày', 'Công sở & Sự nghiệp', 'Học tập & Giáo dục', 'Tâm lý & Đời sống'];
  const difficulties = ['Tất cả', 'Sơ cấp', 'Trung cấp', 'Cao cấp'];

  const filteredLessons = lessons.filter(l => {
    let catMatch = selectedCategory === 'Tất cả' || l.category === selectedCategory;
    let diffMatch = selectedDifficulty === 'Tất cả' || l.difficulty === selectedDifficulty;
    return catMatch && diffMatch;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Khám phá bài học & Chủ đề</Text>
          <Text style={styles.headerSubtitle}>Chọn lộ trình học phù hợp với trình độ và nhu cầu của bạn</Text>
        </View>

        {/* CATEGORIES SCROLL */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll} contentContainerStyle={styles.catContainer}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.catChip, selectedCategory === cat && styles.catChipActive]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.catChipText, selectedCategory === cat && styles.catChipTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* DIFFICULTY SCROLL */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.diffScroll} contentContainerStyle={styles.diffContainer}>
          {difficulties.map(diff => (
            <TouchableOpacity
              key={diff}
              style={[styles.diffChip, selectedDifficulty === diff && styles.diffChipActive]}
              onPress={() => setSelectedDifficulty(diff)}
            >
              <Text style={[styles.diffChipText, selectedDifficulty === diff && styles.diffChipTextActive]}>{diff}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* LESSONS GRID LIST */}
        <ScrollView contentContainerStyle={styles.lessonsList} showsVerticalScrollIndicator={false}>
          {filteredLessons.map(lesson => (
            <TouchableOpacity
              key={lesson.id}
              style={styles.lessonCard}
              onPress={() => setSelectedLessonPreview(lesson)}
            >
              <View style={styles.cardTop}>
                <View style={styles.iconBox}>
                  <Feather name={(lesson.icon as any) || 'book-open'} size={22} color={Palette.primary[500]} />
                </View>

                <View style={{ flex: 1 }}>
                  <View style={styles.titleRow}>
                    <Text style={styles.lessonTitle}>{lesson.name}</Text>
                  </View>
                  <Text style={styles.categoryText}>{lesson.category}</Text>
                </View>

                <View style={styles.difficultyBadge}>
                  <Text style={styles.difficultyBadgeText}>{lesson.difficulty}</Text>
                </View>
              </View>

              <Text style={styles.lessonDesc} numberOfLines={2}>{lesson.description}</Text>

              <View style={styles.cardFooter}>
                <View style={styles.progressRow}>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${lesson.progress}%` }]} />
                  </View>
                  <Text style={styles.progressText}>{lesson.wordCount} từ ({lesson.progress}%)</Text>
                </View>

                <TouchableOpacity
                  style={styles.startBtn}
                  onPress={() => onStartLesson(lesson.id)}
                >
                  <Text style={styles.startBtnText}>VÀO HỌC</Text>
                  <Feather name="chevron-right" size={14} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* LESSON WORDS PREVIEW MODAL */}
        <Modal visible={!!selectedLessonPreview} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              <View style={styles.modalHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Feather name={(selectedLessonPreview?.icon as any) || 'book-open'} size={24} color={Palette.primary[500]} />
                  <Text style={styles.modalTitle}>{selectedLessonPreview?.name}</Text>
                </View>
                <TouchableOpacity onPress={() => setSelectedLessonPreview(null)}>
                  <Feather name="x" size={20} color={Palette.text.muted} />
                </TouchableOpacity>
              </View>
              <Text style={styles.modalSub}>{selectedLessonPreview?.description}</Text>

              <Text style={styles.wordListTitle}>Danh sách từ vựng ({selectedLessonPreview?.words.length} từ):</Text>

              <ScrollView style={styles.previewWordsList} showsVerticalScrollIndicator={false}>
                {selectedLessonPreview?.words.map(word => (
                  <View key={word.id} style={styles.wordPreviewItem}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.previewWordText}>{word.word}</Text>
                      <Text style={styles.previewPhoneticText}>{word.phonetic}</Text>
                      <Text style={styles.previewVnText}>{word.vn}</Text>
                    </View>
                    <TouchableOpacity onPress={() => playAudio(word.word)} style={styles.audioBtn}>
                      <Feather name="volume-2" size={18} color={Palette.primary[500]} />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>

              <TouchableOpacity
                style={styles.modalStartBtn}
                onPress={() => {
                  if (selectedLessonPreview) {
                    const id = selectedLessonPreview.id;
                    setSelectedLessonPreview(null);
                    onStartLesson(id);
                  }
                }}
              >
                <Text style={styles.modalStartBtnText}>BẮT ĐẦU BÀI HỌC NÀY</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Palette.canvas,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    marginBottom: Spacing.two,
  },
  headerTitle: {
    fontFamily: Fonts.sans,
    fontSize: 20,
    fontWeight: '800',
    color: Palette.text.primary,
  },
  headerSubtitle: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Palette.text.secondary,
    marginTop: 2,
  },

  // Category Scroll
  catScroll: {
    maxHeight: 44,
    marginBottom: 8,
  },
  catContainer: {
    gap: Spacing.two,
  },
  catChip: {
    backgroundColor: Palette.surfaceWhite,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  catChipActive: {
    backgroundColor: Palette.primary[500],
    borderColor: Palette.primary[500],
  },
  catChipText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '600',
    color: Palette.text.secondary,
  },
  catChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  // Diff Scroll
  diffScroll: {
    maxHeight: 38,
    marginBottom: Spacing.three,
  },
  diffContainer: {
    gap: 8,
  },
  diffChip: {
    backgroundColor: Palette.canvas,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  diffChipActive: {
    backgroundColor: Palette.primary[100],
  },
  diffChipText: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    fontWeight: '600',
    color: Palette.text.muted,
  },
  diffChipTextActive: {
    color: Palette.primary[500],
    fontWeight: '800',
  },

  // Lessons List
  lessonsList: {
    gap: Spacing.three,
    paddingBottom: 110,
  },
  lessonCard: {
    backgroundColor: Palette.surfaceWhite,
    borderRadius: 20,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: Palette.border,
    gap: 12,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Palette.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  lessonIcon: {
    fontSize: 22,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  lessonTitle: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '800',
    color: Palette.text.primary,
  },
  categoryText: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    color: Palette.text.muted,
    marginTop: 4,
  },
  difficultyBadge: {
    backgroundColor: Palette.secondary[100],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyBadgeText: {
    fontFamily: Fonts.sans,
    fontSize: 10,
    fontWeight: '700',
    color: Palette.secondary[600],
  },
  lessonDesc: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Palette.text.secondary,
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressRow: {
    gap: 4,
  },
  progressTrack: {
    width: 100,
    height: 6,
    backgroundColor: Palette.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Palette.primary[500],
    borderRadius: 3,
  },
  progressText: {
    fontFamily: Fonts.sans,
    fontSize: 10,
    color: Palette.text.muted,
  },
  startBtn: {
    backgroundColor: Palette.primary[500],
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  startBtnText: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Palette.surfaceWhite,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: Spacing.four,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: Fonts.sans,
    fontSize: 18,
    fontWeight: '800',
    color: Palette.text.primary,
  },
  modalSub: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Palette.text.secondary,
    marginTop: 4,
    marginBottom: Spacing.three,
  },
  wordListTitle: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '700',
    color: Palette.text.primary,
    marginBottom: Spacing.two,
  },
  previewWordsList: {
    maxHeight: 250,
    marginBottom: Spacing.three,
  },
  wordPreviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.canvas,
    padding: Spacing.three,
    borderRadius: 14,
    marginBottom: 8,
  },
  previewWordText: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '800',
    color: Palette.text.primary,
  },
  previewPhoneticText: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    color: Palette.text.ipa,
    marginTop: 1,
  },
  previewVnText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Palette.text.secondary,
    marginTop: 2,
  },
  audioBtn: {
    padding: 6,
  },
  modalStartBtn: {
    backgroundColor: Palette.primary[500],
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalStartBtnText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});
