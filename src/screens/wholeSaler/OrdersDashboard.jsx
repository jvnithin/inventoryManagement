import React, { useEffect, useState } from 'react';
import { SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import PendingOrders from './PendingOrders';
import CompletedOrders from './CompletedOrders';
import { useAppContext } from '../../context/AppContext';
import Geolocation from '@react-native-community/geolocation';
import { useColorScheme } from 'nativewind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Tab = createMaterialTopTabNavigator();

export default function OrdersDashboard() {
  const { apiUrl, orders, setOrders, fetchOrders } = useAppContext();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [loading, setLoading] = useState(true);

  // Use fetchOrders from context
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchOrders();
      setLoading(false);
    };
    load();
    Geolocation.getCurrentPosition(() => {}, () => {}, {
      enableHighAccuracy: false,
      timeout: 20000,
      maximumAge: 10000,
    });
  }, [fetchOrders]);

  // Optionally, move this to AppContext as well
  const markAsDelivered = async orderId => {
    try {
      const token = await AsyncStorage.getItem('token');
       const res=await axios.put(
        `${apiUrl}/api/wholesaler/update-order-status/${orderId}`,
        { status: 'delivered' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("wholes asler",res)
      setOrders(os =>
        os.map(o =>
          o.order_id === orderId ? { ...o, status: 'delivered' } : o
        )
      );
      Alert.alert('Success', `Order Id : ${orderId} had successfully delivered`);
    } catch (e) {
      Alert.alert('Error', 'Failed to update order');
      console.log(e)
    }
  };

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
          tabBarActiveTintColor: '#16A34A',
          tabBarInactiveTintColor: '#6B7280',
          tabBarIndicatorStyle: { backgroundColor: '#16A34A' },
          tabBarStyle: {
            backgroundColor: isDark ? '#1F2937' : '#F8FAFC',
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
