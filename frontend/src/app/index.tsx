import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import OnboardingScreen, { OnboardingData } from '@/components/onboarding/onboarding-screen';
import SignupScreen from '@/components/auth/signup-screen';
import LoginScreen from '@/components/auth/login-screen';
import MainContainer from '@/components/main-container';
import DotsLoader from '@/components/ui/dots-loader';
import { Palette } from '@/constants/theme';

type Screen = 'onboarding' | 'login' | 'signup' | 'dashboard';

// Brief splash duration on first launch (ms)
const SPLASH_MS = 1400;

export default function HomeScreen() {
  const [isBooting, setIsBooting] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
  const [userOnboardingData, setUserOnboardingData] = useState<OnboardingData | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsBooting(false), SPLASH_MS);
    return () => clearTimeout(timer);
  }, []);

  if (isBooting) {
    return (
      <View style={styles.splash}>
        <DotsLoader color="#FFFFFF" size={14} gap={12} />
      </View>
    );
  }

  if (currentScreen === 'dashboard') {
    return (
      <MainContainer
        onLogout={() => setCurrentScreen('onboarding')}
      />
    );
  }

  if (currentScreen === 'onboarding') {
    return (
      <OnboardingScreen
        onLoginPress={() => setCurrentScreen('login')}
        onComplete={(data) => {
          setUserOnboardingData(data);
          setCurrentScreen('signup');
        }}
      />
    );
  }

  if (currentScreen === 'signup') {
    return (
      <SignupScreen
        onLoginPress={() => setCurrentScreen('login')}
        onSignupSuccess={() => {
          const planInfo = userOnboardingData
            ? ` (${userOnboardingData.level} • ${userOnboardingData.dailyTime})`
            : '';
          alert(`Đăng ký thành công! Lộ trình học của bạn${planInfo} đã được kích hoạt.`);
          setCurrentScreen('dashboard');
        }}
      />
    );
  }

  return (
    <LoginScreen
      onSignupPress={() => setCurrentScreen('signup')}
      onLoginSuccess={() => setCurrentScreen('dashboard')}
    />
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: Palette.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
});
