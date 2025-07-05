import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, SafeAreaView, StyleSheet, ActivityIndicator, Linking, Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Geolocation from '@react-native-community/geolocation';
import { useAppContext } from '../../context/AppContext';

const OrdersDashboard = () => {
  const { apiUrl, user, orders, setOrders, fetchOrders } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      await fetchOrders();
      setLoading(false);
    };
    loadOrders();

    Geolocation.getCurrentPosition(
      position => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      error => {
        console.error('Error getting location:', error);
      },
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 10000 },
    );
    // eslint-disable-next-line
  }, []);

  const markAsDelivered = async (orderId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put(
        `${apiUrl}/api/wholesaler/update-order-status/${orderId}`,
        { status: 'delivered' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Option 1: update locally
      setOrders(prev =>
        prev.map(order =>
          order.order_id === orderId
            ? { ...order, status: 'delivered' }
            : order
        )
      );
      // Option 2: or just refetch
      // await fetchOrders();
      Alert.alert('Success', `Order #${orderId} marked as delivered`);
    } catch (error) {
      Alert.alert('Error', 'Failed to mark order as delivered');
    }
  };

  const buildMapsUrl = () => {
    const locs = orders.map(order => ({
      lat: order.address.latitude,
      lng: order.address.longitude,
    }));
    const fmt = loc => `${loc.lat},${loc.lng}`;
    const origin = fmt(location || { lat: user.address.latitude, lng: user.address.longitude });
    const destination = fmt(locs[locs.length - 1]);
    const waypoints = locs
      .slice(0, locs.length - 1)
      .map(fmt)
      .map(encodeURIComponent)
      .join('|');
    return (
      `https://www.google.com/maps/dir/?api=1` +
      `&origin=${encodeURIComponent(origin)}` +
      `&destination=${encodeURIComponent(destination)}` +
      (waypoints ? `&waypoints=${waypoints}` : '') +
      `&travelmode=driving`
    );
  };

  const handleGoogle = async () => {
    const url = buildMapsUrl();
    if (!url) {
      Alert.alert('Route Error', 'Not enough locations to navigate');
      return;
    }
    try {
      const supported = await Linking.openURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Not Supported', 'This URL cannot be opened on your device.');
      }
    } catch (err) {
      Alert.alert('Error', 'Cannot open Google Maps or browser.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#16a34a" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={{ paddingVertical: 16 }}>
          {orders.length === 0 && (
            <Text style={styles.emptyText}>No orders to show.</Text>
          )}
          {orders.map(order => (
            <View key={order.order_id} style={styles.orderItem}>
              <Text style={styles.retailerName}>Order #{order.order_id}</Text>
              <Text style={styles.itemText}>
                Status:{' '}
                <Text
                  style={{
                    color:
                      order.status === 'pending'
                        ? '#D97706'
                        : order.status === 'delivered'
                        ? '#059669'
                        : '#DC2626',
                    fontWeight: 'bold',
                  }}
                >
                  {order.status}
                </Text>
              </Text>
              <Text style={styles.itemText}>
                Date:{' '}
                {order.created_at
                  ? new Date(order.created_at).toLocaleDateString()
                  : 'N/A'}
              </Text>
              <Text style={styles.itemText}>
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
                <View style={{ marginTop: 8 }}>
                  <Text style={styles.itemsTitle}>Items:</Text>
                  <Text style={styles.itemText}>
                    {order.order_items.name} x {order.order_items.quantity} - {'\u20B9'}
                    {order.order_items.price * order.order_items.quantity}
                  </Text>
                </View>
              )}
              <Text style={styles.totalText}>
                Total: {'\u20B9'}
                {order.order_items
                  ? order.order_items.price * order.order_items.quantity
                  : 0}
              </Text>
              {order.status !== 'delivered' && (
                <TouchableOpacity
                  onPress={() => markAsDelivered(order.order_id)}
                  style={{
                    marginTop: 10,
                    backgroundColor: '#10B981',
                    paddingVertical: 10,
                    borderRadius: 8,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>
                    Mark as Delivered
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleGoogle}
        activeOpacity={0.85}
      >
        <Icon name="map-outline" size={24} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.fabText}>Open in google maps</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ECFDF5', paddingHorizontal: 16 },
  emptyText: { color: '#64748b', textAlign: 'center', marginTop: 40, fontSize: 16 },
  orderItem: {
    backgroundColor: '#fff', borderRadius: 12, padding: 18, marginBottom: 18,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  retailerName: { fontSize: 18, fontWeight: '600', color: '#065F46', marginBottom: 8, letterSpacing: 0.5 },
  itemText: { color: '#374151', fontSize: 15, marginTop: 2 },
  itemsTitle: { color: '#0f766e', fontWeight: 'bold', marginBottom: 2, fontSize: 15 },
  totalText: { fontWeight: 'bold', color: '#16a34a', marginTop: 8, fontSize: 16 },
  fab: {
    position: 'absolute', right: 24, bottom: 36, flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#06B6D4', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 30,
    elevation: 4, shadowColor: '#000', shadowOpacity: 0.12, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6,
  },
  fabText: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginLeft: 8, letterSpacing: 0.5 },
});

export default OrdersDashboard;