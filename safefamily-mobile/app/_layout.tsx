// app/_layout.tsx
import { Slot, Stack } from "expo-router";
import { AuthProvider } from "../contexts/AuthContext";
import ThemedView from "../components/ThemedView";
import { useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar"
import { Colors } from "../constants/Color";
import { usePushNotifications } from "../hooks/usePushNotifications";
// import ShakeHandler from "../components/ShakeHandler";

export default function RootLayout() {
  const colorScheme = useColorScheme()
  console.log(colorScheme)
  usePushNotifications()

  const theme = Colors[colorScheme as keyof typeof Colors] ?? Colors.light
  
    return (
    <AuthProvider>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} backgroundColor={theme.background} />
      <Slot />
    </AuthProvider>
  );
}