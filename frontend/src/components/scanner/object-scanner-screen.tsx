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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { CameraView, useCameraPermissions } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Palette } from '@/constants/theme';
import { VocabularyWord } from '@/types';
import DotsLoader from '@/components/ui/dots-loader';
import { playAudio, playSoundEffect } from '@/utils/audio';
import { api } from '@/services/api';
import { BoundingBoxOverlay, BoundingBoxItem } from './bounding-box-overlay';

const translatePos = (pos: string) => {
  const map: Record<string, string> = {
    'noun': 'Danh từ',
    'verb': 'Động từ',
    'adjective': 'Tính từ',
    'adverb': 'Trạng từ',
    'preposition': 'Giới từ',
    'pronoun': 'Đại từ',
    'conjunction': 'Liên từ',
    'interjection': 'Thán từ',
  };
  return map[pos.toLowerCase().trim()] || pos;
};

interface ObjectScannerScreenProps {
  onAddWordToFlashcards: (word: VocabularyWord) => Promise<void>;
}

export default function ObjectScannerScreen({
  onAddWordToFlashcards,
}: ObjectScannerScreenProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number }>({ width: 1920, height: 1080 });
  const [detections, setDetections] = useState<BoundingBoxItem[]>([]);
  const [selectedBox, setSelectedBox] = useState<BoundingBoxItem | null>(null);
  const [scannedResult, setScannedResult] = useState<VocabularyWord | null>(null);
  const [showResultSheet, setShowResultSheet] = useState(false);
  const [addedToast, setAddedToast] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const cameraRef = useRef<any>(null);
  const [showGuide, setShowGuide] = useState(true);

  React.useEffect(() => {
    const checkGuideStatus = async () => {
      try {
        const value = await AsyncStorage.getItem('has_seen_scanner_guide');
        if (value === 'true') {
          setShowGuide(false);
        }
      } catch (err) {
        console.error('AsyncStorage read error:', err);
      }
    };
    checkGuideStatus();
  }, []);

  const handleDismissGuide = async () => {
    setShowGuide(false);
    try {
      await AsyncStorage.setItem('has_seen_scanner_guide', 'true');
    } catch (err) {
      console.error('AsyncStorage write error:', err);
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const handleLiveCapture = async () => {
    if (isScanning) return;
    if (!cameraRef.current) return;
    try {
      setIsScanning(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: false,
      });
      if (photo && photo.uri) {
        await processScan(photo.uri);
      } else {
        setIsScanning(false);
      }
    } catch (err) {
      console.error('Live capture error:', err);
      Alert.alert('Lỗi', 'Không thể chụp ảnh từ camera.');
      setIsScanning(false);
    }
  };

  const handleResetScan = () => {
    setSelectedImageUri(null);
    setDetections([]);
    setSelectedBox(null);
    setScannedResult(null);
    setShowResultSheet(false);
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
      mediaTypes: ['images'],
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

    try {
      const response = await api.scanImage(fileUri);

      if (!response || !response.predictions || response.predictions.length === 0) {
        Alert.alert('Không nhận diện được', 'Không tìm thấy vật thể hợp lệ trong ảnh. Hãy thử ảnh khác.');
        return;
      }

      const imgW = response.imageWidth || 1920;
      const imgH = response.imageHeight || 1080;
      setImageDimensions({ width: imgW, height: imgH });

      const parsedDetections: BoundingBoxItem[] = response.predictions
        .filter((p: any) => p.wordData?.id && p.box)
        .map((p: any, index: number) => ({
        id: `${p.label}_${index}`,
        label: p.label,
        confidence: p.confidence || 0.85,
        box: p.box,
        wordData: p.wordData ? {
          id: String(p.wordData.id),
          word: p.wordData.enWord || p.label,
          phonetic: p.wordData.phonetic || '',
          vn: p.wordData.translation || '',
          pos: p.wordData.pos || 'Noun',
          definition: p.wordData.definition || undefined,
          sentence: p.wordData.exampleEn || '',
          sentenceVn: p.wordData.exampleVn || '',
          difficulty: 'easy',
          imageUrl: p.wordData.imageUrl || undefined,
          detectionLabel: p.wordData.detectionLabel || p.label,
          captured: true,
        } : undefined,
      }));

      setDetections(parsedDetections);
      playSoundEffect('correct');
      if (parsedDetections.length === 0) {
        Alert.alert('Chưa có từ vựng phù hợp', 'Các vật thể phát hiện được chưa ánh xạ tới từ vựng chính thức.');
      }
    } catch (err: any) {
      console.warn('Scan processing error:', err);
      const message = err?.message === 'NETWORK_UNAVAILABLE'
        ? 'Không có kết nối tới máy chủ. Vui lòng kiểm tra mạng và thử lại.'
        : 'Dịch vụ AI đang tạm thời không khả dụng. Vui lòng thử lại sau.';
      Alert.alert('Lỗi nhận diện', message);
    } finally {
      setIsScanning(false);
    }
  };

  const handleSelectBox = (item: BoundingBoxItem) => {
    setSelectedBox(item);
    if (!item.wordData) return;
    const word = item.wordData;
    setScannedResult(word);
    setShowResultSheet(true);
    playAudio(word.word);
  };

  const handleSaveToDeck = async () => {
    if (!scannedResult || isSaving) return;
    setIsSaving(true);
    try {
      await onAddWordToFlashcards(scannedResult);
      playSoundEffect('success');
      showToast(`Đã lưu "${scannedResult.word}" vào sổ từ!`);
      setShowResultSheet(false);
    } catch (err: any) {
      if (err?.message === 'ALREADY_SAVED') {
        showToast(`"${scannedResult.word}" đã có trong sổ từ của bạn.`);
        setShowResultSheet(false);
      } else {
        Alert.alert('Không thể lưu thẻ', 'Không thể lưu từ vựng lúc này. Kiểm tra mạng và thử lại.');
      }
    } finally {
      setIsSaving(false);
    }
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
            <Text style={styles.headerTitle}>Quét vật thể AI</Text>
          </View>
          <Text style={styles.headerSubtitle}>
            Nhận diện đa vật thể & học từ vựng trực quan thông qua hình ảnh
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
            <View style={styles.resultsContainer}>
              {/* Image Preview Area */}
              <View style={styles.imagePreviewWrapper}>
                <Image source={{ uri: selectedImageUri }} style={styles.previewImage} resizeMode="contain" />
                
                {/* Floating Close Button */}
                <TouchableOpacity style={styles.closePreviewBtn} onPress={handleResetScan}>
                  <Feather name="x" size={24} color="#FFFFFF" />
                </TouchableOpacity>

                {detections.length > 0 && (
                  <BoundingBoxOverlay
                    imageWidth={imageDimensions.width}
                    imageHeight={imageDimensions.height}
                    detections={detections}
                    selectedLabel={selectedBox?.label}
                    selectedId={selectedBox?.id}
                    onSelectBox={handleSelectBox}
                  />
                )}
              </View>

              {/* Guide & Object list Area */}
              <View style={styles.resultsInfoPanel}>
                <Text style={styles.guideText}>
                  👉 Chạm vào vật thể trên hình hoặc chọn trong danh sách dưới đây:
                </Text>
                
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.detectedList}
                >
                  {detections.map((item) => {
                    const isSelected = selectedBox?.id === item.id;
                    return (
                      <TouchableOpacity
                        key={item.id}
                        style={[
                          styles.detectedChip,
                          isSelected && styles.detectedChipSelected
                        ]}
                        onPress={() => handleSelectBox(item)}
                      >
                        <Feather 
                          name="tag" 
                          size={14} 
                          color={isSelected ? '#FFFFFF' : '#818CF8'} 
                        />
                        <Text style={[
                          styles.detectedChipText,
                          isSelected && styles.detectedChipTextSelected
                        ]}>
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            </View>
          ) : (
            !permission ? (
              <View style={styles.loadingContainer}>
                <DotsLoader color="#FFFFFF" size={14} gap={10} />
                <Text style={styles.loadingText}>Đang khởi tạo camera...</Text>
              </View>
            ) : !permission.granted ? (
              <View style={styles.permissionContainer}>
                <Feather name="camera-off" size={48} color="#64748B" />
                <Text style={styles.permissionText}>Chưa cấp quyền Camera</Text>
                <Text style={styles.permissionSubText}>Vui lòng cấp quyền truy cập camera để quét vật thể trực tiếp.</Text>
                
                <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
                  <Text style={styles.permissionBtnText}>Cấp quyền truy cập</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.galleryFallbackBtn} onPress={handleGalleryPick}>
                  <Feather name="image" size={18} color="#818CF8" style={{ marginRight: 6 }} />
                  <Text style={styles.galleryFallbackBtnText}>Chọn ảnh từ thư viện</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.cameraWrapper}>
                <CameraView
                  style={styles.cameraView}
                  facing={facing}
                  ref={cameraRef}
                >
                  {/* Instruction Pill */}
                  <View style={styles.instructionPill}>
                    <Text style={styles.instructionText}>Căn giữa vật thể trong khung hình</Text>
                  </View>

                  {/* Camera Instruction Box */}
                  {showGuide && (
                    <View style={styles.cameraInstructions}>
                      <Feather name="info" size={16} color="#818CF8" style={{ marginRight: 4 }} />
                      <Text style={styles.cameraInstructionsText}>
                        Hướng camera vào các vật thể và nhấn chụp. Nhấn vào vật thể hoặc danh sách sau khi quét để học từ vựng.
                      </Text>
                      <TouchableOpacity style={styles.closeGuideBtn} onPress={handleDismissGuide}>
                        <Feather name="x" size={16} color="#94A3B8" />
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* Shutter controls bar */}
                  <View style={styles.shutterControlsBar}>
                    <TouchableOpacity style={styles.sideControlBtn} onPress={toggleCameraFacing} disabled={isScanning}>
                      <Feather name="refresh-cw" size={20} color="#FFFFFF" />
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.shutterOuterRing} 
                      onPress={handleLiveCapture} 
                      disabled={isScanning}
                      activeOpacity={0.8}
                    >
                      <View style={[styles.shutterInnerCircle, isScanning && { backgroundColor: '#94A3B8', transform: [{ scale: 0.85 }] }]} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.sideControlBtn} onPress={handleGalleryPick} disabled={isScanning}>
                      <Feather name="image" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                </CameraView>
              </View>
            )
          )}

          {isScanning && (
            <View style={styles.scanningOverlay}>
              <DotsLoader color="#FFFFFF" size={14} gap={10} />
              <Text style={styles.scanningText}>AI đang phân tích đa vật thể...</Text>
            </View>
          )}
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
                  {/* IMAGE — hiển thị nếu có imageUrl */}
                  {scannedResult.imageUrl ? (
                    <Image
                      source={{ uri: scannedResult.imageUrl }}
                      style={styles.wordImage}
                      resizeMode="cover"
                    />
                  ) : null}

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
                    <Text style={styles.posTagText}>{translatePos(scannedResult.pos || 'Noun')}</Text>
                  </View>

                  <View style={styles.vnBox}>
                    <Text style={styles.vnTitle}>Nghĩa tiếng Việt:</Text>
                    <Text style={styles.vnText}>{scannedResult.vn}</Text>
                  </View>

                  {/* ENGLISH DEFINITION */}
                  {scannedResult.definition ? (
                    <View style={styles.definitionBox}>
                       <Text style={styles.definitionTitle}>Định nghĩa tiếng Anh:</Text>
                       <Text style={styles.definitionText}>{scannedResult.definition}</Text>
                    </View>
                  ) : null}

                  {scannedResult.sentence && (
                    <View style={styles.sentenceBox}>
                      <Text style={styles.sentenceTitle}>Ví dụ câu Anh-Việt:</Text>
                      <Text style={styles.sentenceEn}>“{scannedResult.sentence}”</Text>
                      {scannedResult.sentenceVn && (
                        <Text style={styles.sentenceVn}>“{scannedResult.sentenceVn}”</Text>
                      )}
                    </View>
                  )}

                  <TouchableOpacity disabled={isSaving} style={[styles.saveFlashcardBtn, isSaving && { opacity: 0.6 }]} onPress={() => void handleSaveToDeck()}>
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
  container: { flex: 1, paddingBottom: 80 },

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

  viewfinderContainer: { flex: 1, margin: 16, alignSelf: 'stretch' },
  imageWrapper: { flex: 1, width: '100%', borderRadius: 16, overflow: 'hidden' },
  previewImage: { width: '100%', height: '100%' },

  closePreviewBtn: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  cameraWrapper: {
    flex: 1,
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  cameraView: {
    flex: 1,
    width: '100%',
  },
  instructionPill: {
    position: 'absolute',
    top: 24,
    alignSelf: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 10,
  },
  instructionText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  resultsContainer: {
    flex: 1,
    width: '100%',
  },
  imagePreviewWrapper: {
    flex: 1,
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#000000',
  },
  resultsInfoPanel: {
    padding: 12,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    marginTop: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  guideText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  detectedList: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  detectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#475569',
  },
  detectedChipSelected: {
    backgroundColor: '#4F46E5',
    borderColor: '#6366F1',
  },
  detectedChipText: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  detectedChipTextSelected: {
    color: '#FFFFFF',
  },
  cameraInstructions: {
    position: 'absolute',
    bottom: 112,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(129, 140, 248, 0.2)',
  },
  cameraInstructionsText: {
    color: '#E2E8F0',
    fontSize: 12,
    lineHeight: 18,
    flex: 1,
  },
  closeGuideBtn: {
    padding: 4,
    marginLeft: 6,
  },
  shutterControlsBar: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
  },
  shutterOuterRing: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  shutterInnerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },
  sideControlBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '600',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  permissionText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 8,
  },
  permissionSubText: {
    color: '#94A3B8',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
  permissionBtn: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 8,
    width: '100%',
    alignItems: 'center',
  },
  permissionBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  galleryFallbackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#4F46E5',
    borderWidth: 1,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    width: '100%',
    marginTop: 10,
  },
  galleryFallbackBtnText: {
    color: '#818CF8',
    fontWeight: '700',
    fontSize: 14,
  },

  scanningOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    gap: 12,
  },
  scanningText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },

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

  wordImage: { width: '100%', height: 160, borderRadius: 12, marginBottom: 4 },

  definitionBox: { backgroundColor: '#EFF6FF', padding: 12, borderRadius: 10 },
  definitionTitle: { fontSize: 12, color: '#3B82F6', fontWeight: '600', marginBottom: 2 },
  definitionText: { fontSize: 14, color: '#1E3A5F', lineHeight: 20 },

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
