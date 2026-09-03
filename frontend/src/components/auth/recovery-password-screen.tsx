import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '@/lib/supabase';
import { Palette, Spacing } from '@/constants/theme';

interface RecoveryPasswordScreenProps {
  onComplete: () => void;
}

export default function RecoveryPasswordScreen({ onComplete }: RecoveryPasswordScreenProps) {
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updatePassword = async () => {
    setError(null);
    if (password.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }
    if (password !== confirmation) {
      setError('Hai mật khẩu chưa trùng khớp.');
      return;
    }
    setSaving(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      await supabase.auth.signOut();
      Alert.alert('Đã đổi mật khẩu', 'Bạn có thể đăng nhập bằng mật khẩu mới.');
      onComplete();
    } catch (err: any) {
      setError(err?.message || 'Liên kết đã hết hạn hoặc không thể đổi mật khẩu. Hãy yêu cầu email mới.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.card}>
        <Text style={styles.title}>Tạo mật khẩu mới</Text>
        <Text style={styles.subtitle}>Nhập mật khẩu mới cho tài khoản Vocam của bạn.</Text>
        <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry placeholder="Mật khẩu mới" />
        <TextInput style={styles.input} value={confirmation} onChangeText={setConfirmation} secureTextEntry placeholder="Nhập lại mật khẩu" />
        {error && <Text style={styles.error}>{error}</Text>}
        <TouchableOpacity style={styles.button} disabled={saving} onPress={() => void updatePassword()}>
          <Text style={styles.buttonText}>{saving ? 'Đang lưu...' : 'Đổi mật khẩu'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Palette.canvas, justifyContent: 'center', padding: Spacing.four },
  card: { backgroundColor: Palette.surfaceWhite, borderRadius: 20, borderWidth: 1, borderColor: Palette.border, padding: 22, gap: 12 },
  title: { fontSize: 22, fontWeight: '800', color: Palette.text.primary },
  subtitle: { fontSize: 14, color: Palette.text.secondary, lineHeight: 20 },
  input: { borderWidth: 1, borderColor: Palette.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, color: Palette.text.primary },
  error: { color: Palette.error.text, fontSize: 13 },
  button: { backgroundColor: Palette.primary[500], borderRadius: 12, padding: 14, alignItems: 'center' },
  buttonText: { color: '#FFFFFF', fontWeight: '700' },
});
