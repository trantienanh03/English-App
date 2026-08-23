import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, LayoutChangeEvent } from 'react-native';
import { VocabularyWord } from '@/types';
import { getContainedBoxLayout, sortBoxesForHitTesting } from './bounding-box-math';

export { getContainedBoxLayout } from './bounding-box-math';

export interface BoundingBoxItem {
  id: string; // Unique instance identifier e.g. "person_0"
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
  selectedId?: string | null;
  onSelectBox: (item: BoundingBoxItem) => void;
}

export const BoundingBoxOverlay: React.FC<Props> = ({
  imageWidth,
  imageHeight,
  detections,
  selectedLabel,
  selectedId,
  onSelectBox,
}) => {
  const [layout, setLayout] = React.useState<{ width: number; height: number }>({ width: 0, height: 0 });

  if (!detections || detections.length === 0) return null;

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width > 0 && height > 0) {
      setLayout({ width, height });
    }
  };

  const cWidth = layout.width;
  const cHeight = layout.height;
  const imgW = imageWidth || 1920;
  const imgH = imageHeight || 1080;

  // Sort detections by area descending so smallest box is rendered ON TOP and receives taps first!
  const sortedDetections = sortBoxesForHitTesting(detections);

  return (
    <View style={styles.container} onLayout={onLayout} pointerEvents="box-none">
      {cWidth > 0 && cHeight > 0 && sortedDetections.map((item) => {
        const isSelected = selectedId === item.id || selectedLabel === item.label;
        const position = getContainedBoxLayout(cWidth, cHeight, imgW, imgH, item.box);
        if (!position) return null;

        return (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.8}
            hitSlop={8}
            onPress={() => onSelectBox(item)}
            style={[
              styles.box,
              {
                ...position,
                borderColor: isSelected ? '#F59E0B' : '#10B981',
                backgroundColor: isSelected ? 'rgba(245, 158, 11, 0.35)' : 'rgba(16, 185, 129, 0.15)',
                borderWidth: isSelected ? 3 : 2,
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
  },
  box: {
    position: 'absolute',
    borderRadius: 6,
  },
  labelBadge: {
    position: 'absolute',
    top: -22,
    left: -2,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  labelText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});

export default BoundingBoxOverlay;
