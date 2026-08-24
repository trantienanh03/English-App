import { Platform } from 'react-native';
import * as Speech from 'expo-speech';

/**
 * Pronounces English words using Speech Synthesis or Expo Speech fallback.
 */
export const playAudio = (text: string) => {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      
      const voices = window.speechSynthesis.getVoices();
      const cleanVoice = voices.find(
        v => v.lang.startsWith('en-US') && (v.name.includes('Google') || v.name.includes('Natural'))
      ) || voices.find(v => v.lang.startsWith('en-US'));
      
      if (cleanVoice) {
        utterance.voice = cleanVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('SpeechSynthesis error:', e);
    }
  } else {
    // Native TTS fallback using expo-speech
    try {
      console.log(`[Audio TTS] Speaking via expo-speech: "${text}"`);
      void Speech.stop();
      void Speech.speak(text, {
        language: 'en-US',
        rate: 0.9,
      });
    } catch (e) {
      console.warn('Expo Speech error:', e);
    }
  }
};

/**
 * Synthetic sound effects using Web Audio API (offline, zero audio files required)
 */
export const playSoundEffect = (type: 'correct' | 'incorrect' | 'success') => {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return;

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    
    const ctx = new AudioContextClass();
    
    if (type === 'correct') {
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      gain1.gain.setValueAtTime(0.08, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.2);
      
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.frequency.setValueAtTime(783.99, ctx.currentTime); // G5
        gain2.gain.setValueAtTime(0.08, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc2.start();
        osc2.stop(ctx.currentTime + 0.25);
      }, 80);
      
    } else if (type === 'incorrect') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
      
    } else if (type === 'success') {
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25];
      notes.forEach((freq, index) => {
        setTimeout(() => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          gain.gain.setValueAtTime(0.06, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
          osc.start();
          osc.stop(ctx.currentTime + 0.3);
        }, index * 70);
      });
    }
  } catch (error) {
    console.warn('Synthetic sound effect error:', error);
  }
};
