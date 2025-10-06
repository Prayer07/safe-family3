// backend/src/services/firebase.ts
import admin from "firebase-admin";

import dotenv from "dotenv"

dotenv.config()

const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID!
const FIREBASE_CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL!
const FIREBASE_PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY!

// console.log(FIREBASE_PROJECT_ID)
// console.log(FIREBASE_PRIVATE_KEY)
// console.log(FIREBASE_CLIENT_EMAIL)


const serviceAccount = {
  projectId: FIREBASE_PROJECT_ID,
  clientEmail: FIREBASE_CLIENT_EMAIL,
  privateKey: FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

export async function sendPushNotification(
  token: string,
  title: string,
  body: string,
  data?: Record<string, string>
) {
  try {
    await admin.messaging().send({
      token,
      notification: { title, body },
      data: data || {},
      android: {
        priority: "high",
        notification: {
          sound: "default",
          priority: "max",
        },
      },
      apns: {
        payload: {
          aps: {
            sound: "default",
            badge: 1,
          },
        },
      },
    });
    console.log(`✅ Push notification sent to ${token.substring(0, 10)}...`);
  } catch (error) {
    console.error("Failed to send push notification:", error);
  }
}