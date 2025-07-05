import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const apiUrl = 'http://192.168.1.4:8000';
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [storedProducts, setStoredProducts] = useState([]); // always default to []
  const [retailerCart, setRetailerCart] = useState([]);
  const getUserDetails = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('Token:', token);
      if (!token) {
        setUser(null);
      } else {
        const response = await axios.get(`${apiUrl}/api/auth/get-user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user);
        console.log('User loaded:', response.data.user);
      }
    } catch (error) {
      setUser(null);
      console.log('Error fetching user:', error);
    } finally {
      setLoading(false);
      console.log('Loading set to false');
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    setUser(null);
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);