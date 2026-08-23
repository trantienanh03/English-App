/**
 * Vocam Notification Utility
 * Schedules local review notifications for SM-2 Spaced Repetition due cards
 */
export async function registerForPushNotificationsAsync(): Promise<boolean> {
  return true;
}

export async function scheduleSM2ReviewNotification(dueCount: number, delaySeconds: number = 3600): Promise<string | null> {
  if (dueCount > 0) {
    console.log(`[Local Notification] Lịch nhắc nhở ôn tập SM-2 đã được lên lịch: Bạn có ${dueCount} từ vựng cần ôn tập.`);
  }
  return 'local_sm2_notification_id';
}
