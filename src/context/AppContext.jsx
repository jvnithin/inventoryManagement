import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const apiUrl = 'http://192.168.1.4:8000';
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [storedProducts, setStoredProducts] = useState([]);
  const [retailerCart, setRetailerCart] = useState([]);
  const [orders, setOrders] = useState([]); // <--- orders in context

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

  // Fetch all orders for this user (wholesaler/retailer)
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

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    setUser(null);
    setOrders([]);
    setStoredProducts([]);
    setRetailerCart([]);
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
        fetchOrders, // <--- expose fetchOrders!
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
