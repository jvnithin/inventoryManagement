import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppContext } from '../../../context/AppContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';

const fallbackImage = 'https://ui-avatars.com/api/?background=16A34A&color=fff&name=R';

export default function RetailerDetails({ route, navigation }) {
  const { retailer } = route.params;
  const { orders, fetchOrders, apiUrl } = useAppContext();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Form state
  const [name, setName] = useState(retailer.name);
  const [contact, setContact] = useState(retailer.phone);
  const [street, setStreet] = useState(retailer.address?.street || '');
  const [city, setCity] = useState(retailer.address?.city || '');
  const [stateField, setStateField] = useState(retailer.address?.state || '');
  const [zip, setZip] = useState(retailer.address?.zip || '');
  const [photo, setPhoto] = useState(retailer.photo);

  // --- CENTRAL: Filter orders for this retailer/customer ---
  console.log(orders);
  console.log(retailer.user_id);
  const retailerOrders = orders.filter(order => String(order.user_id) === String(retailer.user_id));
  console.log(retailerOrders);
  const totalOrders = retailerOrders.length;
  const totalValue = retailerOrders.reduce((sum, order) =>
    sum + (order.order_items ? order.order_items.price * order.order_items.quantity : 0),
    0
  );

  const handleSaveRetailer = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const address = { street, city, state: stateField, zip };
      await axios.put(
        `${apiUrl}/api/wholesaler/edit-retailer/${retailer.user_id}`,
        { name, phone: contact, address, photo },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('Success', 'Retailer updated successfully!');
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Failed to update retailer!');
    }
  };

  useEffect(() => {
    fetchOrders(); // Always fetch latest orders on mount
    // eslint-disable-next-line
  }, []);

  // Color tokens
  const bg = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const text = isDark ? 'text-gray-100' : 'text-gray-800';
  const label = isDark ? 'text-gray-400' : 'text-gray-600';
  const inputBg = isDark ? 'bg-gray-700' : 'bg-gray-100';
  const inputBorder = isDark ? 'border-gray-600' : 'border-gray-200';
  const accent = '#16A34A';

  return (
    <View className={`${bg} flex-1`}>
      <StatusBar backgroundColor={accent} barStyle={isDark ? 'light-content' : 'dark-content'} />
      <SafeAreaView className={`${bg} flex-1`}>
        {/* Header */}
        <View className="flex-row items-center px-4 pt-4 pb-3" style={{
          backgroundColor: accent,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 6,
          elevation: 3,
        }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mr-3 bg-green-100 rounded-full p-2"
          >
            <Icon name="arrow-back" size={24} color="#065F46" />
          </TouchableOpacity>
          <Text className="flex-1 text-white text-xl font-bold" numberOfLines={1}>
            {retailer.name}
          </Text>
        </View>

        <ScrollView className="px-4 py-4">
          {/* Profile */}
          <View className="flex-row items-center mb-6">
            <Image
              source={{ uri: photo || fallbackImage }}
              className="w-20 h-20 rounded-full mr-4 border-2 border-green-200 bg-green-50"
              onError={() => setPhoto(fallbackImage)}
            />
            <TouchableOpacity
              onPress={() => console.log('Change Photo')}
              className="px-4 py-2 bg-green-100 rounded-full"
            >
              <Text className="text-green-800 font-medium">Change Photo </Text>
            </TouchableOpacity>
          </View>

          {/* Form Card */}
          <View className={`${cardBg} rounded-xl p-4 mb-6 shadow-md`}>
            <Text className={`text-sm ${label} mb-1`}>Retailer Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              className={`border ${inputBorder} ${inputBg} rounded-lg px-3 py-2 mb-3 ${text}`}
            />

            <Text className={`text-sm ${label} mb-1`}>Contact Number</Text>
            <TextInput
              value={contact}
              onChangeText={setContact}
              keyboardType="phone-pad"
              className={`border ${inputBorder} ${inputBg} rounded-lg px-3 py-2 mb-3 ${text}`}
            />

            <Text className={`text-sm ${label} mb-2`}>Address</Text>
            <TextInput
              placeholder="Street"
              value={street}
              onChangeText={setStreet}
              className={`border ${inputBorder} ${inputBg} rounded-lg px-3 py-2 mb-2 ${text}`}
              placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            />
            <TextInput
              placeholder="City"
              value={city}
              onChangeText={setCity}
              className={`border ${inputBorder} ${inputBg} rounded-lg px-3 py-2 mb-2 ${text}`}
              placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            />
            <TextInput
              placeholder="State"
              value={stateField}
              onChangeText={setStateField}
              className={`border ${inputBorder} ${inputBg} rounded-lg px-3 py-2 mb-2 ${text}`}
              placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            />
            <TextInput
              placeholder="ZIP"
              value={zip}
              onChangeText={setZip}
              keyboardType="number-pad"
              className={`border ${inputBorder} ${inputBg} rounded-lg px-3 py-2 mb-4 ${text}`}
              placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            />

            {/* Summary */}
            <View className="flex-row justify-between mt-4">
              <View>
                <Text className={`text-sm ${label}`}>Total Orders</Text>
                <Text className="text-lg font-bold" style={{ color: accent }}>
                  {totalOrders}
                </Text>
              </View>
              <View>
                <Text className={`text-sm ${label}`}>Total Value</Text>
                <Text className="text-lg font-bold" style={{ color: accent }}>
                  ₹{totalValue}
                </Text>
              </View>
            </View>
          </View>

          {/* Orders List */}
          <Text className="text-lg font-bold mb-3" style={{ color: accent }}>
            Recent Orders
          </Text>
          {retailerOrders.length === 0 && (
            <Text className={`text-center ${label}`}>No orders for this retailer.</Text>
          )}
          {retailerOrders.map((order) => (
            <View
              key={order.order_id}
              className={`${cardBg} rounded-lg p-4 mb-3 border ${
                isDark ? 'border-gray-700' : 'border-gray-200'
              }`}
            >
              <Text className="font-semibold mb-1" style={{ color: accent }}>
                {order.created_at ? new Date(order.created_at).toLocaleDateString() : ''}
              </Text>
              <Text className={`text-sm ${label} mb-1`}>
                Items:{' '}
                <Text className={`font-medium ${text}`}>
                  {order.order_items ? order.order_items.name : ''} x {order.order_items ? order.order_items.quantity : ''}
                </Text>
              </Text>
              <View className="flex-row items-center">
                <Icon name="pricetag" size={16} color={accent} />
                <Text className="ml-1 font-bold" style={{ color: accent }}>
                  ₹{order.order_items ? order.order_items.price * order.order_items.quantity : 0}
                </Text>
              </View>
            </View>
          ))}

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSaveRetailer}
            className="mt-6 mb-8 bg-green-700 rounded-lg py-3 shadow-lg"
          >
            <Text className="text-center text-white font-semibold text-base">
              Save Changes
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
