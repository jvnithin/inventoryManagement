import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useAppContext } from '../../context/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

function formatAddress(address) {
  if (!address) return '';
  return [
    address.street,
    address.city,
    address.state,
    address.zip,
  ].filter(Boolean).join(', ');
}

function formatDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString();
}

export default function MyOrdersScreen() {
  const { apiUrl } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${apiUrl}/api/retailer/get-orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (order_id) => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              const token = await AsyncStorage.getItem('token');
              // Adjust the API endpoint as per your backend
              const response = await axios.put(
                `${apiUrl}/api/retailer/cancel-order/${order_id}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
              );
              console.log(response.data);
              await fetchOrders();
              Alert.alert('Order Cancelled', 'Your order has been cancelled.');
            } catch (error) {
              console.error('Error cancelling order:', error);
              Alert.alert('Error', 'Failed to cancel order.');
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderOrderItem = ({ item }) => (
    <View className="mb-4 p-4 rounded-xl bg-green-50 shadow shadow-black/5">
      <Text className="font-bold text-lg text-green-800">
        Order #{item.order_id}
      </Text>
      <Text className="text-slate-700 mt-1">
        Date: {formatDate(item.created_at)}
      </Text>
      <Text className="text-slate-700 mt-1">
        Status:{' '}
        <Text
          className={
            item.status === 'delivered'
              ? 'text-green-700 font-bold'
              : item.status === 'pending'
              ? 'text-yellow-600 font-bold'
              : 'text-red-600 font-bold'
          }
        >
          {item.status}
        </Text>
      </Text>
      <Text className="text-slate-700 mt-1">
        Address: {formatAddress(item.address)}
      </Text>
      <Text className="text-teal-700 mt-2 font-bold">Items:</Text>
      {item.order_items ? (
        <View className="ml-2 mt-1">
          <Text className="text-green-800">
            {item.order_items.name} x {item.order_items.quantity} — ₹
            {item.order_items.price * item.order_items.quantity}
          </Text>
        </View>
      ) : (
        <Text className="ml-2 text-slate-400">No items</Text>
      )}
      <Text className="text-green-700 mt-2 font-bold">
        Total: ₹
        {item.order_items
          ? item.order_items.price * item.order_items.quantity
          : 0}
      </Text>
      {/* Cancel Order Button */}
      {item.status === 'pending' && (
        <TouchableOpacity
          className="mt-4 bg-red-500 rounded-lg py-2 px-4 self-start"
          onPress={() => handleCancelOrder(item.order_id)}
        >
          <Text className="text-white font-bold text-base">Cancel Order</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View className="flex-1 bg-white px-4 pt-4">
      <Text className="text-2xl font-bold text-green-800 mb-4">
        My Orders
      </Text>
      {loading ? (
        <ActivityIndicator size="large" color="#16a34a" className="mt-10" />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={item => item.order_id?.toString()}
          renderItem={renderOrderItem}
          ListEmptyComponent={
            <Text className="text-slate-400 text-center mt-10">
              No orders yet
            </Text>
          }
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
