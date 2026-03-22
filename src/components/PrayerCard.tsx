import React from "react";
import { View, Text } from "react-native";
import { PrayerTime } from "../types";
import { formatTime } from "../utils/prayerNames";

interface PrayerCardProps {
  prayer: PrayerTime;
  isNext: boolean;
  isPast: boolean;
}

export function PrayerCard({ prayer, isNext, isPast }: PrayerCardProps) {
  return (
    <View
      className={`flex-row items-center justify-between px-5 py-4 mx-4 mb-3 rounded-2xl ${
        isNext
          ? "bg-accent border-2 border-gold"
          : isPast
          ? "bg-surface opacity-60"
          : "bg-surface"
      }`}
    >
      <View className="flex-row items-center gap-3">
        <View
          className={`w-2 h-2 rounded-full ${
            isNext ? "bg-gold" : isPast ? "bg-gray-500" : "bg-secondary"
          }`}
        />
        <View>
          <Text
            className={`text-lg font-semibold ${
              isNext ? "text-surface" : "text-white"
            }`}
          >
            {prayer.labelTR}
          </Text>
          <Text
            className={`text-sm ${
              isNext ? "text-surface opacity-70" : "text-gray-400"
            }`}
          >
            {prayer.labelAR}
          </Text>
        </View>
      </View>

      <View className="items-end">
        <Text
          className={`text-xl font-bold ${
            isNext ? "text-surface" : "text-white"
          }`}
        >
          {formatTime(prayer.time)}
        </Text>
        {isNext && (
          <Text className="text-xs text-surface opacity-70 mt-0.5">
            Sıradaki
          </Text>
        )}
        {isPast && (
          <Text className="text-xs text-gray-500 mt-0.5">Geçti</Text>
        )}
      </View>
    </View>
  );
}
