import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { VocabularyWord } from '@/types';

export interface BoundingBoxItem {
  label: string;
  confidence: number;
  box: { x1: number; y1: number; x2: number; y2: number };
  wordData?: VocabularyWord;
}

interface Props {
  imageWidth: number;
  imageHeight: number;
  detections: BoundingBoxItem[];
  selectedLabel?: string | null;
  onSelectBox: (item: BoundingBoxItem) => void;
}

export const BoundingBoxOverlay: React.FC<Props> = ({
  imageWidth,
  imageHeight,
  detections,
  selectedLabel,
  onSelectBox,
}) => {
  if (!detections || detections.length === 0) return null;

  const windowWidth = Dimensions.get('window').width - 32;
  const scaleX = windowWidth / (imageWidth || 640);
  const scaleY = scaleX;

  return (
    <View style={styles.container}>
      {detections.map((item, idx) => {
        const isSelected = selectedLabel === item.label;
        const left = item.box.x1 * scaleX;
        const top = item.box.y1 * scaleY;
        const width = (item.box.x2 - item.box.x1) * scaleX;
        const height = (item.box.y2 - item.box.y1) * scaleY;

        return (
          <TouchableOpacity
            key={`box_${idx}`}
            activeOpacity={0.7}
            onPress={() => onSelectBox(item)}
            style={[
              styles.box,
              {
                left,
                top,
                width: Math.max(width, 40),
                height: Math.max(height, 30),
                borderColor: isSelected ? '#F59E0B' : '#10B981',
                backgroundColor: isSelected ? 'rgba(245, 158, 11, 0.25)' : 'rgba(16, 185, 129, 0.15)',
              },
            ]}
          >
            <View style={[styles.labelBadge, { backgroundColor: isSelected ? '#F59E0B' : '#10B981' }]}>
              <Text style={styles.labelText}>{item.label}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
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
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
});

export default BoundingBoxOverlay;
