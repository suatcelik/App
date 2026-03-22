import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PrayerName, DailyTrackerEntry } from "../types";
import { PRAYER_ORDER, getTodayKey } from "../utils/prayerNames";

const STORAGE_PREFIX = "PRAYER_APP::LOG_";

function emptyEntry(date: string): DailyTrackerEntry {
  return {
    date,
    prayers: {
      Fajr: false,
      Dhuhr: false,
      Asr: false,
      Maghrib: false,
      Isha: false,
    },
  };
}

export function usePrayerTracker() {
  const [todayEntry, setTodayEntry] = useState<DailyTrackerEntry>(
    emptyEntry(getTodayKey())
  );
  const [weekEntries, setWeekEntries] = useState<DailyTrackerEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    const today = getTodayKey();

    const entries: DailyTrackerEntry[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      try {
        const raw = await AsyncStorage.getItem(STORAGE_PREFIX + key);
        if (raw) {
          entries.push(JSON.parse(raw));
        } else {
          entries.push(emptyEntry(key));
        }
      } catch {
        entries.push(emptyEntry(key));
      }
    }

    setWeekEntries(entries);
    setTodayEntry(entries[entries.length - 1] ?? emptyEntry(today));
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const togglePrayer = useCallback(
    async (prayer: PrayerName) => {
      const updated: DailyTrackerEntry = {
        ...todayEntry,
        prayers: {
          ...todayEntry.prayers,
          [prayer]: !todayEntry.prayers[prayer],
        },
      };
      setTodayEntry(updated);
      // optimistic update in weekEntries too
      setWeekEntries((prev) =>
        prev.map((e) => (e.date === updated.date ? updated : e))
      );
      try {
        await AsyncStorage.setItem(
          STORAGE_PREFIX + updated.date,
          JSON.stringify(updated)
        );
      } catch {
        // revert on error
        loadData();
      }
    },
    [todayEntry, loadData]
  );

  const completedToday = PRAYER_ORDER.filter(
    (p) => todayEntry.prayers[p]
  ).length;

  return {
    todayEntry,
    weekEntries,
    loading,
    togglePrayer,
    completedToday,
  };
}
