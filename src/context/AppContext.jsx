import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { on } from '../services/socketService';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  
  // const apiUrl = 'https://backendinventory-4lnp.onrender.com';
  const apiUrl = 'http://192.168.1.44:8000';
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [storedProducts, setStoredProducts] = useState([]);
  const [retailerCart, setRetailerCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [retailers, setRetailers] = useState([]); // <-- Add this line

  // Socket event handlers for orders (as before)
  on('order-cancelled', (data) => {
    setOrders((orders) => orders.map((order) =>
      order.order_id === data.order_id ? { ...order, status: 'cancelled' } : order
    ));
  });
  on('new-order', (data) => {
    setOrders((orders) => [...orders, data]);
  });
  on('order-completed', (data) => {
    setOrders((orders) => orders.map((order) =>
      order.order_id === data.order_id ? { ...order, status: 'delivered' } : order
    ));
  });

  // Fetch user details
  const getUserDetails = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setUser(null);
      } else {
        const response = await axios.get(`${apiUrl}/api/auth/get-user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all orders
  const fetchOrders = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${apiUrl}/api/wholesaler/get-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data || []);
    } catch (error) {
      setOrders([]);
      console.log('Error fetching orders:', error);
    }
  }, [apiUrl]);

  // Fetch all retailers
  const fetchRetailers = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const { data } = await axios.get(`${apiUrl}/api/wholesaler/get-retailers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRetailers(data || []);
    } catch (error) {
      setRetailers([]);
      console.log('Error fetching retailers:', error);
    }
  }, [apiUrl]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    setUser(null);
    setOrders([]);
    setStoredProducts([]);
    setRetailerCart([]);
    setRetailers([]); // <-- Reset retailers on logout
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <AppContext.Provider
      value={{
        apiUrl,
        user,
        setUser,
        loading,
        handleLogout,
        getUserDetails,
        retailerCart,
        setRetailerCart,
        storedProducts,
        setStoredProducts,
        orders,
        setOrders,
        fetchOrders,
        retailers,         // <-- Expose retailers
        setRetailers,      // <-- Expose setRetailers
        fetchRetailers,    // <-- Expose fetchRetailers
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
