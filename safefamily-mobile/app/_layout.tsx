// app/_layout.tsx
import { Slot } from "expo-router";
import { AuthProvider } from "../contexts/AuthContext";
import { useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar"
import { Colors } from "../constants/Color";
import { usePushNotifications } from "../hooks/usePushNotifications";
import { useEffect } from "react";
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';


function useNotificationObserver() {
  useEffect(() => {
    function redirect(notification: Notifications.Notification) {
      const url = notification.request.content.data?.url;
      if (typeof url === 'string') {
        router.push(url);
      }
    }

    const response = Notifications.getLastNotificationResponse();
    if (response?.notification) {
      redirect(response.notification);
    }

    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      redirect(response.notification);
    });

    return () => {
      subscription.remove();
    };
  }, []);
}

export default function RootLayout() {
  const colorScheme = useColorScheme()
  console.log(colorScheme)
  useNotificationObserver();
  usePushNotifications()

  // const theme = Colors[colorScheme as keyof typeof Colors] ?? Colors.dark
  
    return (
    <>
    <StatusBar style={colorScheme === "dark"? "light" : "dark"}/>
      <AuthProvider>
      <Slot />
      </AuthProvider>
    </>
  );
}