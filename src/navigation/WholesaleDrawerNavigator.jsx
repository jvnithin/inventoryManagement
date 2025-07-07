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
import NotificationIcon from '../components/NotificationComponents';

// Define your colors object matching tailwind.config.js
const COLORS = {
  primary: '#16A34A',
  secondary: '#065F46',
  accent: '#22C55E',
  muted: '#9CA3AF',
  background: {
    light: '#FFFFFF',
    dark: '#1F2937',
  },
};

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Use your centralized color tokens
  const headerBg = COLORS.primary;
  const headerTint = COLORS.background.light;
  const drawerBg = isDark ? COLORS.background.dark : COLORS.background.light;
  const activeTint = isDark ? COLORS.accent : COLORS.secondary;
  const inactiveTint = COLORS.muted;

  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: headerBg },
        headerTintColor: headerTint,
        drawerStyle: { backgroundColor: drawerBg },
        drawerActiveTintColor: activeTint,
        drawerInactiveTintColor: inactiveTint,
        headerRight: () => <NotificationIcon />,
      }}
    >
      {/* Same drawer screens as before */}
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
        name="Retailers List"
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
