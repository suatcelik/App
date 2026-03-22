import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { usePrayerTimes } from "../hooks/usePrayerTimes";
import { PrayerCard } from "../components/PrayerCard";
import { PrayerTime, PrayerName } from "../types";
import {
  PRAYER_NAMES_TR,
  PRAYER_NAMES_AR,
  PRAYER_ORDER,
  formatTime,
} from "../utils/prayerNames";
import {
  requestNotificationPermission,
  schedulePrayerNotifications,
} from "../utils/notifications";

function getCountdown(target: Date): string {
  const now = new Date();
  let diff = target.getTime() - now.getTime();
  if (diff < 0) return "Geçti";
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function PrayerTimesScreen() {
  const { prayerTimes, location, loading, error, refresh } = usePrayerTimes();
  const [countdown, setCountdown] = useState("");
  const [now, setNow] = useState(new Date());
  const [notifScheduled, setNotifScheduled] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!prayerTimes) return;
    const prayers = buildPrayerList(prayerTimes);
    const next = prayers.find((p) => p.time > now);
    if (next) {
      setCountdown(getCountdown(next.time));
    }
  }, [now, prayerTimes]);

  useEffect(() => {
    if (prayerTimes && !notifScheduled) {
      requestNotificationPermission().then((granted) => {
        if (granted) {
          schedulePrayerNotifications(prayerTimes).catch(() => {});
          setNotifScheduled(true);
        }
      });
    }
  }, [prayerTimes]);

  function buildPrayerList(pt: NonNullable<typeof prayerTimes>): PrayerTime[] {
    const map: Record<PrayerName, Date> = {
      Fajr: pt.fajr,
      Dhuhr: pt.dhuhr,
      Asr: pt.asr,
      Maghrib: pt.maghrib,
      Isha: pt.isha,
    };
    return PRAYER_ORDER.map((name) => ({
      name,
      labelTR: PRAYER_NAMES_TR[name],
      labelAR: PRAYER_NAMES_AR[name],
      time: map[name],
    }));
  }

  if (loading) {
    return (
      <LinearGradient colors={["#0f2d47", "#1a4a6e"]} className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#d4af37" />
        <Text className="text-white mt-4 text-base">Konum alınıyor...</Text>
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient colors={["#0f2d47", "#1a4a6e"]} className="flex-1 items-center justify-center px-8">
        <Text className="text-white text-xl font-bold text-center mb-2">Hata</Text>
        <Text className="text-gray-300 text-center mb-6">{error}</Text>
        <TouchableOpacity
          onPress={refresh}
          className="bg-accent px-6 py-3 rounded-full"
        >
          <Text className="text-surface font-bold">Tekrar Dene</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  const prayers = prayerTimes ? buildPrayerList(prayerTimes) : [];
  const nextPrayer = prayers.find((p) => p.time > now);
  const todayStr = now.toLocaleDateString("tr-TR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <LinearGradient colors={["#0f2d47", "#1a4a6e"]} className="flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refresh}
            tintColor="#d4af37"
          />
        }
      >
        {/* Header */}
        <View className="items-center pt-14 pb-8 px-6">
          <Text className="text-gold text-3xl font-bold">🕌 Namaz Vakitleri</Text>
          <Text className="text-gray-300 text-base mt-1">{todayStr}</Text>
          {location?.city && (
            <View className="flex-row items-center mt-2 gap-1">
              <Text className="text-secondary text-sm">📍</Text>
              <Text className="text-secondary text-sm">{location.city}</Text>
            </View>
          )}
        </View>

        {/* Countdown banner */}
        {nextPrayer && (
          <View className="mx-4 mb-6 bg-primary rounded-2xl px-6 py-5 items-center border border-gold/30">
            <Text className="text-gray-300 text-sm mb-1">
              {nextPrayer.labelTR} vaktine kalan
            </Text>
            <Text className="text-gold text-4xl font-bold tracking-widest">
              {countdown}
            </Text>
          </View>
        )}

        {/* Sunrise info */}
        {prayerTimes && (
          <View className="mx-4 mb-4 flex-row justify-center bg-surface/60 rounded-xl px-4 py-3 gap-6">
            <View className="items-center">
              <Text className="text-yellow-300 text-lg">🌅</Text>
              <Text className="text-gray-400 text-xs">Güneş Doğuşu</Text>
              <Text className="text-white font-semibold">
                {formatTime(prayerTimes.sunrise)}
              </Text>
            </View>
          </View>
        )}

        {/* Prayer list */}
        <View className="pb-8">
          {prayers.map((prayer) => (
            <PrayerCard
              key={prayer.name}
              prayer={prayer}
              isNext={nextPrayer?.name === prayer.name}
              isPast={prayer.time < now}
            />
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
