// OrdersDashboard.jsx

import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import PendingOrders from './PendingOrders';
import CompletedOrders from './CompletedOrders';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';
import Geolocation from '@react-native-community/geolocation';
import { useColorScheme } from 'nativewind';

const Tab = createMaterialTopTabNavigator();

export default function OrdersDashboard() {
  const { apiUrl, user } = useAppContext();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(`${apiUrl}/api/wholesaler/get-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data || []);
    } catch {
      Alert.alert('Error', 'Unable to fetch orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsDelivered = async orderId => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put(
        `${apiUrl}/api/wholesaler/update-order-status/${orderId}`,
        { status: 'delivered' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(os =>
        os.map(o =>
          o.order_id === orderId ? { ...o, status: 'delivered' } : o
        )
      );
      Alert.alert('Success', `Order #${orderId} marked delivered`);
    } catch {
      Alert.alert('Error', 'Failed to update order');
    }
  };

  useEffect(() => {
    fetchOrders();
    Geolocation.getCurrentPosition(() => {}, () => {}, {
      enableHighAccuracy: false,
      timeout: 20000,
      maximumAge: 10000,
    });
  }, []);

  if (loading) {
    return (
      <SafeAreaView
        className={`${
          isDark ? 'bg-background-dark' : 'bg-background-light'
        } flex-1 justify-center items-center`}
      >
        <ActivityIndicator size="large" color="#16A34A" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className={`${
        isDark ? 'bg-background-dark' : 'bg-background-light'
      } flex-1`}
    >
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#16A34A',            // bg-primary
          tabBarInactiveTintColor: '#6B7280',         // text-muted
          tabBarIndicatorStyle: { backgroundColor: '#16A34A' },
          tabBarStyle: {
            backgroundColor: isDark
              ? '#1F2937'                          // background.dark
              : '#F8FAFC',                         // background.light
          },
          tabBarLabelStyle: { fontWeight: '600' },
        }}
      >
        <Tab.Screen name="Pending ">
          {() => (
            <PendingOrders
              orders={orders}
              markAsDelivered={markAsDelivered}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Completed ">
          {() => <CompletedOrders orders={orders} />}
        </Tab.Screen>
      </Tab.Navigator>
    </SafeAreaView>
  );
}
