// src/screens/Invoices.jsx

import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useColorScheme } from 'nativewind';

const dummyInvoices = [
  { id: 1, invoiceNumber: 'INV-1001', retailerName: 'Retailer A', date: '2025-06-15', totalAmount: 1200.5, status: 'Paid' },
  { id: 2, invoiceNumber: 'INV-1002', retailerName: 'Retailer B', date: '2025-06-18', totalAmount: 850.0, status: 'Unpaid' },
  { id: 3, invoiceNumber: 'INV-1003', retailerName: 'Retailer C', date: '2025-06-20', totalAmount: 425.75, status: 'Paid' },
  { id: 4, invoiceNumber: 'INV-1004', retailerName: 'Retailer D', date: '2025-06-22', totalAmount: 999.99, status: 'Unpaid' },
];

const formatCurrency = (amt) => `₹${amt.toFixed(2)}`;
const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const result = invoices.filter((inv) =>
      inv.retailerName.toLowerCase().includes(search.toLowerCase()) ||
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredInvoices(result);
  }, [search, invoices]);

  const loadData = () => {
    setLoading(true);
    setTimeout(() => {
      setInvoices(dummyInvoices);
      setFilteredInvoices(dummyInvoices);
      setLoading(false);
    }, 800);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setInvoices(dummyInvoices);
      setRefreshing(false);
    }, 800);
  };

  const summary = {
    totalCount: invoices.length,
    totalAmount: invoices.reduce((sum, i) => sum + i.totalAmount, 0),
    paid: invoices.filter((i) => i.status === 'Paid').length,
    unpaid: invoices.filter((i) => i.status === 'Unpaid').length,
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      className={`
        flex-row justify-between items-start
        ${isDark ? 'bg-gray-800' : 'bg-white'}
        mx-4 my-2 p-4 rounded-2xl
        ${isDark ? 'shadow-black/20' : 'shadow-md'}
      `}
      activeOpacity={0.8}
      onPress={() => {}}
    >
      <View className="flex-1 pr-3">
        <Text className={`${isDark ? 'text-gray-100' : 'text-gray-800'} text-lg font-semibold mb-1`}>
          {item.invoiceNumber}
        </Text>
        <Text className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mb-1`}>
          {item.retailerName}
        </Text>
        <Text className={`${isDark ? 'text-gray-500' : 'text-gray-500'} text-sm`}>
          Date: {formatDate(item.date)}
        </Text>
        <Text className={`${isDark ? 'text-gray-100' : 'text-gray-800'} text-sm mt-2`}>
          Total: {formatCurrency(item.totalAmount)}
        </Text>
      </View>
      <View className="items-end">
        <Text
          className={`text-sm font-medium ${
            item.status === 'Paid'
              ? isDark ? 'text-green-400' : 'text-green-600'
              : isDark ? 'text-red-400' : 'text-red-600'
          }`}
        >
          {item.status}
        </Text>
        {/* <Icon
          name="chevron-forward-outline"
          size={22}
          color={isDark ? '#A3E635' : '#065F46'}
          style={{ marginTop: 16 }}
        /> */}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'} flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mt-3`}>
          Loading invoices...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'} flex-1`}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        {/* Header & Search */}
        <View className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
          {/* <View className="flex-row justify-between items-center px-4 py-3">
            <Text className={`${isDark ? 'text-gray-100' : 'text-gray-800'} text-2xl font-bold`}>
              Invoices
            </Text>
            <TouchableOpacity className={`${isDark ? 'bg-green-700' : 'bg-green-100'} p-2 rounded-full`}>
              <Icon name="filter-outline" size={20} color="#10B981" />
            </TouchableOpacity>
          </View> */}
          <View className="mx-4 mb-3">
            <View className={`${isDark ? 'bg-gray-800 shadow-black/20' : 'bg-white shadow-sm'} flex-row items-center rounded-full px-4 py-2 border mt-2`}>
              <Icon name="search-outline" size={20} color="#9CA3AF" />
              <TextInput
                className={`${isDark ? 'text-gray-100' : 'text-gray-700'} ml-3 flex-1 `}
                placeholder="Search invoices..."
                placeholderTextColor="#9CA3AF"
                value={search}
                onChangeText={setSearch}
                autoCorrect={false}
                autoCapitalize="none"
                returnKeyType="done"
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch('')}>
                  <Icon name="close-circle" size={18} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 16, paddingBottom: 8 }}
          >
            <View className="bg-green-600 px-5 py-4 mr-3 rounded-2xl shadow-lg">
              <Text className="text-gray-100 text-sm">Total Invoices</Text>
              <Text className="text-white text-2xl font-bold mt-1">{summary.totalCount}</Text>
            </View>
            <View className="bg-green-100 px-5 py-4 mr-3 rounded-2xl shadow-lg">
              <Text className="text-green-800 text-sm">Total Amount</Text>
              <Text className="text-green-900 text-2xl font-bold mt-1">
                ₹{summary.totalAmount.toFixed(2)}
              </Text>
            </View>
            <View className="bg-green-100 px-5 py-4 mr-3 rounded-2xl shadow-lg">
              <Text className="text-green-800 text-sm">Paid</Text>
              <Text className="text-green-900 text-2xl font-bold mt-1">{summary.paid}</Text>
            </View>
            <View className="bg-red-100 px-5 py-4 rounded-2xl shadow-lg">
              <Text className="text-red-800 text-sm">Unpaid</Text>
              <Text className="text-red-900 text-2xl font-bold mt-1">{summary.unpaid}</Text>
            </View>
          </ScrollView>
        </View>

        {/* Invoice List */}
        <FlatList
          data={filteredInvoices}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#10B981']}
            />
          }
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <Text className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-center mt-8`}>
              No invoices found.
            </Text>
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
