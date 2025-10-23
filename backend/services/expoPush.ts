// backend/src/services/expoPush.ts
import fetch from "node-fetch";

export async function sendPushNotification(
  expoPushToken: string,
  title: string,
  body: string,
  data?: Record<string, string>
) {
  try {
    if (!expoPushToken || !expoPushToken.startsWith("ExponentPushToken")) {
      console.warn("❌ Invalid Expo push token:", expoPushToken);
      return;
    }

    const message = {
      to: expoPushToken,
      sound: "default",
      title,
      body,
      data: data || {},
    };

    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    const result = await response.json();
    console.log("📦 Expo push result:", result);
    console.log("🎯 Sent to:", expoPushToken);
    return result;
  } catch (error) {
    console.error("Expo push error:", error);
    throw error;
  }
}