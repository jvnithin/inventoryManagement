import React, { useEffect } from 'react';
import { Alert, StatusBar } from 'react-native';
// import messaging from '@react-native-firebase/messaging';
// import notifee from '@notifee/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigator';
import { AppProvider } from './src/context/AppContext';
// import { displayNotification } from './src/utils/notification';

const linking = {
  prefixes: ['inventorymanagement://', 'https://inventorymanagement.com'],
  config: {
    screens: {
      Retailer: 'retailer/:wholesalerCode',
      Invite: 'invite/:inviteCode',
    },
  },
};

const App = () => {
  useEffect(() => {
    // const requestPermission = async () => {
    //   const authStatus = await messaging().requestPermission();
    //   const enabled =
    //     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    //     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    //   if (enabled) {
    //     console.log('Notification permission granted:', authStatus);
    //   }
    // };

    // requestPermission();

    // Get FCM Token
    // messaging()
    //   .getToken()
    //   .then(token => {
    //     console.log('FCM Token:', token);
    //     // Save/send to backend as needed
    //   });

    // // Foreground messages
    // const unsubscribe = messaging().onMessage(async remoteMessage => {
    //   console.log('Received in foreground:', remoteMessage);
    //   displayNotification(remoteMessage.notification);
    // });

    // // Background > Foreground
    // messaging().onNotificationOpenedApp(remoteMessage => {
    //   console.log('App opened from background:', remoteMessage.notification);
    // });

    // // Quit > App launch
    // messaging()
    //   .getInitialNotification()
    //   .then(remoteMessage => {
    //     if (remoteMessage) {
    //       console.log('App launched by notification:', remoteMessage.notification);
    //     }
    //   });

    // return unsubscribe;
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
        <NavigationContainer linking={linking}>
          <AppNavigator />
        </NavigationContainer>
      </AppProvider>
    </GestureHandlerRootView>
  );
};

export default App;
