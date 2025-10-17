// services/firebaseConfig.ts
import { initializeApp } from '@react-native-firebase/app';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "safe-family.firebaseapp.com",
  projectId: "safe-family-6adef",
  storageBucket: "safe-family-6adef.firebasestorage.app",
  messagingSenderId: "241979900571",
  appId: "1:241979900571:android:636af38692b07bc3317c3e"
};

export const firebaseApp = initializeApp(firebaseConfig);