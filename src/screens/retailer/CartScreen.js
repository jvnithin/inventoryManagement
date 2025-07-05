// CartScreen.jsx

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
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';
import { emit } from '../../services/socketService';
import { useColorScheme } from 'nativewind';

const formatAddress = (address) => {
  if (!address) return '';
  return [address.street, address.city, address.state, address.zip]
    .filter(Boolean)
    .join(', ');
};

export default function CartScreen({ navigation }) {
  const { apiUrl, user, retailerCart, setRetailerCart } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [quantityModal, setQuantityModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState('1');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastText, setToastText] = useState('');
  const toastTimeoutRef = useRef();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const COLORS = {
    bg: isDark ? '#1F2937' : '#F8FAFC',
    card: isDark ? '#374151' : '#FFFFFF',
    text: isDark ? '#F9FAFB' : '#065F46',
    subtext: isDark ? '#9CA3AF' : '#4B5563',
    primary: '#16A34A',
    danger: '#DC2626',
    modalBg: isDark ? '#374151' : '#FFFFFF',
    toastBg: '#16A34A',
    toastBtn: '#065F46',
    border: isDark ? '#4B5563' : '#E5E7EB',
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Alert.alert('Error', 'Authentication token not found.');
          return;
        }
        const res = await axios.get(`${apiUrl}/api/retailer/get-cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const agg = {};
        res.data.forEach(item => {
          if (agg[item.product_id]) agg[item.product_id].quantity += item.quantity;
          else agg[item.product_id] = item;
        });
        setRetailerCart(Object.values(agg));
        setLoading(false);
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    };

    fetchCart();
    emit('retailer-connect', { id: user.userId });
    return () => clearTimeout(toastTimeoutRef.current);
  }, [apiUrl, user.userId, setRetailerCart]);

  const updateQuantity = async (product_id, newQty) => {
    if (isNaN(newQty) || newQty < 1) return;
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(
        `${apiUrl}/api/retailer/update-cart`,
        { product_id, quantity: newQty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // refresh cart
      const res = await axios.get(`${apiUrl}/api/retailer/get-cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const agg = {};
      res.data.forEach(item => {
        if (agg[item.product_id]) agg[item.product_id].quantity += item.quantity;
        else agg[item.product_id] = item;
      });
      setRetailerCart(Object.values(agg));
    } catch (e) {
      console.error(e);
    }
  };

  const handlePressAndHold = (product_id, type) => {
    toastTimeoutRef.current = setInterval(() => {
      const item = retailerCart.find(i => i.product_id === product_id);
      if (!item) return;
      const newQty = type === 'inc' ? item.quantity + 1 : Math.max(1, item.quantity - 1);
      updateQuantity(product_id, newQty);
    }, 120);
  };

  const handlePressOut = () => clearInterval(toastTimeoutRef.current);

  const deleteFromCart = async product_id => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.delete(`${apiUrl}/api/retailer/delete-from-cart/${product_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // refresh cart
      const res = await axios.get(`${apiUrl}/api/retailer/get-cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const agg = {};
      res.data.forEach(item => {
        if (agg[item.product_id]) agg[item.product_id].quantity += item.quantity;
        else agg[item.product_id] = item;
      });
      setRetailerCart(Object.values(agg));
    } catch (e) {
      console.error(e);
    }
  };

  const removeItem = product_id => {
    Alert.alert('Remove Item', 'Remove this item from your cart?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => deleteFromCart(product_id),
      },
    ]);
  };

  const cartTotal = retailerCart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const confirmCheckout = () => {
    if (!user.address || !Object.keys(user.address).length) {
      Alert.alert('Error', 'Please update your address.', [
        { text: 'OK', onPress: () => navigation.navigate('Profile') },
      ]);
      return;
    }
    const addr = formatAddress(user.address);
    Alert.alert(
      'Confirm Address',
      `Deliver to:\n${addr}`,
      [
        { text: 'Change', onPress: () => navigation.navigate('Profile') },
        { text: 'Proceed', onPress: async () => {
            // place order...
          }},
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };
  const handleCheckout = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Authentication token not found.');
        return;
      }
      if (!user?.address || Object.keys(user.address).length === 0) {
        Alert.alert('Error', 'Please update your address.', [
          { text: 'OK', onPress: () => navigation.navigate('Profile') },
        ]);
        return;
      }
      const response = await axios.post(
        `${apiUrl}/api/retailer/place-order`,
        { cart: retailerCart, address: user.address },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        setRetailerCart([]);
        Alert.alert('Success', 'Your order has been placed successfully!');
        navigation.navigate("My Orders");
      } else {
        throw new Error('Failed to place order');
      }
    } catch (error) {
      console.error("Error placing order", error);
      Alert.alert('Error', 'Failed to place order. Please try again.');
    }
  };
  const confirmAddressAndCheckout = () => {
    if (!user?.address || Object.keys(user.address).length === 0) {
      Alert.alert('Error', 'Please update your address.', [
        { text: 'OK', onPress: () => navigation.navigate('Profile') },
      ]);
      return;
    }
    const formattedAddress = formatAddress(user.address);
    Alert.alert(
      'Confirm Address',
      `Your order will be delivered to:\n\n${formattedAddress}\n\nDo you want to proceed or update your address?`,
      [
        { text: 'Change Address', onPress: () => navigation.navigate('Profile'), style: 'default' },
        { text: 'Proceed', onPress: handleCheckout, style: 'default' },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.card,
      borderRadius: 14,
      padding: 14,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 3,
      elevation: 2,
    }}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 17, color: COLORS.text }}>
          {item.name}
        </Text>
        <Text style={{ color: COLORS.primary, fontSize: 14, marginTop: 2 }}>
          ₹{item.price} x {item.quantity} = ₹{item.price * item.quantity}
        </Text>
        <Text style={{ color: COLORS.subtext, fontSize: 12, marginTop: 2 }}>
          Wholesaler ID: {item.wholesaler_id}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
        <TouchableOpacity
          onPress={() => updateQuantity(item.product_id, item.quantity - 1)}
          onPressIn={() => handlePressAndHold(item.product_id, 'dec')}
          onPressOut={handlePressOut}
          style={{
            backgroundColor: COLORS.bg,
            borderRadius: 6,
            padding: 4,
            marginHorizontal: 2,
          }}
        >
          <Icon name="remove" size={20} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={{
          width: 36,
          height: 40,
          lineHeight: 40,
          textAlign: 'center',
          fontSize: 17,
          color: COLORS.text,
          backgroundColor: COLORS.bg,
          borderColor: COLORS.primary,
          borderWidth: 1,
          borderRadius: 6,
          marginHorizontal: 2,
        }}>
          {item.quantity}
        </Text>
        <TouchableOpacity
          onPress={() => updateQuantity(item.product_id, item.quantity + 1)}
          onPressIn={() => handlePressAndHold(item.product_id, 'inc')}
          onPressOut={handlePressOut}
          style={{
            backgroundColor: COLORS.bg,
            borderRadius: 6,
            padding: 4,
            marginHorizontal: 2,
          }}
        >
          <Icon name="add" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => removeItem(item.product_id)}
        style={{
          backgroundColor: COLORS.danger,
          borderRadius: 8,
          padding: 6,
          marginLeft: 4,
        }}
      >
        <Icon name="trash-outline" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  if (!retailerCart.length && loading) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.bg
      }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <View style={{ flex: 1, padding: 18 }}>
        <FlatList
          data={retailerCart}
          keyExtractor={i => i.product_id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={{
              textAlign: 'center',
              color: COLORS.subtext,
              marginTop: 40
            }}>
              Your cart is empty.
            </Text>
          }
          contentContainerStyle={{ paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        />
        {retailerCart.length > 0 && (
          <View style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: COLORS.bg,
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
            padding: 18,
            shadowColor: '#000',
            shadowOpacity: 0.09,
            shadowRadius: 6,
            elevation: 8,
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 8,
            }}>
              <Text style={{
                fontSize: 18,
                color: COLORS.text,
                fontWeight: 'bold',
                flex: 1,
              }}>
                Total
              </Text>
              <Text style={{
                fontSize: 20,
                color: COLORS.primary,
                fontWeight: 'bold',
              }}>
                ₹{cartTotal}
              </Text>
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: COLORS.primary,
                borderRadius: 10,
                paddingVertical: 14,
                alignItems: 'center',
                marginTop: 6,
              }}
              onPress={confirmAddressAndCheckout}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 17 }} className='px-1'>
                Proceed to Checkout 
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
);
}
