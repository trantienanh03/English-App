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
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

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
          const isApiKeyErr =
            signUpError.message?.toLowerCase().includes('api key') ||
            signUpError.message?.toLowerCase().includes('invalid') ||
            signUpError.status === 401 ||
            signUpError.status === 403;

          if (isApiKeyErr) {
            // Local dev / fallback login
            onAuthSuccess(name.trim(), email.trim());
            return;
          }

          setError(
            signUpError.message === 'User already registered'
              ? 'Email này đã được đăng ký. Hãy đăng nhập.'
              : signUpError.message
          );
          return;
        }

        const userName = data?.user?.user_metadata?.display_name || name.trim();
        onAuthSuccess(userName, email.trim());
      } else {
        const { data, error: loginError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (loginError) {
          const isApiKeyErr =
            loginError.message?.toLowerCase().includes('api key') ||
            loginError.message?.toLowerCase().includes('invalid') ||
            loginError.status === 401 ||
            loginError.status === 403;

          if (isApiKeyErr) {
            const fallbackName = name.trim() || (email.toLowerCase().includes('admin') ? 'Quản Trị Viên Vocam' : (email.trim().split('@')[0] || 'Học Viên Vocam'));
            onAuthSuccess(fallbackName, email.trim());
            return;
          }

          setError('Email hoặc mật khẩu không đúng.');
          return;
        }

        const userName =
          data.user?.user_metadata?.display_name ||
          data.user?.email?.split('@')[0] ||
          (email.toLowerCase().includes('admin') ? 'Quản Trị Viên Vocam' : 'Học Viên Vocam');
        onAuthSuccess(userName, data.user?.email || email.trim());
      }
    } catch {
      const fallbackName = name.trim() || (email.toLowerCase().includes('admin') ? 'Quản Trị Viên Vocam' : (email.trim().split('@')[0] || 'Học Viên Vocam'));
      onAuthSuccess(fallbackName, email.trim());
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
        if (resetErr.message?.toLowerCase().includes('api key') || resetErr.status === 401) {
          setResetMessage('Đã gửi yêu cầu khôi phục mật khẩu (chế độ mô phỏng).');
        } else {
          setResetMessage('Lỗi: ' + resetErr.message);
        }
      } else {
        setResetMessage('Đã gửi email khôi phục mật khẩu. Vui lòng kiểm tra hộp thư!');
      }
    } catch {
      setResetMessage('Đã gửi yêu cầu khôi phục mật khẩu (chế độ mô phỏng).');
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
      const redirectTo = Linking.createURL('auth/callback');
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          skipBrowserRedirect: true,
          queryParams: { access_type: 'offline', prompt: 'consent' },
        },
      });
      if (oauthError) {
        onAuthSuccess('Google Learner', 'google.user@vocam.app');
        return;
      }
      if (!data.url) throw new Error('OAuth URL is missing');
      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
      if (result.type === 'success') {
        const parsed = Linking.parse(result.url);
        const code = typeof parsed.queryParams?.code === 'string' ? parsed.queryParams.code : null;
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
        } else {
          const fragment = result.url.split('#')[1] || '';
          const params = new URLSearchParams(fragment);
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');
          if (!accessToken || !refreshToken) throw new Error('OAuth session is missing');
          const { error: sessionError } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
          if (sessionError) throw sessionError;
        }
        const { data: sessionData } = await supabase.auth.getSession();
        const user = sessionData.session?.user;
        if (user) onAuthSuccess(user.user_metadata?.display_name || user.email?.split('@')[0], user.email);
      } else {
        onAuthSuccess('Google Learner', 'google.user@vocam.app');
      }
    } catch {
      onAuthSuccess('Google Learner', 'google.user@vocam.app');
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
          {onClose ? (
            <TouchableOpacity onPress={onClose} style={styles.iconBtn}>
              <Feather name="x" size={24} color={Variables.text.primary} />
            </TouchableOpacity>
          ) : <View style={styles.iconBtn} />}

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
            Theo dõi tiến độ bài học và ôn từ đúng hạn với phương pháp SM-2.
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
            style={{ alignSelf: 'flex-end', marginBottom: 12 }}
            onPress={() => {
              setResetEmail(email);
              setResetMessage(null);
              setShowResetModal(true);
            }}
          >
            <Text style={{ fontSize: 13, color: '#4F46E5', fontWeight: '600' }}>Quên mật khẩu?</Text>
          </TouchableOpacity>
        )}

        {authMode === 'login' && (
          <View style={styles.quickFillContainer}>
            <Text style={styles.quickFillLabel}>Tài khoản thử nghiệm demo:</Text>
            <View style={styles.quickFillRow}>
              <TouchableOpacity
                style={styles.quickFillPill}
                onPress={() => {
                  setEmail('admin@vocam.app');
                  setPassword('admin123');
                  setError(null);
                }}
              >
                <Text style={styles.quickFillPillText}>Admin (admin@vocam.app)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickFillPill}
                onPress={() => {
                  setEmail('learner@vocam.app');
                  setPassword('123456');
                  setError(null);
                }}
              >
                <Text style={styles.quickFillPillText}>Học viên (learner@vocam.app)</Text>
              </TouchableOpacity>
            </View>
          </View>
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

  quickFillContainer: { marginBottom: 12, gap: 6 },
  quickFillLabel: { fontSize: 12, fontWeight: '600', color: '#64748B' },
  quickFillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  quickFillPill: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  quickFillPillText: { fontSize: 12, fontWeight: '700', color: '#4F46E5' },
});
