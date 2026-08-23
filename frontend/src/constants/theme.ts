/**
 * VOCAM COLOR PALETTE — React Native / Expo Theme Tokens
 * Synced from: vocam_color_palette.html
 *
 * Usage: import { Palette } from '@/constants/theme';
 *        backgroundColor: Palette.primary[500]
 */

import '@/global.css';
import { Platform } from 'react-native';

export const Palette = {
  // ── Backgrounds & Surfaces ────────────────────────────────
  /** Nền app chính · xanh lá pha xám nhẹ, không gây mỏi mắt */
  canvas: '#F4F6F3',
  /** Nền card & panel · trắng ngà, không chói */
  surface: '#FAFBF9',
  /** Nền Flashcard, modal, bottom sheet */
  surfaceWhite: '#FFFFFF',
  /** Camera view · tối hoàn toàn, không xanh */
  canvasDark: '#1A2B1A',

  // ── Primary — Forest Green (Xanh rừng) ───────────────────
  primary: {
    100: '#E8F2EC',  // Card highlight, badge nền, chip
    200: '#B8D9C4',
    300: '#7DB89A',
    400: '#3D7A5E',  // IPA / Accent
    500: '#2C6E49',  // CTA button, nav active — màu chính
    600: '#1A4A30',
  },

  // ── Secondary — Sage Teal (Xanh teal mặn mà) ─────────────
  secondary: {
    100: '#E3F0EE',
    200: '#B0D5D0',
    300: '#72B2AA',
    400: '#3D8B84',
    500: '#2A7069',  // IPA, icon camera, accent phụ
    600: '#184F4A',
  },

  // ── Semantic — Phản hồi & trạng thái ────────────────────
  /** Câu đúng, từ đã thuộc */
  success: {
    text: '#1E6B3A',
    bg: '#E8F5EC',
  },
  /** Câu sai, từ cần ôn gấp — đỏ muted, không chói */
  error: {
    text: '#B03535',
    bg: '#FDF0F0',
  },
  /** Cảnh báo, cần ôn hôm nay — nâu mật ong */
  warning: {
    text: '#8B6314',
    bg: '#FBF5E8',
  },
  /** Tooltip, badge thông tin, liên kết — xanh đậm dịu */
  info: {
    text: '#3A5A8C',
    bg: '#EEF2F8',
  },

  // ── Typography ────────────────────────────────────────────
  text: {
    /** Heading, từ tiếng Anh */
    primary: '#1A2B1A',
    /** Body, nghĩa tiếng Việt, câu ví dụ */
    secondary: '#4B5B4B',
    /** Metadata, ngày scan, placeholder, caption */
    muted: '#8B9B8B',
    /** / kʌp / — phiên âm IPA, màu teal phân biệt với nghĩa */
    ipa: '#3D7A5E',
  },
  /** Viền card, dòng phân cách */
  border: '#E2E8E0',
} as const;

export const Colors = {
  light: {
    text: Palette.text.primary,
    textSecondary: Palette.text.secondary,
    textMuted: Palette.text.muted,
    ipaText: Palette.text.ipa,
    background: Palette.canvas,
    surface: Palette.surface,
    surfaceWhite: Palette.surfaceWhite,
    backgroundElement: Palette.surface,
    backgroundSelected: Palette.primary[100],
    primary: Palette.primary[500],
    primaryTint: Palette.primary[100],
    secondary: Palette.secondary[500],
    secondaryTint: Palette.secondary[100],
    border: Palette.border,
    success: Palette.success.text,
    successBg: Palette.success.bg,
    error: Palette.error.text,
    errorBg: Palette.error.bg,
    warning: Palette.warning.text,
    warningBg: Palette.warning.bg,
    info: Palette.info.text,
    infoBg: Palette.info.bg,
  },
  dark: {
    text: '#FFFFFF',
    textSecondary: '#A3B8A3',
    textMuted: '#8B9B8B',
    ipaText: '#7DB89A',
    background: Palette.canvasDark,
    surface: '#223622',
    surfaceWhite: '#2C442C',
    backgroundElement: '#223622',
    backgroundSelected: Palette.primary[600],
    primary: Palette.primary[300],
    primaryTint: '#1A4A30',
    secondary: Palette.secondary[300],
    secondaryTint: '#184F4A',
    border: '#2C442C',
    success: '#7DB89A',
    successBg: '#1A4A30',
    error: '#E57373',
    errorBg: '#4A1C1C',
    warning: '#FFD54F',
    warningBg: '#4A3B1C',
    info: '#64B5F6',
    infoBg: '#1C2E4A',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light;

export const Fonts = Platform.select({
  ios: {
    sans: 'Inter',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'Inter, sans-serif',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-sans, "Inter", sans-serif)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
