import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/wholeSaler/Home';
import ProductList from '../screens/wholeSaler/products/ProductList';
import RetailerList from '../screens/wholeSaler/retailers/RetailerList';
import Invoices from '../screens/wholeSaler/Invoices';
import Transactions from '../screens/wholeSaler/Transactions';
import Settings from '../screens/wholeSaler/Settings';

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
        name="My Products"
        component={ProductList}
        options={{
          drawerIcon: ({ color }) => (
            <Icon name="pricetags-outline" size={20} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Orders Dashboard"
        component={HomeScreen}
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
      {/* <Drawer.Screen name="My Profile" component={MyProfile} options={{
        drawerIcon: ({ color }) => <Icon name="person-circle-outline" size={20} color={color} />,
      }} /> */}
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
