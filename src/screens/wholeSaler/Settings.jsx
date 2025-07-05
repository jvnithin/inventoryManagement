// src/screens/Settings.jsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppContext } from '../../context/AppContext';
import { useNavigation } from '@react-navigation/native';
import { useColorScheme } from 'nativewind';

export default function Settings() {
  const { handleLogout } = useAppContext();
  const navigation = useNavigation();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const onLogout = async () => {
    await handleLogout();
    // Optionally navigate to login
    navigation.replace('Login');
  };

  // Dynamic colors
  const bg = isDark ? '#1F2937' : '#F3F4F6';            // gray-800 / gray-100
  const textColor = isDark ? '#F9FAFB' : '#111827';     // gray-50 / gray-900
  const buttonBg = isDark ? '#991B1B' : '#DC2626';      // red-700 / red-600
  const buttonText = '#FFFFFF';

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <Text style={[styles.title, { color: textColor }]}>Settings</Text>

      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: buttonBg }]}
        onPress={onLogout}
      >
        <Text style={[styles.logoutText, { color: buttonText }]}>
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  logoutButton: {
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 8,
    elevation: 3,
  },
  logoutText: {
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: 1,
  },
});
