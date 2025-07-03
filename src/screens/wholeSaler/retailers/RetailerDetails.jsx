import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const RetailerDetails = ({ route }) => {
  const { retailer } = route.params;

  const [name, setName] = useState(retailer.name);
  const [contact, setContact] = useState(retailer.contact);
  const [location, setLocation] = useState('Hyderabad');
  const [photo, setPhoto] = useState(retailer.photo);

  const totalOrders = 6;
  const totalValue = retailer.totalValue;

  const orders = [
    {
      id: 'O001',
      date: '2025-06-28',
      items: ['Organic Apples', 'Green Tea'],
      value: 500,
    },
    {
      id: 'O002',
      date: '2025-06-30',
      items: ['Almonds', 'Natural Honey'],
      value: 850,
    },
    {
      id: 'O003',
      date: '2025-07-01',
      items: ['Almonds'],
      value: 450,
    },
  ];

  return (
    <ScrollView className="flex-1 bg-white px-4 pt-6">
      {/* Header */}
      <View className="flex-row items-center mb-4">
        <Image
          source={{ uri: photo }}
          className="w-20 h-20 rounded-full mr-4"
        />
        <TouchableOpacity
          onPress={() => console.log('Change Photo')}
          className="bg-green-100 px-3 py-1 rounded-full"
        >
          <Text className="text-green-700 text-sm">Change Photo</Text>
        </TouchableOpacity>
      </View>

      {/* Editable Fields */}
      <View className="mb-6">
        <Text className="text-sm text-gray-600 mb-1">Retailer Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          className="border border-gray-300 rounded-xl px-4 py-2 mb-3"
        />

        <Text className="text-sm text-gray-600 mb-1">Contact Number</Text>
        <TextInput
          value={contact}
          onChangeText={setContact}
          keyboardType="phone-pad"
          className="border border-gray-300 rounded-xl px-4 py-2 mb-3"
        />

        <Text className="text-sm text-gray-600 mb-1">Location</Text>
        <TextInput
          value={location}
          onChangeText={setLocation}
          className="border border-gray-300 rounded-xl px-4 py-2 mb-3"
        />

        <View className="flex-row justify-between mt-4">
          <View>
            <Text className="text-sm text-gray-500">Total Order Value</Text>
            <Text className="text-lg font-bold text-green-700">₹{totalValue}</Text>
          </View>
          <View>
            <Text className="text-sm text-gray-500">Total Orders</Text>
            <Text className="text-lg font-bold text-green-700">{totalOrders}</Text>
          </View>
        </View>
      </View>

      {/* Orders List */}
      <View className="mb-4">
        <Text className="text-xl font-semibold text-green-800 mb-3">Orders</Text>
        {orders.map((order) => (
          <View
            key={order.id}
            className="border border-gray-200 rounded-xl p-4 mb-3 bg-gray-50"
          >
            <Text className="text-base font-medium text-green-700 mb-1">
              {order.date}
            </Text>
            <Text className="text-sm text-gray-700 mb-1">
              Items: {order.items.join(', ')}
            </Text>
            <Text className="text-sm text-green-800 font-semibold">
              Order Value: ₹{order.value}
            </Text>
          </View>
        ))}
      </View>

      {/* Save Button */}
      <TouchableOpacity
        onPress={() => console.log('Saving...')}
        className="bg-green-700 py-3 rounded-xl mb-6"
      >
        <Text className="text-white text-center text-base font-semibold">Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default RetailerDetails;
