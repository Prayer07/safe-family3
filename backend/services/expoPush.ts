import fetch from "node-fetch";

interface Message {
  expoPushToken: string,
  title: string,
  body: string,
  data?: Record<string, string>
}

export async function sendPushNotification({ expoPushToken, title, body, data }: Message, p0: string, p1: string, p2: { type: string; sosId: string; lat: string; lng: string; userName: string; }) {
  try{
    const message = {
      to: expoPushToken,
      title,
      body,
      data: data || {},
    };

    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

      const result = await response.json();
      console.log("Expo push result:", result);

  }catch (error) {
    console.error("Expo push error:", error);
  }
} 