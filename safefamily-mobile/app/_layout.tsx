// app/_layout.tsx
import { Slot, Stack } from "expo-router";
import { AuthProvider } from "../contexts/AuthContext";
import ThemedView from "../components/ThemedView";
import { StatusBar, useColorScheme } from "react-native";
import { Colors } from "../constants/Color";
import { usePushNotifications } from "../hooks/usePushNotifications";
// import ShakeHandler from "../components/ShakeHandler";

export default function RootLayout() {
  const colorScheme = useColorScheme()
  console.log(colorScheme)
  usePushNotifications()

  const theme = Colors[colorScheme as keyof typeof Colors] ?? Colors.light
  
  
  if (colorScheme === "dark"){
    return (
    <AuthProvider>
      <StatusBar barStyle={"light-content"} backgroundColor={theme.background}/>
      <Slot />
    </AuthProvider>
  );
  }
  return (
    <AuthProvider>
      <StatusBar barStyle={"dark-content"} backgroundColor={theme.background}/>
      <Slot />
    </AuthProvider>
  );
}