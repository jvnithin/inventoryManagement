import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity, Image, SafeAreaView, Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppContext } from '../../../context/AppContext';

const fallbackImage = 'https://ui-avatars.com/api/?background=16A34A&color=fff&name=R';

const RetailerDetails = ({ route, navigation }) => {
  const { apiUrl, orders, fetchOrders } = useAppContext();
  const { retailer } = route.params;
  const [name, setName] = useState(retailer.name);
  const [contact, setContact] = useState(retailer.phone);
  const [photo, setPhoto] = useState(retailer.photo);

  // Address fields
  const [street, setStreet] = useState(retailer.address?.street || '');
  const [city, setCity] = useState(retailer.address?.city || '');
  const [state, setState] = useState(retailer.address?.state || '');
  const [zip, setZip] = useState(retailer.address?.zip || '');

  // Filter orders for this retailer
  const retailerOrders = orders.filter(order => order.retailer_id === retailer.user_id);

  const totalOrders = retailerOrders.length;
  const totalValue = retailerOrders.reduce((sum, order) =>
    sum + (order.order_items ? order.order_items.price * order.order_items.quantity : 0),
    0
  );

  const handleSaveRetailer = async () => {
    try {
      const userToken = await AsyncStorage.getItem('token');
      const address = { street, city, state, zip };
      await axios.put(
        `${apiUrl}/api/wholesaler/edit-retailer/${retailer.user_id}`,
        { name, phone: contact, address, photo },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      Alert.alert('Success', 'Retailer updated successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update retailer!');
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16,
        paddingBottom: 12, backgroundColor: '#16A34A', borderBottomLeftRadius: 18, borderBottomRightRadius: 18,
        shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, elevation: 3,
      }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            marginRight: 14, backgroundColor: '#bbf7d0', borderRadius: 20, padding: 5,
          }}
        >
          <Icon name="arrow-back" size={24} color="#065F46" />
        </TouchableOpacity>
        <Text style={{
          fontSize: 22, fontWeight: 'bold', color: '#fff', flex: 1,
        }} numberOfLines={1}>
          {retailer.name}
        </Text>
      </View>
      <ScrollView style={{ flex: 1, paddingHorizontal: 16, paddingTop: 18 }}>
        {/* Profile Section */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18 }}>
          <Image
            source={{ uri: photo || fallbackImage }}
            style={{
              width: 80, height: 80, borderRadius: 40, marginRight: 18,
              borderWidth: 2, borderColor: '#bbf7d0', backgroundColor: '#e6f9ed'
            }}
            onError={() => setPhoto(fallbackImage)}
          />
          <TouchableOpacity
            onPress={() => console.log('Change Photo')}
            style={{
              backgroundColor: '#e6f9ed', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 16,
            }}
          >
            <Text style={{ color: '#16A34A', fontWeight: '600' }}>Change Photo</Text>
          </TouchableOpacity>
        </View>
        {/* Editable Fields */}
        <View style={{
          backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 20,
          shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
        }}>
          <Text style={{ fontSize: 13, color: '#64748b', marginBottom: 3 }}>Retailer Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            style={{
              borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, paddingHorizontal: 12,
              paddingVertical: 8, marginBottom: 10, fontSize: 16, color: '#065F46', backgroundColor: '#f1f5f9'
            }}
          />
          <Text style={{ fontSize: 13, color: '#64748b', marginBottom: 3 }}>Contact Number</Text>
          <TextInput
            value={contact}
            onChangeText={setContact}
            keyboardType="phone-pad"
            style={{
              borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, paddingHorizontal: 12,
              paddingVertical: 8, marginBottom: 10, fontSize: 16, color: '#065F46', backgroundColor: '#f1f5f9'
            }}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
            <View>
              <Text style={{ fontSize: 13, color: '#64748b' }}>Total Order Value</Text>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#16A34A' }}>₹{totalValue}</Text>
            </View>
            <View>
              <Text style={{ fontSize: 13, color: '#64748b' }}>Total Orders</Text>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#16A34A' }}>{totalOrders}</Text>
            </View>
          </View>
        </View>
        {/* Orders List */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#16A34A', marginBottom: 10 }}>
            Orders
          </Text>
          {retailerOrders.length === 0 && (
            <Text style={{ color: '#64748b', textAlign: 'center' }}>No orders for this retailer.</Text>
          )}
          {retailerOrders.map((order) => (
            <View
              key={order.order_id}
              style={{
                borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 14, padding: 14, marginBottom: 10,
                backgroundColor: '#f9fafb', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 2, elevation: 1,
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: '600', color: '#16A34A', marginBottom: 2 }}>
                {order.created_at ? new Date(order.created_at).toLocaleDateString() : ''}
              </Text>
              <Text style={{ fontSize: 13, color: '#64748b', marginBottom: 2 }}>
                Items: <Text style={{ color: '#065F46' }}>
                  {order.order_items ? order.order_items.name : ''} x {order.order_items ? order.order_items.quantity : ''}
                </Text>
              </Text>
              <Text style={{ fontSize: 14, color: '#065F46', fontWeight: 'bold' }}>
                Order Value: ₹{order.order_items ? order.order_items.price * order.order_items.quantity : 0}
              </Text>
            </View>
          ))}
        </View>
        <TouchableOpacity
          onPress={handleSaveRetailer}
          style={{
            backgroundColor: '#16A34A',
            paddingVertical: 14,
            borderRadius: 12,
            marginBottom: 32,
            shadowColor: '#000',
            shadowOpacity: 0.08,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontSize: 17, fontWeight: 'bold', letterSpacing: 0.5 }}>
            Save Changes
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RetailerDetails;
