// src/utils/notification.js
import notifee, { AndroidImportance } from '@notifee/react-native';

export async function displayNotification(notification) {
  await notifee.requestPermission();

  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
  });

  await notifee.displayNotification({
    title: notification?.title || 'Notification',
    body: notification?.body || '',
    android: {
      channelId,
      pressAction: {
        id: 'default',
      },
    },
  });
}
