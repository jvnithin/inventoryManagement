import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  useColorScheme,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppContext } from '../../../context/AppContext';

export default function EditProduct({ navigation, route }) {
  const product = route.params.product;
  const { apiUrl,setStoredProducts } = useAppContext();
  const colorScheme = useColorScheme();

  // Theme-aware styles
  const isDark = colorScheme === 'dark';
  const inputBase =
    'border rounded-xl px-4 py-2 text-base ' +
    (isDark
      ? 'border-gray-700 bg-gray-800 text-gray-100 placeholder-gray-400'
      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400');

  const labelBase =
    'mb-1 text-sm font-medium ' +
    (isDark ? 'text-gray-300' : 'text-gray-600');

  const headerText =
    'text-2xl font-bold ' + (isDark ? 'text-green-300' : 'text-green-800');

  const buttonBase =
    'rounded-xl py-3 mt-4 ' +
    (isDark
      ? 'bg-green-600 active:bg-green-700'
      : 'bg-green-700 active:bg-green-800');

  const buttonText =
    'text-white text-center font-semibold text-lg';

  // State
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(String(product.price));
  const [mrp, setMrp] = useState(String(product.mrp));
  const [stock, setStock] = useState(String(product.stock));
  const [description, setDescription] = useState(product.description || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    const requiredFields = [
      { label: 'Name', value: name },
      { label: 'Price', value: price },
      { label: 'MRP', value: mrp },
      { label: 'Stock', value: stock },
    ];
    const emptyFields = requiredFields.filter(field => !field.value);
    if (emptyFields.length > 0) {
      Alert.alert(
        'Validation Error',
        `Please fill all required fields: ${emptyFields
          .map(f => f.label)
          .join(', ')}`
      );
      return;
    }

    const newProduct = {
      name,
      price: parseInt(price),
      mrp: parseInt(mrp),
      stock: parseInt(stock),
      description,
    };

    try {
      setLoading(true);
      const userToken = await AsyncStorage.getItem('token');
      console.log(userToken);
      const response = await axios.put(
        `${apiUrl}/api/product/update/${product.product_id}`,
        newProduct,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      setLoading(false);
      setStoredProducts((prevProducts) => {
        return prevProducts.map((product) => {
          if (product.product_id === response.data.product.product_id) {
            return response.data.product;
          }
          return product;
        });
      })
      navigation.goBack();
    } catch (error) {
      setLoading(false);
      console.log(error);
      Alert.alert(
        'Error',
        'Something went wrong while editing product. Please try again later.'
      );
    }
  };

  return (
    <ScrollView
      className={`flex-1 px-4 pt-6 ${isDark ? 'bg-gray-900' : 'bg-white'}`}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <View className="flex-row items-center mb-6">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mr-2"
          accessibilityLabel="Go back"
        >
          <Icon
            name="arrow-back"
            size={26}
            color={isDark ? '#bbf7d0' : '#065F46'}
          />
        </TouchableOpacity>
        <Text className={headerText}>Edit Product</Text>
      </View>

      {/* Form Fields */}
      <View className="space-y-5">
        <View>
          <Text className={labelBase}>Product Name *</Text>
          <TextInput
            className={inputBase}
            placeholder="e.g., Organic Honey"
            placeholderTextColor={isDark ? '#94a3b8' : '#94a3b8'}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View className="flex-row space-x-4">
          <View className="flex-1">
            <Text className={labelBase}>Price (₹) *</Text>
            <TextInput
              keyboardType="numeric"
              className={inputBase}
              placeholder="e.g., 150"
              placeholderTextColor={isDark ? '#94a3b8' : '#94a3b8'}
              value={price}
              onChangeText={setPrice}
            />
          </View>
          <View className="flex-1">
            <Text className={labelBase}>MRP (₹) *</Text>
            <TextInput
              keyboardType="numeric"
              className={inputBase}
              placeholder="e.g., 180"
              placeholderTextColor={isDark ? '#94a3b8' : '#94a3b8'}
              value={mrp}
              onChangeText={setMrp}
            />
          </View>
        </View>

        <View>
          <Text className={labelBase}>Stock Quantity *</Text>
          <TextInput
            keyboardType="numeric"
            className={inputBase}
            placeholder="e.g., 100"
            placeholderTextColor={isDark ? '#94a3b8' : '#94a3b8'}
            value={stock}
            onChangeText={setStock}
          />
        </View>

        <View>
          <Text className={labelBase}>Description</Text>
          <TextInput
            className={inputBase + ' h-24'}
            multiline
            placeholder="Write a short description"
            placeholderTextColor={isDark ? '#94a3b8' : '#94a3b8'}
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSave}
          className={buttonBase}
          disabled={loading}
        >
          <Text className={buttonText}>
            {loading ? 'Saving...' : 'Save Product'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
