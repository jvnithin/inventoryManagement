import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import SignIn from '../screens/auth/SignIn';
import SignUp from '../screens/auth/SignUp';
import DrawerNavigator from './WholesaleDrawerNavigator';
import AddProduct from '../screens/wholeSaler/products/AddProduct';
import RetailerList from '../screens/wholeSaler/retailers/RetailerList';
import RetailerDetails from '../screens/wholeSaler/retailers/RetailerDetails';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SignIn"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="MainApp" component={DrawerNavigator} />
        <Stack.Screen name="AddProduct" component={AddProduct} />
        <Stack.Screen name="RetailerList" component={RetailerList} />
        <Stack.Screen name="RetailerDetails" component={RetailerDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
