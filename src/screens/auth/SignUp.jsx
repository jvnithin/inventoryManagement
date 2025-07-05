import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import AppContext, { useAppContext } from '../../context/AppContext';
import axios from 'axios';

const SignUpScreen = () => {
  const { apiUrl } = useAppContext();
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleSignUp = async () => {
    if (!name || !email || !phone || !password) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }
    
    try {
      const response = await axios.post(`${apiUrl}/api/auth/register`, {
        name,
        email,
        phone,
        password,
      });
      Alert.alert('Success', 'Account created successfully!');
      navigation.navigate('SignIn');
    } catch (error) {
      console.log('Error signing up:', error);
      Alert.alert('Error', 'Failed to sign up. Please try again.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={{ paddingTop: 48, paddingBottom: 32 }}>
            <View style={{ alignItems: 'center', marginBottom: 24 }}>
              <View style={{
                width: 80, height: 80, backgroundColor: '#bbf7d0',
                borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 16
              }}>
                <View style={{
                  width: 40, height: 40, backgroundColor: '#22c55e',
                  borderRadius: 20, alignItems: 'center', justifyContent: 'center'
                }}>
                  <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>+</Text>
                </View>
              </View>
              <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#22c55e', marginBottom: 8 }}>
                Create Account
              </Text>
              <Text style={{ color: '#6b7280', textAlign: 'center', fontSize: 16 }}>
                Join us today and get started
              </Text>
            </View>
          </View>

          {/* Form Section */}
          <View style={{ flex: 1 }}>
            {/* Name Input */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{ color: '#374151', fontSize: 14, fontWeight: '500', marginBottom: 4 }}>
                Full Name
              </Text>
              <View>
                <TextInput
                  style={{
                    width: '100%', height: 48, paddingHorizontal: 16,
                    backgroundColor: '#f9fafb', borderColor: '#e5e7eb', borderWidth: 1,
                    borderRadius: 12, color: '#111827', fontSize: 16
                  }}
                  placeholder="Enter your full name"
                  placeholderTextColor="#9CA3AF"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
                <Icon
                  name="user"
                  size={20}
                  color="#9CA3AF"
                  style={{ position: 'absolute', right: 16, top: 14 }}
                />
              </View>
            </View>

            {/* Email Input */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{ color: '#374151', fontSize: 14, fontWeight: '500', marginBottom: 4 }}>
                Email Address
              </Text>
              <View>
                <TextInput
                  style={{
                    width: '100%', height: 48, paddingHorizontal: 16,
                    backgroundColor: '#f9fafb', borderColor: '#e5e7eb', borderWidth: 1,
                    borderRadius: 12, color: '#111827', fontSize: 16
                  }}
                  placeholder="Enter your email"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Icon
                  name="mail"
                  size={20}
                  color="#9CA3AF"
                  style={{ position: 'absolute', right: 16, top: 14 }}
                />
              </View>
            </View>

            {/* Phone Input */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{ color: '#374151', fontSize: 14, fontWeight: '500', marginBottom: 4 }}>
                Phone Number
              </Text>
              <View>
                <TextInput
                  style={{
                    width: '100%', height: 48, paddingHorizontal: 16,
                    backgroundColor: '#f9fafb', borderColor: '#e5e7eb', borderWidth: 1,
                    borderRadius: 12, color: '#111827', fontSize: 16
                  }}
                  placeholder="Enter your phone number"
                  placeholderTextColor="#9CA3AF"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Icon
                  name="phone"
                  size={20}
                  color="#9CA3AF"
                  style={{ position: 'absolute', right: 16, top: 14 }}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{ color: '#374151', fontSize: 14, fontWeight: '500', marginBottom: 4 }}>
                Password
              </Text>
              <View>
                <TextInput
                  style={{
                    width: '100%', height: 48, paddingHorizontal: 16,
                    backgroundColor: '#f9fafb', borderColor: '#e5e7eb', borderWidth: 1,
                    borderRadius: 12, color: '#111827', fontSize: 16
                  }}
                  placeholder="Create a password"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!isPasswordVisible}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={{ position: 'absolute', right: 16, top: 14 }}
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  {isPasswordVisible ? (
                    <Icon name="eye" size={20} color="#9CA3AF" />
                  ) : (
                    <Icon name="eye-off" size={20} color="#9CA3AF" />
                  )}
                </TouchableOpacity>
              </View>
              <Text style={{ color: '#6b7280', fontSize: 12, marginTop: 4 }}>
                Password must be at least 8 characters
              </Text>
            </View>

        

            {/* Sign Up Button */}
            <TouchableOpacity
              style={{
                width: '100%',
                height: 48,
                backgroundColor: name && email && phone && password ? '#22c55e' : '#d1d5db',
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 24,
              }}
              onPress={handleSignUp}
              disabled={!name || !email || !phone || !password}
              activeOpacity={0.8}
            >
              <Text style={{
                color: name && email && phone && password ? '#fff' : '#6b7280',
                fontSize: 16,
                fontWeight: 'bold'
              }}>
                Create Account
              </Text>
            </TouchableOpacity>

            {/* Already have an account */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: '#6b7280', fontSize: 16 }}>
                Already have an account?
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('SignIn')}
                style={{ marginLeft: 4 }}
              >
                <Text style={{ color: '#22c55e', fontWeight: 'bold', fontSize: 16 }}>
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUpScreen;
