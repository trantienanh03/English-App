import React, { useState } from 'react';
import SignupScreen from '@/components/auth/signup-screen';
import LoginScreen from '@/components/auth/login-screen';
import DashboardScreen from '@/components/dashboard/dashboard-screen';

export default function HomeScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignup, setShowSignup] = useState(true);

  if (isLoggedIn) {
    return (
      <DashboardScreen
        onLogout={() => setIsLoggedIn(false)}
      />
    );
  }

  if (showSignup) {
    return (
      <SignupScreen
        onLoginPress={() => setShowSignup(false)}
        onSignupSuccess={() => {
          alert('Đăng ký thành công!');
          setIsLoggedIn(true);
        }}
      />
    );
  }

  return (
    <LoginScreen
      onSignupPress={() => setShowSignup(true)}
      onLoginSuccess={() => {
        setIsLoggedIn(true);
      }}
    />
  );
}
