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
      const res = await axios.post(`${apiUrl}/api/auth/login`, { email, password });
      setUser(res.data.user);
      await AsyncStorage.setItem('token', res.data.token);
    } catch (e) {
      console.log(e);
    }
  };

  // Dark/light classes
  const bg = isDark ? 'bg-background-dark' : 'bg-background-light';
  const textPrimary = isDark ? 'text-background-light' : 'text-secondary';
  const textSecondary = isDark ? 'text-muted' : 'text-muted';
  const inputBg = isDark ? 'bg-gray-800' : 'bg-background-light';
  const inputBorder = isDark ? 'border-border-dark' : 'border-border-light';
  const placeholderColor = '#9CA3AF';
  const iconColor = '#9CA3AF';
  const btnBg = 'bg-primary';
  const divider = isDark ? 'bg-muted' : 'bg-muted';

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
            {/* Logo */}
            <View className={`w-24 h-24 rounded-full items-center justify-center mb-8 ${isDark ? 'bg-accent' : 'bg-accent'}`}>
              <View className="w-12 h-12 bg-primary rounded-full items-center justify-center">
                <Text className="text-white text-xl font-bold">S</Text>
              </View>
            </View>

            <Text className={`text-3xl font-bold mb-2 px-1 ${textPrimary}`}>Welcome Back</Text>
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
                <Text className={`text-sm font-medium mb-2 ml-1 mt-2 ${textPrimary}`}>
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
                    onPress={() => setIsPasswordVisible(v => !v)}
                  >
                    <Icon name={isPasswordVisible ? 'eye' : 'eye-off'} size={20} color={iconColor} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Sign In */}
              <TouchableOpacity
                className={`w-full h-14 rounded-xl items-center justify-center mt-6 ${btnBg} shadow-lg`}
                onPress={handleSignIn}
                activeOpacity={0.8}
              >
                <Text className="text-white text-base font-semibold">Sign In</Text>
              </TouchableOpacity>

              {/* Divider */}
              <View className="flex-row items-center my-6">
                <View className={`flex-1 h-px ${divider}`} />
                <Text className={`mx-4 text-sm ${textSecondary}`}>or</Text>
                <View className={`flex-1 h-px ${divider}`} />
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
                  <Text className="text-primary font-semibold text-base px-3">
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
