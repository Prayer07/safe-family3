// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useColorScheme } from "react-native";
import { Colors } from "../../constants/Color";
import { StatusBar } from "expo-status-bar";

export default function TabsLayout() {
  const colorScheme = useColorScheme()

  const theme = Colors[colorScheme as keyof typeof Colors] ?? Colors.light
  return (
    <>
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: "#1E90FF",
        tabBarStyle: {backgroundColor: theme.background}
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Map",
          tabBarIcon: ({ color, size }) => <Ionicons name="map-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="members"
        options={{
          title: "Members",
          tabBarIcon: ({ color, size }) => <Ionicons name="people-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="sos"
        options={{
          title: "SOS",
          tabBarIcon: ({ color, size }) => <Ionicons name="alert-circle-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color, size }) => <Ionicons name="time-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
    </>
  );
}