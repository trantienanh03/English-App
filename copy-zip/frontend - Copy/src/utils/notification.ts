import { Platform } from 'react-native';

/**
 * Mock Notification Utility (Scope frozen without native push notification dependency)
 */
export async function registerForPushNotificationsAsync(): Promise<boolean> {
  return true;
}

export async function scheduleSM2ReviewNotification(dueCount: number, delaySeconds: number = 3600): Promise<string | null> {
  console.log(`[Mock Notification] SM-2 Review scheduled for ${dueCount} words in ${delaySeconds}s.`);
  return 'mock_notification_id';
}

export async function sendStreakNotification(streakDays: number, xpEarned: number): Promise<void> {
  console.log(`[Mock Notification] Streak ${streakDays} days! +${xpEarned} XP.`);
}
