import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
  Modal,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';
import { emit } from '../../services/socketService';
import { useColorScheme } from 'nativewind';

export default function WholesalerProducts({ route, navigation }) {
  const { apiUrl, user, retailerCart, setRetailerCart } = useAppContext();
  const { wholesaler } = route.params;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantityModal, setQuantityModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState('1');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastText, setToastText] = useState('');
  const toastTimeoutRef = useRef();

  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Define colors based on theme
  const colors = {
    background: isDark ? '#1F2937' : '#FFFFFF',
    card: isDark ? '#374151' : '#ECFDF5',
    text: isDark ? '#F9FAFB' : '#065F46',
    subtext: isDark ? '#9CA3AF' : '#4B5563',
    primary: '#16A34A',
    danger: '#DC2626',
    modalBg: isDark ? '#374151' : '#FFFFFF',
    toastBg: '#16A34A',
    toastBtnBg: '#065F46',
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(
        `${apiUrl}/api/wholesaler/get-products/${wholesaler.user_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProducts(res.data || []);
    } catch {
      Alert.alert('Error', 'Could not load products.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCart = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(`${apiUrl}/api/retailer/get-cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const aggregated = {};
      res.data.forEach(item => {
        if (aggregated[item.product_id]) {
          aggregated[item.product_id].quantity += item.quantity;
        } else aggregated[item.product_id] = { ...item };
      });
      setRetailerCart(Object.values(aggregated));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCart();
    emit('retailer-connect', { message: 'retailer connected', id: user.userId });
    return () => clearTimeout(toastTimeoutRef.current);
  }, []);

  const addToCart = async (product, qty) => {
    const num = parseInt(qty, 10);
    if (isNaN(num) || num < 1) {
      Alert.alert('Invalid Quantity', 'Please enter a valid quantity.');
      return;
    }
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(
        `${apiUrl}/api/retailer/add-to-cart`,
        {
          product_id: product.product_id,
          quantity: num,
          name: product.name,
          wholesaler_id: product.wholesaler_id,
          price: product.price,
          addedAt: Date.now(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCart();
      setQuantity('1');
      setQuantityModal(false);
      setToastText(`${product.name} x${num} added to your cart!`);
      setToastVisible(true);
      clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = setTimeout(() => setToastVisible(false), 3000);
    } catch {
      Alert.alert('Error', 'Failed to add to cart.');
    }
  };

  const handleAddPress = product => {
    setSelectedProduct(product);
    setQuantity('1');
    setQuantityModal(true);
  };

  if (loading) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background
      }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 16, color: colors.text }}>Loading Products...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 16 }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
        {/* <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
          <Icon name="arrow-back" size={26} color={colors.text} />
        </TouchableOpacity> */}
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.text }}>
          {wholesaler.name} Products
        </Text>
      </View>

      <FlatList
        data={products}
        keyExtractor={item => String(item.product_id || item.id)}
        renderItem={({ item }) => (
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: colors.card,
            borderRadius: 12,
            padding: 16,
            marginBottom: 12
          }}>
            <View>
              <Text style={{ fontWeight: '600', color: colors.text, marginBottom: 4 }}>
                {item.name}
              </Text>
              <Text style={{ color: colors.subtext }}>
                ₹{item.price} | Stock: {item.stock}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => handleAddPress(item)}
              style={{
                backgroundColor: colors.primary,
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 8
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '600' }}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{
            textAlign: 'center',
            color: colors.subtext,
            marginTop: 32
          }}>
            No products available.
          </Text>
        }
      />

      {/* Quantity Modal */}
      <Modal visible={quantityModal} transparent animationType="fade">
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.3)',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{
            width: '80%',
            backgroundColor: colors.modalBg,
            borderRadius: 16,
            padding: 24,
            alignItems: 'center'
          }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 12 }}>
              Enter quantity for {selectedProduct?.name}
            </Text>
            <TextInput
              style={{
                width: 100,
                height: 40,
                borderWidth: 1,
                borderColor: colors.primary,
                borderRadius: 8,
                textAlign: 'center',
                fontSize: 16,
                color: colors.text,
                marginBottom: 20
              }}
              keyboardType="number-pad"
              value={quantity}
              onChangeText={setQuantity}
              autoFocus
            />
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                onPress={() => selectedProduct && addToCart(selectedProduct, quantity)}
                style={{
                  backgroundColor: colors.primary,
                  paddingVertical: 10,
                  paddingHorizontal: 24,
                  borderRadius: 8,
                  marginRight: 12
                }}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setQuantityModal(false)}
                style={{
                  backgroundColor: colors.danger,
                  paddingVertical: 10,
                  paddingHorizontal: 24,
                  borderRadius: 8
                }}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Toast */}
      {toastVisible && (
        <View style={{
          position: 'absolute',
          bottom: 24,
          left: 20,
          right: 20,
          backgroundColor: colors.toastBg,
          borderRadius: 12,
          padding: 16,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          shadowColor: '#000',
          shadowOpacity: 0.15,
          shadowRadius: 6,
          elevation: 8
        }}>
          <Text style={{ color: '#fff', fontWeight: 'bold', flex: 1 }}>{toastText}</Text>
          <TouchableOpacity
            onPress={() => {
              setToastVisible(false);
              navigation.navigate('Cart');
            }}
            style={{
              backgroundColor: colors.toastBtnBg,
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: 8
            }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Go to Cart</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
