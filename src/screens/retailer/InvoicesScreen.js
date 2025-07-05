import React from 'react';
import { View, Text, FlatList } from 'react-native';

const MOCK_INVOICES = [
  { id: 'inv1', date: '2025-07-01', amount: 130, status: 'Paid' },
  { id: 'inv2', date: '2025-06-28', amount: 60, status: 'Unpaid' },
];

export default function InvoicesScreen() {
  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold text-green-800 mb-4">Invoices</Text>
      <FlatList
        data={MOCK_INVOICES}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View className="mb-3 p-3 rounded-lg bg-green-50">
            <Text className="font-semibold text-green-900">Invoice #{item.id}</Text>
            <Text className="text-gray-700">Date: {item.date}</Text>
            <Text className="text-gray-700">Amount: ₹{item.amount}</Text>
            <Text className={item.status === 'Paid' ? 'text-green-700' : 'text-red-600'}>
              Status: {item.status}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text className="text-gray-500 text-center mt-10">No invoices yet</Text>
        }
      />
    </View>
  );
}
