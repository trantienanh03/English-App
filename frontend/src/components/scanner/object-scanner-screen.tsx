import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Palette, Fonts, Spacing } from '@/constants/theme';
import { VocabularyWord, Lesson } from '@/types';
import DotsLoader from '@/components/ui/dots-loader';
import { mockScannerPresets } from '@/data/mock-data';
import { playAudio, playSoundEffect } from '@/utils/audio';

interface ObjectScannerScreenProps {
  lessons: Lesson[];
  onAddWordToFlashcards: (word: VocabularyWord) => void;
  onAddWordToLesson: (lessonId: string, word: VocabularyWord) => void;
  onAddXp: (amount: number) => void;
  onNavigate: (tab: string) => void;
}

export default function ObjectScannerScreen({
  lessons,
  onAddWordToFlashcards,
  onAddWordToLesson,
  onAddXp,
  onNavigate,
}: ObjectScannerScreenProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState<VocabularyWord | null>(null);
  const [showResultSheet, setShowResultSheet] = useState(false);
  const [showLessonPicker, setShowLessonPicker] = useState(false);
  const [addedToast, setAddedToast] = useState<string | null>(null);

  const [scanIndex, setScanIndex] = useState(0);

  const handleScan = (presetIndex?: number) => {
    if (isScanning) return;
    setIsScanning(true);
    setScannedResult(null);
    setShowResultSheet(false);

    let targetIdx = 0;
    if (presetIndex !== undefined) {
      targetIdx = presetIndex;
    } else {
      targetIdx = scanIndex % mockScannerPresets.length;
      setScanIndex(prev => prev + 1);
    }
    const chosen = { ...mockScannerPresets[targetIdx], captured: true };

    setTimeout(() => {
      setIsScanning(false);
      setScannedResult(chosen);
      setShowResultSheet(true);
      playSoundEffect('correct');
      playAudio(chosen.word);
    }, 1500);
  };

  const handleSaveToDeck = () => {
    if (!scannedResult) return;
    onAddWordToFlashcards(scannedResult);
    onAddXp(15);
    playSoundEffect('success');

    setAddedToast(`Đã thêm "${scannedResult.word}" (+15 XP)`);
    setTimeout(() => setAddedToast(null), 3000);
    setShowResultSheet(false);
  };

  const handleAddToLesson = (lessonId: string) => {
    if (!scannedResult) return;
    onAddWordToLesson(lessonId, scannedResult);
    setShowLessonPicker(false);
    setShowResultSheet(false);
    setAddedToast(`Đã thêm vào bài học!`);
    setTimeout(() => setAddedToast(null), 3000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* CAMERA VIEWFINDER HEADER */}
        <View style={styles.topHeader}>
          <View style={styles.headerTitleRow}>
            <MaterialCommunityIcons name="camera-iris" size={24} color={Palette.primary[300]} />
            <Text style={styles.headerTitle}>AI Object Scanner</Text>
          </View>
          <Text style={styles.headerSubtitle}>Hướng ống kính vào vật thể xung quanh để học từ vựng</Text>
        </View>

        {/* TOAST NOTIFICATION */}
        {addedToast && (
          <View style={styles.toastBox}>
            <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
            <Text style={styles.toastText}>{addedToast}</Text>
          </View>
        )}

        {/* VIEWFINDER FRAME */}
        <View style={styles.viewfinder}>
          {/* Simulated Camera Feed Image or Dark Space */}
          <View style={styles.cameraBackground}>
            <MaterialCommunityIcons name="cube-scan" size={80} color="rgba(255, 255, 255, 0.15)" />
          </View>

          {/* Scanner Target Frame */}
          <View style={styles.targetFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />

            {isScanning ? (
              <View style={styles.scanningIndicator}>
                <DotsLoader color={Palette.primary[300]} size={14} gap={10} />
                <Text style={styles.scanningText}>Đang nhận diện vật thể AI...</Text>
              </View>
            ) : (
              <View style={styles.targetCenter}>
                <Feather name="aperture" size={32} color="rgba(255,255,255,0.6)" />
                <Text style={styles.targetHint}>Đặt vật thể vào trung tâm khung hình</Text>
              </View>
            )}
          </View>
        </View>

        {/* PRESET OBJECT CHIPS BAR */}
        <View style={styles.presetBar}>
          <Text style={styles.presetTitle}>Vật thể quét nhanh thử nghiệm:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.presetScroll}>
            {mockScannerPresets.map((item, idx) => (
              <TouchableOpacity
                key={item.id}
                style={styles.presetChip}
                onPress={() => handleScan(idx)}
              >
                <Text style={styles.presetChipText}>📷 {item.word}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* SCAN BUTTON */}
        <TouchableOpacity style={styles.scanButton} onPress={() => handleScan()} disabled={isScanning}>
          <MaterialCommunityIcons name="camera" size={24} color="#FFFFFF" />
          <Text style={styles.scanButtonText}>{isScanning ? 'ĐANG QUÉT...' : 'QUÉT VẬT THỂ'}</Text>
        </TouchableOpacity>

        {/* RESULT MODAL SHEET */}
        <Modal visible={showResultSheet} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              <View style={styles.sheetHandle} />

              {scannedResult && (
                <View style={styles.sheetContent}>
                  <View style={styles.resultHeader}>
                    <Image source={{ uri: scannedResult.imageUrl }} style={styles.resultImage} />
                    <View style={{ flex: 1 }}>
                      <View style={styles.wordRow}>
                        <Text style={styles.resultWord}>{scannedResult.word}</Text>
                        <View style={styles.posChip}>
                          <Text style={styles.posText}>{scannedResult.pos}</Text>
                        </View>
                      </View>

                      <View style={styles.phoneticRow}>
                        <Text style={styles.phoneticText}>{scannedResult.phonetic}</Text>
                        <TouchableOpacity onPress={() => playAudio(scannedResult.word)}>
                          <Feather name="volume-2" size={18} color={Palette.primary[500]} />
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.resultVn}>🇻🇳 {scannedResult.vn}</Text>
                    </View>

                    <TouchableOpacity onPress={() => setShowResultSheet(false)}>
                      <Feather name="x" size={20} color={Palette.text.muted} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.sentenceBox}>
                    <Text style={styles.sentenceLabel}>Ví dụ sử dụng câu:</Text>
                    <Text style={styles.sentenceEn}>“{scannedResult.sentence}”</Text>
                  </View>

                  {/* ACTION BUTTONS */}
                  <View style={styles.actionRow}>
                    <TouchableOpacity style={styles.saveDeckBtn} onPress={handleSaveToDeck}>
                      <Ionicons name="add-circle" size={20} color="#FFFFFF" />
                      <Text style={styles.saveDeckBtnText}>LƯU VÀO SỔ TỪ (+15 XP)</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.lessonPickerBtn} onPress={() => setShowLessonPicker(true)}>
                      <Feather name="folder-plus" size={18} color={Palette.primary[500]} />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </View>
        </Modal>

        {/* LESSON PICKER MODAL */}
        <Modal visible={showLessonPicker} transparent animationType="fade">
          <View style={styles.modalOverlayCenter}>
            <View style={styles.lessonPickerCard}>
              <Text style={styles.pickerTitle}>Thêm vào bài học</Text>
              <Text style={styles.pickerSub}>Chọn chủ đề bài học để đưa từ này vào:</Text>

              {lessons.map(lesson => (
                <TouchableOpacity
                  key={lesson.id}
                  style={styles.lessonItem}
                  onPress={() => handleAddToLesson(lesson.id)}
                >
                  <Text style={styles.lessonItemIcon}>{lesson.icon}</Text>
                  <Text style={styles.lessonItemName}>{lesson.name}</Text>
                  <Feather name="plus" size={16} color={Palette.primary[500]} />
                </TouchableOpacity>
              ))}

              <TouchableOpacity style={styles.closePickerBtn} onPress={() => setShowLessonPicker(false)}>
                <Text style={styles.closePickerBtnText}>Đóng</Text>
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
    backgroundColor: Palette.canvasDark,
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: 100,
  },

  // Header
  topHeader: {
    marginBottom: Spacing.three,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontFamily: Fonts.sans,
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: '#A3B8A3',
    marginTop: 2,
  },

  // Toast
  toastBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Palette.primary[500],
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    marginBottom: Spacing.two,
  },
  toastText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Viewfinder
  viewfinder: {
    flex: 1,
    backgroundColor: '#0F1A0F',
    borderRadius: 24,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cameraBackground: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetFrame: {
    width: 220,
    height: 220,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: Palette.primary[300],
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  scanningIndicator: {
    alignItems: 'center',
    gap: Spacing.two,
  },
  scanningText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '700',
    color: Palette.primary[300],
  },
  targetCenter: {
    alignItems: 'center',
    gap: Spacing.one,
  },
  targetHint: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },

  // Preset Bar
  presetBar: {
    marginVertical: Spacing.three,
  },
  presetTitle: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    color: '#A3B8A3',
    marginBottom: 6,
  },
  presetScroll: {
    gap: 8,
  },
  presetChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  presetChipText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // Scan Button
  scanButton: {
    backgroundColor: Palette.primary[500],
    height: 52,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  scanButtonText: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },

  // Modal Sheet
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Palette.surfaceWhite,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: Spacing.four,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: Palette.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.three,
  },
  sheetContent: {
    gap: Spacing.three,
  },
  resultHeader: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  resultImage: {
    width: 70,
    height: 70,
    borderRadius: 16,
  },
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resultWord: {
    fontFamily: Fonts.sans,
    fontSize: 20,
    fontWeight: '900',
    color: Palette.text.primary,
  },
  posChip: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  posText: {
    fontFamily: Fonts.sans,
    fontSize: 10,
    fontWeight: '800',
    color: '#D97706',
  },
  phoneticRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  phoneticText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    color: Palette.text.ipa,
  },
  resultVn: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '700',
    color: Palette.text.primary,
    marginTop: 4,
  },
  sentenceBox: {
    backgroundColor: Palette.canvas,
    padding: Spacing.three,
    borderRadius: 14,
  },
  sentenceLabel: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    color: Palette.text.muted,
  },
  sentenceEn: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '600',
    color: Palette.text.primary,
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  saveDeckBtn: {
    flex: 1,
    backgroundColor: Palette.primary[500],
    height: 48,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  saveDeckBtnText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  lessonPickerBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Palette.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Lesson Picker Modal
  modalOverlayCenter: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
  },
  lessonPickerCard: {
    backgroundColor: Palette.surfaceWhite,
    borderRadius: 24,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  pickerTitle: {
    fontFamily: Fonts.sans,
    fontSize: 18,
    fontWeight: '800',
    color: Palette.text.primary,
  },
  pickerSub: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Palette.text.secondary,
    marginBottom: Spacing.one,
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    backgroundColor: Palette.canvas,
    borderRadius: 14,
    gap: Spacing.two,
  },
  lessonItemIcon: {
    fontSize: 20,
  },
  lessonItemName: {
    flex: 1,
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '700',
    color: Palette.text.primary,
  },
  closePickerBtn: {
    alignItems: 'center',
    paddingVertical: Spacing.two,
    marginTop: Spacing.one,
  },
  closePickerBtnText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '700',
    color: Palette.text.muted,
  },
});
