// firebase-messaging.js
import messaging from '@react-native-firebase/messaging';
import { displayNotification } from './src/utils/notification';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in background!', remoteMessage);
  displayNotification(remoteMessage.notification);
});
