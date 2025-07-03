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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SignInScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleSignIn = () => {
    console.log('Sign in with:', { email, password });
    navigation.navigate('MainApp');
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
          <View className="flex-1 justify-center items-center pt-16 pb-8">
            {/* Logo/Icon */}
            <View className="w-24 h-24 bg-green-100 rounded-full items-center justify-center mb-8">
              <View className="w-12 h-12 bg-green-500 rounded-full items-center justify-center">
                <Text className="text-white text-xl font-bold">S</Text>
              </View>
            </View>

            {/* Welcome Text */}
            <Text className="text-3xl font-bold text-gray-800 mb-2">
              Welcome Back
            </Text>
            <Text className="text-gray-500 text-center text-base mb-8">
              Sign in to your account to continue
            </Text>

            {/* Form Section */}
            <View className="w-full space-y-4">
              {/* Email Input */}
              <View>
                <Text className="text-gray-700 text-sm font-medium mb-2 ml-1">
                  Email Address
                </Text>
                <View className="relative">
                  <TextInput
                    className="w-full h-14 px-4 pr-12 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-base focus:border-blue-500 focus:bg-white"
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

              {/* Password Input */}
              <View>
                <Text className="text-gray-700 text-sm font-medium mb-2 ml-1">
                  Password
                </Text>
                <View className="relative">
                  <TextInput
                    className="w-full h-14 px-4 pr-12 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-base focus:border-blue-500 focus:bg-white"
                    placeholder="Enter your password"
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
              </View>

              {/* Forgot Password */}
              {/* <TouchableOpacity className="self-end">
                <Text className="text-blue-500 text-sm font-medium">
                  Forgot Password?
                </Text>
              </TouchableOpacity> */}

              {/* Sign In Button */}
              <TouchableOpacity
                className="w-full h-14 bg-green-500 rounded-xl items-center justify-center mt-6 shadow-lg shadow-blue-500/25"
                onPress={handleSignIn}
                activeOpacity={0.8}
              >
                <Text className="text-white text-base font-semibold">
                  Sign In
                </Text>
              </TouchableOpacity>

              {/* Divider */}
              <View className="flex-row items-center my-6">
                <View className="flex-1 h-px bg-gray-200" />
                <Text className="mx-4 text-gray-500 text-sm">or</Text>
                <View className="flex-1 h-px bg-gray-200" />
              </View>

              {/* Social Login Buttons */}
              {/* <View className="space-y-3">
                <TouchableOpacity
                  className="w-full h-12 bg-white border border-gray-200 rounded-xl flex-row items-center justify-center space-x-3"
                  activeOpacity={0.7}
                >
                  <Icon name="google" size={20} color="#EA4335" />
                  <Text className="text-gray-700 font-medium">
                    Continue with Google
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="w-full h-12 bg-white border border-gray-200 rounded-xl flex-row items-center justify-center space-x-3"
                  activeOpacity={0.7}
                >
                  <Ionicons name="logo-apple" size={22} color="#000" />
                  <Text className="text-gray-700 font-medium">
                    Continue with Apple
                  </Text>
                </TouchableOpacity>
              </View> */}
              <View className="flex-row justify-center items-center">
              <Text className="text-gray-500 text-base">
                Don't have an account?
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('SignUp')}
                className="ml-1"
              >
                <Text className="text-green-500 font-semibold text-base">
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
            </View>
          </View>

          {/* Footer */}
          <View className="pb-8">
            
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignInScreen;
