export type PrayerName = "Fajr" | "Dhuhr" | "Asr" | "Maghrib" | "Isha";

export interface PrayerTime {
  name: PrayerName;
  labelTR: string;
  labelAR: string;
  time: Date;
}

export interface PrayerTimesData {
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
  date: Date;
}

export interface DailyTrackerEntry {
  date: string; // YYYY-MM-DD
  prayers: Record<PrayerName, boolean>;
}

export interface QuranVerse {
  arabic: string;
  turkish: string;
  surah: string;
  ayah: number;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
}
