import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { CompassNeedle } from "../components/CompassNeedle";
import { useQibla } from "../hooks/useQibla";
import { usePrayerTimes } from "../hooks/usePrayerTimes";

export function QiblaScreen() {
  const { heading, available } = useQibla();
  const { qiblaDirection, loading } = usePrayerTimes();

  if (loading) {
    return (
      <LinearGradient colors={["#0f2d47", "#1a4a6e"]} className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#d4af37" />
        <Text className="text-white mt-4">Kıble hesaplanıyor...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#0f2d47", "#1a4a6e"]} className="flex-1">
      {/* Header */}
      <View className="items-center pt-14 pb-6 px-6">
        <Text className="text-gold text-3xl font-bold">🧭 Kıble Yönü</Text>
        <Text className="text-gray-300 text-sm mt-1">
          Altın ibre Kabe'yi gösterir
        </Text>
      </View>

      {/* Compass */}
      <View className="flex-1 items-center justify-center px-6">
        {!available ? (
          <View className="items-center">
            <Text className="text-6xl mb-4">📵</Text>
            <Text className="text-white text-lg font-semibold text-center">
              Manyetometre Bulunamadı
            </Text>
            <Text className="text-gray-400 text-sm text-center mt-2">
              Bu cihazda pusula sensörü desteklenmiyor.
            </Text>
            {qiblaDirection !== null && (
              <View className="mt-6 bg-surface rounded-2xl px-8 py-6 items-center">
                <Text className="text-gray-300 text-sm">Kıble yönü</Text>
                <Text className="text-gold text-5xl font-bold mt-1">
                  {Math.round(qiblaDirection)}°
                </Text>
                <Text className="text-gray-400 text-sm mt-2">
                  Kuzeyden saat yönünde
                </Text>
              </View>
            )}
          </View>
        ) : qiblaDirection !== null ? (
          <CompassNeedle heading={heading} qiblaAngle={qiblaDirection} />
        ) : (
          <View className="items-center">
            <Text className="text-white text-base">
              Konum bilgisi alınamadı.
            </Text>
            <Text className="text-gray-400 text-sm mt-2">
              Kıble hesabı için konum gerekli.
            </Text>
          </View>
        )}
      </View>

      {/* Info card */}
      <View className="mx-6 mb-10 bg-surface/70 rounded-2xl p-5 border border-gold/20">
        <Text className="text-gold text-base font-semibold text-center mb-2">
          🕋 Kabe — Mescid-i Haram
        </Text>
        <Text className="text-gray-400 text-sm text-center">
          Mekke, Suudi Arabistan
        </Text>
        <Text className="text-gray-400 text-xs text-center mt-1">
          21.4225° K, 39.8262° D
        </Text>
      </View>
    </LinearGradient>
  );
}
