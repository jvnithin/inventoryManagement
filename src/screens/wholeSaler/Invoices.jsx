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

  useEffect(() => {
    loadData();
  }, []);

  // Filter whenever search or invoices change
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
      className="bg-white mx-4 my-2 p-4 rounded-2xl shadow-md flex-row justify-between items-start"
      activeOpacity={0.8}
      onPress={() => {}}
    >
      <View className="flex-1 pr-3">
        <Text className="text-lg font-semibold text-gray-800 mb-1">{item.invoiceNumber}</Text>
        <Text className="text-sm text-gray-600 mb-1">{item.retailerName}</Text>
        <Text className="text-sm text-gray-500">Date: {formatDate(item.date)}</Text>
        <Text className="text-sm text-gray-800 mt-2">Total: {formatCurrency(item.totalAmount)}</Text>
      </View>
      <View className="items-end">
        <Text
          className={`text-sm font-medium ${
            item.status === 'Paid' ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {item.status}
        </Text>
        <Icon
          name="chevron-forward-outline"
          size={22}
          color="#065F46"
          style={{ marginTop: 16 }}
        />
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#10B981" />
        <Text className="mt-3 text-gray-600">Loading invoices...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        {/* Header & Search */}
        <View className="bg-white border-b border-gray-200">
          {/* Title & Filter */}
          <View className="flex-row justify-between items-center px-4 py-3">
            <Text className="text-2xl font-bold text-gray-800">Invoices</Text>
            <TouchableOpacity className="p-2 bg-green-100 rounded-full">
              <Icon name="filter-outline" size={20} color="#10B981" />
            </TouchableOpacity>
          </View>
          {/* Search Bar */}
          <View className="mx-4 mb-3">
            <View className="flex-row items-center bg-white rounded-full px-4 py-2 shadow-sm">
              <Icon name="search-outline" size={20} color="#9CA3AF" />
              <TextInput
                className="ml-3 flex-1 text-gray-700"
                placeholder="Search invoices..."
                placeholderTextColor="#9CA3AF"
                value={search}
                onChangeText={setSearch}
                autoCorrect={false}
                autoCapitalize="none"
                returnKeyType="done"
                keyboardShouldPersistTaps="handled"
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch('')}>
                  <Icon name="close-circle" size={18} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>
          </View>
          {/* Summary Cards */}
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
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={{ paddingBottom: 20, paddingTop: 0 }}
          ListEmptyComponent={
            <Text className="text-center text-gray-500 mt-8">No invoices found.</Text>
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
