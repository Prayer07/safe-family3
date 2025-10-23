// hooks/usePushNotifications.ts
import { useEffect } from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { apiFetch } from '../utils/apiClient';
import { useAuth } from '../contexts/AuthContext';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      sound: 'default',
    });
  }

  if (!Device.isDevice) {
    console.warn('Must use physical device for push notifications');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    console.warn('Permission not granted for push notifications');
    return null;
  }

  const projectId = Constants?.expoConfig?.extra?.eas?.projectId;
  if (!projectId) {
    console.error('Project ID not found');
    return null;
  }

  try {
    const pushToken = await Notifications.getExpoPushTokenAsync({ projectId });
    console.log('✅ Got push token:', pushToken.data);
    return pushToken.data;
  } catch (e) {
    console.error('Failed to get push token:', e);
    return null;
  }
}

export function usePushNotifications() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    let isMounted = true;

    const setupPushNotifications = async () => {
      try {
        const token = await registerForPushNotificationsAsync();
        
        if (token && isMounted) {
          // Save token to backend
          await apiFetch('/auth/push-token', {
            method: 'POST',
            body: JSON.stringify({ pushToken: token }),
          });
          console.log('✅ Push token saved to backend');
        }
      } catch (error) {
        console.error('Error setting up push notifications:', error);
      }
    };

    setupPushNotifications();

    return () => {
      isMounted = false;
    };
  }, [user]);
}