import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Platform,
  useColorScheme,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../context/AppContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ----- Helper functions -----
function getIconName(type) {
  switch (type) {
    case 'order-cancelled':
      return 'close-circle-outline';
    case 'new-order':
      return 'add-circle-outline';
    case 'order-completed':
      return 'checkmark-done-circle-outline';
    case 'new-retailer':
      return 'person-add-outline';
    default:
      return 'notifications-outline';
  }
}

function getTitle(type) {
  switch (type) {
    case 'order-cancelled':
      return 'Order Cancelled';
    case 'new-order':
      return 'New Order';
    case 'order-completed':
      return 'Order Completed';
    case 'new-retailer':
      return 'New Retailer Joined';
    default:
      return 'Notification';
  }
}

function getBody(item) {
  if (!item || !item.type || !item.data) return '';
  switch (item.type) {
    case 'order-cancelled':
    case 'order-completed':
      return `Order Id : ${item.data.order_id ?? ''}`;
    case 'new-order':
      return `Order Id : ${item.data.order_id ?? ''} has been placed.`;
    case 'new-retailer':
      return `${
        item.data.name ? item.data.name : 'A retailer'
      } joined the platform.`;
    default:
      return '';
  }
}

// ----- Main component -----
export default function NotificationScreen() {
  const { notifications, setNotifications, user } = useAppContext();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  // Filter notifications for the current user role
  const filteredNotifications = notifications.filter(
    n => !user || !n.for || n.for === user.role,
  );

  // Mark notification as read
  const markAsRead = index => {
    setNotifications(prev =>
      prev.map((n, i) => (i === index ? { ...n, read: true } : n)),
    );
  };

  // Render each notification item
  const renderItem = ({ item, index }) => {
    if (!item || !item.data) return null;
    
    return (
      <TouchableOpacity
        className={`
          flex-row items-center 
          bg-white dark:bg-gray-800 
          rounded-lg my-1.5 p-3.5 
          border border-gray-200 dark:border-gray-600
          ${!item.read ? 'bg-green-50 dark:bg-green-900/20' : ''}
        `}
        onPress={() =>markAsRead(index)}
        activeOpacity={0.7}
      >
        <Icon
          name={getIconName(item.type)}
          size={24}
          color={item.read ? '#9CA3AF' : '#16A34A'}
          className="mr-3"
        />
        <View className="flex-1">
          <Text
            className={`
              text-base text-gray-900 dark:text-white font-medium
              ${!item.read ? 'text-green-600 dark:text-green-400 font-bold' : ''}
            `}
          >
            {getTitle(item.type)}
          </Text>
          <Text className="text-sm text-gray-700 dark:text-gray-300 mt-0.5 opacity-85">
            {String(getBody(item))}
          </Text>
        </View>
        {!item.read && (
          <View className="w-2.5 h-2.5 bg-green-500 rounded-full ml-2" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View 
      className="flex-1 bg-gray-50 dark:bg-gray-900"
      style={{ paddingTop: insets.top }}
    >
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      
      {/* Custom Header */}
      <View className="flex-row items-center justify-between bg-white dark:bg-gray-800 py-4 px-4 border-b border-gray-200 dark:border-gray-600 mb-2">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-8 items-center justify-center"
        >
          <Icon name="arrow-back-outline" size={24} color="#16A34A" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-green-600 dark:text-green-400 flex-1 text-center">
          Notifications
        </Text>
        <View className="w-6" />
      </View>

      {/* Notification List */}
      <View className="flex-1 px-4">
        {filteredNotifications.length === 0 ? (
          <View className="flex-1 justify-center items-center mt-15">
            <Icon
              name="notifications-off-outline"
              size={48}
              color="#9CA3AF"
            />
            <Text className="mt-3 px-2 text-gray-500 dark:text-gray-400 text-base">
              No notifications yet
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredNotifications.slice().reverse()}
            keyExtractor={(_, idx) => idx.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}
