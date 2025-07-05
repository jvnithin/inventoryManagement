import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useAppContext } from '../../context/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const InvitationScreen = ({ route, navigation }) => {
  const inviteCode = route?.params?.inviteCode;
    const {apiUrl,user} = useAppContext();
  const handleAccept = async () => {
    try {
      const userToken = await AsyncStorage.getItem('token');
      const response = await axios.post(`${apiUrl}/api/retailer/subscribe-wholesaler`, { inviteCode }, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      console.log(response);
      Alert.alert('Success', response.data.message);
      navigation.navigate("retailer");
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'An error occurred while accepting the invitation.');
    }
  };
  
  const handleReject = () => {
    // TODO: Replace with your reject-invite logic
    Alert.alert('Invitation Rejected', 'You have rejected the invitation.');
    // navigation.goBack(); // Or any other logic
    navigation.navigate("retailer");
  };
  
  if (!inviteCode) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>Invitation Screen</Text>
        <Text style={{ fontSize: 16, color: 'gray' }}>No invite code found in link.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16, color: '#16A34A' }}>
        You've been invited!
      </Text>
      <Text style={{ fontSize: 17, color: '#065F46', marginBottom: 32, textAlign: 'center' }}>
        Invitation Code: <Text style={{ fontWeight: 'bold' }}>{inviteCode}</Text>
      </Text>
      <View style={{ flexDirection: 'row', gap: 18 }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#16A34A',
            paddingVertical: 12,
            paddingHorizontal: 28,
            borderRadius: 10,
            marginRight: 10,
          }}
          onPress={handleAccept}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: '#f87171',
            paddingVertical: 12,
            paddingHorizontal: 28,
            borderRadius: 10,
          }}
          onPress={handleReject}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default InvitationScreen;
