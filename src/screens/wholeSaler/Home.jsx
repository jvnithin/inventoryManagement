import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

const orders = [
  {
    id: '1',
    retailerName: 'Retailer A',
    items: [
      { product: 'Organic Apples', quantity: 2, price: 80 },
      { product: 'Honey', quantity: 1, price: 200 },
    ],
    total: 360,
    status: 'Pending',
    coords: { latitude: 28.7041, longitude: 77.1025 },
  },
  {
    id: '2',
    retailerName: 'Retailer B',
    items: [{ product: 'Green Tea', quantity: 3, price: 150 }],
    total: 450,
    status: 'Delivered',
    coords: { latitude: 28.5355, longitude: 77.391 },
  },
];

const OrderItem = ({ item }) => (
  <View style={styles.orderItem}>
    <Text style={styles.retailerName}>{item.retailerName}</Text>
    {item.items.map((p, idx) => (
      <Text key={idx} style={styles.itemText}>
        {p.product} x{p.quantity} = ₹{p.quantity * p.price}
      </Text>
    ))}
    <Text style={styles.totalText}>Total: ₹{item.total}</Text>
    <Text style={styles.statusText}>
      Status:{' '}
      <Text
        style={{
          color:
            item.status === 'Pending'
              ? '#D97706'
              : item.status === 'Delivered'
              ? '#059669'
              : '#DC2626',
        }}
      >
        {item.status}
      </Text>
    </Text>
  </View>
);

const OrdersListTab = () => (
  <ScrollView contentContainerStyle={{ padding: 16 }}>
    {orders.map((order) => (
      <OrderItem key={order.id} item={order} />
    ))}
  </ScrollView>
);

const MapViewTab = () => (
  <View style={{ flex: 1 }}>
    <MapView
      style={{ flex: 1 }}
      overScrollMode="never"
      removeClippedSubviews={true}
      initialRegion={{
        latitude: 28.6139,
        longitude: 77.209,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      }}
    >
      {orders
        .filter((o) => o.status === 'Pending')
        .map((order) => (
          <Marker
            key={order.id}
            coordinate={order.coords}
            title={order.retailerName}
            description={`₹${order.total} - ${order.items.length} item(s)`}
          />
        ))}
    </MapView>
  </View>
);

const Home = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Orders Dashboard</Text>
        <View style={styles.iconGroup}>
          <TouchableOpacity>
            <Icon name="color-palette-outline" size={22} color="#047857" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="key-outline" size={22} color="#047857" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="log-out-outline" size={22} color="#DC2626" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontWeight: '600' },
          tabBarActiveTintColor: '#065F46',
          tabBarIndicatorStyle: { backgroundColor: '#065F46' },
          tabBarStyle: { backgroundColor: 'white' },
        }}
      >
        <Tab.Screen name="Orders List" component={OrdersListTab} />
        <Tab.Screen name="Map View" component={MapViewTab} />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#065F46',
  },
  iconGroup: {
    flexDirection: 'row',
    gap: 16,
  },
  orderItem: {
    backgroundColor: '#ECFDF5',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  retailerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#065F46',
    marginBottom: 8,
  },
  itemText: {
    color: '#374151',
  },
  totalText: {
    fontWeight: '500',
    color: '#1F2937',
    marginTop: 8,
  },
  statusText: {
    fontSize: 13,
    marginTop: 4,
    color: '#4B5563',
  },
});

export default Home;
