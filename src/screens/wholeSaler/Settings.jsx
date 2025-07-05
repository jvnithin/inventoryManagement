import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppContext } from '../../context/AppContext';
import { useNavigation } from '@react-navigation/native';

const Settings = () => {
  const { handleLogout } = useAppContext();
  const navigation = useNavigation();

  const onLogout = async () => {
  await handleLogout();
  
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    color: '#111827',
    fontWeight: 'bold',
    marginBottom: 40,
  },
  logoutButton: {
    backgroundColor: '#DC2626',
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 8,
    elevation: 3,
  },
  logoutText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: 1,
  },
});
