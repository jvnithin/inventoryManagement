import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
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
const Profile = () => {
  const { user, handleLogout,apiUrl,setUser } = useAppContext();

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);

  // Address fields state
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [zip, setZip] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [fetchingLocation, setFetchingLocation] = useState(false);

  // Open modal and prefill if address exists
  const handleChangeAddress = () => {
    if (user?.address) {
      setStreet(user.address.street || '');
      setCity(user.address.city || '');
      setStateName(user.address.state || '');
      setZip(user.address.zip || '');
      setLatitude(user.address.latitude ? String(user.address.latitude) : '');
      setLongitude(
        user.address.longitude ? String(user.address.longitude) : '',
      );
    } else {
      setStreet('');
      setCity('');
      setStateName('');
      setZip('');
      setLatitude('');
      setLongitude('');
    }
    setModalVisible(true);
  };

  // Permission and location fetching
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Geolocation Permission',
          message: 'Can we access your location?',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const fetchCurrentLocation = async () => {
    setFetchingLocation(true);
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Location permission is required.');
      setFetchingLocation(false);
      return;
    }
    console.log("Fetching location");
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setLatitude(latitude.toString());
        setLongitude(longitude.toString());
        setFetchingLocation(false); 
      },
      error => {
        setFetchingLocation(false); 
        if (error.code === 1) {
          Alert.alert('Permission Denied', 'Please allow location access.');
        } else if (error.code === 2) {
          Alert.alert(
            'Location Unavailable',
            'Could not determine your location.',
          );
        } else if (error.code === 3) {
          Alert.alert('Timeout', 'Location request timed out. Try again.');
        } else {
          Alert.alert('Error', error.message);
        }
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 10000 },
    );
  };

  const isAllFieldsFilled = () =>
    street && city && stateName && zip && latitude && longitude;

  const handleUpdateAddress = async () => {
    try {
      // Here you would call your API or update context with the new address
      const token =await AsyncStorage.getItem('token');
      if(!token){
        Alert("Token not found");
        return;
      }
      const response = await axios.put(`${apiUrl}/api/retailer/edit-retailer`, { address:{street, city, state: stateName, zip, latitude, longitude} }, { headers: { Authorization: `Bearer ${token}` } });
      console.log(response);
      setUser({...user,address:{street, city, state: stateName, zip, latitude, longitude}});
      Alert.alert('Address Updated', 'Your address has been updated.');
      setModalVisible(false);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to update address. Please try again.');
    }
  };

  const onLogout = async () => {
    await handleLogout();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      {user && (
        <View style={styles.infoBox}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{user.name || 'N/A'}</Text>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{user.email || 'N/A'}</Text>
          <Text style={styles.label}>Role:</Text>
          <Text style={styles.value}>{user.role || 'N/A'}</Text>
          <TouchableOpacity
            style={styles.addressBtn}
            onPress={handleChangeAddress}
          >
            <Text style={styles.addressBtnText}>Update Address</Text>
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* Address Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Street"
              value={street}
              onChangeText={setStreet}
              placeholderTextColor={'#ccc'}
            />
            <TextInput
              style={styles.input}
              placeholder="City"
              value={city}
              onChangeText={setCity}
              placeholderTextColor={'#ccc'}
            />
            <TextInput
              style={styles.input}
              placeholder="State"
              value={stateName}
              onChangeText={setStateName}
              placeholderTextColor={'#ccc'}
            />
            <TextInput
              style={styles.input}
              placeholder="Zip"
              value={zip}
              onChangeText={setZip}
              keyboardType="numeric"
              placeholderTextColor={'#ccc'}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput
                style={[styles.input, { flex: 1, marginRight: 8 }]}
                placeholder="Latitude"
                value={latitude}
                onChangeText={setLatitude}
                keyboardType="numeric"
                placeholderTextColor={'#ccc'}
              />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Longitude"
                value={longitude}
                onChangeText={setLongitude}
                keyboardType="numeric"
                placeholderTextColor={'#ccc'}
              />
              <TouchableOpacity
                style={styles.locationBtn}
                onPress={fetchCurrentLocation}
                disabled={fetchingLocation}
              >
                {fetchingLocation ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.locationBtnText}>Use Current</Text>
                )}
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <TouchableOpacity
                style={[
                  styles.updateBtn,
                  {
                    backgroundColor: isAllFieldsFilled()
                      ? '#06B6D4'
                      : '#d1d5db',
                  },
                ]}
                onPress={handleUpdateAddress}
                disabled={!isAllFieldsFilled()}
              >
                <Text style={styles.updateBtnText}>Update</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.updateBtn,
                  { backgroundColor: '#DC2626', marginLeft: 10 },
                ]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.updateBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#065F46',
    marginBottom: 32,
    letterSpacing: 1,
  },
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 24,
    marginBottom: 40,
    width: '100%',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  label: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
    marginTop: 12,
  },
  value: {
    fontSize: 16,
    color: '#111827',
    marginLeft: 8,
    marginBottom: 6,
  },
  addressBtn: {
    marginTop: 20,
    backgroundColor: '#06B6D4',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 1,
  },
  addressBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 0.5,
  },
  logoutBtn: {
    backgroundColor: '#DC2626',
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 8,
    elevation: 2,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.20)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    elevation: 4,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#06B6D4',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 44,
    borderColor: '#e5e7eb',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#f9fafb',
    color: '#374151',
    fontSize: 15,
  },
  locationBtn: {
    backgroundColor: '#10B981',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
    height: 44,
    justifyContent: 'center',
  },
  locationBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  updateBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
});
