import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Animated,
  Easing,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Palette, Fonts, Spacing } from '@/constants/theme';

interface StreakCelebrationModalProps {
  visible: boolean;
  streakDays: number;
  xpEarned: number;
  onClose: () => void;
}

export default function StreakCelebrationModal({
  visible,
  streakDays,
  xpEarned,
  onClose,
}: StreakCelebrationModalProps) {
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  // Infinite pulse on the fire icon
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!visible) return;

    // Card entrance
    Animated.parallel([
      Animated.timing(opacityAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 6, tension: 80, useNativeDriver: true }),
    ]).start();

    // Pulsing fire icon
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    pulse.start();

    return () => {
      pulse.stop();
      scaleAnim.setValue(0.7);
      opacityAnim.setValue(0);
      pulseAnim.setValue(1);
    };
  }, [visible]);

  const milestoneLabel = streakDays >= 30
    ? '🏆 Huyền thoại!'
    : streakDays >= 14
    ? '🔥 Siêu ấn tượng!'
    : streakDays >= 7
    ? '⚡ Tuyệt vời!'
    : '🎉 Chúc mừng!';

  return (
    <Modal visible={visible} transparent animationType="none">
      <Animated.View style={[styles.overlay, { opacity: opacityAnim }]}>
        <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>

          {/* Fire icon with pulse animation */}
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <MaterialCommunityIcons name="fire" size={64} color={Palette.error.text} />
          </Animated.View>

          <Text style={styles.milestoneLabel}>{milestoneLabel}</Text>
          <Text style={styles.streakCount}>{streakDays}</Text>
          <Text style={styles.streakSubtitle}>ngày liên tiếp</Text>
          <Text style={styles.streakMessage}>
            Bạn đã duy trì chuỗi học {streakDays} ngày không gián đoạn. Thật đáng kinh ngạc!
          </Text>

          {/* XP reward badge */}
          <View style={styles.xpBadge}>
            <MaterialCommunityIcons name="lightning-bolt" size={16} color={Palette.warning.text} />
            <Text style={styles.xpBadgeText}>+{xpEarned} XP thưởng</Text>
          </View>

          <TouchableOpacity style={styles.ctaBtn} onPress={onClose}>
            <Text style={styles.ctaBtnText}>TIẾP TỤC HỌC</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.dismissBtn} onPress={onClose}>
            <Text style={styles.dismissText}>Để sau</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(26, 43, 26, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
  },
  card: {
    backgroundColor: Palette.surfaceWhite,
    borderRadius: 32,
    padding: Spacing.five,
    alignItems: 'center',
    width: '100%',
    gap: Spacing.two,
    borderWidth: 1,
    borderColor: Palette.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
  },

  milestoneLabel: {
    fontFamily: Fonts.sans,
    fontSize: 20,
    fontWeight: '900',
    color: Palette.text.primary,
  },
  streakCount: {
    fontFamily: Fonts.sans,
    fontSize: 72,
    fontWeight: '900',
    color: Palette.primary[500],
    lineHeight: 80,
  },
  streakSubtitle: {
    fontFamily: Fonts.sans,
    fontSize: 16,
    fontWeight: '600',
    color: Palette.text.secondary,
    marginTop: -Spacing.two,
  },
  streakMessage: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    color: Palette.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: Spacing.one,
    paddingHorizontal: Spacing.two,
  },

  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Palette.warning.bg,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: Spacing.one,
  },
  xpBadgeText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '800',
    color: Palette.warning.text,
  },

  ctaBtn: {
    width: '100%',
    backgroundColor: Palette.primary[500],
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: Spacing.two,
    shadowColor: Palette.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaBtnText: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },

  dismissBtn: {
    paddingVertical: Spacing.one,
  },
  dismissText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    color: Palette.text.muted,
  },
});
