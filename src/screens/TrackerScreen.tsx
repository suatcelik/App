import React from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { usePrayerTracker } from "../hooks/usePrayerTracker";
import { PrayerCheckbox } from "../components/PrayerCheckbox";
import { PRAYER_NAMES_TR, PRAYER_ORDER } from "../utils/prayerNames";
import { DailyTrackerEntry } from "../types";

function WeekBar({ entries }: { entries: DailyTrackerEntry[] }) {
  const dayLabels = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
  const today = new Date();

  return (
    <View className="flex-row justify-between mx-4 mb-6 bg-surface rounded-2xl px-4 py-4">
      {entries.map((entry, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const isToday = entry.date === `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
        const count = Object.values(entry.prayers).filter(Boolean).length;
        const percent = count / 5;

        return (
          <View key={entry.date} className="items-center gap-1">
            <View
              className={`w-8 rounded-full overflow-hidden bg-primary`}
              style={{ height: 48 }}
            >
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: `${percent * 100}%`,
                  backgroundColor: isToday ? "#d4af37" : "#2d7d9a",
                  borderRadius: 4,
                }}
              />
            </View>
            <Text
              className={`text-xs font-medium ${
                isToday ? "text-gold" : "text-gray-400"
              }`}
            >
              {dayLabels[d.getDay() === 0 ? 6 : d.getDay() - 1]}
            </Text>
            <Text
              className={`text-xs ${isToday ? "text-gold" : "text-gray-500"}`}
            >
              {count}/5
            </Text>
          </View>
        );
      })}
    </View>
  );
}

export function TrackerScreen() {
  const { todayEntry, weekEntries, loading, togglePrayer, completedToday } =
    usePrayerTracker();

  if (loading) {
    return (
      <LinearGradient colors={["#0f2d47", "#1a4a6e"]} className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#d4af37" />
      </LinearGradient>
    );
  }

  const today = new Date().toLocaleDateString("tr-TR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <LinearGradient colors={["#0f2d47", "#1a4a6e"]} className="flex-1">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="items-center pt-14 pb-6 px-6">
          <Text className="text-gold text-3xl font-bold">📿 Namaz Takibi</Text>
          <Text className="text-gray-300 text-sm mt-1">{today}</Text>
        </View>

        {/* Progress circle */}
        <View className="items-center mb-6">
          <View className="w-28 h-28 rounded-full bg-primary border-4 border-gold/40 items-center justify-center">
            <Text className="text-gold text-4xl font-bold">{completedToday}</Text>
            <Text className="text-gray-400 text-xs">/ 5 Namaz</Text>
          </View>
          {completedToday === 5 && (
            <View className="mt-3 bg-gold/20 px-5 py-2 rounded-full">
              <Text className="text-gold font-semibold">
                🎉 Tüm namazlar kılındı!
              </Text>
            </View>
          )}
        </View>

        {/* Weekly chart */}
        {weekEntries.length > 0 && <WeekBar entries={weekEntries} />}

        {/* Prayer checkboxes */}
        <View className="pb-10">
          {PRAYER_ORDER.map((prayer) => (
            <PrayerCheckbox
              key={prayer}
              prayer={prayer}
              labelTR={PRAYER_NAMES_TR[prayer]}
              checked={todayEntry.prayers[prayer]}
              onToggle={togglePrayer}
            />
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
