import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useColorScheme } from 'nativewind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';
import { useNavigation } from '@react-navigation/native';
import RazorpayCheckout from 'react-native-razorpay';

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

 const handlePay = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.post(`${apiUrl}/api/payment/create-order`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const order = response.data;
    console.log(order);
    const options = {
      name: 'Scale Orange',
      description: 'Wholesaler Subscription',
      image: 'https://file.aiquickdraw.com/imgcompressed/img/compressed_6b6b3dff9e1747d75b19d87062804621.webp',
      order_id: order.id, // Order ID from backend
      currency: 'INR',
      key: 'rzp_test_l8kTJWUfz1w9pU', // Razorpay public key
      amount: order.amount, // in paise
      prefill: {
        email: user?.email || 'test@example.com',
        contact: user?.phone || '9999999999',
        name: user?.name || 'Test User',
      },
      theme: { color: '#16A34A' },
    };
     RazorpayCheckout.open(options)
      .then(async (data) => {
        console.log('Payment success: ', data);

        // Send data to backend for verification
        const response = await axios.post(
          `${apiUrl}/api/payment/verify-payment`,
          {
            order_id: order.id,
            payment_id: data.razorpay_payment_id,
            signature: data.razorpay_signature,
          },
          { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }
        );
        console.log(response);
        if(response.status === 200){
          setUser({
            ...user,
            subscriptionExpired:false,
            subscription_expiry:response.data.end_date
          });
          Alert.alert('Success', 'Subscription successful!');
          navigation.navigate('wholesaler',{payment:true});
        }
        else{
          Alert.alert("Subscription Failed",response.data.message);
        }
        // alert('Payment successful!');
      })
      .catch((error) => {
        console.log('Payment failed: ', error);
        // alert('Payment failed!');
      });

    // const options = {
    //   description: 'Wholesaler Subscription',
    //   image: 'https://file.aiquickdraw.com/imgcompressed/img/compressed_6b6b3dff9e1747d75b19d87062804621.webp',
    //   currency: 'INR',
    //   key: 'rzp_test_l8kTJWUfz1w9pU', // replace with your Razorpay Key ID
    //   amount: 30000, // 300 INR in paise
    //   name: 'Scale Orange',
    //   prefill: {
    //     email: user?.email || 'test@example.com',
    //     contact: user?.phone || '9999999999',
    //     name: user?.name || 'Test User',
    //   },
    //   theme: { color: '#16A34A' },
    // };

    // RazorpayCheckout.open(options)
    //   .then(async (data) => {
    //     console.log('Payment Success:', data);

    //     // Optionally validate payment_id + signature on your backend
    //     const response = await axios.post(
    //       `${apiUrl}/api/wholesaler/add-subscription`,
    //       { payment_id: data.razorpay_payment_id },
    //       { headers: { Authorization: `Bearer ${token}` } }
    //     );
    //     console.log(response);
    //     if (response.status === 200) {
    //       setUser({
    //         ...user,
    //         subscriptionExpired: false,
    //         subscription_expiry: response.data.subscription.end_date,
    //       });

    //       // Alert.alert('Success', 'Payment successful!');
    //       navigation.navigate('wholesaler');
    //     }
    //   })
    //   .catch((error) => {
    //     console.error('Payment Failed:', error);
    //     Alert.alert('Payment Failed', 'Transaction cancelled or failed.');
    //   });
  } catch (e) {
    console.error(e);
    Alert.alert('Error', 'Something went wrong!');
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
