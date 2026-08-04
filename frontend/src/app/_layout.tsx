import { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { View, StyleSheet, Platform } from 'react-native';
import '../global.css';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <View style={styles.outerContainer}>
      <View style={styles.mobileFrame}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#121A12', // Dark background for desktop browser surround
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  mobileFrame: {
    width: '100%',
    height: '100%',
    maxWidth: Platform.OS === 'web' ? 440 : undefined,
    maxHeight: Platform.OS === 'web' ? 900 : undefined,
    backgroundColor: '#F4F6F3',
    overflow: 'hidden',
    ...(Platform.OS === 'web'
      ? {
          borderRadius: 24,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 16 },
          shadowOpacity: 0.45,
          shadowRadius: 30,
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.15)',
        }
      : {}),
  },
});
