import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppContext } from '../../../context/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function AddProduct({ navigation }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [mrp, setMrp] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const { apiUrl, storedProducts, setStoredProducts } = useAppContext();

  const handleSave = async () => {
    try {
      const newProduct = {
        name,
        price: parseInt(price),
        mrp: parseInt(mrp),
        stock: parseInt(stock),
        description,
      };
      const userToken = await AsyncStorage.getItem('token');
      const response = await axios.post(
        `${apiUrl}/api/product/new`,
        newProduct,
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      const createdProduct = response.data.product;
      setStoredProducts([...(storedProducts || []), createdProduct]);
      Alert.alert('Success', 'Product added successfully!');
      navigation.goBack();
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to add product!');
    }
  };

  return (
    <ScrollView className="flex-1 bg-white px-4 pt-6">
      <View className="flex-row items-center mb-6">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-2">
          <Icon name="arrow-back" size={24} color="#065F46" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-green-800">Add Product</Text>
      </View>
      <View className="space-y-4">
        <View>
          <Text className="text-gray-600 mb-1">Product Name *</Text>
          <TextInput
            className="border border-gray-300 rounded-xl px-4 py-2"
            placeholder="e.g., Organic Honey"
            value={name}
            onChangeText={setName}
          />
        </View>
        <View className="flex-row justify-between space-x-4">
          <View className="flex-1">
            <Text className="text-gray-600 mb-1">Price (₹) *</Text>
            <TextInput
              keyboardType="numeric"
              className="border border-gray-300 rounded-xl px-4 py-2"
              placeholder="e.g., 150"
              value={price}
              onChangeText={setPrice}
            />
          </View>
          <View className="flex-1">
            <Text className="text-gray-600 mb-1">MRP (₹) *</Text>
            <TextInput
              keyboardType="numeric"
              className="border border-gray-300 rounded-xl px-4 py-2"
              placeholder="e.g., 180"
              value={mrp}
              onChangeText={setMrp}
            />
          </View>
        </View>
        <View>
          <Text className="text-gray-600 mb-1">Stock Quantity *</Text>
          <TextInput
            keyboardType="numeric"
            className="border border-gray-300 rounded-xl px-4 py-2"
            placeholder="e.g., 100"
            value={stock}
            onChangeText={setStock}
          />
        </View>
        <View>
          <Text className="text-gray-600 mb-1">Description</Text>
          <TextInput
            className="border border-gray-300 rounded-xl px-4 py-2 h-24 text-base"
            multiline
            placeholder="Write a short description"
            value={description}
            onChangeText={setDescription}
          />
        </View>
        <TouchableOpacity
          onPress={handleSave}
          className="bg-green-700 rounded-xl py-3 mt-4"
        >
          <Text className="text-white text-center font-semibold text-lg">
            Save Product
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
