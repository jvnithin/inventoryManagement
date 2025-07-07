import React, { useEffect, useCallback, useState } from 'react';
import { SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import PendingOrders from './PendingOrders';
import DeliveredOrders from './DeliveredOrders';
import { useAppContext } from '../../context/AppContext';
import { useColorScheme } from 'nativewind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Tab = createMaterialTopTabNavigator();

export default function MyOrdersScreen() {
  const { orders, setOrders, fetchRetailerOrders, apiUrl } = useAppContext();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchRetailerOrders();
      setLoading(false);
    };
    load();
  }, [fetchRetailerOrders]);

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
              await fetchRetailerOrders();
            } catch {
              Alert.alert('Error', 'Failed to cancel order.');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  }, [apiUrl, fetchRetailerOrders]);

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
