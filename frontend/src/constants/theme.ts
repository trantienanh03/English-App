/**
 * Vocam Color Palette & Typography Theme Tokens
 * Based on vocam_color_palette.html
 */

import '@/global.css';
import { Platform } from 'react-native';

export const Palette = {
  // Canvas & Surfaces
  canvas: '#F4F6F3',       // App background - xanh lá pha xám nhẹ
  surface: '#FAFBF9',      // Card & panel background - trắng ngà
  surfaceWhite: '#FFFFFF', // Flashcard, modal, bottom sheet
  canvasDark: '#1A2B1A',   // Camera view - tối hoàn toàn không xanh

  // Primary — Forest Green (Xanh Rừng)
  primary: {
    100: '#E8F2EC',        // Primary tint (highlight, badge nền, chip)
    200: '#B8D9C4',
    300: '#7DB89A',
    400: '#3D7A5E',        // IPA / Accent
    500: '#2C6E49',        // Primary action (CTA button, nav active)
    600: '#1A4A30',
  },

  // Secondary — Sage Teal (Xanh Teal)
  secondary: {
    100: '#E3F0EE',
    200: '#B0D5D0',
    300: '#72B2AA',
    400: '#3D8B84',
    500: '#2A7069',
    600: '#184F4A',
  },

  // Semantic — Feedback & Status
  success: {
    text: '#1E6B3A',
    bg: '#E8F5EC',
  },
  error: {
    text: '#B03535',
    bg: '#FDF0F0',
  },
  warning: {
    text: '#8B6314',
    bg: '#FBF5E8',
  },
  info: {
    text: '#3A5A8C',
    bg: '#EEF2F8',
  },

  // Typography & Borders
  text: {
    primary: '#1A2B1A',    // Heading / từ tiếng Anh
    secondary: '#4B5B4B',  // Body / nghĩa tiếng Việt
    muted: '#8B9B8B',      // Metadata / caption / placeholder
    ipa: '#3D7A5E',        // / kʌp / — phiên âm IPA
  },
  border: '#E2E8E0',       // Viền card, dòng phân cách
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
