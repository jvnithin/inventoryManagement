import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const [wholesalers, setWholesalers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const { apiUrl } = useAppContext();

  const fetchWholesalers = async () => {
    setError(null);
    try {
      const userToken = await AsyncStorage.getItem('token');
      const response = await axios.get(
        `${apiUrl}/api/retailer/get-wholesalers`,
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      console.log(response.data);
      setWholesalers(response.data || []);
    } catch (e) {
      setError('Failed to load wholesalers. Please try again.');
      setWholesalers([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchWholesalers();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchWholesalers();
  }, []);

  const handleWholesalerPress = (wholesaler) => {
    navigation.navigate('WholeSalerProducts', { wholesaler });
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#16A34A" />
        <Text className="mt-4 text-green-800">Loading Wholesalers...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center px-6">
        <Icon name="alert-circle-outline" size={48} color="#dc2626" />
        <Text className="mt-4 text-red-700 text-center">{error}</Text>
        <TouchableOpacity
          className="mt-6 bg-green-700 px-6 py-3 rounded-xl"
          onPress={fetchWholesalers}
        >
          <Text className="text-white font-semibold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold text-green-800 mb-4">
        Wholesalers who invited you
      </Text>
      <FlatList
        data={wholesalers}
        keyExtractor={item => item.user_id?.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="bg-green-50 rounded-xl p-4 mb-4 shadow-md"
            onPress={() => handleWholesalerPress(item)}
            activeOpacity={0.8}
          >
            <Text className="text-lg font-semibold text-green-900">{item.name}</Text>
            <Text>Email: {item.email}</Text>
            <Text>Phone: {item.phone}</Text>
            <Text>
              Address: {item.address?.street}, {item.address?.city},{' '}
              {item.address?.state}
            </Text>
            {/* <Text className="text-gray-500 mt-2">
              {item.products?.length || 0} Products
            </Text> */}
          </TouchableOpacity>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#16A34A']}
            tintColor="#16A34A"
          />
        }
        ListEmptyComponent={
          <View className="flex-1 items-center mt-10">
            <Icon name="cube-outline" size={56} color="#94a3b8" />
            <Text className="text-gray-500 text-center mt-4">
              No wholesalers found. You may not have been invited yet.
            </Text>
          </View>
        }
      />
    </View>
  );
}
