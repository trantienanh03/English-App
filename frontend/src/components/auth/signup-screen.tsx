import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { Palette, Fonts, Spacing } from '@/constants/theme';

interface SignupScreenProps {
  onLoginPress: () => void;
  onSignupSuccess: () => void;
}

export default function SignupScreen({ onLoginPress, onSignupSuccess }: SignupScreenProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureConfirmTextEntry, setSecureConfirmTextEntry] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSignup = () => {
    if (!fullName || !email || !password || !confirmPassword) {
      alert('Vui lòng điền đầy đủ thông tin.');
      return;
    }
    if (password !== confirmPassword) {
      alert('Mật khẩu và xác nhận mật khẩu không khớp.');
      return;
    }
    if (!agreeTerms) {
      alert('Vui lòng đồng ý với điều khoản dịch vụ.');
      return;
    }
    onSignupSuccess();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Bar */}
          <View style={styles.headerBar}>
            <View style={styles.logoContainer}>
              <Feather name="book-open" size={24} color={Palette.primary[500]} style={styles.logoIcon} />
              <Text style={styles.logoText}>Vocam</Text>
            </View>
            <TouchableOpacity style={styles.menuButton}>
              <Feather name="menu" size={24} color={Palette.text.primary} />
            </TouchableOpacity>
          </View>

          {/* Intro Section */}
          <View style={styles.introSection}>
            <View style={styles.popperBadge}>
              <MaterialCommunityIcons name="party-popper" size={32} color={Palette.primary[500]} />
            </View>
            <Text style={styles.title}>Bắt đầu hành trình</Text>
            <Text style={styles.titleBold}>ngay!</Text>
            <Text style={styles.subtitle}>
              Tham gia cùng <Text style={styles.highlightText}>10,000+</Text> người học tiếng Anh.
            </Text>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            {/* Full Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Họ và tên</Text>
              <View style={styles.inputWrapper}>
                <Feather name="user" size={20} color={Palette.text.muted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nguyễn Văn A"
                  placeholderTextColor={Palette.text.muted}
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>
            </View>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <Feather name="mail" size={20} color={Palette.text.muted} style={styles.inputIcon} />
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

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mật khẩu</Text>
              <View style={styles.inputWrapper}>
                <Feather name="lock" size={20} color={Palette.text.muted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor={Palette.text.muted}
                  secureTextEntry={secureTextEntry}
                  autoCapitalize="none"
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  onPress={() => setSecureTextEntry(!secureTextEntry)}
                  style={styles.eyeButton}
                >
                  <Feather name={secureTextEntry ? 'eye-off' : 'eye'} size={20} color={Palette.text.muted} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Xác nhận mật khẩu</Text>
              <View style={styles.inputWrapper}>
                <Feather name="lock" size={20} color={Palette.text.muted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor={Palette.text.muted}
                  secureTextEntry={secureConfirmTextEntry}
                  autoCapitalize="none"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity
                  onPress={() => setSecureConfirmTextEntry(!secureConfirmTextEntry)}
                  style={styles.eyeButton}
                >
                  <Feather name={secureConfirmTextEntry ? 'eye-off' : 'eye'} size={20} color={Palette.text.muted} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Terms and Conditions Checkbox */}
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setAgreeTerms(!agreeTerms)}
            >
              <View style={[styles.checkbox, agreeTerms && styles.checkboxChecked]}>
                {agreeTerms && <Feather name="check" size={14} color="#FFF" />}
              </View>
              <Text style={styles.checkboxLabel}>
                Tôi đồng ý với{' '}
                <Text style={styles.linkText}>Điều khoản sử dụng</Text> và{' '}
                <Text style={styles.linkText}>Chính sách bảo mật</Text> của Vocam.
              </Text>
            </TouchableOpacity>

            {/* Submit Button */}
            <TouchableOpacity style={styles.submitButton} onPress={handleSignup}>
              <Text style={styles.submitButtonText}>Tạo tài khoản</Text>
              <Feather name="arrow-right" size={18} color="#FFF" style={styles.arrowIcon} />
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>HOẶC</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google Signup Button */}
            <TouchableOpacity style={styles.googleButton} onPress={onSignupSuccess}>
              <AntDesign name="google" size={20} color="#EA4335" style={styles.googleIcon} />
              <Text style={styles.googleButtonText}>Tiếp tục với Google</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Bạn đã có tài khoản?{' '}
              <Text style={styles.footerLink} onPress={onLoginPress}>
                Đăng nhập
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Palette.canvas,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.three,
    marginBottom: Spacing.two,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    marginRight: Spacing.two,
  },
  logoText: {
    fontFamily: Fonts.sans,
    fontSize: 22,
    fontWeight: 'bold',
    color: Palette.primary[500],
  },
  menuButton: {
    padding: Spacing.one,
  },
  introSection: {
    alignItems: 'center',
    marginVertical: Spacing.three,
  },
  popperBadge: {
    backgroundColor: Palette.primary[100],
    width: 64,
    height: 64,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.three,
    borderWidth: 1,
    borderColor: Palette.primary[200],
  },
  title: {
    fontFamily: Fonts.sans,
    fontSize: 28,
    fontWeight: '400',
    color: Palette.text.primary,
    textAlign: 'center',
  },
  titleBold: {
    fontFamily: Fonts.sans,
    fontSize: 28,
    fontWeight: 'bold',
    color: Palette.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.two,
  },
  subtitle: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    color: Palette.text.secondary,
    textAlign: 'center',
    marginTop: Spacing.one,
  },
  highlightText: {
    fontFamily: Fonts.sans,
    color: Palette.primary[500],
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: Palette.surfaceWhite,
    borderRadius: 24,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: Palette.border,
    shadowColor: Palette.text.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 4,
    marginBottom: Spacing.four,
  },
  inputGroup: {
    marginBottom: Spacing.three,
  },
  label: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '600',
    color: Palette.text.secondary,
    marginBottom: Spacing.two,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.surface,
    borderRadius: 14,
    paddingHorizontal: Spacing.three,
    height: 52,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  inputIcon: {
    marginRight: Spacing.two,
  },
  input: {
    flex: 1,
    fontFamily: Fonts.sans,
    fontSize: 15,
    color: Palette.text.primary,
  },
  eyeButton: {
    padding: Spacing.one,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: Spacing.two,
    paddingRight: Spacing.two,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Palette.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.two,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: Palette.primary[500],
    borderColor: Palette.primary[500],
  },
  checkboxLabel: {
    flex: 1,
    fontFamily: Fonts.sans,
    fontSize: 13,
    color: Palette.text.secondary,
    lineHeight: 18,
  },
  linkText: {
    fontFamily: Fonts.sans,
    color: Palette.primary[500],
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: Palette.primary[500],
    borderRadius: 14,
    height: 52,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.three,
    shadowColor: Palette.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  submitButtonText: {
    fontFamily: Fonts.sans,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  arrowIcon: {
    marginLeft: Spacing.two,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.four,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Palette.border,
  },
  dividerText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: 'bold',
    color: Palette.text.muted,
    paddingHorizontal: Spacing.three,
  },
  googleButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Palette.surfaceWhite,
    borderWidth: 1,
    borderColor: Palette.border,
    borderRadius: 14,
    height: 52,
  },
  googleIcon: {
    marginRight: Spacing.three,
  },
  googleButtonText: {
    fontFamily: Fonts.sans,
    color: Palette.text.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  footerText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    color: Palette.text.secondary,
  },
  footerLink: {
    fontFamily: Fonts.sans,
    color: Palette.primary[500],
    fontWeight: 'bold',
  },
});
