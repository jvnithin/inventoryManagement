import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { on, off, getSocket, emit } from '../services/socketService';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const apiUrl = 'http://192.168.1.44:8000';
  // const apiUrl = 'https://backendinventory-4lnp.onrender.com';

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [storedProducts, setStoredProducts] = useState([]);
  const [retailerCart, setRetailerCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [retailers, setRetailers] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // --- Socket event handlers ---
  const handleOrderCancelled = useCallback((data) => {
    setOrders((orders) =>
      orders.map((order) =>
        order.order_id === data.order_id ? { ...order, status: 'cancelled' } : order
      )
    );
    setNotifications((notifications) => [
      ...notifications,
      { type: 'order-cancelled', data, read: false,for:"wholesaler" },
    ]);
  }, []);

  const handleNewOrder = useCallback((data) => {
    setOrders((orders) => [...orders, data]);
    setNotifications((notifications) => [
      ...notifications,
      { type: 'new-order', data, read: false,for:"wholesaler" },
    ]);
  }, []);

  const handleOrderCompleted = useCallback((data) => {
    setOrders((orders) =>
      orders.map((order) =>
        order.order_id === data.order_id ? { ...order, status: 'delivered' } : order
      )
    );
    setNotifications((notifications) => [
      ...notifications,
      { type: 'order-completed', data, read: false,for:"retailer" },
    ]);
  }, []);

  // --- Register and clean up socket listeners ---
  useEffect(() => {
    const socket = getSocket();
    console.log(socket);
    on('order-cancelled', handleOrderCancelled);
    on('new-order', handleNewOrder);
    on('order-complete', handleOrderCompleted);

    return () => {
      off('order-cancelled', handleOrderCancelled);
      off('new-order', handleNewOrder);
      off('order-complete', handleOrderCompleted);
    };
  }, [handleOrderCancelled, handleNewOrder, handleOrderCompleted]);

  // --- Socket connect event: emit appropriate event after socket and user are ready ---
  useEffect(() => {
    const socket = getSocket();

    const handleSocketConnect = () => {
      if (user && user.userId && user.role) {
        if (user.role === 'retailer') {
          emit('wholesaler-connect', { id: user.userId });
        } else if (user.role === 'wholesaler') {
          emit('retailer-connect', { id: user.userId });
        }
      }
    };

    socket.on('connect', handleSocketConnect);

    return () => {
      socket.off('connect', handleSocketConnect);
    };
  }, [user]);

  // --- Fetch user details ---
  const getUserDetails = useCallback(async () => {
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
  }, [apiUrl]);

  // --- Fetch all wholesaler orders ---
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

  // --- Fetch all retailer orders ---
  const fetchRetailerOrders = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${apiUrl}/api/retailer/get-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data || []);
    } catch (error) {
      setOrders([]);
      console.log('Error fetching retailer orders:', error);
    }
  }, [apiUrl]);

  // --- Fetch all retailers ---
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

  // --- Logout handler ---
  const handleLogout = useCallback(async () => {
    await AsyncStorage.removeItem('token');
    setUser(null);
    setOrders([]);
    setStoredProducts([]);
    setRetailerCart([]);
    setRetailers([]);
    setNotifications([]);
  }, []);

  // --- On mount: fetch user details ---
  useEffect(() => {
    getUserDetails();
  }, [getUserDetails]);

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
        fetchRetailerOrders,
        retailers,
        setRetailers,
        fetchRetailers,
        notifications,
        setNotifications,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
