// src/navigation/DrawerNavigator.jsx

import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';
import { useColorScheme } from 'nativewind';

import HomeStack from './retailer/HomeStack';
import CartScreen from '../screens/retailer/CartScreen';
import MyOrdersScreen from '../screens/retailer/MyOrdersScreen';
import InvoicesScreen from '../screens/retailer/InvoicesScreen';
import TransactionsScreen from '../screens/retailer/TransactionsScreen';
import Profile from '../screens/retailer/Profile';
import NotificationIcon from '../components/NotificationComponents';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Color tokens
  const headerBg = '#16A34A';
  const headerTint = '#FFFFFF';
  const drawerBg = isDark ? '#1F2937' : '#ECFDF5';       // gray-800 / green-50
  const activeTint = isDark ? '#A3E635' : '#065F46';     // lime-400 / green-800
  const inactiveTint = isDark ? '#9CA3AF' : '#4B5563';   // gray-400 / gray-600

  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: headerBg },
        headerTintColor: headerTint,
        drawerStyle: { backgroundColor: drawerBg },
        drawerActiveTintColor: activeTint,
        drawerInactiveTintColor: inactiveTint,
        headerRight: () => <NotificationIcon />
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeStack}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Cart"
        component={CartScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="cart-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="My Orders"
        component={MyOrdersScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="list-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Invoices"
        component={InvoicesScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="document-text-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Transactions"
        component={TransactionsScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="swap-horizontal-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
