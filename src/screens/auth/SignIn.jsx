// SignInScreen.jsx

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
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'nativewind';

const SignInScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { apiUrl, setUser } = useAppContext();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleSignIn = async () => {
    try {
      const response = await axios.post(`${apiUrl}/api/auth/login`, { email, password });
      setUser(response.data.user);
      await AsyncStorage.setItem('token', response.data.token);
    } catch (e) {
      console.log(e);
    }
  };

  // Dynamic colors
  const bg = isDark ? 'bg-gray-900' : 'bg-white';
  const textPrimary = isDark ? 'text-gray-100' : 'text-gray-800';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-500';
  const inputBg = isDark ? 'bg-gray-800' : 'bg-gray-50';
  const inputBorder = isDark ? 'border-gray-700' : 'border-gray-200';
  const placeholderColor = isDark ? '#6B7280' : '#9CA3AF';
  const iconColor = isDark ? '#9CA3AF' : '#9CA3AF';
  const btnBg = isDark ? 'bg-green-600' : 'bg-green-500';
  const shadowColor = isDark ? 'shadow-black/25' : 'shadow-blue-500/25';

  return (
    <SafeAreaView className={`${bg} flex-1`}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          className="px-6"
        >
          <View className="flex-1 justify-center items-center pt-16 pb-8">
            <View className={`w-24 h-24 rounded-full items-center justify-center mb-8 ${isDark ? 'bg-green-800' : 'bg-green-100'}`}>
              <View className="w-12 h-12 bg-green-500 rounded-full items-center justify-center">
                <Text className="text-white text-xl font-bold">S</Text>
              </View>
            </View>

            <Text className={`text-3xl font-bold mb-2 ${textPrimary}`}>Welcome Back</Text>
            <Text className={`text-center text-base mb-8 ${textSecondary}`}>
              Sign in to your account to continue
            </Text>

            <View className="w-full space-y-4">
              {/* Email */}
              <View>
                <Text className={`text-sm font-medium mb-2 ml-1 ${textPrimary}`}>
                  Email Address
                </Text>
                <View className="relative">
                  <TextInput
                    className={`w-full h-14 px-4 pr-12 rounded-xl text-base ${inputBg} border ${inputBorder} ${textPrimary}`}
                    placeholder="Enter your email"
                    placeholderTextColor={placeholderColor}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <View className="absolute right-4 top-4">
                    <Icon name="mail" size={20} color={iconColor} />
                  </View>
                </View>
              </View>

              {/* Password */}
              <View>
                <Text className={`text-sm font-medium mb-2 ml-1 ${textPrimary}`}>
                  Password
                </Text>
                <View className="relative">
                  <TextInput
                    className={`w-full h-14 px-4 pr-12 rounded-xl text-base ${inputBg} border ${inputBorder} ${textPrimary}`}
                    placeholder="Enter your password"
                    placeholderTextColor={placeholderColor}
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
                      <Icon name="eye" size={20} color={iconColor} />
                    ) : (
                      <Icon name="eye-off" size={20} color={iconColor} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Sign In */}
              <TouchableOpacity
                className={`w-full h-14 rounded-xl items-center justify-center mt-6 ${btnBg} shadow-lg ${shadowColor}`}
                onPress={handleSignIn}
                activeOpacity={0.8}
              >
                <Text className="text-white text-base font-semibold">Sign In</Text>
              </TouchableOpacity>

              {/* Divider */}
              <View className="flex-row items-center my-6">
                <View className="flex-1 h-px bg-gray-200" />
                <Text className={`mx-4 text-sm ${textSecondary}`}>or</Text>
                <View className="flex-1 h-px bg-gray-200" />
              </View>

              {/* Sign Up Link */}
              <View className="flex-row justify-center items-center">
                <Text className={`text-base ${textSecondary}`}>
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

          <View className="pb-8" />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignInScreen;
