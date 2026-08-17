import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { MultiDetectedObject, ContextSentence } from '@/services/yolo-detector';

interface Props {
  imageWidth: number;
  imageHeight: number;
  predictions: MultiDetectedObject[];
  selectedObject?: MultiDetectedObject | null;
  contextualSentence?: ContextSentence | null;
  onSelectObject: (obj: MultiDetectedObject) => void;
}

export const BoundingBoxOverlay: React.FC<Props> = ({
  imageWidth,
  imageHeight,
  predictions,
  selectedObject,
  contextualSentence,
  onSelectObject,
}) => {
  if (!predictions || predictions.length === 0) return null;

  const windowWidth = Dimensions.get('window').width - 32; // Container padding
  const scaleX = windowWidth / (imageWidth || 640);
  const scaleY = scaleX; // Preserve aspect ratio

  return (
    <View style={styles.container}>
      {/* Bounding Box Rectangles */}
      {predictions.map((item, idx) => {
        const isSelected = selectedObject?.label === item.label && selectedObject?.box.x1 === item.box.x1;
        const left = item.box.x1 * scaleX;
        const top = item.box.y1 * scaleY;
        const width = (item.box.x2 - item.box.x1) * scaleX;
        const height = (item.box.y2 - item.box.y1) * scaleY;

        return (
          <TouchableOpacity
            key={`box_${idx}`}
            activeOpacity={0.7}
            onPress={() => onSelectObject(item)}
            style={[
              styles.box,
              {
                left,
                top,
                width: Math.max(width, 40),
                height: Math.max(height, 30),
                borderColor: isSelected ? '#ff9800' : '#4caf50',
                backgroundColor: isSelected ? 'rgba(255, 152, 0, 0.25)' : 'rgba(76, 175, 80, 0.15)',
              },
            ]}
          >
            <View style={[styles.labelBadge, { backgroundColor: isSelected ? '#ff9800' : '#4caf50' }]}>
              <Text style={styles.labelText}>
                {item.label} ({(item.confidence * 100).toFixed(0)}%)
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}

      {/* Gemini AI Contextual Sentence Banner */}
      {contextualSentence && (
        <View style={styles.contextBanner}>
          <Text style={styles.contextTitle}>
            ✨ Gemini AI Contextual Sentence ({contextualSentence.source}):
          </Text>
          <Text style={styles.contextEn}>"{contextualSentence.sentence_en}"</Text>
          <Text style={styles.contextVn}>👉 {contextualSentence.sentence_vn}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'box-none',
  },
  box: {
    position: 'absolute',
    borderWidth: 2,
    borderRadius: 6,
  },
  labelBadge: {
    position: 'absolute',
    top: -22,
    left: -2,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  labelText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  contextBanner: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(18, 18, 18, 0.90)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#9c27b0',
  },
  contextTitle: {
    color: '#e1bee7',
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  contextEn: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
    fontStyle: 'italic',
  },
  contextVn: {
    color: '#b0bec5',
    fontSize: 12,
    marginTop: 2,
  },
});
