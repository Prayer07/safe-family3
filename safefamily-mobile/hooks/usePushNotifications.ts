import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import { Platform } from "react-native";

export function usePushNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      if (token) setExpoPushToken(token);
    });
  }, []);

  return expoPushToken;
}

async function registerForPushNotificationsAsync() {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert("Push notifications permission not granted!");
      return null;
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("Expo Push Token:", token);

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  } catch (error) {
    console.error("Error getting push token:", error);
    return null;
  }
}



// // src/hooks/usePushNotifications.ts
// import { useEffect, useRef, useState } from "react";
// import * as Notifications from "expo-notifications";
// import * as Device from "expo-device";
// import { Platform } from "react-native";
// import { apiFetch } from "../utils/apiClient";
// import { useRouter } from "expo-router";

// export function usePushNotifications() {
//   const router = useRouter();
//   const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

//   useEffect(() => {
//     registerForPushNotificationsAsync().then((token => {
//       if (token) setExpoPushToken(token);
//     }));

//     // Listen for notification received
//     Notifications.addNotificationReceivedListener((notification) => {
//       console.log("📩 Notification received:", notification);
//     });

//     // Listen for user tapping on the notification
//     Notifications.addNotificationResponseReceivedListener((response) => {
//       const data = response.notification.request.content.data as {
//         type?: string;
//         sosId?: string;
//       };

//       if (data?.type === "sos") {
//         router.push({
//           pathname: "/index",
//           params: { sosId: data.sosId },
//         });
//       }
//     });
//   }, []);
//   return expoPushToken
// }

// async function registerForPushNotificationsAsync() {
//   if (!Device.isDevice) {
//     console.log("❗ Must use a physical device for Push Notifications");
//     return;
//   }

//   // Get permissions
//   const { status: existingStatus } = await Notifications.getPermissionsAsync();
//   let finalStatus = existingStatus;

//   if (existingStatus !== "granted") {
//     const { status } = await Notifications.requestPermissionsAsync();
//     finalStatus = status;
//   }

//   if (finalStatus !== "granted") {
//     console.log("❌ Failed to get push notification permission");
//     return;
//   }

//   // Get Expo push token
//   const token = (await Notifications.getExpoPushTokenAsync()).data;
//   console.log("✅ Push token:", token);

//   // Send token to backend
//   try {
//     await apiFetch("/auth/push-token", {
//       method: "POST",
//       body: JSON.stringify({ pushToken: token }),
//     });
//   } catch (error) {
//     console.error("🚨 Failed to register push token:", error);
//   }

//   // Android channel setup
//   if (Platform.OS === "android") {
//     await Notifications.setNotificationChannelAsync("default", {
//       name: "default",
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: "#FF231F7C",
//     });
//   }

//   return token

// }
