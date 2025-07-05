import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppContext } from '../../context/AppContext';
import { emit } from '../../services/socketService';

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

  // Fetch products for this wholesaler
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const userToken = await AsyncStorage.getItem('token');
      const response = await axios.get(
        `${apiUrl}/api/wholesaler/get-products/${wholesaler.user_id}`,
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      setProducts(response.data || []);
    } catch (e) {
      Alert.alert('Error', 'Could not load products.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch cart from backend and update context
  const fetchCart = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${apiUrl}/api/retailer/get-cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const newCart = {};
      response.data.forEach(item => {
        if (newCart[item.product_id]) {
          newCart[item.product_id].quantity += item.quantity;
        } else {
          newCart[item.product_id] = item;
        }
      });
      setRetailerCart(Object.values(newCart));
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCart();
    emit("retailer-connect", { message: "retailer connected", id: user.userId });
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
    // eslint-disable-next-line
  }, []);

  // Add to cart with quantity
  const addToCart = async (product, qty) => {
    if (!product) return;
    const numQty = parseInt(qty, 10);
    if (isNaN(numQty) || numQty < 1) {
      Alert.alert('Invalid Quantity', 'Please enter a valid quantity.');
      return;
    }
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(
        `${apiUrl}/api/retailer/add-to-cart`,
        {
          product_id: product.product_id,
          quantity: numQty,
          name: product.name,
          wholesaler_id: product.wholesaler_id,
          price: product.price,
          addedAt: Date.now(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCart(); // Update context cart from backend
      setQuantity('1');
      setQuantityModal(false);
      setToastText(`${product.name} x${qty} added to your cart!`);
      setToastVisible(true);
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = setTimeout(() => setToastVisible(false), 3000);
    } catch (e) {
      Alert.alert('Error', 'Failed to add to cart.');
    }
  };

  const handleAddPress = (product) => {
    setSelectedProduct(product);
    setQuantity('1');
    setQuantityModal(true);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#16A34A" />
        <Text className="mt-4 text-green-800">Loading Products...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white p-4">
      {/* Back Button and Title */}
      <View className="flex-row items-center mb-4">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mr-2"
          accessibilityLabel="Go back"
        >
          <Icon name="arrow-back" size={26} color="#065F46" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-green-800">
          {wholesaler.name} Products
        </Text>
      </View>

      <FlatList
        data={products}
        keyExtractor={item => (item.product_id || item.id)?.toString()}
        renderItem={({ item }) => (
          <View className="bg-green-100 rounded-xl p-4 mb-3 flex-row justify-between items-center">
            <View>
              <Text className="font-semibold text-green-900">{item.name}</Text>
              <Text className="text-gray-700">₹{item.price} | Stock: {item.stock}</Text>
            </View>
            <TouchableOpacity
              className="bg-green-700 px-4 py-2 rounded-lg"
              onPress={() => handleAddPress(item)}
            >
              <Text className="text-white font-semibold">Add to Cart</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text className="text-gray-500 text-center mt-10">No products available.</Text>
        }
      />

      {/* Quantity Modal */}
      <Modal
        visible={quantityModal}
        transparent
        animationType="fade"
        onRequestClose={() => setQuantityModal(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.3)',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 24,
            width: '80%',
            alignItems: 'center'
          }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
              Enter quantity for {selectedProduct?.name}
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#16A34A',
                borderRadius: 8,
                padding: 10,
                width: 100,
                textAlign: 'center',
                fontSize: 18,
                marginBottom: 20
              }}
              keyboardType="number-pad"
              value={quantity}
              onChangeText={setQuantity}
              autoFocus
            />
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#16A34A',
                  paddingVertical: 10,
                  paddingHorizontal: 24,
                  borderRadius: 8,
                  marginRight: 10
                }}
                onPress={() => selectedProduct && addToCart(selectedProduct, quantity)}
              >
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: '#f87171',
                  paddingVertical: 10,
                  paddingHorizontal: 24,
                  borderRadius: 8
                }}
                onPress={() => setQuantityModal(false)}
              >
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Toast */}
      {toastVisible && (
        <View
          style={{
            position: 'absolute',
            bottom: 24,
            left: 20,
            right: 20,
            backgroundColor: '#16A34A',
            borderRadius: 16,
            padding: 18,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            shadowColor: '#000',
            shadowOpacity: 0.15,
            shadowRadius: 6,
            elevation: 8,
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', flex: 1 }}>
            {toastText}
          </Text>
          <TouchableOpacity
            style={{
              marginLeft: 16,
              backgroundColor: '#065F46',
              paddingVertical: 7,
              paddingHorizontal: 16,
              borderRadius: 8,
            }}
            onPress={() => {
              setToastVisible(false);
              navigation.navigate('Cart');
            }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Go to Cart</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
