// CompletedOrders.jsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppContext } from '../../context/AppContext';
import Geolocation from '@react-native-community/geolocation';
import { useColorScheme } from 'nativewind';

export default function CompletedOrders({ orders }) {
  const { user } = useAppContext();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [location, setLocation] = useState(null);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      pos =>
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      () => {},
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 10000 },
    );
  }, []);

  const buildMapsUrl = () => {
    const completed = orders.filter(o => o.status === 'delivered');
    if (!completed.length) return null;
    const coords = completed.map(
      o => `${o.address.latitude},${o.address.longitude}`,
    );
    const origin = location
      ? `${location.lat},${location.lng}`
      : `${user.address.latitude},${user.address.longitude}`;
    const destination = coords[coords.length - 1];
    const waypoints = coords.slice(0, -1).join('|');
    return [
      'https://www.google.com/maps/dir/?api=1',
      `origin=${encodeURIComponent(origin)}`,
      `destination=${encodeURIComponent(destination)}`,
      waypoints && `waypoints=${encodeURIComponent(waypoints)}`,
      'travelmode=driving',
    ]
      .filter(Boolean)
      .join('&');
  };

  const openGoogleMaps = () => {
    const url = buildMapsUrl();
    if (!url) {
      Alert.alert('Route Error', 'Not enough locations to navigate');
      return;
    }
    Linking.openURL(url).catch(() =>
      Alert.alert('Error', 'Cannot open Google Maps.'),
    );
  };

  const completed = orders.filter(o => o.status === 'delivered');
  if (!completed.length) {
    return (
      <View
        className={`flex-1 justify-center items-center ${
          isDark ? 'bg-gray-900' : 'bg-gray-100'
        }`}
      >
        <Text
          className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-lg`}
        >
          No completed orders.
        </Text>
      </View>
    );
  }

  return (
    <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {completed.map(order => (
          <View
            key={order.order_id}
            className={`
              mb-4 p-4 rounded-xl
              ${isDark ? 'bg-gray-800' : 'bg-white'}
              ${
                isDark
                  ? 'shadow-md shadow-black/20'
                  : 'shadow-sm shadow-gray-300'
              }
            `}
          >
            <View className="flex-row justify-between items-center mb-2">
              <Text
                className={`text-base font-semibold ${
                  isDark ? 'text-white' : 'text-green-800'
                }`}
              >
                Order Id : {order.order_id}
              </Text>
              <Text
                className={`
                px-3 py-1 text-xs font-bold rounded-full
                ${
                  isDark
                    ? 'bg-green-700 text-green-100'
                    : 'bg-green-100 text-green-800'
                }
              `}
              >
                Delivered
              </Text>
            </View>
            <Text
              className={`${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}
            >
              Date:{' '}
              {order.created_at
                ? new Date(order.created_at).toLocaleDateString()
                : 'N/A'}
            </Text>
            <Text
              className={`${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}
            >
              Address:{' '}
              {order.address
                ? [
                    order.address.street,
                    order.address.city,
                    order.address.state,
                    order.address.zip,
                  ]
                    .filter(Boolean)
                    .join(', ')
                : 'N/A'}
            </Text>
            {order.order_items && (
              <Text
                className={`${isDark ? 'text-gray-300' : 'text-gray-700'} mb-3`}
              >
                Items: {order.order_items.name} × {order.order_items.quantity} —
                ₹{order.order_items.price * order.order_items.quantity}
              </Text>
            )}{' '}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
