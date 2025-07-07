// src/components/NotificationIcon.jsx

import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../context/AppContext';

export default function NotificationIcon() {
  const navigation = useNavigation();
  const { user, notifications } = useAppContext();

  // Count unread notifications
  let unreadCount = 0;
  if (user.role === 'wholesaler') {
    unreadCount = notifications.filter(
      n => !n.read && n.for === 'wholesaler'
    ).length;
  } else if (user.role === 'retailer') {
    unreadCount = notifications.filter(
      n => !n.read && n.for === 'retailer'
    ).length;
  }

  return (
    <TouchableOpacity
      style={{ marginRight: 16 }}
      onPress={() => navigation.navigate('Notifications')}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Icon name="notifications-outline" size={26} color="#fff" />
      {unreadCount > 0 && (
        <View
          style={{
            position: 'absolute',
            right: 2,
            top: 2,
            backgroundColor: '#EF4444',
            borderRadius: 8,
            minWidth: 16,
            height: 16,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 3,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>
            {unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

