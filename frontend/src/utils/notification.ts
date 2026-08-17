import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Request Push Notification permissions on device
 */
export async function registerForPushNotificationsAsync(): Promise<boolean> {
  if (Platform.OS === 'web') {
    console.log('Push notifications are handled locally on Web.');
    return true;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('Push notification permission denied!');
    return false;
  }

  return true;
}

/**
 * Schedule a Smart SM-2 Spaced Repetition Reminder
 * Notifies the learner when Flashcards are due for review.
 *
 * @param dueCount Number of flashcards due for review
 * @param delaySeconds Time in seconds until reminder triggers
 */
export async function scheduleSM2ReviewNotification(dueCount: number, delaySeconds: number = 3600): Promise<string | null> {
  try {
    const hasPermission = await registerForPushNotificationsAsync();
    if (!hasPermission) return null;

    // Cancel existing pending notifications to avoid spamming
    await Notifications.cancelAllScheduledNotificationsAsync();

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: '🧠 Thời Điểm Vàng Ôn Tập SM-2!',
        body: `Bạn đang có ${dueCount} từ vựng chuẩn bị vào vùng quên. Dành 2 phút ôn tập ngay để giữ Streak nhé! 🔥`,
        data: { screen: 'ReviewScreen', dueCount },
        sound: 'default',
      },
      trigger: {
        seconds: Math.max(delaySeconds, 10),
      },
    });

    console.log(`🔔 Scheduled SM-2 Notification #${id} in ${delaySeconds} seconds.`);
    return id;
  } catch (err) {
    console.warn('Error scheduling SM-2 notification:', err);
    return null;
  }
}

/**
 * Send an Instant Reminder Toast/Notification when Streak is maintained
 */
export async function sendStreakNotification(streakDays: number, xpEarned: number): Promise<void> {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `🔥 Chúc mừng Streak ${streakDays} Ngày!`,
        body: `Bạn vừa nhận được +${xpEarned} XP! Hãy duy trì phong độ học tập hàng ngày nhé.`,
        sound: 'default',
      },
      trigger: null, // Instant trigger
    });
  } catch (err) {
    console.warn('Error sending streak notification:', err);
  }
}
