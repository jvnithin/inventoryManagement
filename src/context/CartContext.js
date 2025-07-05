import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Load cart from storage on mount
  useEffect(() => {
    AsyncStorage.getItem('cart').then(data => {
      if (data) setCart(JSON.parse(data));
    });
  }, []);

  // Persist cart to storage whenever it changes
  useEffect(() => {
    AsyncStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Cart operations
  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product_id === product.product_id);
      if (existing) {
        return prev.map(item =>
          item.product_id === product.product_id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prev, { ...product, quantity }];
      }
    });
  };

  const updateCartItem = (product_id, quantity) => {
    setCart(prev =>
      prev.map(item =>
        item.product_id === product_id ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (product_id) => {
    setCart(prev => prev.filter(item => item.product_id !== product_id));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
