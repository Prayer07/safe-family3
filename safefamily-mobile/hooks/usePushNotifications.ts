// src/hooks/usePushNotifications.ts
import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { apiFetch } from "../utils/apiClient";
import { useRouter } from "expo-router";

export function usePushNotifications() {
  const router = useRouter();

  useEffect(() => {
    registerForPushNotificationsAsync();

    // Listen for notification received
    Notifications.addNotificationReceivedListener((notification) => {
      console.log("📩 Notification received:", notification);
    });

    // Listen for user tapping on the notification
    Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as {
        type?: string;
        sosId?: string;
      };

      if (data?.type === "sos") {
        router.push({
          pathname: "/index",
          params: { sosId: data.sosId },
        });
      }
    });
  }, []);
}

async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    console.log("❗ Must use a physical device for Push Notifications");
    return;
  }

  // Get permissions
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("❌ Failed to get push notification permission");
    return;
  }

  // Get Expo push token
  const token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log("✅ Push token:", token);

  // Send token to backend
  try {
    await apiFetch("/auth/push-token", {
      method: "POST",
      body: JSON.stringify({ pushToken: token }),
    });
  } catch (error) {
    console.error("🚨 Failed to register push token:", error);
  }

  // Android channel setup
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
}
