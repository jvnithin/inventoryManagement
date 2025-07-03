import { View, Text } from 'react-native';
import React from 'react';
import './global.css'; // Import global styles
import { StatusBar } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProvider } from './src/context/AppContext';
const App = () => {
  return (
    <AppProvider>
      <GestureHandlerRootView>
        <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
        <AppNavigator />
      </GestureHandlerRootView>
    </AppProvider>
  );
};

export default App;
