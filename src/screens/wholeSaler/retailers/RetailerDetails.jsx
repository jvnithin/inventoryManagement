import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppContext } from '../../../context/AppContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const fallbackImage =
  'https://ui-avatars.com/api/?background=16A34A&color=fff&name=R';

export default function RetailerDetails({ route, navigation }) {
  const { retailer } = route.params;
  const { orders, fetchOrders, apiUrl } = useAppContext();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [loading, setLoading] = useState(false);
  // Form state
  const [name, setName] = useState(retailer.name);
  const [contact, setContact] = useState(retailer.phone);
  const [street, setStreet] = useState(retailer.address?.street || '');
  const [city, setCity] = useState(retailer.address?.city || '');
  const [stateField, setStateField] = useState(retailer.address?.state || '');
  const [zip, setZip] = useState(retailer.address?.zip || '');
  const [photo, setPhoto] = useState(retailer.photo);

  // Edit mode and dropdown state
  const [isEditMode, setIsEditMode] = useState(false);
  const [showNewBillDropdown, setShowNewBillDropdown] = useState(false);
  const [billAmount, setBillAmount] = useState('');

  // --- CENTRAL: Filter orders for this retailer/customer ---
  console.log(orders);
  console.log(retailer.user_id);

  const retailerOrders = orders.filter(
    order => String(order.user_id) === String(retailer.user_id),
  );
  console.log(retailerOrders);
  const totalOrders = retailerOrders.length;
  console.log(totalOrders);
  const totalValue = retailerOrders.reduce(
    (sum, order) =>
      sum +
      (order.order_items
        ? order.order_items.price * order.order_items.quantity
        : 0),
    0,
  );

  const handleSaveRetailer = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const address = { street, city, state: stateField, zip };
      await axios.put(
        `${apiUrl}/api/wholesaler/edit-retailer/${retailer.user_id}`,
        { name, phone: contact, address, photo },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      Alert.alert('Success', 'Retailer updated successfully!');
      setIsEditMode(false);
    } catch (e) {
      Alert.alert('Error', 'Failed to update retailer!');
      console.log('updating details of retailer in wholesaler', e);
    }
  };

  const handleNewBillSubmit = async () => {
    if (!billAmount || parseFloat(billAmount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      console.log('no bill amount');
      return;
    }

    try {
      // TODO: Send to backend
      console.log('New bill amount:', billAmount);
      const response = await axios.post(
        `${apiUrl}/api/wholesaler/add-payment`,
        { retailerId: retailer.user_id, amount: parseFloat(billAmount) },
        {
          headers: {
            Authorization: `Bearer ${await AsyncStorage.getItem('token')}`,
          },
        },
      );
      console.log('new bill response', response.data);
      Alert.alert('Success', 'Bill amount recorded successfully!');
      setBillAmount('');
      setShowNewBillDropdown(false);

      // Refresh orders or update UI as needed
      fetchOrders();
    } catch (error) {
      Alert.alert('Error', 'Failed to record bill amount');
      console.log('new bill error', error);
    }
  };

  const handleCancelEdit = () => {
    // Reset form to original values
    setName(retailer.name);
    setContact(retailer.phone);
    setStreet(retailer.address?.street || '');
    setCity(retailer.address?.city || '');
    setStateField(retailer.address?.state || '');
    setZip(retailer.address?.zip || '');
    setPhoto(retailer.photo);
    setIsEditMode(false);
  };

  useEffect(() => {
    fetchOrders(); // Always fetch latest orders on mount
    // eslint-disable-next-line
  }, []);

  // Color tokens
  const bg = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const text = isDark ? 'text-gray-100' : 'text-gray-800';
  const label = isDark ? 'text-gray-400' : 'text-gray-600';
  const inputBg = isDark ? 'bg-gray-700' : 'bg-gray-100';
  const inputBorder = isDark ? 'border-gray-600' : 'border-gray-200';
  const accent = '#16A34A';

  return (
    <View className={`${bg} flex-1`}>
      <StatusBar
        backgroundColor={accent}
        barStyle={isDark ? 'light-content' : 'dark-content'}
      />
      <SafeAreaView className={`${bg} flex-1`}>
        {/* Header */}
        <View
          className="flex-row items-center px-4 pt-4 pb-3"
          style={{
            backgroundColor: accent,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 3,
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mr-3 bg-green-100 rounded-full p-2"
          >
            <Icon name="arrow-back" size={24} color="#065F46" />
          </TouchableOpacity>
          <Text
            className="flex-1 text-white text-xl font-bold"
            numberOfLines={1}
          >
            {retailer.name}
          </Text>
        </View>

        <ScrollView className="px-4 py-4">
          {/* Profile */}
          <View className="flex-col items-center mb-6">
            <Image
              source={{ uri: photo || fallbackImage }}
              className="w-20 h-20 rounded-full mr-4 border-2 border-green-200 bg-green-50"
              onError={() => setPhoto(fallbackImage)}
            />
            {isEditMode && (
              <TouchableOpacity
                onPress={() => console.log('Change Photo')}
                className="px-4 py-2 bg-green-100 rounded-full mt-3"
              >
                <Text className="text-green-800 font-medium">Change Photo</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Form Card */}
          <View className={`${cardBg} rounded-xl p-4 mb-6 shadow-md`}>
            <Text className={`text-sm ${label} mb-1`}>Retailer Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              editable={isEditMode}
              className={`border ${inputBorder} ${inputBg} rounded-lg px-3 py-2 mb-3 ${text} ${
                !isEditMode ? 'opacity-60' : ''
              }`}
            />

            <Text className={`text-sm ${label} mb-1`}>Contact Number</Text>
            <TextInput
              value={contact}
              onChangeText={setContact}
              keyboardType="phone-pad"
              editable={isEditMode}
              className={`border ${inputBorder} ${inputBg} rounded-lg px-3 py-2 mb-3 ${text} ${
                !isEditMode ? 'opacity-60' : ''
              }`}
            />

            <Text className={`text-sm ${label} mb-2`}>Address</Text>
            <TextInput
              placeholder="Street"
              value={street}
              onChangeText={setStreet}
              editable={isEditMode}
              className={`border ${inputBorder} ${inputBg} rounded-lg px-3 py-2 mb-2 ${text} ${
                !isEditMode ? 'opacity-60' : ''
              }`}
              placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            />
            <TextInput
              placeholder="City"
              value={city}
              onChangeText={setCity}
              editable={isEditMode}
              className={`border ${inputBorder} ${inputBg} rounded-lg px-3 py-2 mb-2 ${text} ${
                !isEditMode ? 'opacity-60' : ''
              }`}
              placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            />
            <TextInput
              placeholder="State"
              value={stateField}
              onChangeText={setStateField}
              editable={isEditMode}
              className={`border ${inputBorder} ${inputBg} rounded-lg px-3 py-2 mb-2 ${text} ${
                !isEditMode ? 'opacity-60' : ''
              }`}
              placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            />
            <TextInput
              placeholder="ZIP"
              value={zip}
              onChangeText={setZip}
              keyboardType="number-pad"
              editable={isEditMode}
              className={`border ${inputBorder} ${inputBg} rounded-lg px-3 py-2 mb-4 ${text} ${
                !isEditMode ? 'opacity-60' : ''
              }`}
              placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            />

            {/* Summary */}
            <View className="flex-row justify-between mt-4">
              <View>
                <Text className={`text-sm ${label}`}>Total Orders</Text>
                <Text className="text-lg font-bold" style={{ color: accent }}>
                  {totalOrders}
                </Text>
              </View>
              <View>
                <Text className={`text-sm ${label}`}>Amount Paid</Text>
                <Text className="text-lg font-bold" style={{ color: accent }}>
                  {retailer.amount_paid ?? 0}
                </Text>
              </View>
              <View>
                <Text className={`text-sm ${label}`}>Total Value</Text>
                <Text className="text-lg font-bold" style={{ color: accent }}>
                  ₹{totalValue}
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-3 mb-6">
            {!isEditMode ? (
              <>
                <TouchableOpacity
                  onPress={() => setIsEditMode(true)}
                  className="flex-1 bg-green-700 rounded-lg py-3 shadow-lg"
                >
                  <Text className="text-center text-white font-semibold text-base">
                    Update Details
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setShowNewBillDropdown(!showNewBillDropdown)}
                  className="flex-1 bg-blue-600 rounded-lg py-3 shadow-lg"
                >
                  <Text className="text-center text-white font-semibold text-base">
                    New Bill
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  onPress={handleSaveRetailer}
                  className="flex-1 bg-green-700 rounded-lg py-3 shadow-lg"
                >
                  <Text className="text-center text-white font-semibold text-base">
                    Save Changes
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleCancelEdit}
                  className="flex-1 bg-gray-500 rounded-lg py-3 shadow-lg"
                >
                  <Text className="text-center text-white font-semibold text-base">
                    Cancel
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* New Bill Dropdown */}
          {showNewBillDropdown && (
            <View
              className={`${cardBg} rounded-xl p-4 mb-6 shadow-md border-2 border-blue-200`}
            >
              <View className="flex-row items-center mb-3">
                <Icon name="receipt" size={20} color="#2563EB" />
                <Text className="ml-2 text-lg font-bold text-blue-600">
                  New Bill
                </Text>
              </View>

              <Text className={`text-sm ${label} mb-2`}>Enter Amount</Text>
              <TextInput
                placeholder="0.00"
                value={billAmount}
                onChangeText={setBillAmount}
                keyboardType="numeric"
                className={`border ${inputBorder} ${inputBg} rounded-lg px-3 py-2 mb-4 ${text}`}
                placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
              />

              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={handleNewBillSubmit}
                  className={`flex-1 ${
                    loading ? 'bg-blue-400' : 'bg-blue-600'
                  } rounded-lg py-2 shadow-lg`}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="text-center text-white font-semibold">
                      Submit
                    </Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    if (!loading) {
                      setBillAmount('');
                      setShowNewBillDropdown(false);
                    }
                  }}
                  className="flex-1 bg-gray-500 rounded-lg py-2 shadow-lg"
                  disabled={loading}
                >
                  <Text className="text-center text-white font-semibold">
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Orders List */}
          <Text className="text-lg font-bold mb-3" style={{ color: accent }}>
            Recent Orders
          </Text>
          {retailerOrders.length === 0 && (
            <Text className={`text-center ${label}`}>
              No orders for this retailer.
            </Text>
          )}
          <View className="pb-5">
            {retailerOrders
              .filter(order => order.status === 'delivered') // only delivered orders
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // most recent first
              .slice(0, 5) // take only the top 5
              .map(order => (
                <View
                  key={order.order_id}
                  className={`${cardBg} rounded-lg p-4 mb-3 border ${
                    isDark ? 'border-gray-700' : 'border-gray-200'
                  }`}
                >
                  <Text
                    className="font-semibold mb-1"
                    style={{ color: accent }}
                  >
                    {order.created_at
                      ? new Date(order.created_at).toLocaleDateString()
                      : ''}
                  </Text>
                  <Text className={`text-sm ${label} mb-1`}>
                    Items:{' '}
                    <Text className={`font-medium ${text}`}>
                      {order.order_items?.name || ''} x{' '}
                      {order.order_items?.quantity || ''}
                    </Text>
                  </Text>
                  <View className="flex-row items-center">
                    <Icon name="pricetag" size={16} color={accent} />
                    <Text className="ml-1 font-bold" style={{ color: accent }}>
                      ₹
                      {order.order_items
                        ? order.order_items.price * order.order_items.quantity
                        : 0}
                    </Text>
                  </View>
                </View>
              ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
