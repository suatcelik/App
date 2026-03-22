import * as Notifications from "expo-notifications";
import { PrayerTimesData } from "../types";
import { PRAYER_NAMES_TR } from "./prayerNames";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export async function schedulePrayerNotifications(
  times: PrayerTimesData
): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();

  const prayers: Array<{ key: keyof PrayerTimesData; label: string }> = [
    { key: "fajr", label: PRAYER_NAMES_TR.Fajr },
    { key: "dhuhr", label: PRAYER_NAMES_TR.Dhuhr },
    { key: "asr", label: PRAYER_NAMES_TR.Asr },
    { key: "maghrib", label: PRAYER_NAMES_TR.Maghrib },
    { key: "isha", label: PRAYER_NAMES_TR.Isha },
  ];

  for (const prayer of prayers) {
    const time = times[prayer.key] as Date;
    if (!(time instanceof Date)) continue;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `🕌 ${prayer.label} Vakti`,
        body: `${prayer.label} namazı vakti girdi.`,
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: time.getHours(),
        minute: time.getMinutes(),
      },
    });
  }
}

export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
