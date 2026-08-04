import React from 'react';
import AuthGateScreen from './auth-gate-screen';

interface LoginScreenProps {
  onSignupPress: () => void;
  onLoginSuccess: () => void;
  onBypassGuest?: () => void;
}

export default function LoginScreen({ onLoginSuccess, onBypassGuest }: LoginScreenProps) {
  return (
    <AuthGateScreen
      initialMode="login"
      onLoginSuccess={() => onLoginSuccess()}
      onBypassGuest={onBypassGuest || onLoginSuccess}
    />
  );
}
