import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { PrayerName } from "../types";
import { PRAYER_NAMES_AR } from "../utils/prayerNames";

interface PrayerCheckboxProps {
  prayer: PrayerName;
  labelTR: string;
  checked: boolean;
  onToggle: (prayer: PrayerName) => void;
}

export function PrayerCheckbox({
  prayer,
  labelTR,
  checked,
  onToggle,
}: PrayerCheckboxProps) {
  return (
    <TouchableOpacity
      onPress={() => onToggle(prayer)}
      activeOpacity={0.7}
      className={`flex-row items-center justify-between px-5 py-4 mx-4 mb-3 rounded-2xl ${
        checked ? "bg-secondary" : "bg-surface"
      }`}
    >
      <View className="flex-row items-center gap-4">
        <View
          className={`w-7 h-7 rounded-full border-2 items-center justify-center ${
            checked ? "bg-gold border-gold" : "border-gray-500"
          }`}
        >
          {checked && (
            <Text className="text-surface font-bold text-sm">✓</Text>
          )}
        </View>
        <View>
          <Text className="text-white text-lg font-semibold">{labelTR}</Text>
          <Text className="text-gray-400 text-sm">{PRAYER_NAMES_AR[prayer]}</Text>
        </View>
      </View>

      {checked && (
        <View className="bg-gold/20 px-3 py-1 rounded-full">
          <Text className="text-gold text-xs font-medium">Kılındı</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
