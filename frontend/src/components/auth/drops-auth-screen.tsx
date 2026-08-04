import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Variables } from '@/constants/variables';

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

  const validateEmail = (str: string) => /\S+@\S+\.\S+/.test(str);

  const handleSubmit = () => {
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

    setTimeout(() => {
      setLoading(false);
      const userName = authMode === 'signup' ? name : (email.split('@')[0] || 'Learner');
      onAuthSuccess(userName, email);
    }, 1200);
  };

  const handleGoogleLogin = (googleEmail: string, googleName: string) => {
    setGoogleLoading(true);
    setTimeout(() => {
      setGoogleLoading(false);
      setShowGoogleModal(false);
      onAuthSuccess(googleName, googleEmail);
    }, 1000);
  };

  const isFormValid = email.length > 0 && password.length >= 6 && (authMode === 'login' || name.length > 0);

  // --- SCREEN 26: LANDING STEP ---
  if (viewState === 'landing') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={onClose || (() => onAuthSuccess())} style={styles.iconBtn}>
            <Feather name="x" size={24} color={Variables.text.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.topRightLink}
            onPress={() => {
              setAuthMode('login');
              setViewState('form');
            }}
          >
            <Text style={styles.topRightTextMuted}>Existing user? </Text>
            <Text style={styles.topRightTextBold}>Log in</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.landingHero}>
          <Text style={styles.heroTitle}>Start learning with Vocam</Text>
          <Text style={styles.heroSubtitle}>
            Track your learning progress, personalize your experience and earn achievements.
          </Text>
        </View>

        <View style={styles.landingActions}>
          <TouchableOpacity
            style={styles.googlePillBtn}
            onPress={() => setShowGoogleModal(true)}
          >
            <MaterialCommunityIcons name="google" size={20} color="#EA4335" />
            <Text style={styles.googlePillText}>CONTINUE WITH GOOGLE</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.createAccountPillBtn}
            onPress={() => {
              setAuthMode('signup');
              setViewState('form');
            }}
          >
            <Feather name="mail" size={18} color="#FFFFFF" />
            <Text style={styles.createAccountPillText}>CREATE AN ACCOUNT</Text>
          </TouchableOpacity>
        </View>

        {/* GOOGLE MODAL */}
        <Modal visible={showGoogleModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.googleModalCard}>
              <View style={styles.googleHeader}>
                <MaterialCommunityIcons name="google" size={26} color="#4285F4" />
                <Text style={styles.googleModalTitle}>Sign in with Google</Text>
              </View>
              <Text style={styles.googleModalSub}>Choose an account to continue to Vocam:</Text>

              {googleLoading ? (
                <View style={styles.loadingBox}>
                  <ActivityIndicator size="large" color={Variables.primary[500]} />
                  <Text style={styles.loadingText}>Authenticating with Google...</Text>
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
                    onPress={() => handleGoogleLogin('learner.vocam@gmail.com', 'Vocam Learner')}
                  >
                    <View style={[styles.accountAvatar, { backgroundColor: Variables.secondary[500] }]}>
                      <Text style={styles.accountAvatarText}>V</Text>
                    </View>
                    <View>
                      <Text style={styles.accountName}>Vocam Learner</Text>
                      <Text style={styles.accountEmail}>learner.vocam@gmail.com</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}

              <TouchableOpacity style={styles.closeGoogleBtn} onPress={() => setShowGoogleModal(false)}>
                <Text style={styles.closeGoogleBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  // --- SCREENS 27, 28, 29: FORM STEP ---
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.formScrollContent} showsVerticalScrollIndicator={false}>
        {/* BACK ARROW */}
        <TouchableOpacity style={styles.iconBtn} onPress={() => setViewState('landing')}>
          <Feather name="arrow-left" size={24} color={Variables.text.primary} />
        </TouchableOpacity>

        {/* HEADER */}
        <View style={styles.formHeader}>
          <Text style={styles.formTitle}>
            {authMode === 'signup' ? 'Sign up' : 'Log in'}
          </Text>

          <TouchableOpacity
            style={styles.switchAuthRow}
            onPress={() => {
              setError(null);
              setAuthMode(authMode === 'signup' ? 'login' : 'signup');
            }}
          >
            <Text style={styles.switchMuted}>
              {authMode === 'signup' ? 'Existing user? ' : 'New user? '}
            </Text>
            <Text style={styles.switchBold}>
              {authMode === 'signup' ? 'Log in' : 'Sign up'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ERROR BANNER */}
        {error && (
          <View style={styles.errorBox}>
            <Feather name="alert-circle" size={16} color={Variables.semantic.errorText} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* INPUT FIELDS */}
        <View style={styles.inputsGroup}>
          {authMode === 'signup' && (
            <View style={styles.pillInputContainer}>
              <Feather name="user" size={18} color={Variables.text.muted} style={styles.pillIcon} />
              <TextInput
                style={styles.pillInput}
                placeholder="Name"
                placeholderTextColor={Variables.text.muted}
                value={name}
                onChangeText={setName}
              />
            </View>
          )}

          <View style={styles.pillInputContainer}>
            <Feather name="mail" size={18} color={Variables.text.muted} style={styles.pillIcon} />
            <TextInput
              style={styles.pillInput}
              placeholder="Email"
              placeholderTextColor={Variables.text.muted}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.pillInputContainer}>
            <Feather name="lock" size={18} color={Variables.text.muted} style={styles.pillIcon} />
            <TextInput
              style={styles.pillInput}
              placeholder="Password"
              placeholderTextColor={Variables.text.muted}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
              <Feather name={showPassword ? 'eye-off' : 'eye'} size={18} color={Variables.text.muted} />
            </TouchableOpacity>
          </View>
        </View>

        {/* SUBMIT BUTTON (DROPS STYLED CENTERED PILL) */}
        <View style={styles.submitContainer}>
          <TouchableOpacity
            style={[
              styles.submitPillBtn,
              isFormValid && styles.submitPillBtnActive,
              loading && styles.submitPillBtnDisabled,
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={[styles.submitPillText, isFormValid && styles.submitPillTextActive]}>
                {authMode === 'signup' ? 'SIGN UP' : 'LOG IN'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Variables.canvas,
    paddingHorizontal: 24,
  },

  // Header
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
  },
  iconBtn: {
    padding: 8,
    marginLeft: -8,
  },
  topRightLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topRightTextMuted: {
    fontFamily: Variables.fonts.sans,
    fontSize: 14,
    color: Variables.text.secondary,
  },
  topRightTextBold: {
    fontFamily: Variables.fonts.sans,
    fontSize: 14,
    fontWeight: '800',
    color: Variables.primary[500],
  },

  // Landing Hero
  landingHero: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  heroTitle: {
    fontFamily: Variables.fonts.sans,
    fontSize: 28,
    fontWeight: '900',
    color: Variables.text.primary,
    textAlign: 'center',
    marginBottom: 12,
  },
  heroSubtitle: {
    fontFamily: Variables.fonts.sans,
    fontSize: 14,
    color: Variables.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Landing Actions
  landingActions: {
    gap: 14,
    paddingBottom: 40,
  },
  googlePillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Variables.white,
    height: 54,
    borderRadius: 27,
    borderWidth: 1,
    borderColor: Variables.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  googlePillText: {
    fontFamily: Variables.fonts.sans,
    fontSize: 13,
    fontWeight: '800',
    color: Variables.text.primary,
    letterSpacing: 0.5,
  },
  createAccountPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Variables.primary[500], // Forest Green from variables.ts
    height: 54,
    borderRadius: 27,
    shadowColor: Variables.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  createAccountPillText: {
    fontFamily: Variables.fonts.sans,
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },

  // Form Scroll & Header
  formScrollContent: {
    paddingTop: 12,
    paddingBottom: 40,
  },
  formHeader: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 32,
  },
  formTitle: {
    fontFamily: Variables.fonts.sans,
    fontSize: 32,
    fontWeight: '900',
    color: Variables.text.primary,
    marginBottom: 6,
  },
  switchAuthRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchMuted: {
    fontFamily: Variables.fonts.sans,
    fontSize: 14,
    color: Variables.text.secondary,
  },
  switchBold: {
    fontFamily: Variables.fonts.sans,
    fontSize: 14,
    fontWeight: '800',
    color: Variables.primary[500],
  },

  // Error Box
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Variables.semantic.errorBg,
    padding: 12,
    borderRadius: 16,
    marginBottom: 16,
  },
  errorText: {
    fontFamily: Variables.fonts.sans,
    fontSize: 12,
    color: Variables.semantic.errorText,
    fontWeight: '600',
  },

  // Inputs Group
  inputsGroup: {
    gap: 14,
    marginBottom: 36,
  },
  pillInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Variables.white,
    height: 56,
    borderRadius: 28,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: Variables.border,
  },
  pillIcon: {
    marginRight: 12,
  },
  pillInput: {
    flex: 1,
    fontFamily: Variables.fonts.sans,
    fontSize: 14,
    color: Variables.text.primary,
  },
  eyeBtn: {
    padding: 6,
  },

  // Submit Pill
  submitContainer: {
    alignItems: 'center',
  },
  submitPillBtn: {
    width: 180,
    height: 50,
    borderRadius: 25,
    backgroundColor: Variables.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitPillBtnActive: {
    backgroundColor: Variables.primary[500],
    shadowColor: Variables.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitPillBtnDisabled: {
    opacity: 0.6,
  },
  submitPillText: {
    fontFamily: Variables.fonts.sans,
    fontSize: 13,
    fontWeight: '800',
    color: Variables.text.muted,
    letterSpacing: 0.5,
  },
  submitPillTextActive: {
    color: '#FFFFFF',
  },

  // Google Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  googleModalCard: {
    backgroundColor: Variables.white,
    borderRadius: 24,
    padding: 20,
  },
  googleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  googleModalTitle: {
    fontFamily: Variables.fonts.sans,
    fontSize: 18,
    fontWeight: '800',
    color: Variables.text.primary,
  },
  googleModalSub: {
    fontFamily: Variables.fonts.sans,
    fontSize: 12,
    color: Variables.text.secondary,
    marginBottom: 16,
  },
  loadingBox: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 10,
  },
  loadingText: {
    fontFamily: Variables.fonts.sans,
    fontSize: 12,
    color: Variables.text.secondary,
  },
  accountList: {
    gap: 10,
    marginBottom: 16,
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: Variables.canvas,
    borderRadius: 14,
  },
  accountAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Variables.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountAvatarText: {
    fontFamily: Variables.fonts.sans,
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  accountName: {
    fontFamily: Variables.fonts.sans,
    fontSize: 13,
    fontWeight: '800',
    color: Variables.text.primary,
  },
  accountEmail: {
    fontFamily: Variables.fonts.sans,
    fontSize: 11,
    color: Variables.text.secondary,
  },
  closeGoogleBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  closeGoogleBtnText: {
    fontFamily: Variables.fonts.sans,
    fontSize: 13,
    fontWeight: '700',
    color: Variables.text.muted,
  },
});
