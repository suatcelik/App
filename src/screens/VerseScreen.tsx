import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { getDailyVerse, QURAN_VERSES } from "../utils/quranVerses";

export function VerseScreen() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const dailyVerse = getDailyVerse();
  const displayVerse =
    selectedIndex !== null ? QURAN_VERSES[selectedIndex] : dailyVerse;

  const today = new Date().toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <LinearGradient colors={["#0f2d47", "#1a4a6e"]} className="flex-1">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="items-center pt-14 pb-6 px-6">
          <Text className="text-gold text-3xl font-bold">📖 Günün Ayeti</Text>
          <Text className="text-gray-300 text-sm mt-1">{today}</Text>
        </View>

        {/* Main verse card */}
        <View className="mx-4 mb-6 bg-surface rounded-3xl p-6 border border-gold/30">
          {/* Arabic */}
          <Text
            className="text-white text-2xl text-right leading-10 mb-6"
            style={{ fontFamily: "serif", writingDirection: "rtl" }}
          >
            {displayVerse.arabic}
          </Text>

          {/* Divider */}
          <View className="h-px bg-gold/20 mb-5" />

          {/* Turkish translation */}
          <Text className="text-gray-200 text-base leading-7 text-center mb-5 italic">
            "{displayVerse.turkish}"
          </Text>

          {/* Source */}
          <View className="flex-row items-center justify-center gap-2">
            <View className="h-px flex-1 bg-gold/20" />
            <Text className="text-gold text-xs font-semibold px-3">
              {displayVerse.surah} — {displayVerse.ayah}. Ayet
            </Text>
            <View className="h-px flex-1 bg-gold/20" />
          </View>
        </View>

        {/* Bismillah */}
        <View className="mx-4 mb-6 bg-primary/60 rounded-2xl p-4 items-center border border-gold/10">
          <Text
            className="text-gold text-xl"
            style={{ fontFamily: "serif" }}
          >
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </Text>
          <Text className="text-gray-400 text-xs mt-2">
            Rahman ve Rahim olan Allah'ın adıyla
          </Text>
        </View>

        {/* Verse list */}
        <View className="px-4 mb-4">
          <Text className="text-gray-300 text-sm font-semibold mb-3">
            Seçilmiş Ayetler
          </Text>
          {QURAN_VERSES.map((verse, index) => (
            <TouchableOpacity
              key={index}
              onPress={() =>
                setSelectedIndex(selectedIndex === index ? null : index)
              }
              className={`mb-2 px-4 py-3 rounded-xl ${
                selectedIndex === index
                  ? "bg-secondary"
                  : "bg-surface"
              }`}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1 mr-3">
                  <Text className="text-white text-sm font-medium" numberOfLines={1}>
                    {verse.surah} — {verse.ayah}. Ayet
                  </Text>
                  <Text className="text-gray-400 text-xs mt-0.5" numberOfLines={2}>
                    {verse.turkish}
                  </Text>
                </View>
                <Text className="text-gold text-lg">
                  {selectedIndex === index ? "▲" : "▼"}
                </Text>
              </View>

              {selectedIndex === index && (
                <View className="mt-3 pt-3 border-t border-gold/20">
                  <Text
                    className="text-white text-lg text-right leading-8"
                    style={{ fontFamily: "serif" }}
                  >
                    {verse.arabic}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View className="h-6" />
      </ScrollView>
    </LinearGradient>
  );
}
