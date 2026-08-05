import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Palette, Fonts, Spacing } from '@/constants/theme';

interface SettingsScreenProps {
  onClose: () => void;
  onLogout: () => void;
}

interface SettingRowProps {
  icon: string;
  iconColor?: string;
  label: string;
  value?: string;
  isLast?: boolean;
  onPress?: () => void;
  rightContent?: React.ReactNode;
}

function SettingRow({ icon, iconColor = Palette.text.muted, label, value, isLast, onPress, rightContent }: SettingRowProps) {
  return (
    <TouchableOpacity
      style={[styles.settingRow, isLast && styles.settingRowLast]}
      onPress={onPress}
      disabled={!onPress && !rightContent}
      activeOpacity={onPress ? 0.6 : 1}
    >
      <View style={[styles.settingIcon, { backgroundColor: `${iconColor}18` }]}>
        <Feather name={icon as any} size={16} color={iconColor} />
      </View>
      <Text style={styles.settingLabel}>{label}</Text>
      <View style={styles.settingRight}>
        {value && <Text style={styles.settingValue}>{value}</Text>}
        {rightContent}
        {onPress && <Feather name="chevron-right" size={16} color={Palette.text.muted} />}
      </View>
    </TouchableOpacity>
  );
}

interface SettingGroupProps {
  title: string;
  children: React.ReactNode;
}

function SettingGroup({ title, children }: SettingGroupProps) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupTitle}>{title}</Text>
      <View style={styles.groupCard}>{children}</View>
    </View>
  );
}

export default function SettingsScreen({ onClose, onLogout }: SettingsScreenProps) {
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [autoPlayAudio, setAutoPlayAudio] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Feather name="x" size={22} color={Palette.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cài đặt</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* LEARNING */}
        <SettingGroup title="Học tập">
          <SettingRow
            icon="clock"
            iconColor={Palette.primary[500]}
            label="Mục tiêu hàng ngày"
            value="10 phút/ngày"
            onPress={() => {}}
          />
          <SettingRow
            icon="trending-up"
            iconColor={Palette.secondary[500]}
            label="Mức độ học tập"
            value="Trung cấp"
            onPress={() => {}}
          />
          <SettingRow
            icon="volume-2"
            iconColor={Palette.info.text}
            label="Tự phát âm khi lật thẻ"
            isLast
            rightContent={
              <Switch
                value={autoPlayAudio}
                onValueChange={setAutoPlayAudio}
                trackColor={{ false: Palette.border, true: Palette.primary[400] }}
                thumbColor={Palette.surfaceWhite}
              />
            }
          />
        </SettingGroup>

        {/* NOTIFICATIONS */}
        <SettingGroup title="Thông báo">
          <SettingRow
            icon="bell"
            iconColor={Palette.warning.text}
            label="Nhắc nhở học hàng ngày"
            rightContent={
              <Switch
                value={notifEnabled}
                onValueChange={setNotifEnabled}
                trackColor={{ false: Palette.border, true: Palette.primary[400] }}
                thumbColor={Palette.surfaceWhite}
              />
            }
          />
          <SettingRow
            icon="clock"
            iconColor={Palette.text.muted}
            label="Giờ nhắc nhở"
            value="08:00 SA"
            onPress={notifEnabled ? () => {} : undefined}
            isLast
          />
        </SettingGroup>

        {/* SOUND & HAPTIC */}
        <SettingGroup title="Âm thanh & Rung">
          <SettingRow
            icon="music"
            iconColor={Palette.primary[500]}
            label="Hiệu ứng âm thanh"
            rightContent={
              <Switch
                value={soundEnabled}
                onValueChange={setSoundEnabled}
                trackColor={{ false: Palette.border, true: Palette.primary[400] }}
                thumbColor={Palette.surfaceWhite}
              />
            }
          />
          <SettingRow
            icon="smartphone"
            iconColor={Palette.secondary[500]}
            label="Rung phản hồi"
            isLast
            rightContent={
              <Switch
                value={hapticEnabled}
                onValueChange={setHapticEnabled}
                trackColor={{ false: Palette.border, true: Palette.primary[400] }}
                thumbColor={Palette.surfaceWhite}
              />
            }
          />
        </SettingGroup>

        {/* ACCOUNT */}
        <SettingGroup title="Tài khoản">
          <SettingRow
            icon="user"
            iconColor={Palette.info.text}
            label="Chỉnh sửa hồ sơ"
            onPress={() => {}}
          />
          <SettingRow
            icon="lock"
            iconColor={Palette.text.muted}
            label="Đổi mật khẩu"
            onPress={() => {}}
          />
          <SettingRow
            icon="shield"
            iconColor={Palette.primary[500]}
            label="Quyền riêng tư"
            onPress={() => {}}
          />
          <SettingRow
            icon="help-circle"
            iconColor={Palette.secondary[500]}
            label="Trợ giúp & Hỗ trợ"
            onPress={() => {}}
            isLast
          />
        </SettingGroup>

        {/* APP INFO */}
        <SettingGroup title="Ứng dụng">
          <SettingRow
            icon="info"
            iconColor={Palette.text.muted}
            label="Phiên bản"
            value="1.0.0"
          />
          <SettingRow
            icon="star"
            iconColor={Palette.warning.text}
            label="Đánh giá ứng dụng"
            onPress={() => {}}
            isLast
          />
        </SettingGroup>

        {/* LOGOUT */}
        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <Feather name="log-out" size={16} color={Palette.error.text} />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Palette.canvas,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
    backgroundColor: Palette.surfaceWhite,
  },
  closeBtn: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontFamily: Fonts.sans,
    fontSize: 16,
    fontWeight: '700',
    color: Palette.text.primary,
    textAlign: 'center',
  },

  scroll: { flex: 1 },
  scrollContent: {
    padding: Spacing.four,
    paddingBottom: 40,
    gap: Spacing.three,
  },

  group: {
    gap: Spacing.one,
  },
  groupTitle: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    fontWeight: '700',
    color: Palette.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    paddingHorizontal: Spacing.one,
    marginBottom: 4,
  },
  groupCard: {
    backgroundColor: Palette.surfaceWhite,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Palette.border,
    overflow: 'hidden',
  },

  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
  },
  settingRowLast: {
    borderBottomWidth: 0,
  },
  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingLabel: {
    flex: 1,
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '500',
    color: Palette.text.primary,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  settingValue: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    color: Palette.text.muted,
  },

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    backgroundColor: Palette.error.bg,
    borderRadius: 16,
    paddingVertical: Spacing.three,
    marginTop: Spacing.one,
  },
  logoutText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '700',
    color: Palette.error.text,
  },
});
