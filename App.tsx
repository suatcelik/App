import "./global.css";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";

import { PrayerTimesScreen } from "./src/screens/PrayerTimesScreen";
import { QiblaScreen } from "./src/screens/QiblaScreen";
import { TrackerScreen } from "./src/screens/TrackerScreen";
import { VerseScreen } from "./src/screens/VerseScreen";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#0f2d47",
            borderTopColor: "#d4af3730",
            borderTopWidth: 1,
            height: 65,
            paddingBottom: 8,
            paddingTop: 6,
          },
          tabBarActiveTintColor: "#d4af37",
          tabBarInactiveTintColor: "#6b7280",
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "600",
          },
        }}
      >
        <Tab.Screen
          name="Vakitler"
          component={PrayerTimesScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 20, color }}>🕌</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Kıble"
          component={QiblaScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 20, color }}>🧭</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Takip"
          component={TrackerScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 20, color }}>📿</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Ayet"
          component={VerseScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 20, color }}>📖</Text>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
