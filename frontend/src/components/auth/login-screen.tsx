import React from 'react';
import DropsAuthScreen from './drops-auth-screen';

interface LoginScreenProps {
  onSignupPress?: () => void;
  onLoginSuccess: (name?: string, email?: string) => void;
  onClose?: () => void;
}

export default function LoginScreen({ onLoginSuccess, onClose }: LoginScreenProps) {
  return (
    <DropsAuthScreen
      initialMode="login"
      onAuthSuccess={(name, email) => onLoginSuccess(name, email)}
      onClose={onClose}
    />
  );
}
