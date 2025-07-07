// HomeScreen.jsx

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Share,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppContext } from '../../context/AppContext';
import { useColorScheme } from 'nativewind';
import { emit } from '../../services/socketService';

export default function HomeScreen({ navigation }) {
  const {user}=useAppContext();
  const [wholesalers, setWholesalers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const { apiUrl } = useAppContext();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const fetchWholesalers = async () => {
    setError(null);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${apiUrl}/api/retailer/get-wholesalers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      emit("retailer-login",{id:user.retailer_id});

    setLoading(true);
    fetchWholesalers();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchWholesalers();
  }, []);

  const handleWholesalerPress = wholesaler => {
    console.log("Home : ",wholesaler)
    navigation.navigate('WholeSalerProducts', { wholesaler });
  };

  const colors = {
    background: isDark ? '#1F2937' : '#FFFFFF',
    textPrimary: isDark ? '#F9FAFB' : '#065F46',
    textSecondary: isDark ? '#9CA3AF' : '#4B5563',
    cardBg: isDark ? '#374151' : '#ECFDF5',
    shadowColor: isDark ? '#000' : '#000',
    inviteButton: '#16A34A',
    error: '#DC2626',
    loading: '#16A34A',
    muted: isDark ? '#6B7280' : '#94A3B8',
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.loading} />
        <Text style={{ marginTop: 16, color: colors.textPrimary }}>Loading Wholesalers...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: colors.background }}>
        <Icon name="alert-circle-outline" size={48} color={colors.error} />
        <Text style={{ marginTop: 16, color: colors.error, textAlign: 'center' }}>{error}</Text>
        <TouchableOpacity
          onPress={fetchWholesalers}
          style={{
            marginTop: 24,
            backgroundColor: colors.inviteButton,
            paddingVertical: 12,
            paddingHorizontal: 32,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '600' }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.textPrimary, marginBottom: 16 }}>
        Wholesalers who invited you
      </Text>
      <FlatList
        data={wholesalers}
        keyExtractor={item => item.user_id?.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.loading]}
            tintColor={colors.loading}
          />
        }
        ListEmptyComponent={
          <View style={{ flex: 1, alignItems: 'center', marginTop: 40 }}>
            <Icon name="cube-outline" size={56} color={colors.muted} />
            <Text style={{ color: colors.textSecondary, textAlign: 'center', marginTop: 16 }}>
              No wholesalers found. You may not have been invited yet.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleWholesalerPress(item)}
            activeOpacity={0.8}
            style={{
              backgroundColor: colors.cardBg,
              borderRadius: 12,
              padding: 16,
              marginBottom: 16,
              shadowColor: colors.shadowColor,
              shadowOpacity: 0.1,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 2 },
              elevation: 2,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '600', color: colors.textPrimary, marginBottom: 8 }}>
              {item.name}
            </Text>
            <Text style={{ color: colors.textSecondary }}>Email : {item.email}</Text>
            <Text style={{ color: colors.textSecondary }}>Phone : {item.phone}</Text>
            <Text style={{ color: colors.textSecondary }}>
              Address : {item.address?.street}, {item.address?.city}, {item.address?.state}
            </Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        onPress={() => {
          const inviteCode = user?.group_code || 'YOUR_GROUP_CODE';
          const link = `inventorymanagement://invite/${inviteCode}`;
          Share.share({ message: `Join my network! Tap: ${link}`, url: link });
        }}
        activeOpacity={0.85}
        style={{
          position: 'absolute',
          right: 24,
          bottom: 24,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.inviteButton,
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 30,
          shadowColor: '#000',
          shadowOpacity: 0.2,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 6,
        }}
      >
        <Icon name="add" size={24} color="#fff" />
        <Text style={{ color: '#fff', marginLeft: 8, fontWeight: '600' }}>Invite</Text>
      </TouchableOpacity>
    </View>
  );
}
