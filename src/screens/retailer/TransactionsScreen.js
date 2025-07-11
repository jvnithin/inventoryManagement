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
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useColorScheme } from 'nativewind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';

const formatCurrency = amt => `₹${amt.toFixed(2)}`;
const formatDate = d =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export default function Transactions() {
  const { apiUrl } = useAppContext();
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Fetch & transform API data
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(
        `${apiUrl}/api/retailer/get-transactions`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Transform API data to UI-friendly structure
      const transformed = (response.data || []).map(tx => {
        // Prefer wholesaler_id if present, else user_id
        let partyLabel = tx.wholesaler_id
          ? `Wholesaler ${tx.wholesaler_id}`
          : `User ${tx.user_id}`;
        // Capitalize status
        let statusLabel = tx.status
          ? tx.status.charAt(0).toUpperCase() + tx.status.slice(1)
          : '';
        // Type: Credit if amount > 0, Debit if amount < 0
        let type = 'debit'
        return {
          id: tx.payment_id,
          partyLabel,
          date: tx.created_at,
          amount: Math.abs(tx.amount),
          status: statusLabel,
          type,
        };
      });
      setTransactions(transformed);
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to fetch transactions.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Filter on search
  useEffect(() => {
    const filteredData = transactions.filter(tx =>
      tx.partyLabel.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(filteredData);
  }, [search, transactions]);

  // Pull-to-refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchTransactions();
  };

  // Summary
  const summary = {
    total: transactions.reduce((sum, t) => sum + t.amount, 0),
    credit: transactions.filter(t => t.type === 'Credit').reduce((s, t) => s + t.amount, 0),
    debit: transactions.filter(t => t.type === 'Debit').reduce((s, t) => s + t.amount, 0),
  };

  // Colors
  const bg = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textPrimary = isDark ? 'text-gray-100' : 'text-gray-800';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const accentGreen = '#10B981';
  const accentRed = '#EF4444';

  // Render each transaction
  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      className={`
        mx-4 my-2 p-4 rounded-2xl flex-row justify-between items-center shadow-md
        ${cardBg}
      `}
      onPress={() => {}}
    >
      <View className="flex-1 pr-4">
        <Text className={`text-lg font-semibold ${textPrimary}`}>{item.partyLabel}</Text>
        <Text className={`text-sm mt-1 ${textSecondary}`}>
          Date: {formatDate(item.date)}
        </Text>
        <View className="flex-row items-center mt-1">
          <Icon
            name={
              item.type === 'Credit'
                ? 'arrow-down-circle-outline'
                : 'arrow-up-circle-outline'
            }
            size={18}
            color={item.type === 'Credit' ? accentGreen : accentRed}
          />
          <Text className={`${textPrimary} text-sm ml-2`}>
            {formatCurrency(item.amount)} ({item.type})
          </Text>
        </View>
      </View>
      <Text
        className={`text-sm font-medium px-1 ${
          item.status === 'Successful'
            ? 'text-green-700'
            : item.status === 'Pending'
            ? 'text-yellow-600'
            : 'text-red-600'
        }`}
      >
        {item.status}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView className={`${bg} flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color={accentGreen} />
        <Text className={`${textSecondary} mt-3`}>Loading transactions...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`${bg} flex-1`}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        {/* Header & Search */}
        <View className={`${cardBg} border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <View className="mx-4 mb-3">
            <View className={`flex-row items-center rounded-full px-4 py-2 border mt-2 shadow-sm ${cardBg}`}>
              <Icon name="search-outline" size={20} color="#9CA3AF" />
              <TextInput
                className={`ml-3 flex-1 ${textPrimary}`}
                placeholder="Search by wholesaler or user"
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
            <View className="px-5 py-4 mr-3 rounded-2xl shadow-lg" style={{ backgroundColor: '#059669' }}>
              <Text className="text-gray-100 text-sm">Total</Text>
              <Text className="text-white text-2xl font-bold mt-1">
                ₹{summary.total.toFixed(2)}
              </Text>
            </View>
            {/* <View className="px-5 py-4 mr-3 rounded-2xl shadow-lg" style={{ backgroundColor: '#10B98120' }}>
              <Text className="text-green-800 text-sm">Credits</Text>
              <Text className="text-green-900 text-2xl font-bold mt-1">
                ₹{summary.credit.toFixed(2)}
              </Text>
            </View>
            <View className="px-5 py-4 rounded-2xl shadow-lg" style={{ backgroundColor: '#EF444420' }}>
              <Text className="text-red-800 text-sm">Debits</Text>
              <Text className="text-red-900 text-2xl font-bold mt-1">
                ₹{summary.debit.toFixed(2)}
              </Text>
            </View> */}
          </ScrollView>
        </View>

        {/* Transactions List */}
        <FlatList
          data={filtered}
          keyExtractor={item => item.id?.toString()}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={accentGreen} colors={[accentGreen]} />
          }
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <Text className={`${textSecondary} text-center mt-8`}>No transactions found.</Text>
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
