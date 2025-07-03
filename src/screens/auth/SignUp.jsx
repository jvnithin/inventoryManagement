import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppContext from '../../context/AppContext';
import axios from 'axios';

const SignUpScreen = () => {
  const {apiUrl}=useContext(AppContext);
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleSignUp = async() => {
    try {
      const response= await axios.post(`${apiUrl}/api/auth/register`,{name,email,phone,password} )
      console.log(response.data);
    } catch (error) {
      console.log("Error signing up:", error);
    }

    console.log('Sign up with:', { name, email, phone, password });
    navigation.navigate('Home');
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
            {/* Back Button */}
            {/* <TouchableOpacity
              className="w-10 h-10 items-center justify-center mb-4"
              onPress={() => navigation.goBack()}
            >
              <Icon name="arrow-left" size={24} color="#111827" />
            </TouchableOpacity> */}

            {/* Logo/Icon */}
            <View className="items-center mb-6">
              <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-4">
                <View className="w-10 h-10 bg-green-500 rounded-full items-center justify-center">
                  <Text className="text-white text-lg font-bold">+</Text>
                </View>
              </View>

              {/* Welcome Text */}
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
            <View className="space-y-4">
              {/* Name Input */}
              <View>
                <Text className="text-gray-700 text-sm font-medium mb-2 ml-1">
                  Full Name
                </Text>
                <View className="relative">
                  <TextInput
                    className="w-full h-14 px-4 pr-12 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-base focus:border-green-500 focus:bg-white"
                    placeholder="Enter your full name"
                    placeholderTextColor="#9CA3AF"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                  <View className="absolute right-4 top-4">
                    <Icon name="user" size={20} color="#9CA3AF" />
                  </View>
                </View>
              </View>

              {/* Email Input */}
              <View>
                <Text className="text-gray-700 text-sm font-medium mb-2 ml-1">
                  Email Address
                </Text>
                <View className="relative">
                  <TextInput
                    className="w-full h-14 px-4 pr-12 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-base focus:border-green-500 focus:bg-white"
                    placeholder="Enter your email"
                    placeholderTextColor="#9CA3AF"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <View className="absolute right-4 top-4">
                    <Icon name="mail" size={20} color="#9CA3AF" />
                  </View>
                </View>
              </View>

              {/* Phone Input */}
              <View>
                <Text className="text-gray-700 text-sm font-medium mb-2 ml-1">
                  Phone Number
                </Text>
                <View className="relative">
                  <TextInput
                    className="w-full h-14 px-4 pr-12 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-base focus:border-green-500 focus:bg-white"
                    placeholder="Enter your phone number"
                    placeholderTextColor="#9CA3AF"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <View className="absolute right-4 top-4">
                    <Icon name="phone" size={20} color="#9CA3AF" />
                  </View>
                </View>
              </View>

              {/* Password Input */}
              <View>
                <Text className="text-gray-700 text-sm font-medium mb-2 ml-1">
                  Password
                </Text>
                <View className="relative">
                  <TextInput
                    className="w-full h-14 px-4 pr-12 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-base focus:border-green-500 focus:bg-white"
                    placeholder="Create a password"
                    placeholderTextColor="#9CA3AF"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!isPasswordVisible}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    className="absolute right-4 top-4"
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                  >
                    {isPasswordVisible ? (
                      <Icon name="eye" size={20} color="#9CA3AF" />
                    ) : (
                      <Icon name="eye-off" size={20} color="#9CA3AF" />
                    )}
                  </TouchableOpacity>
                </View>
                <Text className="text-xs text-gray-500 mt-2 ml-1">
                  Password must be at least 8 characters
                </Text>
              </View>

              {/* Terms and Conditions */}
              {/* <View className="flex-row items-start space-x-3 mt-4">
                <TouchableOpacity
                  className={`w-5 h-5 rounded border-2 items-center justify-center mt-0.5 ${
                    agreeToTerms 
                      ? 'bg-green-500 border-green-500' 
                      : 'border-gray-300'
                  }`}
                  onPress={() => setAgreeToTerms(!agreeToTerms)}
                >
                  {agreeToTerms && (
                    <Icon name="check" size={14} color="#fff" />
                  )}
                </TouchableOpacity>
                <View className="flex-1">
                  <Text className="text-gray-600 text-sm leading-5">
                    I agree to the{' '}
                    <Text className="text-green-500 font-medium">
                      Terms of Service
                    </Text>
                    {' '}and{' '}
                    <Text className="text-green-500 font-medium">
                      Privacy Policy
                    </Text>
                  </Text>
                </View>
              </View> */}

              {/* Sign Up Button */}
              <TouchableOpacity
                className="w-full h-14 rounded-xl items-center justify-center mt-6 bg-green-500 shadow-lg shadow-green-500/25"
                onPress={handleSignUp}
                disabled={!agreeToTerms}
                activeOpacity={0.8}
              >
                <Text className={`text-base font-semibold ${
                  agreeToTerms ? 'text-white' : 'text-gray-500'
                }`}>
                  Create Account
                </Text>
              </TouchableOpacity>

              {/* Divider */}
              <View className="flex-row items-center my-6">
                <View className="flex-1 h-px bg-gray-200" />
                <Text className="mx-4 text-gray-500 text-sm">or</Text>
                <View className="flex-1 h-px bg-gray-200" />
              </View>

              {/* Social Sign Up Buttons */}
              {/* <View className="space-y-3">
                <TouchableOpacity
                  className="w-full h-12 bg-white border border-gray-200 rounded-xl flex-row items-center justify-center space-x-3"
                  activeOpacity={0.7}
                >
                  <Icon name="google" size={20} color="#EA4335" />
                  <Text className="text-gray-700 font-medium">
                    Sign up with Google
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="w-full h-12 bg-white border border-gray-200 rounded-xl flex-row items-center justify-center space-x-3"
                  activeOpacity={0.7}
                >
                  <Ionicons name="logo-apple" size={22} color="#000" />
                  <Text className="text-gray-700 font-medium">
                    Sign up with Apple
                  </Text>
                </TouchableOpacity>
              </View> */}
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
          </View>

          {/* Footer */}
          <View className="py-8">
            
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUpScreen;
