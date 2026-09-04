import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

const STORAGE_KEY = '@vocam/review_notification_id';
const CHANNEL_ID = 'vocam-review';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForReviewNotifications(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Nhắc ôn tập',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
    });
  }
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

export async function cancelReviewNotification(): Promise<void> {
  const existing = await AsyncStorage.getItem(STORAGE_KEY);
  if (existing) {
    try { await Notifications.cancelScheduledNotificationAsync(existing); } catch { /* already delivered */ }
    await AsyncStorage.removeItem(STORAGE_KEY);
  }
}

export async function scheduleReviewNotification(dueCount: number, delaySeconds = 3600): Promise<string | null> {
  await cancelReviewNotification();
  const isTest = delaySeconds <= 10;
  if (!isTest && dueCount <= 0) return null;
  if (!(await registerForReviewNotifications())) return null;
  
  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: isTest ? 'Vocam: Đến giờ ôn từ vựng' : 'Đến giờ ôn từ cùng Vocam',
      body: dueCount > 0
        ? `Bạn có ${dueCount} thẻ từ đến hạn ôn tập theo thuật toán SM-2.`
        : 'Hệ thống nhắc nhở hoạt động bình thường! Chạm để bắt đầu ôn tập.',
      sound: true,
      data: { destination: 'cards' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: Math.max(1, delaySeconds),
      repeats: false,
      channelId: Platform.OS === 'android' ? CHANNEL_ID : undefined,
    },
  });
  await AsyncStorage.setItem(STORAGE_KEY, identifier);
  return identifier;
}

export async function hasScheduledReviewNotification(): Promise<boolean> {
  const identifier = await AsyncStorage.getItem(STORAGE_KEY);
  if (!identifier) return false;
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  return scheduled.some(item => item.identifier === identifier);
}
