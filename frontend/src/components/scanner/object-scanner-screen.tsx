import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  Animated,
  Platform,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Palette } from '@/constants/theme';
import { VocabularyWord, Lesson } from '@/types';
import DotsLoader from '@/components/ui/dots-loader';
import { playAudio, playSoundEffect } from '@/utils/audio';
import { api } from '@/services/api';
import BoundingBoxOverlay, { BoundingBoxItem } from './bounding-box-overlay';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ObjectScannerScreenProps {
  lessons: Lesson[];
  onAddWordToFlashcards: (word: VocabularyWord) => void;
  onAddWordToLesson: (lessonId: string, word: VocabularyWord) => void;
  onAddXp?: (amount: number) => void;
  onNavigate: (tab: string) => void;
}

export default function ObjectScannerScreen({
  lessons,
  onAddWordToFlashcards,
  onAddWordToLesson,
  onNavigate,
}: ObjectScannerScreenProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number }>({ width: 1920, height: 1080 });
  const [detections, setDetections] = useState<BoundingBoxItem[]>([]);
  const [selectedBox, setSelectedBox] = useState<BoundingBoxItem | null>(null);
  const [scannedResult, setScannedResult] = useState<VocabularyWord | null>(null);
  const [showResultSheet, setShowResultSheet] = useState(false);
  const [addedToast, setAddedToast] = useState<string | null>(null);

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

  const handleCameraCapture = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Cần quyền Camera', 'Vui lòng cấp quyền camera trong cài đặt thiết bị.');
        return;
      }
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: false,
    });
    if (!result.canceled && result.assets[0]) {
      await processScan(result.assets[0].uri);
    }
  };

  const handleGalleryPick = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Cần quyền Thư viện', 'Vui lòng cấp quyền truy cập ảnh trong cài đặt.');
        return;
      }
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: false,
    });
    if (!result.canceled && result.assets[0]) {
      await processScan(result.assets[0].uri);
    }
  };

  const processScan = async (fileUri: string) => {
    if (isScanning) return;
    setIsScanning(true);
    setSelectedImageUri(fileUri);
    setDetections([]);
    setSelectedBox(null);
    setScannedResult(null);
    setShowResultSheet(false);
    startPulse();

    try {
      const response = await api.scanImage(fileUri);

      if (!response || !response.predictions || response.predictions.length === 0) {
        Alert.alert('Không nhận diện được', 'Không tìm thấy vật thể hợp lệ trong ảnh. Hãy thử ảnh khác.');
        return;
      }

      const imgW = response.imageWidth || 1920;
      const imgH = response.imageHeight || 1080;
      setImageDimensions({ width: imgW, height: imgH });

      const parsedDetections: BoundingBoxItem[] = response.predictions.map((p: any) => ({
        label: p.label,
        confidence: p.confidence || 0.85,
        box: p.box,
        wordData: p.wordData ? {
          id: String(p.wordData.id || Date.now()),
          word: p.wordData.enWord || p.label,
          phonetic: p.wordData.phonetic || '',
          vn: p.wordData.translation || p.label,
          pos: p.wordData.pos || 'Noun',
          sentence: p.wordData.exampleEn || `I see a ${p.label}.`,
          sentenceVn: p.wordData.exampleVn || `Tôi thấy một ${p.label}.`,
          difficulty: 'easy',
          imageUrl: p.wordData.imageUrl || fileUri,
        } : undefined,
      }));

      setDetections(parsedDetections);
      playSoundEffect('correct');

      if (parsedDetections.length > 0) {
        handleSelectBox(parsedDetections[0]);
      }
    } catch (err: any) {
      console.warn('Scan processing error:', err);
      Alert.alert('Lỗi nhận diện', 'Không thể kết nối tới dịch vụ AI Scanner. Vui lòng kiểm tra lại kết nối mạng.');
    } finally {
      setIsScanning(false);
      stopPulse();
    }
  };

  const handleSelectBox = (item: BoundingBoxItem) => {
    setSelectedBox(item);
    let word: VocabularyWord;
    if (item.wordData) {
      word = item.wordData;
    } else {
      word = {
        id: `word_${item.label}`,
        word: item.label,
        pos: 'Noun',
        phonetic: `/${item.label}/`,
        vn: item.label,
        sentence: `This is a ${item.label}.`,
        sentenceVn: `Đó là một ${item.label}.`,
        difficulty: 'easy',
      };
    }
    setScannedResult(word);
    setShowResultSheet(true);
    playAudio(word.word);
  };

  const handleSaveToDeck = () => {
    if (!scannedResult) return;
    onAddWordToFlashcards(scannedResult);
    playSoundEffect('success');
    showToast(`Đã lưu "${scannedResult.word}" vào sổ từ!`);
    setShowResultSheet(false);
  };

  const showToast = (msg: string) => {
    setAddedToast(msg);
    setTimeout(() => setAddedToast(null), 3000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* TOP HEADER */}
        <View style={styles.topHeader}>
          <View style={styles.headerTitleRow}>
            <Feather name="aperture" size={22} color={Palette.primary[300]} />
            <Text style={styles.headerTitle}>AI Object Scanner</Text>
          </View>
          <Text style={styles.headerSubtitle}>
            Chụp hoặc chọn ảnh để nhận diện đa vật thể & học từ vựng trực quan
          </Text>
        </View>

        {/* TOAST */}
        {addedToast && (
          <View style={styles.toastBox}>
            <Feather name="check-circle" size={18} color="#FFFFFF" />
            <Text style={styles.toastText}>{addedToast}</Text>
          </View>
        )}

        {/* CAMERA / VIEWFINDER STAGE */}
        <View style={styles.viewfinderContainer}>
          {selectedImageUri ? (
            <View style={styles.imageWrapper}>
              <Image source={{ uri: selectedImageUri }} style={styles.previewImage} resizeMode="contain" />
              {detections.length > 0 && (
                <BoundingBoxOverlay
                  imageWidth={imageDimensions.width}
                  imageHeight={imageDimensions.height}
                  detections={detections}
                  selectedLabel={selectedBox?.label}
                  onSelectBox={handleSelectBox}
                />
              )}
            </View>
          ) : (
            <Animated.View style={[styles.viewfinder, { transform: [{ scale: pulseAnim }] }]}>
              <Feather name="camera" size={56} color="#818CF8" />
              <Text style={styles.viewfinderText}>Chưa có hình ảnh</Text>
              <Text style={styles.viewfinderSubText}>Bấm nút bên dưới để Chụp hoặc Chọn ảnh</Text>
            </Animated.View>
          )}

          {isScanning && (
            <View style={styles.scanningOverlay}>
              <DotsLoader color="#FFFFFF" size={14} gap={10} />
              <Text style={styles.scanningText}>AI đang phân tích đa vật thể...</Text>
            </View>
          )}
        </View>

        {/* ACTION BUTTONS BAR */}
        <View style={styles.controlsBar}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleCameraCapture} disabled={isScanning}>
            <Feather name="camera" size={20} color="#FFFFFF" />
            <Text style={styles.actionBtnText}>Chụp ảnh</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionBtn, styles.galleryBtn]} onPress={handleGalleryPick} disabled={isScanning}>
            <Feather name="image" size={20} color="#4F46E5" />
            <Text style={[styles.actionBtnText, styles.galleryBtnText]}>Thư viện</Text>
          </TouchableOpacity>
        </View>

        {/* WORD DETAIL BOTTOM SHEET */}
        <Modal visible={showResultSheet} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.sheetContainer}>
              <View style={styles.sheetHeader}>
                <View style={styles.sheetHandle} />
                <TouchableOpacity style={styles.closeBtn} onPress={() => setShowResultSheet(false)}>
                  <Feather name="x" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              {scannedResult && (
                <ScrollView contentContainerStyle={styles.sheetContent}>
                  <View style={styles.wordHeaderRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.wordTitle}>{scannedResult.word}</Text>
                      <Text style={styles.wordPhonetic}>{scannedResult.phonetic}</Text>
                    </View>
                    <TouchableOpacity style={styles.audioBtn} onPress={() => playAudio(scannedResult.word)}>
                      <Feather name="volume-2" size={22} color="#4F46E5" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.posTag}>
                    <Text style={styles.posTagText}>{scannedResult.pos || 'Noun'}</Text>
                  </View>

                  <View style={styles.vnBox}>
                    <Text style={styles.vnTitle}>Nghĩa tiếng Việt:</Text>
                    <Text style={styles.vnText}>🇻🇳 {scannedResult.vn}</Text>
                  </View>

                  {scannedResult.sentence && (
                    <View style={styles.sentenceBox}>
                      <Text style={styles.sentenceTitle}>Ví dụ câu Anh-Việt:</Text>
                      <Text style={styles.sentenceEn}>“{scannedResult.sentence}”</Text>
                      {scannedResult.sentenceVn && (
                        <Text style={styles.sentenceVn}>“{scannedResult.sentenceVn}”</Text>
                      )}
                    </View>
                  )}

                  <TouchableOpacity style={styles.saveFlashcardBtn} onPress={handleSaveToDeck}>
                    <Feather name="bookmark" size={18} color="#FFFFFF" />
                    <Text style={styles.saveFlashcardText}>Lưu vào Sổ từ Flashcard</Text>
                  </TouchableOpacity>
                </ScrollView>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0F172A' },
  container: { flex: 1 },

  topHeader: { padding: 16, borderBottomWidth: 1, borderColor: '#1E293B' },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  headerSubtitle: { fontSize: 12, color: '#94A3B8', marginTop: 4 },

  toastBox: {
    position: 'absolute',
    top: 70,
    left: 20,
    right: 20,
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 10,
    zIndex: 99,
  },
  toastText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },

  viewfinderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', margin: 16 },
  imageWrapper: { width: '100%', height: '100%', borderRadius: 16, overflow: 'hidden' },
  previewImage: { width: '100%', height: '100%' },

  viewfinder: {
    width: '100%',
    height: '100%',
    borderWidth: 2,
    borderColor: '#312E81',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1B4B',
    padding: 20,
  },
  viewfinderText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginTop: 12 },
  viewfinderSubText: { color: '#818CF8', fontSize: 12, textAlign: 'center', marginTop: 4 },

  scanningOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    gap: 12,
  },
  scanningText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },

  controlsBar: { flexDirection: 'row', padding: 16, gap: 12 },
  actionBtn: {
    flex: 1,
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 12,
  },
  actionBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  galleryBtn: { backgroundColor: '#FFFFFF' },
  galleryBtnText: { color: '#4F46E5' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheetContainer: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '75%' },
  sheetHeader: { alignItems: 'center', paddingVertical: 12 },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#CBD5E1' },
  closeBtn: { position: 'absolute', right: 16, top: 12 },

  sheetContent: { padding: 20, gap: 12 },
  wordHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  wordTitle: { fontSize: 24, fontWeight: '800', color: '#1E293B' },
  wordPhonetic: { fontSize: 14, color: '#64748B', fontStyle: 'italic', marginTop: 2 },
  audioBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center' },
  posTag: { alignSelf: 'flex-start', backgroundColor: '#EEF2FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  posTagText: { color: '#4F46E5', fontSize: 12, fontWeight: '700' },

  vnBox: { backgroundColor: '#F8FAFC', padding: 12, borderRadius: 10 },
  vnTitle: { fontSize: 12, color: '#64748B' },
  vnText: { fontSize: 16, fontWeight: '700', color: '#10B981', marginTop: 2 },

  sentenceBox: { backgroundColor: '#F8FAFC', padding: 12, borderRadius: 10, gap: 4 },
  sentenceTitle: { fontSize: 12, color: '#64748B' },
  sentenceEn: { fontSize: 14, color: '#1E293B', fontStyle: 'italic' },
  sentenceVn: { fontSize: 13, color: '#64748B', fontStyle: 'italic' },

  saveFlashcardBtn: {
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 12,
    marginTop: 8,
  },
  saveFlashcardText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
});
