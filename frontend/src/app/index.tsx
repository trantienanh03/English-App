import React, { useState } from 'react';
import OnboardingScreen, { OnboardingData } from '@/components/onboarding/onboarding-screen';
import SignupScreen from '@/components/auth/signup-screen';
import LoginScreen from '@/components/auth/login-screen';
import MainContainer from '@/components/main-container';

export default function HomeScreen() {
  const [currentScreen, setCurrentScreen] = useState<'onboarding' | 'login' | 'signup' | 'dashboard'>('onboarding');
  const [userOnboardingData, setUserOnboardingData] = useState<OnboardingData | null>(null);

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
          const planInfo = userOnboardingData ? ` (${userOnboardingData.level} • ${userOnboardingData.dailyTime})` : '';
          alert(`Đăng ký thành công! Lộ trình học của bạn${planInfo} đã được kích hoạt.`);
          setCurrentScreen('dashboard');
        }}
      />
    );
  }

  return (
    <LoginScreen
      onSignupPress={() => setCurrentScreen('signup')}
      onLoginSuccess={() => {
        setCurrentScreen('dashboard');
      }}
    />
  );
}
