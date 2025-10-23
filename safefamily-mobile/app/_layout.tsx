// app/_layout.tsx
import { Slot } from "expo-router";
import { AuthProvider } from "../contexts/AuthContext";
import { useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar"
import { Colors } from "../constants/Color";
import { useEffect } from "react";
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { usePushNotifications } from "../hooks/usePushNotifications";


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
  usePushNotifications()
  useNotificationObserver();

  // const theme = Colors[colorScheme as keyof typeof Colors] ?? Colors.dark
  
    return (
    <>
    <StatusBar style={"dark"}/>
      <AuthProvider>
      <Slot />
      </AuthProvider>
    </>
  );
}