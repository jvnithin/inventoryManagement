import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FloatingActionButton from '../../../components/FloatingActionButton';

const retailers = [
  {
    id: 'R001',
    name: 'Retailer One',
    photo: 'https://i.pravatar.cc/150?img=1',
    contact: '9876543210',
    totalValue: 12000,
    invoicesPending: 2,
    totalPaid: 9000,
  },
  {
    id: 'R002',
    name: 'Retailer Two',
    photo: 'https://i.pravatar.cc/150?img=2',
    contact: '9876543000',
    totalValue: 8500,
    invoicesPending: 1,
    totalPaid: 8500,
  },
  {
    id: 'R003',
    name: 'Retailer Three',
    photo: 'https://i.pravatar.cc/150?img=3',
    contact: '9876543111',
    totalValue: 5000,
    invoicesPending: 3,
    totalPaid: 2000,
  },
];

export default function RetailerList({ navigation }) {
  const renderRetailer = ({ item }) => (
    <TouchableOpacity
      className="flex-row items-center bg-white rounded-2xl shadow-sm p-4 mb-4"
      onPress={() => navigation.navigate('RetailerDetails', { retailer: item })}
    >
      {/* Retailer Image */}
      <Image
        source={{ uri: item.photo }}
        className="w-14 h-14 rounded-full mr-4"
      />

      {/* Details */}
      <View className="flex-1">
        <Text className="text-lg font-semibold text-green-800">
          {item.name}
        </Text>
        <Text className="text-sm text-gray-600">
          Total Orders: ₹{item.totalValue}
        </Text>
        <Text className="text-sm text-yellow-600">
          Invoices Pending: {item.invoicesPending}
        </Text>
        <Text className="text-sm text-green-700">Paid: ₹{item.totalPaid}</Text>
      </View>

      {/* Chevron Icon */}
      <Icon name="chevron-forward-outline" size={24} color="#065F46" />
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-100 px-4 pt-6">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-2xl font-bold text-green-800">Retailers</Text>
      </View>

      {/* List */}
      <FlatList
        data={retailers}
        keyExtractor={item => item.id}
        renderItem={renderRetailer}
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      />

      {/* FAB */}
      <FloatingActionButton onPress={() => console.log('Add Retailer')} />
    </View>
  );
}
