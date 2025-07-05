import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';
import { useColorScheme } from 'nativewind';
import MyProductsStack from './MyProductsStack';
import OrdersDashboard from '../screens/wholeSaler/OrdersDashboard';
import RetailerList from '../screens/wholeSaler/retailers/RetailerList';
import Invoices from '../screens/wholeSaler/Invoices';
import Transactions from '../screens/wholeSaler/Transactions';
import Settings from '../screens/wholeSaler/Settings';

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
      }}
    >
      <Drawer.Screen
        name="My Products"
        component={MyProductsStack}
        options={{
          drawerIcon: ({ color }) => (
            <Icon name="pricetags-outline" size={20} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Orders Dashboard"
        component={OrdersDashboard}
        options={{
          drawerIcon: ({ color }) => (
            <Icon name="home-outline" size={20} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Retailer List"
        component={RetailerList}
        options={{
          drawerIcon: ({ color }) => (
            <Icon name="people-outline" size={20} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Invoices"
        component={Invoices}
        options={{
          drawerIcon: ({ color }) => (
            <Icon name="document-text-outline" size={20} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Transactions"
        component={Transactions}
        options={{
          drawerIcon: ({ color }) => (
            <Icon name="swap-horizontal-outline" size={20} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={Settings}
        options={{
          drawerIcon: ({ color }) => (
            <Icon name="settings-outline" size={20} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
