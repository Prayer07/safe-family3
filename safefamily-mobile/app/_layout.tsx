// app/_layout.tsx
import { Slot } from "expo-router";
import { AuthProvider } from "../contexts/AuthContext";
import { useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar"
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

    Notifications.getLastNotificationResponseAsync().then(response => {
      if (response?.notification) {
        redirect(response.notification);
      }
    });

    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      redirect(response.notification);
    });

    return () => {
      subscription.remove();
    };
  }, []);
}

// This component is INSIDE AuthProvider
function AppContent() {
  usePushNotifications(); // ✅ Now it can access useAuth
  useNotificationObserver();
  
  return <Slot />;
}

// This is the root - NO HOOKS HERE
export default function RootLayout() {
  const colorScheme = useColorScheme();
  console.log(colorScheme);

  // ❌ DO NOT call usePushNotifications() here!
  
  return (
    <>
      <StatusBar style={"dark"}/>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </>
  );
}