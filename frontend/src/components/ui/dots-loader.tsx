import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet, ViewStyle } from 'react-native';

interface DotsLoaderProps {
  color?: string;
  size?: number;
  gap?: number;
  style?: ViewStyle;
}

// How high each dot bounces up (in px)
const BOUNCE_HEIGHT = 9;
const DOT_DURATION = 340;
const STAGGER_DELAY = 170;

export default function DotsLoader({
  color = '#FFFFFF',
  size = 10,
  gap = 8,
  style,
}: DotsLoaderProps) {
  const dot1Y = useRef(new Animated.Value(0)).current;
  const dot2Y = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const makeBounce = (anim: Animated.Value) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: -BOUNCE_HEIGHT,
            duration: DOT_DURATION,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: DOT_DURATION,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );

    // Start dot2 slightly after dot1 for a staggered wave effect
    const composed = Animated.stagger(STAGGER_DELAY, [
      makeBounce(dot1Y),
      makeBounce(dot2Y),
    ]);
    composed.start();

    return () => composed.stop();
  }, [dot1Y, dot2Y]);

  const dotStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: color,
    marginHorizontal: gap / 2,
  };

  return (
    <View style={[styles.container, style]}>
      <Animated.View style={[dotStyle, { transform: [{ translateY: dot1Y }] }]} />
      <Animated.View style={[dotStyle, { transform: [{ translateY: dot2Y }] }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
