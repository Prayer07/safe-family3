// app/_layout.tsx
import { Slot } from "expo-router";
import { AuthProvider } from "../contexts/AuthContext";
import { useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar"
import { Colors } from "../constants/Color";
import { usePushNotifications } from "../hooks/usePushNotifications";

export default function RootLayout() {
  const colorScheme = useColorScheme()
  console.log(colorScheme)
  usePushNotifications()

  const theme = Colors[colorScheme as keyof typeof Colors] ?? Colors.dark
  
    return (
    <AuthProvider>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} backgroundColor={theme.background} />
      <Slot />
    </AuthProvider>
  );
}