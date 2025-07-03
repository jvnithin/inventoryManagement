// src/components/TopNavBar.jsx
import React from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const TopNavBar = ({ username = "Wholesaler", onLogout, theme, toggleTheme }) => {
  const navigation = useNavigation();

  return (
    <View className="flex-row justify-between items-center bg-green-600 px-4 py-3">
      {/* Left: Username */}
      <View className="flex-row items-center space-x-2">
        <Icon name="person-circle-outline" size={24} color="white" />
        <Text className="text-white text-lg font-semibold">{username}</Text>
      </View>

      {/* Right: Theme toggle + Logout */}
      <View className="flex-row items-center space-x-4">
        <View className="flex-row items-center">
          <Icon name={theme === 'dark' ? 'moon' : 'sunny'} size={20} color="white" />
          <Switch
            value={theme === 'dark'}
            onValueChange={toggleTheme}
            thumbColor="#10B981"
            trackColor={{ false: '#D1D5DB', true: '#065F46' }}
          />
        </View>

        <TouchableOpacity onPress={onLogout} className="flex-row items-center">
          <Icon name="log-out-outline" size={20} color="white" />
          <Text className="text-white ml-1">Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TopNavBar;
