import React from 'react';
import DropsAuthScreen from './drops-auth-screen';

interface LoginScreenProps {
  onSignupPress?: () => void;
  onLoginSuccess: () => void;
  onClose?: () => void;
}

export default function LoginScreen({ onLoginSuccess, onClose }: LoginScreenProps) {
  return (
    <DropsAuthScreen
      initialMode="login"
      onAuthSuccess={() => onLoginSuccess()}
      onClose={onClose}
    />
  );
}
