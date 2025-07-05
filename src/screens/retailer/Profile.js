// src/screens/Profile.jsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Platform,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';
import { useAppContext } from '../../context/AppContext';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'nativewind';

export default function Profile() {
  const { user, handleLogout, apiUrl, setUser } = useAppContext();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [modalVisible, setModalVisible] = useState(false);
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [zip, setZip] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [fetchingLocation, setFetchingLocation] = useState(false);

  const handleChangeAddress = () => {
    const addr = user.address || {};
    setStreet(addr.street || '');
    setCity(addr.city || '');
    setStateName(addr.state || '');
    setZip(addr.zip || '');
    setLatitude(addr.latitude?.toString() || '');
    setLongitude(addr.longitude?.toString() || '');
    setModalVisible(true);
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const fetchCurrentLocation = async () => {
    setFetchingLocation(true);
    if (!(await requestLocationPermission())) {
      Alert.alert('Permission Denied', 'Location permission is required.');
      setFetchingLocation(false);
      return;
    }
    Geolocation.getCurrentPosition(
      pos => {
        setLatitude(pos.coords.latitude.toString());
        setLongitude(pos.coords.longitude.toString());
        setFetchingLocation(false);
      },
      err => {
        setFetchingLocation(false);
        Alert.alert('Error', err.message);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 10000 }
    );
  };

  const isAllFieldsFilled = () =>
    street && city && stateName && zip && latitude && longitude;

  const handleUpdateAddress = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Token not found.');
        return;
      }
      await axios.put(
        `${apiUrl}/api/retailer/edit-retailer`,
        { address: { street, city, state: stateName, zip, latitude, longitude } },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser({ ...user, address: { street, city, state: stateName, zip, latitude, longitude } });
      Alert.alert('Address Updated', 'Your address has been updated.');
      setModalVisible(false);
    } catch {
      Alert.alert('Error', 'Failed to update address. Please try again.');
    }
  };

  return (
    <View className={`${isDark ? 'bg-gray-900' : 'bg-gray-100'} flex-1 px-6 py-8`}>
      {/* <Text className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-green-800'}`}>
        Profile
      </Text> */}
      {user && (
        <View className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 mb-8 shadow`}>
          <Text className={`text-sm font-semibold mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Name:</Text>
          <Text className={`text-lg mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>{user.name || 'N/A'}</Text>
          <Text className={`text-sm font-semibold mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Email:</Text>
          <Text className={`text-lg mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>{user.email || 'N/A'}</Text>
          

          
    <Text className={`text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
      Address:
    </Text>
    <Text className={`mt-1 mb-3 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
      {[
        user.address.street,
        user.address.city,
        user.address.state,
        user.address.zip,
      ]
        .filter(Boolean)
        .join(', ')}
    </Text>

          <TouchableOpacity
            className={`bg-blue-500 rounded-md py-3 ${isDark ? 'bg-blue-700' : ''}`}
            onPress={handleChangeAddress}
          >
            <Text className="text-center text-white font-semibold">Update Address</Text>
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity
        className="bg-red-600 rounded-md py-3 mb-4"
        onPress={handleLogout}
      >
        <Text className="text-center text-white font-semibold">Logout</Text>
      </TouchableOpacity>

      {/* Address Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View className="flex-1 bg-black/30 justify-center items-center">
          <View className={`${isDark ? 'bg-gray-800' : 'bg-white'} w-11/12 p-6 rounded-xl shadow-lg`}>
            <Text className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-green-800'}`}>
              Update Address
            </Text>
            <TextInput
              className={`w-full h-12 px-4 mb-3 rounded-lg ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-200 text-gray-900'} border`}
              placeholder="Street"
              placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
              value={street}
              onChangeText={setStreet}
            />
            <TextInput
              className={`w-full h-12 px-4 mb-3 rounded-lg ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-200 text-gray-900'} border`}
              placeholder="City"
              placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
              value={city}
              onChangeText={setCity}
            />
            <TextInput
              className={`w-full h-12 px-4 mb-3 rounded-lg ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-200 text-gray-900'} border`}
              placeholder="State"
              placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
              value={stateName}
              onChangeText={setStateName}
            />
            <TextInput
              className={`w-full h-12 px-4 mb-3 rounded-lg ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-200 text-gray-900'} border`}
              placeholder="Zip"
              placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
              value={zip}
              onChangeText={setZip}
              keyboardType="numeric"
            />
            <View className="flex-row items-center mb-4">
              <TextInput
                className={`flex-1 h-12 px-4 rounded-lg ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-200 text-gray-900'} border mr-2`}
                placeholder="Latitude"
                placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                value={latitude}
                onChangeText={setLatitude}
                keyboardType="numeric"
              />
              <TextInput
                className={`flex-1 h-12 px-4 rounded-lg ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-200 text-gray-900'} border mr-2`}
                placeholder="Longitude"
                placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                value={longitude}
                onChangeText={setLongitude}
                keyboardType="numeric"
              />
              <TouchableOpacity
                className={`px-4 py-3 rounded-lg ${isDark ? 'bg-blue-700' : 'bg-blue-500'}`}
                onPress={fetchCurrentLocation}
                disabled={fetchingLocation}
              >
                {fetchingLocation ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white font-semibold">Use Current</Text>
                )}
              </TouchableOpacity>
            </View>
            <View className="flex-row">
              <TouchableOpacity
                className={`flex-1 py-3 rounded-lg ${isAllFieldsFilled() ? (isDark ? 'bg-blue-600' : 'bg-blue-500') : 'bg-gray-400'}`}
                onPress={handleUpdateAddress}
                disabled={!isAllFieldsFilled()}
              >
                <Text className="text-center text-white font-semibold">Update</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 py-3 ml-2 rounded-lg bg-red-600"
                onPress={() => setModalVisible(false)}
              >
                <Text className="text-center text-white font-semibold">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
