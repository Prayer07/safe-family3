// app/_layout.tsx
import { Slot } from "expo-router";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar"
import { Colors } from "../constants/Color";
import { usePushNotifications } from "../hooks/usePushNotifications";
import { useFirebaseNotifications } from "../hooks/useFirebaseNotifications";
import { useEffect } from "react";
import axios from "axios"

export default function RootLayout() {
  const colorScheme = useColorScheme()
  console.log(colorScheme)
  // useFirebaseNotifications();
  const token = usePushNotifications()
  // const { user } = useAuth()

    useEffect(() => {
    if (token) {
      axios.post(`/auth/updatePushToken`, {
        token,
      }).catch((err: any) => console.error("Failed to send push token:", err));
    }
  }, [token]);

  const theme = Colors[colorScheme as keyof typeof Colors] ?? Colors.dark
  
    return (
    <AuthProvider>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} backgroundColor={theme.background} />
      <Slot />
    </AuthProvider>
  );
}