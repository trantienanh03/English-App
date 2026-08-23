import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import OnboardingScreen, { OnboardingData } from '@/components/onboarding/onboarding-screen';
import SignupScreen from '@/components/auth/signup-screen';
import LoginScreen from '@/components/auth/login-screen';
import MainContainer from '@/components/main-container';
import DotsLoader from '@/components/ui/dots-loader';
import { Palette } from '@/constants/theme';
import { supabase } from '@/lib/supabase';

type Screen = 'onboarding' | 'login' | 'signup' | 'dashboard';

export default function HomeScreen() {
  const [isBooting, setIsBooting] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
  const [userOnboardingData, setUserOnboardingData] = useState<OnboardingData | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          const email = session.user.email || '';
          const name = session.user.user_metadata?.display_name || (email ? email.split('@')[0] : 'Học Viên Vocam');
          setUserName(name);
          setUserEmail(email);
          setCurrentScreen('dashboard');
        }
      } catch (err) {
        console.warn('Session restore check error:', err);
      } finally {
        setIsBooting(false);
      }
    };

    checkSession();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('SignOut warning:', err);
    } finally {
      setUserName('');
      setUserEmail('');
      setCurrentScreen('login');
    }
  };

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
        userName={userName}
        userEmail={userEmail}
        onLogout={handleLogout}
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
        onSignupSuccess={(name, email) => {
          setUserName(name || '');
          setUserEmail(email || '');
          setCurrentScreen('dashboard');
        }}
        onLoginPress={() => setCurrentScreen('login')}
      />
    );
  }

  return (
    <LoginScreen
      onLoginSuccess={(name, email) => {
        setUserName(name || '');
        setUserEmail(email || '');
        setCurrentScreen('dashboard');
      }}
      onSignupPress={() => setCurrentScreen('signup')}
    />
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: Palette.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
});
