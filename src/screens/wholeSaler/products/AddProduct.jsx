import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  useColorScheme,
  StatusBar,
  StyleSheet,
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
  const colorScheme = useColorScheme();

  // Theme palette
  const theme = colorScheme === 'dark'
    ? {
        background: '#111827',
        card: '#1E293B',
        text: '#F8FAFC',
        label: '#D1D5DB',
        border: '#334155',
        inputBg: '#1E293B',
        placeholder: '#6B7280',
        green: '#22C55E',
        greenDark: '#166534',
        error: '#F87171',
      }
    : {
        background: '#F8FAFC',
        card: '#fff',
        text: '#111827',
        label: '#374151',
        border: '#E5E7EB',
        inputBg: '#fff',
        placeholder: '#9CA3AF',
        green: '#16A34A',
        greenDark: '#065F46',
        error: '#DC2626',
      };

  const handleSave = async () => {
    if (!name || !price || !mrp || !stock) {
      Alert.alert('Validation', 'Please fill all required fields.');
      return;
    }
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
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Icon name="arrow-back" size={24} color={theme.greenDark} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.greenDark }]}>
            Add Product
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Product Name */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.label }]}>
              Product Name <Text style={{ color: theme.error }}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border },
              ]}
              placeholder="e.g., Organic Honey"
              placeholderTextColor={theme.placeholder}
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Price and MRP */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={[styles.label, { color: theme.label }]}>
                Price (₹) <Text style={{ color: theme.error }}>*</Text>
              </Text>
              <TextInput
                keyboardType="numeric"
                style={[
                  styles.input,
                  { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border },
                ]}
                placeholder="e.g., 150"
                placeholderTextColor={theme.placeholder}
                value={price}
                onChangeText={setPrice}
              />
            </View>
            <View style={{ width: 16 }} />
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={[styles.label, { color: theme.label }]}>
                MRP (₹) <Text style={{ color: theme.error }}>*</Text>
              </Text>
              <TextInput
                keyboardType="numeric"
                style={[
                  styles.input,
                  { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border },
                ]}
                placeholder="e.g., 180"
                placeholderTextColor={theme.placeholder}
                value={mrp}
                onChangeText={setMrp}
              />
            </View>
          </View>

          {/* Stock */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.label }]}>
              Stock Quantity <Text style={{ color: theme.error }}>*</Text>
            </Text>
            <TextInput
              keyboardType="numeric"
              style={[
                styles.input,
                { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border },
              ]}
              placeholder="e.g., 100"
              placeholderTextColor={theme.placeholder}
              value={stock}
              onChangeText={setStock}
            />
          </View>

          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.label }]}>Description</Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border },
              ]}
              placeholder="Write a short description"
              placeholderTextColor={theme.placeholder}
              multiline
              value={description}
              onChangeText={setDescription}
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSave}
            style={[styles.saveBtn, { backgroundColor: theme.green }]}
            activeOpacity={0.85}
          >
            <Text style={styles.saveBtnText}>Save Product</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// --------- Styles ---------
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },
  backBtn: {
    marginRight: 8,
    padding: 6,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    flex: 1,
    textAlign: 'left',
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 15,
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  saveBtn: {
    borderRadius: 12,
    paddingVertical: 15,
    marginTop: 10,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 0.5,
  },
});
