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
  Share,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FloatingActionButton from '../../../components/FloatingActionButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useAppContext } from '../../../context/AppContext';
import { useColorScheme } from 'nativewind';

const fallbackImage =
  'https://ui-avatars.com/api/?background=16A34A&color=fff&name=R';

export default function RetailerList({ navigation }) {
  const { apiUrl, user } = useAppContext();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [retailers, setRetailers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Invite handler using Share API
  const handleInviteRetailer = async () => {
    try {
      const inviteCode = user?.group_code || 'YOUR_GROUP_CODE';
      const link = `inventorymanagement://invite/${inviteCode}`;
      const shareMessage = `Join my network on Inventory Management! Tap: ${link}`;
      await Share.share({ message: shareMessage, url: link, title: 'Invite' });
    } catch {}
  };

  const fetchRetailers = async () => {
    setError(null);
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const { data } = await axios.get(`${apiUrl}/api/wholesaler/get-retailers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRetailers(data || []);
    } catch {
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
      className={`
        flex-row items-center rounded-2xl p-4 mb-4
        ${isDark ? 'bg-gray-800 shadow-sm' : 'bg-white shadow-sm'}
      `}
      onPress={() =>
        navigation.navigate('RetailerDetails', { retailer: item })
      }
      activeOpacity={0.85}
    >
      <Image
        source={{ uri: item.photo || fallbackImage }}
        className="w-14 h-14 rounded-full mr-4"
      />
      <View className="flex-1">
        <Text
          className={`
            text-lg font-semibold
            ${isDark ? 'text-green-300' : 'text-green-800'}
          `}
          numberOfLines={1}
        >
          {item.name}
        </Text>
        <Text
          className={`
            text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}
          `}
        >
          Total Orders: ₹{item.totalValue ?? 0}
        </Text>
        <Text
          className={`
            text-sm ${isDark ? 'text-yellow-400' : 'text-yellow-600'}
          `}
        >
          Invoices Pending: {item.invoicesPending ?? 0}
        </Text>
        <Text
          className={`
            text-sm ${isDark ? 'text-green-200' : 'text-green-700'}
          `}
        >
          Paid: ₹{item.totalPaid ?? 0}
        </Text>
      </View>
      <Icon name="chevron-forward-outline" size={24} color="#065F46" />
    </TouchableOpacity>
  );

  // Backgrounds and text colors
  const screenBg = isDark ? 'bg-gray-900' : 'bg-gray-100';
  const loadingText = isDark ? 'text-green-200' : 'text-green-800';
  const errorText = isDark ? 'text-red-400' : 'text-red-700';
  const emptyIconColor = isDark ? '#6B7280' : '#94A3B8';

  if (loading) {
    return (
      <View className={`${screenBg} flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#16A34A" />
        <Text className={`mt-4 font-medium ${loadingText}`}>
          Loading Retailers...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className={`${screenBg} flex-1 justify-center items-center px-6`}>
        <Icon name="alert-circle-outline" size={48} color="#dc2626" />
        <Text className={`mt-4 text-center ${errorText}`}>{error}</Text>
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
    <View className={`${screenBg} flex-1 px-4 pt-6`}>
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <Text
          className={`
            text-2xl font-bold
            ${isDark ? 'text-green-300' : 'text-green-800'}
          `}
        >
          Retailers
        </Text>
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
            <Icon
              name="people-outline"
              size={56}
              color={emptyIconColor}
            />
            <Text
              className={`
                text-center mt-4
                ${isDark ? 'text-gray-400' : 'text-gray-600'}
              `}
            >
              No retailers found.
            </Text>
          </View>
        }
      />

      {/* Invite FAB */}
      <Pressable
        onPress={handleInviteRetailer}
        className="absolute bottom-6 right-6 flex-row items-center rounded-full p-4 shadow-lg"
        style={{ backgroundColor: '#16A34A' }}
      >
        <Icon name="add" size={28} color="white" />
        <Text className="ml-2 text-white font-semibold">Invite</Text>
      </Pressable>
    </View>
  );
}
