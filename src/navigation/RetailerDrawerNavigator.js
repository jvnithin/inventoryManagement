import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../screens/retailer/HomeScreen';
import CartScreen from '../screens/retailer/CartScreen';
import MyOrdersScreen from '../screens/retailer/MyOrdersScreen';
import InvoicesScreen from '../screens/retailer/InvoicesScreen';
import TransactionsScreen from '../screens/retailer/TransactionsScreen';
import HomeStack from './retailer/HomeStack';
import Profile from '../screens/retailer/Profile';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#16A34A' },
        headerTintColor: 'white',
        drawerActiveTintColor: '#065F46',
        drawerInactiveTintColor: '#4B5563',
        drawerStyle: { backgroundColor: '#ECFDF5' },
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
