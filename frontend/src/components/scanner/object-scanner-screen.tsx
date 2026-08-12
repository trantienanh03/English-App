import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Palette, Fonts, Spacing } from '@/constants/theme';
import { VocabularyWord, Lesson } from '@/types';
import DotsLoader from '@/components/ui/dots-loader';
import { playAudio, playSoundEffect } from '@/utils/audio';
import { detect, DetectionResult } from '@/services/yolo-detector';
import { api } from '@/services/api';
import { getCachedWordByClass } from '@/db/database';

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
  const [confidence, setConfidence] = useState<number>(0);
  const [showResultSheet, setShowResultSheet] = useState(false);
  const [showLessonPicker, setShowLessonPicker] = useState(false);
  const [addedToast, setAddedToast] = useState<string | null>(null);

  // Pulse animation on viewfinder when scanning
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    ).start();
  };

  const stopPulse = () => {
    pulseAnim.stopAnimation();
    Animated.timing(pulseAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
  };

  /**
   * Main scan handler:
   * 1. Call YOLO detector (mock or real)
   * 2. If word not in local cache, fetch from Spring Boot API
   * 3. Show result bottom sheet
   */
  const handleScan = async (formData?: any) => {
    if (isScanning) return;

    setIsScanning(true);
    setScannedResult(null);
    setShowResultSheet(false);
    startPulse();

    try {
      // Run YOLO inference (Live FastAPI AI Microservice or SQLite fallback)
      const result: DetectionResult | null = await detect(formData);

      if (!result) {
        setIsScanning(false);
        stopPulse();
        return;
      }

      let vocabulary = result.word;

      // If word not in local cache, fetch from Spring Boot backend
      if (!vocabulary) {
        const cached = getCachedWordByClass(result.cocoClass);
        if (cached) {
          vocabulary = cached;
        } else {
          const remote = await api.getWordByClass(result.cocoClass);
          if (remote) {
            vocabulary = remote;
          } else {
            vocabulary = {
              id: `word_${Date.now()}`,
              word: result.cocoClass,
              pos: 'Noun',
              phonetic: `/${result.cocoClass}/`,
              vn: result.cocoClass,
              sentence: `This is a ${result.cocoClass}.`,
              difficulty: 'easy',
            };
          }
        }
      }

      setScannedResult(vocabulary);
      setConfidence(result.confidence);
      setShowResultSheet(true);
      playSoundEffect('correct');
      playAudio(vocabulary.word);
    } catch (err) {
      console.warn('Scan error:', err);
    } finally {
      setIsScanning(false);
      stopPulse();
    }
  };

  const handleSaveToDeck = () => {
    if (!scannedResult) return;
    onAddWordToFlashcards(scannedResult);
    onAddXp(15);
    playSoundEffect('success');
    showToast(`Đã thêm "${scannedResult.word}" vào sổ từ (+15 XP)`);
    setShowResultSheet(false);
  };

  const handleAddToLesson = (lessonId: string) => {
    if (!scannedResult) return;
    onAddWordToLesson(lessonId, scannedResult);
    setShowLessonPicker(false);
    setShowResultSheet(false);
    showToast('Đã thêm vào bài học!');
  };

  const showToast = (msg: string) => {
    setAddedToast(msg);
    setTimeout(() => setAddedToast(null), 3000);
  };

  const confidencePct = Math.round(confidence * 100);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* HEADER */}
        <View style={styles.topHeader}>
          <View style={styles.headerTitleRow}>
            <MaterialCommunityIcons name="camera-iris" size={24} color={Palette.primary[300]} />
            <Text style={styles.headerTitle}>AI Object Scanner</Text>
          </View>
          <Text style={styles.headerSubtitle}>
            Hướng camera vào vật thể để nhận diện từ vựng ngay lập tức
          </Text>
        </View>

        {/* TOAST */}
        {addedToast && (
          <View style={styles.toastBox}>
            <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
            <Text style={styles.toastText}>{addedToast}</Text>
          </View>
        )}

        {/* VIEWFINDER */}
        <Animated.View style={[styles.viewfinder, { transform: [{ scale: pulseAnim }] }]}>
          <View style={styles.cameraBackground}>
            <MaterialCommunityIcons name="cube-scan" size={80} color="rgba(255, 255, 255, 0.12)" />
          </View>

          {/* Corner brackets */}
          <View style={styles.targetFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />

            {isScanning ? (
              <View style={styles.scanningIndicator}>
                <DotsLoader color={Palette.primary[300]} size={14} gap={10} />
                <Text style={styles.scanningText}>Đang nhận diện...</Text>
              </View>
            ) : (
              <View style={styles.targetCenter}>
                <Feather name="aperture" size={32} color="rgba(255,255,255,0.5)" />
                <Text style={styles.targetHint}>Đặt vật thể vào khung hình</Text>
              </View>
            )}
          </View>

          {/* Model info badge */}
          <View style={styles.modelBadge}>
            <MaterialCommunityIcons name="chip" size={12} color={Palette.primary[300]} />
            <Text style={styles.modelBadgeText}>YOLOv8 nano · On-Device</Text>
          </View>
        </Animated.View>

        {/* SCAN BUTTON */}
        <TouchableOpacity
          style={[styles.scanButton, isScanning && styles.scanButtonActive]}
          onPress={handleScan}
          disabled={isScanning}
        >
          <MaterialCommunityIcons
            name={isScanning ? 'progress-clock' : 'camera'}
            size={22}
            color="#FFFFFF"
          />
          <Text style={styles.scanButtonText}>
            {isScanning ? 'ĐANG NHẬN DIỆN...' : 'QUÉT VẬT THỂ'}
          </Text>
        </TouchableOpacity>

        {/* RESULT BOTTOM SHEET */}
        <Modal visible={showResultSheet} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              <View style={styles.sheetHandle} />

              {scannedResult && (
                <View style={styles.sheetContent}>
                  {/* Confidence bar */}
                  <View style={styles.confidenceRow}>
                    <MaterialCommunityIcons name="brain" size={14} color={Palette.text.muted} />
                    <Text style={styles.confidenceLabel}>Độ tin cậy mô hình:</Text>
                    <View style={styles.confidenceBar}>
                      <View style={[styles.confidenceFill, { width: `${confidencePct}%` as any }]} />
                    </View>
                    <Text style={styles.confidencePct}>{confidencePct}%</Text>
                  </View>

                  {/* Word info */}
                  <View style={styles.resultHeader}>
                    <View style={{ flex: 1, gap: 4 }}>
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

                  {/* Example sentence */}
                  {scannedResult.sentence ? (
                    <View style={styles.sentenceBox}>
                      <Text style={styles.sentenceLabel}>Ví dụ:</Text>
                      <Text style={styles.sentenceEn}>"{scannedResult.sentence}"</Text>
                    </View>
                  ) : null}

                  {/* Action buttons */}
                  <View style={styles.actionRow}>
                    <TouchableOpacity style={styles.saveDeckBtn} onPress={handleSaveToDeck}>
                      <Ionicons name="add-circle" size={20} color="#FFFFFF" />
                      <Text style={styles.saveDeckBtnText}>LƯU VÀO SỔ TỪ (+15 XP)</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.lessonPickerBtn}
                      onPress={() => setShowLessonPicker(true)}
                    >
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

              <ScrollView>
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
              </ScrollView>

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
    paddingBottom: 110,
    gap: Spacing.three,
  },

  topHeader: {},
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
    marginTop: 3,
  },

  toastBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Palette.primary[500],
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
  },
  toastText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
  },

  viewfinder: {
    flex: 1,
    backgroundColor: '#0F1A0F',
    borderRadius: 24,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  cameraBackground: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetFrame: {
    width: 220,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: Palette.primary[300],
  },
  topLeft: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3 },
  topRight: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3 },
  bottomLeft: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3 },
  bottomRight: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3 },
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
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
  },
  modelBadge: {
    position: 'absolute',
    bottom: Spacing.two,
    right: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  modelBadgeText: {
    fontFamily: Fonts.sans,
    fontSize: 10,
    color: Palette.primary[300],
    fontWeight: '600',
  },

  scanButton: {
    backgroundColor: Palette.primary[500],
    height: 54,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: Palette.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  scanButtonActive: {
    backgroundColor: Palette.primary[600],
    shadowOpacity: 0.1,
  },
  scanButtonText: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },

  // Result sheet
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
    paddingBottom: 36,
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
  confidenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  confidenceLabel: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    color: Palette.text.muted,
    flexShrink: 0,
  },
  confidenceBar: {
    flex: 1,
    height: 6,
    backgroundColor: Palette.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: Palette.primary[400],
    borderRadius: 3,
  },
  confidencePct: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    fontWeight: '700',
    color: Palette.primary[500],
    flexShrink: 0,
  },
  resultHeader: {
    flexDirection: 'row',
    gap: Spacing.two,
    alignItems: 'flex-start',
  },
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resultWord: {
    fontFamily: Fonts.sans,
    fontSize: 24,
    fontWeight: '900',
    color: Palette.text.primary,
  },
  posChip: {
    backgroundColor: Palette.warning.bg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  posText: {
    fontFamily: Fonts.sans,
    fontSize: 10,
    fontWeight: '800',
    color: Palette.warning.text,
  },
  phoneticRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  phoneticText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    color: Palette.text.ipa,
  },
  resultVn: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '700',
    color: Palette.text.primary,
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
    marginBottom: 2,
  },
  sentenceEn: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '600',
    color: Palette.text.primary,
    fontStyle: 'italic',
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  saveDeckBtn: {
    flex: 1,
    backgroundColor: Palette.primary[500],
    height: 50,
    borderRadius: 16,
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
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: Palette.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Lesson picker
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
    maxHeight: 480,
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
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    backgroundColor: Palette.canvas,
    borderRadius: 14,
    gap: Spacing.two,
    marginBottom: Spacing.one,
  },
  lessonItemIcon: { fontSize: 20 },
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
  },
  closePickerBtnText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '700',
    color: Palette.text.muted,
  },
});
