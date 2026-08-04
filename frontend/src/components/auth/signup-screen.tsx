import React from 'react';
import AuthGateScreen from './auth-gate-screen';

interface SignupScreenProps {
  onLoginPress: () => void;
  onSignupSuccess: () => void;
  onBypassGuest?: () => void;
}

export default function SignupScreen({ onSignupSuccess, onBypassGuest }: SignupScreenProps) {
  return (
    <AuthGateScreen
      initialMode="signup"
      onLoginSuccess={() => onSignupSuccess()}
      onBypassGuest={onBypassGuest || onSignupSuccess}
    />
  );
}
