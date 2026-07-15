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
import { Spacing } from '@/constants/theme';

interface LoginScreenProps {
  onSignupPress: () => void;
  onLoginSuccess: () => void;
}

export default function LoginScreen({ onSignupPress, onLoginSuccess }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const handleLogin = () => {
    if (email && password) {
      onLoginSuccess();
    } else {
      alert('Vui lòng nhập Email và Mật khẩu.');
    }
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
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <View style={styles.logoRow}>
              <Feather name="book-open" size={32} color="#1D7DF0" style={styles.logoIcon} />
              <Text style={styles.logoText}>Vocam</Text>
            </View>
            <Text style={styles.title}>Chào mừng trở lại!</Text>
            <Text style={styles.subtitle}>
              Học tiếng Anh thật dễ dàng cùng Vocam.
            </Text>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <Feather name="mail" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="email@vi-du.com"
                  placeholderTextColor="#BBB"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <View style={styles.passwordHeader}>
                <Text style={styles.label}>Mật khẩu</Text>
                <TouchableOpacity onPress={() => alert('Chức năng đang được cập nhật!')}>
                  <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.inputWrapper}>
                <Feather name="lock" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#BBB"
                  secureTextEntry={secureTextEntry}
                  autoCapitalize="none"
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  onPress={() => setSecureTextEntry(!secureTextEntry)}
                  style={styles.eyeButton}
                >
                  <Feather name={secureTextEntry ? 'eye-off' : 'eye'} size={20} color="#999" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity style={styles.submitButton} onPress={handleLogin}>
              <Text style={styles.submitButtonText}>Đăng nhập</Text>
              <Feather name="arrow-right" size={18} color="#FFF" style={styles.arrowIcon} />
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>hoặc</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google Login Button */}
            <TouchableOpacity style={styles.googleButton} onPress={onLoginSuccess}>
              <AntDesign name="google" size={20} color="#EA4335" style={styles.googleIcon} />
              <Text style={styles.googleButtonText}>Tiếp tục với Google</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.marketingContainer}>
            <View style={styles.badgeItemGreen}>
              <View style={styles.badgeIconBgGreen}>
                <MaterialCommunityIcons name="lightning-bolt" size={20} color="#10B981" />
              </View>
              <View style={styles.badgeTextWrapper}>
                <Text style={styles.badgeTitle}>Học nhanh hơn 2x</Text>
                <Text style={styles.badgeSubtitle}>Với AI thông minh</Text>
              </View>
            </View>

            <View style={styles.badgeItemGold}>
              <View style={styles.badgeIconBgGold}>
                <MaterialCommunityIcons name="star" size={20} color="#F59E0B" />
              </View>
              <View style={styles.badgeTextWrapper}>
                <Text style={styles.badgeTitle}>1M+ Người dùng</Text>
                <Text style={styles.badgeSubtitle}>Tin dùng mỗi ngày</Text>
              </View>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Bạn chưa có tài khoản?{' '}
              <Text style={styles.footerLink} onPress={onSignupPress}>
                Đăng ký ngay
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
    backgroundColor: '#F8FAFC',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six,
  },
  logoSection: {
    alignItems: 'center',
    marginTop: Spacing.five,
    marginBottom: Spacing.four,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  logoIcon: {
    marginRight: Spacing.two,
  },
  logoText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1D7DF0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: Spacing.two,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    paddingHorizontal: Spacing.three,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: Spacing.four,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
    marginBottom: Spacing.four,
  },
  inputGroup: {
    marginBottom: Spacing.three,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#475569',
    marginBottom: Spacing.two,
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotPasswordText: {
    fontSize: 13,
    color: '#1D7DF0',
    fontWeight: '500',
    marginBottom: Spacing.two,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    paddingHorizontal: Spacing.three,
    height: 52,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  inputIcon: {
    marginRight: Spacing.two,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1E293B',
  },
  eyeButton: {
    padding: Spacing.one,
  },
  submitButton: {
    backgroundColor: '#1D7DF0',
    borderRadius: 14,
    height: 52,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.three,
    shadowColor: '#1D7DF0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  submitButtonText: {
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
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#94A3B8',
    paddingHorizontal: Spacing.three,
  },
  googleButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    height: 52,
  },
  googleIcon: {
    marginRight: Spacing.three,
  },
  googleButtonText: {
    color: '#334155',
    fontSize: 15,
    fontWeight: '600',
  },
  marketingContainer: {
    gap: Spacing.two,
    marginBottom: Spacing.four,
  },
  badgeItemGreen: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 18,
    padding: Spacing.three,
  },
  badgeIconBgGreen: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#C8E6C9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.three,
  },
  badgeItemGold: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    borderRadius: 18,
    padding: Spacing.three,
  },
  badgeIconBgGold: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFE082',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.three,
  },
  badgeTextWrapper: {
    justifyContent: 'center',
  },
  badgeTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  badgeSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  footer: {
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  footerText: {
    fontSize: 14,
    color: '#64748B',
  },
  footerLink: {
    color: '#1D7DF0',
    fontWeight: 'bold',
  },
});
