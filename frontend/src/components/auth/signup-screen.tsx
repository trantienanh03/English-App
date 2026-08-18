import React from 'react';
import DropsAuthScreen from './drops-auth-screen';

interface SignupScreenProps {
  onLoginPress?: () => void;
  onSignupSuccess: (name?: string, email?: string) => void;
  onClose?: () => void;
}

export default function SignupScreen({ onSignupSuccess, onClose }: SignupScreenProps) {
  return (
    <DropsAuthScreen
      initialMode="signup"
      onAuthSuccess={(name, email) => onSignupSuccess(name, email)}
      onClose={onClose}
    />
  );
}
