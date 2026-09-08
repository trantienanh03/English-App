import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import OnboardingScreen from '@/components/onboarding/onboarding-screen';
import SignupScreen from '@/components/auth/signup-screen';
import LoginScreen from '@/components/auth/login-screen';
import MainContainer from '@/components/main-container';
import DotsLoader from '@/components/ui/dots-loader';
import RecoveryPasswordScreen from '@/components/auth/recovery-password-screen';
import { Palette } from '@/constants/theme';
import { supabase } from '@/lib/supabase';

type Screen = 'onboarding' | 'login' | 'signup' | 'recovery' | 'dashboard';

export default function HomeScreen() {
  const [isBooting, setIsBooting] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
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
        } else {
          const savedUser = await AsyncStorage.getItem('@vocam/active_user');
          if (savedUser) {
            const parsed = JSON.parse(savedUser);
            if (parsed?.email) {
              setUserEmail(parsed.email);
              setUserName(parsed.name || parsed.email.split('@')[0]);
              setCurrentScreen('dashboard');
            }
          }
        }
      } catch (err) {
        console.warn('Session restore check error:', err);
      } finally {
        setIsBooting(false);
      }
    };

    void checkSession();
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setCurrentScreen('recovery');
        return;
      }
      if (session?.user) {
        const email = session.user.email || '';
        setUserEmail(email);
        setUserName(session.user.user_metadata?.display_name || email.split('@')[0] || 'Học Viên Vocam');
        setCurrentScreen('dashboard');
      } else if (event === 'SIGNED_OUT') {
        setCurrentScreen('login');
      }
    });

    const handleRecoveryLink = async (url: string | null) => {
      if (!url || !url.includes('reset-password')) return;
      const parsed = Linking.parse(url);
      const code = typeof parsed.queryParams?.code === 'string' ? parsed.queryParams.code : null;
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) setCurrentScreen('recovery');
        return;
      }
      const fragment = url.split('#')[1] || '';
      const params = new URLSearchParams(fragment);
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
        if (!error) setCurrentScreen('recovery');
      }
    };
    void Linking.getInitialURL().then(handleRecoveryLink);
    const linkListener = Linking.addEventListener('url', event => void handleRecoveryLink(event.url));
    return () => {
      listener.subscription.unsubscribe();
      linkListener.remove();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      await AsyncStorage.removeItem('@vocam/active_user');
    } catch (err) {
      console.warn('SignOut warning:', err);
    } finally {
      setUserName('');
      setUserEmail('');
      setCurrentScreen('login');
    }
  };

  const renderContent = () => {
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
          onComplete={() => {
            setCurrentScreen('signup');
          }}
        />
      );
    }

    if (currentScreen === 'signup') {
      return (
        <SignupScreen
          onSignupSuccess={async (name, email) => {
            const finalEmail = email || '';
            const finalName = name || (finalEmail.toLowerCase().includes('admin') ? 'Quản Trị Viên Vocam' : 'Học Viên Vocam');
            await AsyncStorage.setItem('@vocam/active_user', JSON.stringify({ email: finalEmail, name: finalName }));
            setUserName(finalName);
            setUserEmail(finalEmail);
            setCurrentScreen('dashboard');
          }}
          onLoginPress={() => setCurrentScreen('login')}
        />
      );
    }

    if (currentScreen === 'recovery') {
      return <RecoveryPasswordScreen onComplete={() => setCurrentScreen('login')} />;
    }

    return (
      <LoginScreen
        onLoginSuccess={async (name, email) => {
          const finalEmail = email || '';
          const finalName = name || (finalEmail.toLowerCase().includes('admin') ? 'Quản Trị Viên Vocam' : 'Học Viên Vocam');
          await AsyncStorage.setItem('@vocam/active_user', JSON.stringify({ email: finalEmail, name: finalName }));
          setUserName(finalName);
          setUserEmail(finalEmail);
          setCurrentScreen('dashboard');
        }}
        onSignupPress={() => setCurrentScreen('signup')}
      />
    );
  };

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      {renderContent()}
    </SafeAreaProvider>
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
