// src/screens/MyOrdersScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import PendingOrders from './PendingOrders';
import DeliveredOrders from './DeliveredOrders';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppContext } from '../../context/AppContext';
import { useColorScheme } from 'nativewind';

const Tab = createMaterialTopTabNavigator();

export default function MyOrdersScreen() {
  const { apiUrl } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(`${apiUrl}/api/retailer/get-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data || []);
    } catch {
      setOrders([]);
      Alert.alert('Error', 'Unable to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = useCallback(async order_id => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              const token = await AsyncStorage.getItem('token');
              await axios.put(
                `${apiUrl}/api/retailer/cancel-order/${order_id}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
              );
              Alert.alert('Order Cancelled', 'Your order has been cancelled.');
              fetchOrders();
            } catch {
              Alert.alert('Error', 'Failed to cancel order.');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  }, [apiUrl]);

  if (loading) {
    return (
      <SafeAreaView style={{
        flex: 1,
        backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <ActivityIndicator size="large" color="#16A34A" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#1F2937' : '#F8FAFC' }}>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#16A34A',
          tabBarInactiveTintColor: '#6B7280',
          tabBarIndicatorStyle: { backgroundColor: '#16A34A' },
          tabBarLabelStyle: { fontWeight: '600' },
          tabBarStyle: { backgroundColor: isDark ? '#1F2937' : '#F8FAFC' },
        }}
      >
        <Tab.Screen name="Pending">
          {() => (
            <PendingOrders
              orders={orders}
              onCancel={handleCancelOrder}
              loading={loading}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Delivered">
          {() => <DeliveredOrders orders={orders} loading={loading} />}
        </Tab.Screen>
      </Tab.Navigator>
    </SafeAreaView>
  );
}
