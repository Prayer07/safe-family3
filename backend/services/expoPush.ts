import fetch from "node-fetch";

export async function sendPushNotification(
  token: string,
  title: string,
  body: string,
  data?: Record<string, string>
) {
  try {
    if (!token.startsWith("ExponentPushToken")) {
      console.warn(`Skipping invalid token: ${token}`);
      return;
    }

    const message = {
      to: token,
      sound: "default",
      title,
      body,
      data: data || {},
    };

    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });

    const result = await response.json();
    console.log("Expo push result:", result);

  } catch (error) {
    console.error("Expo push error:", error);
  }
}