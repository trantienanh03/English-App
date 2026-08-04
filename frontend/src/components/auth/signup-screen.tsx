import React from 'react';
import DropsAuthScreen from './drops-auth-screen';

interface SignupScreenProps {
  onLoginPress?: () => void;
  onSignupSuccess: () => void;
  onClose?: () => void;
}

export default function SignupScreen({ onSignupSuccess, onClose }: SignupScreenProps) {
  return (
    <DropsAuthScreen
      initialMode="signup"
      onAuthSuccess={() => onSignupSuccess()}
      onClose={onClose}
    />
  );
}
