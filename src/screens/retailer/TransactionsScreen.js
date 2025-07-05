import React from 'react';
import { View, Text, FlatList } from 'react-native';

const MOCK_TRANSACTIONS = [
  { id: 'txn1', date: '2025-07-01', amount: 130, type: 'Debit' },
  { id: 'txn2', date: '2025-06-28', amount: 60, type: 'Credit' },
];

export default function TransactionsScreen() {
  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold text-green-800 mb-4">Transactions</Text>
      <FlatList
        data={MOCK_TRANSACTIONS}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View className="mb-3 p-3 rounded-lg bg-green-50">
            <Text className="font-semibold text-green-900">Txn #{item.id}</Text>
            <Text className="text-gray-700">Date: {item.date}</Text>
            <Text className="text-gray-700">Amount: ₹{item.amount}</Text>
            <Text className={item.type === 'Debit' ? 'text-red-600' : 'text-green-700'}>
              Type: {item.type}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text className="text-gray-500 text-center mt-10">No transactions yet</Text>
        }
      />
    </View>
  );
}
