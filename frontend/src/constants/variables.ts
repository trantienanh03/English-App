/**
 * VOCAM COLOR PALETTE — JavaScript/TypeScript constants
 * Synced from: vocam_color_palette.html
 *
 * Usage: import { Variables } from '@/constants/variables';
 *        backgroundColor: Variables.primary[500]
 */
export const Variables = {

  // ── Backgrounds & Surfaces ─────────────────────────────────
  /** Nền app chính · xanh lá pha xám nhẹ, không gây mỏi mắt */
  canvas: '#F4F6F3',
  /** Nền card & panel · trắng ngà, không chói */
  surface: '#FAFBF9',
  /** Nền Flashcard, modal, bottom sheet */
  white: '#FFFFFF',
  /** Camera view · tối hoàn toàn, không xanh */
  darkCanvas: '#1A2B1A',

  // ── Primary — Forest Green (Xanh rừng) ────────────────────
  primary: {
    100: '#E8F2EC',  // Card highlight, badge nền, chip
    200: '#B8D9C4',
    300: '#7DB89A',
    400: '#3D7A5E',  // IPA / Accent
    500: '#2C6E49',  // CTA button, nav active — màu chính
    600: '#1A4A30',
  },

  // ── Secondary — Sage Teal (Xanh teal mặn mà) ──────────────
  secondary: {
    100: '#E3F0EE',
    200: '#B0D5D0',
    300: '#72B2AA',
    400: '#3D8B84',
    500: '#2A7069',  // IPA, icon camera, accent phụ
    600: '#184F4A',
  },

  // ── Semantic — Phản hồi & trạng thái ─────────────────────
  semantic: {
    /** Câu đúng, từ đã thuộc, streak active */
    successText: '#1E6B3A',
    successBg: '#E8F5EC',
    /** Câu sai, từ cần ôn gấp — đỏ muted, không chói */
    errorText: '#B03535',
    errorBg: '#FDF0F0',
    /** Streak warning, cần ôn hôm nay — nâu mật ong */
    warningText: '#8B6314',
    warningBg: '#FBF5E8',
    /** Tooltip, badge thông tin, liên kết — xanh đậm dịu */
    infoText: '#3A5A8C',
    infoBg: '#EEF2F8',
  },

  // ── Typography & Text ──────────────────────────────────────
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

  // ── Border & Divider ───────────────────────────────────────
  /** Viền card, dòng phân cách */
  border: '#E2E8E0',

  // ── Fonts ──────────────────────────────────────────────────
  fonts: {
    sans: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
};
