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
import { useAppContext } from '../../context/AppContext';
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
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          className="px-6"
        >
          {/* Header Section */}
          <View className="pt-12 pb-8">
            <View className="items-center mb-6">
              <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-4">
                <View className="w-10 h-10 bg-green-500 rounded-full items-center justify-center">
                  <Text className="text-white text-lg font-bold">+</Text>
                </View>
              </View>
              <Text className="text-3xl font-bold text-green-500 mb-2">
                Create Account
              </Text>
              <Text className="text-gray-500 text-center text-base">
                Join us today and get started
              </Text>
            </View>
          </View>

          {/* Form Section */}
          <View className="flex-1">
            {/* Name Input */}
            <View className="mb-4">
              <Text className="text-gray-700 text-sm font-medium mb-1">
                Full Name
              </Text>
              <View className="relative">
                <TextInput
                  className="w-full h-12 px-4 pr-12 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-base"
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
            <View className="mb-4">
              <Text className="text-gray-700 text-sm font-medium mb-1">
                Email Address
              </Text>
              <View className="relative">
                <TextInput
                  className="w-full h-12 px-4 pr-12 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-base"
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
            <View className="mb-4">
              <Text className="text-gray-700 text-sm font-medium mb-1">
                Phone Number
              </Text>
              <View className="relative">
                <TextInput
                  className="w-full h-12 px-4 pr-12 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-base"
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
            <View className="mb-4">
              <Text className="text-gray-700 text-sm font-medium mb-1">
                Password
              </Text>
              <View className="relative">
                <TextInput
                  className="w-full h-12 px-4 pr-12 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-base"
                  placeholder="Create a password"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!isPasswordVisible}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  className="absolute right-4 top-3"
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  {isPasswordVisible ? (
                    <Icon name="eye" size={20} color="#9CA3AF" />
                  ) : (
                    <Icon name="eye-off" size={20} color="#9CA3AF" />
                  )}
                </TouchableOpacity>
              </View>
              <Text className="text-xs text-gray-500 mt-1">
                Password must be at least 8 characters
              </Text>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              className={`w-full h-12 rounded-xl items-center justify-center mb-6 ${
                name && email && phone && password ? 'bg-green-500' : 'bg-gray-300'
              }`}
              onPress={handleSignUp}
              disabled={!name || !email || !phone || !password}
              activeOpacity={0.8}
            >
              <Text className={`text-base font-bold ${
                name && email && phone && password ? 'text-white' : 'text-gray-500'
              }`}>
                Create Account
              </Text>
            </TouchableOpacity>

            {/* Already have an account */}
            <View className="flex-row justify-center items-center">
              <Text className="text-gray-500 text-base">
                Already have an account?
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('SignIn')}
                className="ml-1"
              >
                <Text className="text-green-500 font-semibold text-base">
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
