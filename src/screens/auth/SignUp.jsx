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
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { useAppContext } from '../../context/AppContext';
import axios from 'axios';
import { useColorScheme } from 'nativewind';

const SignUpScreen = () => {
  const { apiUrl } = useAppContext();
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleSignUp = async () => {
    if (!name || !email || !phone || !password || !role) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${apiUrl}/api/auth/register`, {
        name,
        email,
        phone,
        password,
        role,
      });
      Alert.alert('Success', 'Account created successfully!');
      navigation.navigate('SignIn');
    } catch (e) {
      Alert.alert('Error', 'Failed to sign up. Please try again.');
      console.log("signup error", e);
    } finally {
      setLoading(false);
    }
  };

  // Tailwind token classes
  const bg = isDark ? 'bg-background-dark' : 'bg-background-light';
  const headerAccent = 'text-primary';
  const textPrimary = isDark ? 'text-background-light' : 'text-secondary';
  const textSecondary = 'text-muted';
  const inputBg = isDark ? 'bg-gray-800' : 'bg-background-light';
  const inputBorder = isDark ? 'border-border-dark' : 'border-border-light';
  const placeholderColor = '#9CA3AF';
  const iconColor = '#9CA3AF';
  const btnActive = 'bg-primary';
  const btnInactive = 'bg-muted';
  const btnTextActive = 'text-background-light';
  const btnTextInactive = 'text-muted';

  const allFilled = name && email && phone && password && role;

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
          {/* Header Section */}
          <View className="pt-12 pb-8">
            <View className="items-center mb-6">
              <View className="w-20 h-20 bg-accent rounded-full items-center justify-center mb-4">
                <View className="w-10 h-10 bg-primary rounded-full items-center justify-center">
                  <Text className="text-background-light text-lg font-bold">+</Text>
                </View>
              </View>
              <Text className={`text-3xl font-bold mb-2 px-1 ${headerAccent}`}>
                Create Account
              </Text>
              <Text className={`${textSecondary} text-center text-base px-1`}>
                Join us today and get started
              </Text>
            </View>
          </View>

          {/* Form Section */}
          <View className="flex-1">
            {/* Full Name */}
            <View className="mb-4">
              <Text className={`text-muted text-sm font-medium mb-1`}>
                Full Name
              </Text>
              <View className="relative">
                <TextInput
                  className={`w-full h-12 px-4 pr-12 ${inputBg} border ${inputBorder} rounded-xl ${textPrimary}`}
                  placeholder="Enter your full name"
                  placeholderTextColor={placeholderColor}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
                <Icon
                  name="user"
                  size={20}
                  color={iconColor}
                  style={{ position: 'absolute', right: 16, top: 14 }}
                />
              </View>
            </View>

            {/* Email Address */}
            <View className="mb-4">
              <Text className={`text-muted text-sm font-medium mb-1`}>
                Email Address
              </Text>
              <View className="relative">
                <TextInput
                  className={`w-full h-12 px-4 pr-12 ${inputBg} border ${inputBorder} rounded-xl ${textPrimary}`}
                  placeholder="Enter your email"
                  placeholderTextColor={placeholderColor}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Icon
                  name="mail"
                  size={20}
                  color={iconColor}
                  style={{ position: 'absolute', right: 16, top: 14 }}
                />
              </View>
            </View>

            {/* Phone Number */}
            <View className="mb-4">
              <Text className={`text-muted text-sm font-medium mb-1`}>
                Phone Number
              </Text>
              <View className="relative">
                <TextInput
                  className={`w-full h-12 px-4 pr-12 ${inputBg} border ${inputBorder} rounded-xl ${textPrimary}`}
                  placeholder="Enter your phone number"
                  placeholderTextColor={placeholderColor}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Icon
                  name="phone"
                  size={20}
                  color={iconColor}
                  style={{ position: 'absolute', right: 16, top: 14 }}
                />
              </View>
            </View>

            {/* Password */}
            <View className="mb-4">
              <Text className={`text-muted text-sm font-medium mb-1`}>
                Password
              </Text>
              <View className="relative">
                <TextInput
                  className={`w-full h-12 px-4 pr-12 ${inputBg} border ${inputBorder} rounded-xl ${textPrimary}`}
                  placeholder="Create a password"
                  placeholderTextColor={placeholderColor}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!isPasswordVisible}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  className="absolute right-4 top-3"
                  onPress={() => setIsPasswordVisible(v => !v)}
                >
                  {isPasswordVisible ? (
                    <Icon name="eye" size={20} color={iconColor} />
                  ) : (
                    <Icon name="eye-off" size={20} color={iconColor} />
                  )}
                </TouchableOpacity>
              </View>
              <Text className="text-xs text-muted mt-1">
                Password must be at least 8 characters
              </Text>
            </View>

            {/* Role Picker */}
            <View className="mb-4">
              <Text className={`text-muted text-sm font-medium mb-1`}>
                Role
              </Text>
              <View className={`border ${inputBorder} rounded-xl overflow-hidden `}>
                <Picker
                  selectedValue={role}
                  onValueChange={setRole}
                  style={{
                    color: isDark ? '#fff' : '#111827',
                    backgroundColor: isDark ? '#1F2937' : '#fff',
                    height: 60,
                  }}
                  dropdownIconColor={isDark ? '#fff' : '#111827'}
                >
                  <Picker.Item label="Select Role..." value="" color="#9CA3AF" />
                  <Picker.Item label="Wholesaler" value="wholesaler" />
                  <Picker.Item label="Retailer" value="retailer" />
                </Picker>
              </View>
            </View>

            {/* Create Account Button */}
            <TouchableOpacity
              className={`w-full h-12 rounded-xl items-center justify-center mb-6 ${
                allFilled ? btnActive : btnInactive
              } ${loading ? 'opacity-60' : ''}`}
              onPress={handleSignUp}
              disabled={!allFilled || loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className={`text-base font-bold px-1 ${
                  allFilled ? btnTextActive : btnTextInactive
                }`}>
                  Create Account
                </Text>
              )}
            </TouchableOpacity>

            {/* Sign In Link */}
            <View className="flex-row justify-center items-center px-1">
              <Text className="text-muted text-base">
                Already have an account?
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('SignIn')}
                className="ml-1"
              >
                <Text className="text-primary font-semibold text-base">
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
