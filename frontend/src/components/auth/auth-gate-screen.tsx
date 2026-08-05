import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Palette, Fonts, Spacing } from '@/constants/theme';
import DotsLoader from '@/components/ui/dots-loader';

interface AuthGateScreenProps {
  initialMode?: 'login' | 'signup';
  onLoginSuccess: (name?: string, email?: string) => void;
  onBypassGuest?: () => void;
}

export default function AuthGateScreen({
  initialMode = 'login',
  onLoginSuccess,
  onBypassGuest,
}: AuthGateScreenProps) {
  const [isLogin, setIsLogin] = useState<boolean>(initialMode === 'login');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Google Login Modal state
  const [showGoogleModal, setShowGoogleModal] = useState<boolean>(false);
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);

  const validateEmail = (emailStr: string) => {
    return /\S+@\S+\.\S+/.test(emailStr);
  };

  const handleSubmit = () => {
    setError(null);

    if (!email || !password) {
      setError('Vui lòng điền đầy đủ tất cả các trường.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Địa chỉ email không hợp lệ.');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải dài ít nhất 6 ký tự.');
      return;
    }

    if (!isLogin) {
      if (!name) {
        setError('Vui lòng điền họ và tên.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Mật khẩu xác nhận không khớp.');
        return;
      }
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const userName = isLogin ? (email.split('@')[0] || 'Học Viên Vocam') : name;
      onLoginSuccess(userName, email);
    }, 1200);
  };

  const handleGoogleLogin = (googleEmail: string, googleName: string) => {
    setGoogleLoading(true);
    setTimeout(() => {
      setGoogleLoading(false);
      setShowGoogleModal(false);
      onLoginSuccess(googleName, googleEmail);
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* BRAND HEADER */}
        <View style={styles.brandHeader}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoIcon}>🚀</Text>
          </View>
          <Text style={styles.brandTitle}>Vocam</Text>
          <Text style={styles.brandSubtitle}>ENGLISH FOR VIETNAMESE LEARNERS</Text>
        </View>

        {/* TAB SELECTOR: LOGIN / SIGNUP */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabItem, isLogin && styles.tabItemActive]}
            onPress={() => {
              setIsLogin(true);
              setError(null);
            }}
          >
            <Text style={[styles.tabText, isLogin && styles.tabTextActive]}>ĐĂNG NHẬP</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, !isLogin && styles.tabItemActive]}
            onPress={() => {
              setIsLogin(false);
              setError(null);
            }}
          >
            <Text style={[styles.tabText, !isLogin && styles.tabTextActive]}>ĐĂNG KÝ</Text>
          </TouchableOpacity>
        </View>

        {/* ERROR BANNER */}
        {error && (
          <View style={styles.errorBox}>
            <Feather name="alert-triangle" size={16} color={Palette.error.text} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* FORM FIELDS */}
        <View style={styles.formContainer}>
          {/* NAME FIELD (SIGNUP ONLY) */}
          {!isLogin && (
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>HỌ VÀ TÊN</Text>
              <View style={styles.inputWrapper}>
                <Feather name="user" size={16} color={Palette.text.muted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nguyễn Văn A"
                  placeholderTextColor={Palette.text.muted}
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>
          )}

          {/* EMAIL FIELD */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>ĐỊA CHỈ EMAIL</Text>
            <View style={styles.inputWrapper}>
              <Feather name="mail" size={16} color={Palette.text.muted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="email@example.com"
                placeholderTextColor={Palette.text.muted}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          {/* PASSWORD FIELD */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>MẬT KHẨU</Text>
            <View style={styles.inputWrapper}>
              <Feather name="lock" size={16} color={Palette.text.muted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="••••••"
                placeholderTextColor={Palette.text.muted}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                <Feather name={showPassword ? "eye-off" : "eye"} size={16} color={Palette.text.muted} />
              </TouchableOpacity>
            </View>
          </View>

          {/* CONFIRM PASSWORD FIELD (SIGNUP ONLY) */}
          {!isLogin && (
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>XÁC NHẬN MẬT KHẨU</Text>
              <View style={styles.inputWrapper}>
                <Feather name="lock" size={16} color={Palette.text.muted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="••••••"
                  placeholderTextColor={Palette.text.muted}
                  secureTextEntry={!showPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </View>
            </View>
          )}

          {/* SUBMIT BUTTON */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <DotsLoader color="#FFFFFF" size={10} gap={8} />
            ) : (
              <>
                <Text style={styles.submitButtonText}>
                  {isLogin ? 'ĐĂNG NHẬP' : 'TẠO TÀI KHOẢN'}
                </Text>
                <Feather name="arrow-right" size={16} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* OR DIVIDER */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>HOẶC</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* GOOGLE SIGN IN BUTTON */}
        <TouchableOpacity
          style={styles.googleBtn}
          onPress={() => setShowGoogleModal(true)}
        >
          <MaterialCommunityIcons name="google" size={18} color="#EA4335" />
          <Text style={styles.googleBtnText}>ĐĂNG NHẬP VỚI GOOGLE</Text>
        </TouchableOpacity>

        {/* GUEST BYPASS */}
        <View style={styles.footerSection}>
          <TouchableOpacity onPress={onBypassGuest} style={styles.guestBtn}>
            <Text style={styles.guestBtnText}>Tiếp tục với tư cách Khách →</Text>
          </TouchableOpacity>
          <Text style={styles.footerNote}>
            Đăng nhập giúp bạn lưu chuỗi ngày học, huy hiệu danh dự và các từ vựng đã quét của riêng mình.
          </Text>
        </View>
      </ScrollView>

      {/* GOOGLE LOGIN SIMULATOR MODAL */}
      <Modal visible={showGoogleModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.googleModalCard}>
            <View style={styles.googleHeader}>
              <MaterialCommunityIcons name="google" size={28} color="#4285F4" />
              <Text style={styles.googleTitle}>Đăng nhập bằng Google</Text>
            </View>
            <Text style={styles.googleSub}>Chọn tài khoản để tiếp tục tới Vocam:</Text>

            {googleLoading ? (
              <View style={styles.loadingBox}>
                <DotsLoader color={Palette.primary[500]} size={12} gap={10} />
                <Text style={styles.loadingText}>Đang xác thực tài khoản Google...</Text>
              </View>
            ) : (
              <View style={styles.accountList}>
                <TouchableOpacity
                  style={styles.accountItem}
                  onPress={() => handleGoogleLogin('thanhtran.dev@gmail.com', 'Thành Trần')}
                >
                  <View style={styles.accountAvatar}>
                    <Text style={styles.accountAvatarText}>T</Text>
                  </View>
                  <View>
                    <Text style={styles.accountName}>Thành Trần</Text>
                    <Text style={styles.accountEmail}>thanhtran.dev@gmail.com</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.accountItem}
                  onPress={() => handleGoogleLogin('vocam.learner@gmail.com', 'Vocam Learner')}
                >
                  <View style={[styles.accountAvatar, { backgroundColor: '#3B82F6' }]}>
                    <Text style={styles.accountAvatarText}>V</Text>
                  </View>
                  <View>
                    <Text style={styles.accountName}>Vocam Learner</Text>
                    <Text style={styles.accountEmail}>vocam.learner@gmail.com</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity style={styles.closeGoogleBtn} onPress={() => setShowGoogleModal(false)}>
              <Text style={styles.closeGoogleBtnText}>Hủy bỏ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F7FF',
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.six,
  },

  // Brand Header
  brandHeader: {
    alignItems: 'center',
    marginBottom: Spacing.four,
  },
  logoBadge: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: Palette.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Palette.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: Spacing.two,
  },
  logoIcon: {
    fontSize: 26,
  },
  brandTitle: {
    fontFamily: Fonts.sans,
    fontSize: 26,
    fontWeight: '900',
    color: Palette.text.primary,
  },
  brandSubtitle: {
    fontFamily: Fonts.sans,
    fontSize: 10,
    fontWeight: '800',
    color: Palette.primary[500],
    letterSpacing: 1.2,
    marginTop: 2,
  },

  // Tab Bar
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#E5E9F5',
    borderRadius: 16,
    padding: 3,
    marginBottom: Spacing.four,
  },
  tabItem: {
    flex: 1,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
  },
  tabItemActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '800',
    color: Palette.text.muted,
  },
  tabTextActive: {
    color: Palette.primary[500],
  },

  // Error Box
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Palette.error.bg,
    padding: Spacing.three,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FECACA',
    marginBottom: Spacing.three,
  },
  errorText: {
    flex: 1,
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Palette.error.text,
    fontWeight: '600',
  },

  // Form Container
  formContainer: {
    gap: Spacing.three,
  },
  fieldGroup: {
    gap: 4,
  },
  fieldLabel: {
    fontFamily: Fonts.sans,
    fontSize: 10,
    fontWeight: '900',
    color: Palette.text.secondary,
    letterSpacing: 0.5,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: Spacing.three,
    height: 50,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontFamily: Fonts.sans,
    fontSize: 13,
    color: Palette.text.primary,
  },
  eyeBtn: {
    padding: 4,
  },

  // Submit Button
  submitButton: {
    backgroundColor: Palette.primary[500],
    height: 52,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: Spacing.two,
    shadowColor: Palette.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },

  // Divider
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.four,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#CBD5E1',
  },
  dividerText: {
    fontFamily: Fonts.sans,
    fontSize: 10,
    fontWeight: '900',
    color: Palette.text.muted,
    paddingHorizontal: Spacing.three,
  },

  // Google Button
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    height: 50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  googleBtnText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '900',
    color: '#334155',
    letterSpacing: 0.5,
  },

  // Footer Section
  footerSection: {
    alignItems: 'center',
    marginTop: Spacing.five,
    gap: Spacing.two,
  },
  guestBtn: {
    paddingVertical: 4,
  },
  guestBtnText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '800',
    color: Palette.primary[500],
  },
  footerNote: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    color: Palette.text.muted,
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: Spacing.two,
  },

  // Google Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
  },
  googleModalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: Spacing.four,
  },
  googleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: 4,
  },
  googleTitle: {
    fontFamily: Fonts.sans,
    fontSize: 18,
    fontWeight: '800',
    color: Palette.text.primary,
  },
  googleSub: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Palette.text.secondary,
    marginBottom: Spacing.three,
  },
  loadingBox: {
    alignItems: 'center',
    paddingVertical: Spacing.four,
    gap: Spacing.two,
  },
  loadingText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Palette.text.secondary,
  },
  accountList: {
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.three,
    backgroundColor: Palette.canvas,
    borderRadius: 14,
  },
  accountAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Palette.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountAvatarText: {
    fontFamily: Fonts.sans,
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  accountName: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '800',
    color: Palette.text.primary,
  },
  accountEmail: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    color: Palette.text.secondary,
  },
  closeGoogleBtn: {
    alignItems: 'center',
    paddingVertical: Spacing.two,
  },
  closeGoogleBtnText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '700',
    color: Palette.text.muted,
  },
});
