import { View, Text } from 'react-native';
import React from 'react';
import './global.css'; // Import global styles
import { StatusBar } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProvider } from './src/context/AppContext';
import { NavigationContainer } from '@react-navigation/native';
import { CartProvider } from './src/context/CartContext';
const linking = {
  prefixes: ['inventorymanagement://', 'https://inventorymanagement.com'],
  config: {
    screens: {
      Retailer: 'retailer/:wholesalerCode', 
      Invite:'invite/:inviteCode',
    },
  },
};
const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <CartProvider>
      <AppProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
        <NavigationContainer linking={linking}>
          <AppNavigator />
        </NavigationContainer>
      </AppProvider>
      </CartProvider>
    </GestureHandlerRootView>
  );
};

export default App;
