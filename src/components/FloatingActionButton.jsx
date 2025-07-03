// components/FloatingActionButton.jsx
import React from 'react';
import { Pressable, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const FloatingActionButton = ({ onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      className="absolute bottom-6 right-6 bg-green-600 rounded-full p-4 shadow-lg"
    >
      <Icon name="add" size={28} color="white" />
    </Pressable>
  );
};

export default FloatingActionButton;
