// src/screens/NotificationScreen.js

import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppContext } from '../context/AppContext';

export default function NotificationScreen() {
  const { notifications, setNotifications, user } = useAppContext();

  // Filter notifications relevant to the current user's role
  const filteredNotifications = notifications.filter(
    n => !user || !n.for || n.for === user.role
  );

  // Mark notification as read
  const markAsRead = (index) => {
    setNotifications(prev =>
      prev.map((n, i) => i === index ? { ...n, read: true } : n)
    );
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={[styles.notification, !item.read && styles.unread]}
      onPress={() => markAsRead(index)}
      activeOpacity={0.7}
    >
      <Icon
        name={getIconName(item.type)}
        size={24}
        color={item.read ? '#6B7280' : '#16A34A'}
        style={{ marginRight: 12 }}
      />
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, !item.read && styles.unreadTitle]}>
          {getTitle(item.type)}
        </Text>
        <Text style={styles.body}>
          {getBody(item)}
        </Text>
      </View>
      {!item.read && <View style={styles.dot} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {filteredNotifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="notifications-off-outline" size={48} color="#9CA3AF" />
          <Text style={styles.emptyText}>No notifications yet</Text>
        </View>
      ) : (
        <FlatList
          data={filteredNotifications.slice().reverse()} 
          keyExtractor={(_, idx) => idx.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </SafeAreaView>
  );
}

// Helper functions for notification display
function getIconName(type) {
  switch (type) {
    case 'order-cancelled': return 'close-circle-outline';
    case 'new-order': return 'add-circle-outline';
    case 'order-completed': return 'checkmark-done-circle-outline';
    default: return 'notifications-outline';
  }
}

function getTitle(type) {
  switch (type) {
    case 'order-cancelled': return 'Order Cancelled';
    case 'new-order': return 'New Order';
    case 'order-completed': return 'Order Completed';
    default: return 'Notification';
  }
}

function getBody(item) {
  if (item.type === 'order-cancelled' || item.type === 'order-completed') {
    return `Order #${item.data.order_id}`;
  }
  if (item.type === 'new-order') {
    return `Order #${item.data.order_id} has been placed.`;
  }
  return '';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#16A34A',
    alignSelf: 'center',
  },
  notification: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 6,
    padding: 14,
    elevation: 1,
  },
  unread: {
    backgroundColor: '#DCFCE7',
  },
  title: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  unreadTitle: {
    color: '#16A34A',
    fontWeight: 'bold',
  },
  body: {
    fontSize: 14,
    color: '#374151',
    marginTop: 2,
  },
  dot: {
    width: 10,
    height: 10,
    backgroundColor: '#16A34A',
    borderRadius: 5,
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    marginTop: 12,
    color: '#9CA3AF',
    fontSize: 16,
  },
});
