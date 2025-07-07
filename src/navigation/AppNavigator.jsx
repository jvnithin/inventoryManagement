import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppContext } from '../context/AppContext';

import SignIn from '../screens/auth/SignIn';
import SignUp from '../screens/auth/SignUp';
import DrawerNavigator from './WholesaleDrawerNavigator';
import RetailerDrawerNavigator from './RetailerDrawerNavigator';
import LoadingScreen from '../screens/Loading';
import InvitationScreen from '../screens/retailer/InvitationScreen';
import RetailerList from '../screens/wholeSaler/retailers/RetailerList';
import RetailerDetails from '../screens/wholeSaler/retailers/RetailerDetails';
import NotificationScreen from '../screens/NotificationScreen'; // <-- Import your NotificationScreen

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { user, loading } = useAppContext();

  if (loading) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Loading" component={LoadingScreen} />
        <Stack.Screen name="Invite" component={InvitationScreen} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <>
          <Stack.Screen name="SignIn" component={SignIn} />
          <Stack.Screen name="SignUp" component={SignUp} />
        </>
      ) : user.role === 'wholesaler' ? (
        <Stack.Screen name="wholesaler" component={DrawerNavigator} />
      ) : (
        <Stack.Screen name="retailer" component={RetailerDrawerNavigator} />
      )}
      <Stack.Screen name="Invite" component={InvitationScreen} />
      <Stack.Screen name="RetailerList" component={RetailerList} />
      <Stack.Screen name="RetailerDetails" component={RetailerDetails} />
      <Stack.Screen
        name="Notifications"
        component={NotificationScreen}
        options={{ headerShown: true, title: 'Notifications' }} // Show header for notifications
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
