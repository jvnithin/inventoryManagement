import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useAppContext } from '../../context/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useColorScheme } from 'nativewind';

const InvitationScreen = ({ route, navigation }) => {
  const inviteCode = route?.params?.inviteCode;
  const { apiUrl, user } = useAppContext();
  const [loading, setLoading] = useState(false);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const colors = {
    background: isDark ? '#1F2937' : '#FFFFFF',
    textPrimary: isDark ? '#F9FAFB' : '#065F46',
    textSecondary: isDark ? '#9CA3AF' : '#4B5563',
    buttonYes: '#16A34A',
    buttonNo: '#f87171',
    codeBg: isDark ? '#374151' : '#ECFDF5',
  };

  const handleAccept = async () => {
    if (user.role !== "retailer") {
      Alert.alert('Error', 'You are not a retailer.');
      return;
    }
    setLoading(true);
    try {
      const userToken = await AsyncStorage.getItem('token');
      const response = await axios.post(
        `${apiUrl}/api/retailer/subscribe-wholesaler`,
        { inviteCode },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      if (response.status === 200) {
        Alert.alert('Success', response.data.message);
        navigation.navigate("retailer");
      } else {
        Alert.alert('Error', response.data.message);
        navigation.navigate("retailer");
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Something went wrong.');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = () => {
    Alert.alert('Invitation Rejected', 'You have rejected the invitation.');
    navigation.navigate("retailer");
  };

  if (!inviteCode) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10, color: colors.textPrimary }}>Invitation Screen</Text>
        <Text style={{ fontSize: 16, color: colors.textSecondary }}>No invite code found in link.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: colors.background }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16, color: colors.buttonYes }}>
        Do you want to subscribe this wholesaler?
      </Text>
      <Text style={{ fontSize: 17, color: colors.textPrimary, marginBottom: 32, textAlign: 'center' }}>
        Invitation Code:{" "}
        <Text style={{
          fontWeight: 'bold',
          backgroundColor: colors.codeBg,
          paddingHorizontal: 8,
          borderRadius: 4,
          color: colors.textPrimary
        }}>
          {inviteCode}
        </Text>
      </Text>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          style={{
            backgroundColor: colors.buttonYes,
            paddingVertical: 12,
            paddingHorizontal: 28,
            borderRadius: 10,
            marginRight: 18,
            opacity: loading ? 0.7 : 1,
          }}
          onPress={handleAccept}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Yes</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: colors.buttonNo,
            paddingVertical: 12,
            paddingHorizontal: 28,
            borderRadius: 10,
          }}
          onPress={handleReject}
          disabled={loading}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>No</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default InvitationScreen;
