// src/screens/PendingOrders.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppContext } from '../../context/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useColorScheme } from 'nativewind';

export default function PendingOrders({ orders, onCancel, loading }) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const bg = isDark ? '#1F2937' : '#FFFFFF';
  const cardBg = isDark ? '#374151' : '#E6F9ED';
  const textPrimary = isDark ? '#F9FAFB' : '#065F46';
  const textSecondary = isDark ? '#9CA3AF' : '#4B5563';

  const renderItem = ({ item }) => (
    <View style={{
      marginBottom: 16,
      padding: 16,
      borderRadius: 12,
      backgroundColor: cardBg,
      shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
    }}>
      <Text style={{ fontSize: 18, fontWeight: '600', color: textPrimary }}>
        Order Id : {item.order_id}
      </Text>
      <Text style={{ marginTop: 4, color: textSecondary }}>
        Date: {new Date(item.created_at).toLocaleDateString()}
      </Text>
      <Text style={{ marginTop: 4, color: textSecondary }}>
        Address: {formatAddress(item.address)}
      </Text>
      <Text style={{ marginTop: 4, color: textSecondary }}>
        Status:{' '}
        <Text style={{
          color: item.status === 'pending' ? '#D97706'
                 : item.status === 'delivered' ? '#059669'
                 : '#DC2626',
          fontWeight: 'bold'
        }}>
          {item.status}
        </Text>
      </Text>
      <Text style={{ marginTop: 8, fontWeight: 'bold', color: '#059669' }}>
        Total: ₹{item.order_items?.price * item.order_items.quantity || 0}
      </Text>
      {item.status === 'pending' && (
        <TouchableOpacity
          onPress={() => onCancel(item.order_id)}
          style={{
            marginTop: 12,
            backgroundColor: '#DC2626',
            paddingVertical: 10,
            paddingHorizontal: 16,
            borderRadius: 8,
            alignSelf: 'flex-start'
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '600' }}>Cancel Order</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: bg, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#16A34A" />
      </View>
    );
  }

  return (
    <FlatList
      data={orders.filter(o => o.status === 'pending')}
      keyExtractor={o => o.order_id.toString()}
      renderItem={renderItem}
      contentContainerStyle={{ backgroundColor: bg, padding: 16, flexGrow: 1 }}
      ListEmptyComponent={
        <Text style={{ color: textSecondary, textAlign: 'center', marginTop: 40 }}>
          No pending orders
        </Text>
      }
    />
  );
}

// Helper
function formatAddress(address) {
  if (!address) return 'N/A';
  return [address.street, address.city, address.state, address.zip].filter(Boolean).join(', ');
}
