import React, { useState } from 'react';
import SignupScreen from '@/components/auth/signup-screen';
import LoginScreen from '@/components/auth/login-screen';

export default function HomeScreen() {
  const [showSignup, setShowSignup] = useState(true);

  if (showSignup) {
    return (
      <SignupScreen
        onLoginPress={() => setShowSignup(false)}
        onSignupSuccess={() => alert('Đăng ký thành công!')}
      />
    );
  }

  return (
    <LoginScreen
      onSignupPress={() => setShowSignup(true)}
      onLoginSuccess={() => alert('Đăng nhập thành công!')}
    />
  );
}
