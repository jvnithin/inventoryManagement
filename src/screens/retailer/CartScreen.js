import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppContext } from '../../context/AppContext';

const formatAddress = (address) => {
  if (!address) return '';
  return [
    address.street,
    address.city,
    address.state,
    address.zip,
  ]
    .filter(Boolean)
    .join(', ');
};

const CartScreen = ({ navigation }) => {
  const { apiUrl, user, retailerCart, setRetailerCart } = useAppContext();
  const intervalRef = useRef(null);

  // Fetch cart from backend on mount and whenever CartScreen is focused
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Alert.alert('Error', 'Authentication token not found.');
          return;
        }
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
    fetchCart();
    // Optionally, add a listener for navigation focus to refresh cart
    const unsubscribe = navigation.addListener('focus', fetchCart);
    return unsubscribe;
  }, [apiUrl, setRetailerCart, navigation]);

  // Update quantity in context and backend
  const updateQuantity = async (product_id, newQty) => {
    if (isNaN(newQty) || newQty < 1) return;
    // Update in backend
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(
        `${apiUrl}/api/retailer/update-cart`,
        { product_id, quantity: newQty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Fetch updated cart
      const response = await axios.get(`${apiUrl}/api/retailer/get-cart`, {
        headers: { Authorization: `Bearer ${token}` }
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
      console.error('Error updating quantity:', error);
    }
  };

  const handlePressAndHold = (product_id, type) => {
    intervalRef.current = setInterval(() => {
      const item = retailerCart.find(i => i.product_id === product_id);
      if (!item) return;
      let newQty =
        type === 'inc'
          ? item.quantity + 1
          : Math.max(1, item.quantity - 1);
      updateQuantity(product_id, newQty);
    }, 120);
  };

  const handlePressOut = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const deleteFromCart = async (product_id) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.delete(
        `${apiUrl}/api/retailer/delete-from-cart/${product_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Fetch updated cart
      const response = await axios.get(`${apiUrl}/api/retailer/get-cart`, {
        headers: { Authorization: `Bearer ${token}` }
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
      console.log('Error removing from cart:', error);
    }
  };

  const removeItem = async (product_id) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await deleteFromCart(product_id);
          }
        },
      ],
    );
  };

  const cartTotal = retailerCart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

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
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e6f9ed',
        borderRadius: 14,
        padding: 14,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 3,
        elevation: 2,
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 17, color: '#065F46' }}>
          {item.name}
        </Text>
        <Text style={{ color: '#16A34A', fontSize: 14, marginTop: 2 }}>
          ₹{item.price} x {item.quantity} = ₹{item.price * item.quantity}
        </Text>
        <Text style={{ color: '#64748b', fontSize: 12, marginTop: 2 }}>
          Wholesaler ID: {item.wholesaler_id}
        </Text>
      </View>
      <View
        style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}
      >
        <TouchableOpacity
          onPress={() =>
            updateQuantity(item.product_id, Math.max(1, item.quantity - 1))
          }
          onPressIn={() => handlePressAndHold(item.product_id, 'dec')}
          onPressOut={handlePressOut}
          style={{
            backgroundColor: '#bbf7d0',
            borderRadius: 6,
            padding: 4,
            marginHorizontal: 2,
          }}
        >
          <Icon name="remove" size={20} color="#16A34A" />
        </TouchableOpacity>
        <Text
          style={{
            width: 36,
            height: 40,
            lineHeight: 40,
            textAlign: 'center',
            fontSize: 17,
            color: '#065F46',
            backgroundColor: '#fff',
            borderColor: '#16A34A',
            borderWidth: 1,
            borderRadius: 6,
            marginHorizontal: 2,
          }}
        >
          {item.quantity}
        </Text>
        <TouchableOpacity
          onPress={() => updateQuantity(item.product_id, item.quantity + 1)}
          onPressIn={() => handlePressAndHold(item.product_id, 'inc')}
          onPressOut={handlePressOut}
          style={{
            backgroundColor: '#bbf7d0',
            borderRadius: 6,
            padding: 4,
            marginHorizontal: 2,
          }}
        >
          <Icon name="add" size={20} color="#16A34A" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => removeItem(item.product_id)}
        style={{
          backgroundColor: '#f87171',
          borderRadius: 8,
          padding: 6,
          marginLeft: 4,
        }}
      >
        <Icon name="trash-outline" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <View style={{ flex: 1, padding: 18 }}>
        <FlatList
          data={retailerCart}
          keyExtractor={item => item.product_id?.toString()}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text
              style={{ textAlign: 'center', color: '#64748b', marginTop: 40 }}
            >
              Your cart is empty.
            </Text>
          }
          contentContainerStyle={{ paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        />
        {retailerCart.length > 0 && (
          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#fff',
              borderTopLeftRadius: 18,
              borderTopRightRadius: 18,
              padding: 18,
              shadowColor: '#000',
              shadowOpacity: 0.09,
              shadowRadius: 6,
              elevation: 8,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: '#065F46',
                  fontWeight: 'bold',
                  flex: 1,
                }}
              >
                Total
              </Text>
              <Text
                style={{ fontSize: 20, color: '#16A34A', fontWeight: 'bold' }}
              >
                ₹{cartTotal}
              </Text>
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: '#16A34A',
                borderRadius: 10,
                paddingVertical: 14,
                alignItems: 'center',
                marginTop: 6,
              }}
              onPress={confirmAddressAndCheckout}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 17 }}>
                Proceed to Checkout
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default CartScreen;
