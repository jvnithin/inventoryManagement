import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  useColorScheme,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../context/AppContext';

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
      return `Order #${item.data.order_id ?? ''}`;
    case 'new-order':
      return `Order #${item.data.order_id ?? ''} has been placed.`;
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
  const colorScheme = useColorScheme();

  // Theme palette
  const theme =
    colorScheme === 'dark'
      ? {
          background: '#111827',
          card: '#1E293B',
          text: '#F8FAFC',
          green: '#22C55E',
          unreadBg: '#14532D',
          border: '#334155',
          iconInactive: '#A3A3A3',
          iconActive: '#22C55E',
          empty: '#64748B',
        }
      : {
          background: '#F8FAFC',
          card: '#fff',
          text: '#111827',
          green: '#16A34A',
          unreadBg: '#DCFCE7',
          border: '#E5E7EB',
          iconInactive: '#6B7280',
          iconActive: '#16A34A',
          empty: '#9CA3AF',
        };

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
    // Defensive: skip if item or item.data is missing
    if (!item || !item.data) return null;
    return (
      <TouchableOpacity
        style={[styles.notification(theme), !item.read && styles.unread(theme)]}
        onPress={() => markAsRead(index)}
        activeOpacity={0.7}
      >
        <Icon
          name={getIconName(item.type)}
          size={24}
          color={item.read ? theme.iconInactive : theme.iconActive}
          style={{ marginRight: 12 }}
        />
        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.title(theme),
              !item.read && styles.unreadTitle(theme),
            ]}
          >
            {getTitle(item.type)}
          </Text>
          <Text style={styles.body(theme)}>
            <Text style={styles.body(theme)}>{String(getBody(item))}</Text>
          </Text>
        </View>
        {!item.read && <View style={styles.dot(theme)} />}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container(theme)}>
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />
      {/* Custom Header */}
      <View style={styles.header(theme)}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Icon name="arrow-back-outline" size={24} color={theme.green} />
        </TouchableOpacity>
        <Text style={styles.headerTitle(theme)}>Notifications</Text>
        <View style={{ width: 24 }}></View> {/* Alignment placeholder */}
      </View>
      {/* Notification List */}
      {filteredNotifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon
            name="notifications-off-outline"
            size={48}
            color={theme.empty}
          />
          <Text style={styles.emptyText(theme)}>No notifications yet</Text>
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

// ----- Dynamic styles -----
const styles = {
  container: theme => ({
    flex: 1,
    backgroundColor: theme.background,
    paddingHorizontal: 16,
    paddingTop: 0,
  }),
  header: theme => ({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.card,
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    marginBottom: 8,
  }),
  headerTitle: theme => ({
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.green,
    flex: 1,
    textAlign: 'center',
  }),
  backBtn: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notification: theme => ({
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.card,
    borderRadius: 10,
    marginVertical: 6,
    padding: 14,
    elevation: 1,
    borderWidth: 1,
    borderColor: theme.border,
  }),
  unread: theme => ({
    backgroundColor: theme.unreadBg,
  }),
  title: theme => ({
    fontSize: 16,
    color: theme.text,
    fontWeight: '500',
  }),
  unreadTitle: theme => ({
    color: theme.green,
    fontWeight: 'bold',
  }),
  body: theme => ({
    fontSize: 14,
    color: theme.text,
    marginTop: 2,
    opacity: 0.85,
  }),
  dot: theme => ({
    width: 10,
    height: 10,
    backgroundColor: theme.green,
    borderRadius: 5,
    marginLeft: 8,
  }),
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: theme => ({
    marginTop: 12,
    color: theme.empty,
    fontSize: 16,
  }),
};
