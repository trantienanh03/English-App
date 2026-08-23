import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Variables } from '@/constants/variables';
import DotsLoader from '@/components/ui/dots-loader';
import { supabase } from '@/lib/supabase';

interface DropsAuthScreenProps {
  initialMode?: 'login' | 'signup';
  onAuthSuccess: (name?: string, email?: string) => void;
  onClose?: () => void;
}

export default function DropsAuthScreen({
  initialMode = 'signup',
  onAuthSuccess,
  onClose,
}: DropsAuthScreenProps) {
  const [viewState, setViewState] = useState<'landing' | 'form'>(initialMode === 'login' ? 'form' : 'landing');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>(initialMode);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Google Modal State
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Forgot Password Modal State
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const validateEmail = (str: string) => /\S+@\S+\.\S+/.test(str);

  /**
   * Email/Password auth — calls Supabase Auth directly.
   */
  const handleSubmit = async () => {
    setError(null);

    if (!email || !password) {
      setError('Vui lòng điền đầy đủ thông tin.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Email không đúng định dạng.');
      return;
    }
    if (password.length < 6) {
      setError('Mật khẩu phải từ 6 ký tự.');
      return;
    }
    if (authMode === 'signup' && !name) {
      setError('Vui lòng điền tên của bạn.');
      return;
    }

    setLoading(true);
    try {
      if (authMode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { display_name: name.trim() },
          },
        });

        if (signUpError) {
          setError(signUpError.message === 'User already registered'
            ? 'Email này đã được đăng ký. Hãy đăng nhập.'
            : signUpError.message);
          return;
        }

        const userName = data.user?.user_metadata?.display_name || name;
        onAuthSuccess(userName, email.trim());
      } else {
        const { data, error: loginError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (loginError) {
          setError('Email hoặc mật khẩu không đúng.');
          return;
        }

        const userName =
          data.user?.user_metadata?.display_name ||
          data.user?.email?.split('@')[0] ||
          'Học Viên Vocam';
        onAuthSuccess(userName, data.user?.email || email.trim());
      }
    } catch (err: any) {
      setError('Đã xảy ra lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reset Password via Supabase Auth.
   */
  const handleForgotPassword = async () => {
    if (!resetEmail || !validateEmail(resetEmail)) {
      setResetMessage('Vui lòng nhập email hợp lệ.');
      return;
    }
    setResetLoading(true);
    setResetMessage(null);
    try {
      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(resetEmail.trim(), {
        redirectTo: 'vocam://reset-password',
      });
      if (resetErr) {
        setResetMessage('Lỗi: ' + resetErr.message);
      } else {
        setResetMessage('Đã gửi email khôi phục mật khẩu. Vui lòng kiểm tra hộp thư!');
      }
    } catch {
      setResetMessage('Không thể gửi yêu cầu. Vui lòng thử lại sau.');
    } finally {
      setResetLoading(false);
    }
  };

  /**
   * Google OAuth via Supabase.
   */
  const handleGoogleOAuth = async () => {
    setGoogleLoading(true);
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'vocam://auth/callback',
          queryParams: { access_type: 'offline', prompt: 'consent' },
        },
      });
      if (oauthError) {
        Alert.alert('Lỗi đăng nhập Google', oauthError.message);
      }
    } catch {
      Alert.alert('Lỗi', 'Không thể mở đăng nhập Google.');
    } finally {
      setGoogleLoading(false);
      setShowGoogleModal(false);
    }
  };

  const isFormValid = email.length > 0 && password.length >= 6 && (authMode === 'login' || name.length > 0);

  // --- LANDING STEP ---
  if (viewState === 'landing') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={onClose || (() => onAuthSuccess())} style={styles.iconBtn}>
            <Feather name="x" size={24} color={Variables.text.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.topRightLink}
            onPress={() => { setAuthMode('login'); setViewState('form'); }}
          >
            <Text style={styles.topRightTextMuted}>Đã có tài khoản? </Text>
            <Text style={styles.topRightTextBold}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.landingHero}>
          <Text style={styles.heroTitle}>Bắt đầu học với Vocam</Text>
          <Text style={styles.heroSubtitle}>
            Theo dõi tiến độ học, cá nhân hoá trải nghiệm và nhận huy hiệu thành tích.
          </Text>
        </View>

        <View style={styles.landingActions}>
          <TouchableOpacity
            style={styles.googlePillBtn}
            onPress={() => setShowGoogleModal(true)}
          >
            <MaterialCommunityIcons name="google" size={20} color="#EA4335" />
            <Text style={styles.googlePillText}>TIẾP TỤC VỚI GOOGLE</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.createAccountPillBtn}
            onPress={() => { setAuthMode('signup'); setViewState('form'); }}
          >
            <Feather name="mail" size={18} color="#FFFFFF" />
            <Text style={styles.createAccountPillText}>TẠO TÀI KHOẢN</Text>
          </TouchableOpacity>
        </View>

        {/* GOOGLE OAUTH MODAL */}
        <Modal visible={showGoogleModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.googleModalCard}>
              <View style={styles.googleHeader}>
                <MaterialCommunityIcons name="google" size={26} color="#4285F4" />
                <Text style={styles.googleModalTitle}>Đăng nhập với Google</Text>
              </View>
              <Text style={styles.googleModalSub}>
                Bạn sẽ được chuyển đến trang đăng nhập Google của Supabase.
              </Text>

              {googleLoading ? (
                <View style={styles.loadingBox}>
                  <DotsLoader color={Variables.primary[500]} size={12} gap={10} />
                  <Text style={styles.loadingText}>Đang mở Google...</Text>
                </View>
              ) : (
                <View style={styles.googleActionRow}>
                  <TouchableOpacity style={styles.confirmGoogleBtn} onPress={handleGoogleOAuth}>
                    <Text style={styles.confirmGoogleBtnText}>Tiếp tục</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.closeGoogleBtn} onPress={() => setShowGoogleModal(false)}>
                    <Text style={styles.closeGoogleBtnText}>Hủy</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  // --- FORM STEP (signup / login) ---
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.formScrollContent} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => setViewState('landing')}>
          <Feather name="arrow-left" size={24} color={Variables.text.primary} />
        </TouchableOpacity>

        <View style={styles.formHeader}>
          <Text style={styles.formTitle}>
            {authMode === 'signup' ? 'Tạo tài khoản' : 'Đăng nhập'}
          </Text>
          <Text style={styles.formSubtitle}>
            {authMode === 'signup'
              ? 'Bắt đầu hành trình học tiếng Anh của bạn'
              : 'Chào mừng trở lại!'}
          </Text>
        </View>

        {error && (
          <View style={styles.errorBox}>
            <Feather name="alert-circle" size={15} color="#EF4444" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {authMode === 'signup' && (
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Họ và tên</Text>
            <View style={styles.inputWrapper}>
              <Feather name="user" size={16} color={Variables.text.secondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Nhập tên của bạn"
                placeholderTextColor={Variables.text.muted}
                autoCapitalize="words"
              />
            </View>
          </View>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email</Text>
          <View style={styles.inputWrapper}>
            <Feather name="mail" size={16} color={Variables.text.secondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              placeholderTextColor={Variables.text.muted}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Mật khẩu</Text>
          <View style={styles.inputWrapper}>
            <Feather name="lock" size={16} color={Variables.text.secondary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={password}
              onChangeText={setPassword}
              placeholder="Ít nhất 6 ký tự"
              placeholderTextColor={Variables.text.muted}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
              <Feather name={showPassword ? 'eye-off' : 'eye'} size={16} color={Variables.text.secondary} />
            </TouchableOpacity>
          </View>
        </View>

        {authMode === 'login' && (
          <TouchableOpacity
            style={{ alignSelf: 'flex-end', marginBottom: 16 }}
            onPress={() => {
              setResetEmail(email);
              setResetMessage(null);
              setShowResetModal(true);
            }}
          >
            <Text style={{ fontSize: 13, color: '#4F46E5', fontWeight: '600' }}>Quên mật khẩu?</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.submitBtn, (!isFormValid || loading) && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={!isFormValid || loading}
        >
          {loading ? (
            <DotsLoader color="#FFFFFF" size={10} gap={8} />
          ) : (
            <Text style={styles.submitBtnText}>
              {authMode === 'signup' ? 'Tạo tài khoản' : 'Đăng nhập'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.switchModeBtn}
          onPress={() => {
            setAuthMode(authMode === 'login' ? 'signup' : 'login');
            setError(null);
          }}
        >
          <Text style={styles.switchModeText}>
            {authMode === 'login'
              ? 'Chưa có tài khoản? '
              : 'Đã có tài khoản? '}
          </Text>
          <Text style={styles.switchModeBold}>
            {authMode === 'login' ? 'Đăng ký' : 'Đăng nhập'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* FORGOT PASSWORD MODAL */}
      <Modal visible={showResetModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.googleModalCard}>
            <View style={styles.googleHeader}>
              <Feather name="key" size={24} color="#4F46E5" />
              <Text style={styles.googleModalTitle}>Khôi phục mật khẩu</Text>
            </View>
            <Text style={styles.googleModalSub}>
              Nhập email đã đăng ký tài khoản. Hệ thống Supabase Auth sẽ gửi liên kết tạo lại mật khẩu vào hòm thư của bạn.
            </Text>

            {resetMessage && (
              <Text style={{ fontSize: 13, color: resetMessage.startsWith('Lỗi') ? '#EF4444' : '#10B981', marginBottom: 12, textAlign: 'center' }}>
                {resetMessage}
              </Text>
            )}

            <View style={[styles.inputWrapper, { marginBottom: 16 }]}>
              <Feather name="mail" size={16} color={Variables.text.secondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={resetEmail}
                onChangeText={setResetEmail}
                placeholder="your@email.com"
                placeholderTextColor={Variables.text.muted}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.googleActionRow}>
              <TouchableOpacity style={styles.confirmGoogleBtn} onPress={handleForgotPassword} disabled={resetLoading}>
                <Text style={styles.confirmGoogleBtnText}>{resetLoading ? 'Đang gửi...' : 'Gửi Email'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeGoogleBtn} onPress={() => setShowResetModal(false)}>
                <Text style={styles.closeGoogleBtnText}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  iconBtn: { padding: 8 },
  topRightLink: { flexDirection: 'row', alignItems: 'center' },
  topRightTextMuted: { fontSize: 14, color: '#94A3B8' },
  topRightTextBold: { fontSize: 14, fontWeight: '700', color: '#1E293B' },

  landingHero: { paddingHorizontal: 28, marginTop: 40, gap: 12 },
  heroTitle: { fontSize: 28, fontWeight: '800', color: '#1E293B', letterSpacing: -0.5 },
  heroSubtitle: { fontSize: 15, color: '#64748B', lineHeight: 22 },

  landingActions: { paddingHorizontal: 28, marginTop: 36, gap: 14 },
  googlePillBtn: {
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
  },
  googlePillText: { fontSize: 14, fontWeight: '700', color: '#1E293B', letterSpacing: 0.5 },
  createAccountPillBtn: {
    height: 52,
    borderRadius: 16,
    backgroundColor: Variables.primary[500],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  createAccountPillText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.5 },

  // Google Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', paddingHorizontal: 28 },
  googleModalCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, gap: 12 },
  googleHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  googleModalTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B' },
  googleModalSub: { fontSize: 14, color: '#64748B', lineHeight: 20 },
  loadingBox: { alignItems: 'center', gap: 10, paddingVertical: 16 },
  loadingText: { fontSize: 13, color: '#64748B' },
  googleActionRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  confirmGoogleBtn: {
    flex: 1, height: 44, borderRadius: 12,
    backgroundColor: Variables.primary[500],
    alignItems: 'center', justifyContent: 'center',
  },
  confirmGoogleBtnText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
  closeGoogleBtn: {
    flex: 1, height: 44, borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center', justifyContent: 'center',
  },
  closeGoogleBtnText: { fontSize: 15, fontWeight: '600', color: '#64748B' },

  // Form
  formScrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
  formHeader: { marginTop: 28, marginBottom: 24, gap: 6 },
  formTitle: { fontSize: 26, fontWeight: '800', color: '#1E293B' },
  formSubtitle: { fontSize: 14, color: '#64748B' },
  errorBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#FEF2F2', borderRadius: 10, padding: 12, marginBottom: 12,
  },
  errorText: { fontSize: 13, color: '#EF4444', flex: 1 },
  inputGroup: { gap: 6, marginBottom: 16 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#475569' },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 12,
    backgroundColor: '#F8FAFC', paddingHorizontal: 12, height: 50,
  },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 15, color: '#1E293B' },
  eyeBtn: { padding: 4 },
  submitBtn: {
    height: 52, borderRadius: 16,
    backgroundColor: Variables.primary[500],
    alignItems: 'center', justifyContent: 'center',
    marginTop: 8,
  },
  submitBtnDisabled: { opacity: 0.5 },
  submitBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  switchModeBtn: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  switchModeText: { fontSize: 14, color: '#64748B' },
  switchModeBold: { fontSize: 14, fontWeight: '700', color: Variables.primary[500] },
});
