import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useColorScheme } from 'nativewind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';
import { useNavigation } from '@react-navigation/native';

const PaymentPage = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const navigation = useNavigation();
  const {apiUrl,user,setUser} = useAppContext();
  const colors = {
    background: isDark ? '#1F2937' : '#FFFFFF',
    textPrimary: isDark ? '#F9FAFB' : '#065F46',
    cardBg: isDark ? '#374151' : '#ECFDF5',
    button: '#16A34A',
    buttonText: '#FFFFFF',
    amount: isDark ? '#FBBF24' : '#B45309',
  };

  const handlePay =async () => {
    try {
      const token =await AsyncStorage.getItem('token');
      const response = await axios.post(`${apiUrl}/api/wholesaler/add-subscription`, {}, { headers: { Authorization: `Bearer ${token}` } });
      console.log(response);
      if(response.status === 200){
        setUser({...user, subscriptionExpired : false,subscription_expiry: response.data.subscription.end_date});
        navigation.navigate('wholesaler')
      }
      
      Alert.alert('Payment', 'Payment of ₹300 initiated!');
    } catch (e) {
      Alert.alert('Error', 'Payment failed!');
      console.error(e);
    }
  };

  return (
    <View style={{
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    }}>
      <View style={{
        backgroundColor: colors.cardBg,
        padding: 32,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 32,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
      }}>
        <Text style={{
          fontSize: 22,
          fontWeight: 'bold',
          color: colors.textPrimary,
          marginBottom: 12,
        }}>
          Payment Details
        </Text>
        <Text style={{
          fontSize: 32,
          fontWeight: 'bold',
          color: colors.amount,
          marginBottom: 8,
        }}>
          ₹300
        </Text>
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: colors.button,
          paddingVertical: 16,
          paddingHorizontal: 48,
          borderRadius: 10,
        }}
        onPress={handlePay}
        activeOpacity={0.85}
      >
        <Text style={{
          color: colors.buttonText,
          fontWeight: 'bold',
          fontSize: 18,
        }}>
          Pay
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default PaymentPage;
