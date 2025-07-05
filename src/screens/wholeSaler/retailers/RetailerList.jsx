import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  Pressable,
  Share, // <-- Import Share API
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FloatingActionButton from '../../../components/FloatingActionButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useAppContext } from '../../../context/AppContext';

const fallbackImage =
  'https://ui-avatars.com/api/?background=16A34A&color=fff&name=R'; // Default avatar

export default function RetailerList({ navigation }) {
  const { apiUrl, user } = useAppContext();
  const [retailers, setRetailers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Invite handler using Share API
  const handleInviteRetailer = async () => {
    try {
      console.log(user);
      const inviteCode = user?.group_code || 'YOUR_GROUP_CODE'; // Replace with actual group code logic
      const link = `inventorymanagement://invite/${inviteCode}`;
      const shareMessage = `Join my network on Inventory Management! Tap the link to register: ${link}`;

      await Share.share({
        message: shareMessage,
        url: link, // iOS uses this field
        title: 'Invite to Inventory Management',
      });
    } catch (e) {
      // Optionally handle error or cancellation
    }
  };

  const fetchRetailers = async () => {
    setError(null);
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(
        `${apiUrl}/api/wholesaler/get-retailers`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      console.log(response)
      setRetailers(response.data || []);
    } catch (e) {
      setError('Failed to load retailers. Please try again.');
      setRetailers([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRetailers();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRetailers();
  }, []);

  const renderRetailer = ({ item }) => (
    <TouchableOpacity
      className="flex-row items-center bg-white rounded-2xl shadow-sm p-4 mb-4"
      onPress={() => navigation.navigate('RetailerDetails', { retailer: item })}
      activeOpacity={0.85}
    >
      {/* Retailer Image */}
      <Image
        source={{ uri: item.photo || fallbackImage }}
        className="w-14 h-14 rounded-full mr-4"
      />

      {/* Details */}
      <View className="flex-1">
        <Text
          className="text-lg font-semibold text-green-800"
          numberOfLines={1}
        >
          {item.name}
        </Text>
        <Text className="text-sm text-gray-600">
          Total Orders: ₹{item.totalValue ?? 0}
        </Text>
        <Text className="text-sm text-yellow-600">
          Invoices Pending: {item.invoicesPending ?? 0}
        </Text>
        <Text className="text-sm text-green-700">
          Paid: ₹{item.totalPaid ?? 0}
        </Text>
      </View>

      {/* Chevron Icon */}
      <Icon name="chevron-forward-outline" size={24} color="#065F46" />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#16A34A" />
        <Text className="mt-4 text-green-800">Loading Retailers...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100 px-6">
        <Icon name="alert-circle-outline" size={48} color="#dc2626" />
        <Text className="mt-4 text-red-700 text-center">{error}</Text>
        <TouchableOpacity
          className="mt-6 bg-green-700 px-6 py-3 rounded-xl"
          onPress={fetchRetailers}
        >
          <Text className="text-white font-semibold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100 px-4 pt-6">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-2xl font-bold text-green-800">Retailers</Text>
      </View>

      {/* List */}
      <FlatList
        data={retailers}
        keyExtractor={item => item.user_id?.toString()}
        renderItem={renderRetailer}
        contentContainerStyle={[
          { paddingBottom: 80 },
          retailers.length === 0 && { flex: 1, justifyContent: 'center' },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#16A34A']}
            tintColor="#16A34A"
          />
        }
        ListEmptyComponent={
          <View className="items-center">
            <Icon name="people-outline" size={56} color="#94a3b8" />
            <Text className="text-gray-500 text-center mt-4">
              No retailers found.
            </Text>
          </View>
        }
      />

      {/* FAB */}
      <Pressable
        onPress={handleInviteRetailer}
        className="absolute bottom-6 right-6 bg-green-600 rounded-full p-4 shadow-lg flex-row items-center"
      >
        <Icon name="add" size={28} color="white" />
        <Text className="text-white ml-2 font-semibold">Invite</Text>
      </Pressable>
    </View>
  );
}
