import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Modal,
  useColorScheme,
  Image,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FloatingActionButton from '../../../components/FloatingActionButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useAppContext } from '../../../context/AppContext';
import { emit } from '../../../services/socketService';
import moment from 'moment';

const { width } = Dimensions.get('window');
const numColumns = 2;
const spacing = 12;
const sidePadding = 32;
const itemWidth =
  (width - sidePadding - (numColumns - 1) * spacing) / numColumns;

export default function MyProductsScreen({ route, navigation }) {
  const { apiUrl, user, storedProducts, setStoredProducts } = useAppContext();
  const [isGrid, setIsGrid] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  // const subscriptionExpired = route?.params?.subscriptionExpired;
  console.log(user.subscriptionExpired);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(
    user.subscriptionExpired,
  );
  // if (subscriptionExpired) setShowSubscriptionModal(true);
  const { payment } = route?.params || {};
  if (payment) {
    setShowSubscriptionModal(false);
  }
  const [remainingDays, setRemainingDays] = useState(0);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    emit('wholesaler-connect', {
      message: 'wholesaler connected',
      id: user.userId,
    });
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const userToken = await AsyncStorage.getItem('token');
      const response = await axios.get(
        `${apiUrl}/api/wholesaler/get-products/me`,
        {
          headers: { Authorization: `Bearer ${userToken}` },
        },
      );
      setStoredProducts(response.data || []);
    } catch (e) {
      setStoredProducts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProducts();
  }, []);

  const handleAddProduct = () => navigation.navigate('AddProduct');
  const handleEdit = item =>
    navigation.navigate('EditProduct', { product: item });

  const handleDelete = item => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete "${item.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              const userToken = await AsyncStorage.getItem('token');
              await axios.delete(
                `${apiUrl}/api/product/delete/${item.product_id}`,
                {
                  headers: { Authorization: `Bearer ${userToken}` },
                },
              );
              setStoredProducts(
                storedProducts.filter(p => p.product_id !== item.product_id),
              );
            } catch (e) {
              Alert.alert('Error', 'Failed to delete product.');
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  useEffect(() => {
    if (user) {
      const today = moment();
      let daysRemaining = 0;

      if (user.subscription_expiry) {
        const expiry = moment(user.subscription_expiry);
        console.log('Today:', today.format()); 
        console.log(new Date().toLocaleString());
        console.log('Expiry:', expiry.format());


        const diff = expiry.diff(today, 'days');
        daysRemaining = diff >= 0 ? diff : 0;
      }

      setRemainingDays(daysRemaining);

      if (daysRemaining < 7 || user.subscriptionExpired) {
        setShowSubscriptionModal(true);
      }
    }
  }, []);

  // --- Enhanced Card UI ---
  const renderItem = ({ item }) => (
    <View
      style={[
        styles.card,
        isGrid ? { width: itemWidth } : { width: '100%' },
        isDark && styles.cardDark,
      ]}
    >
      {/* Optional product image */}
      {item.image && (
        <Image
          source={{ uri: item.image }}
          style={styles.productImage}
          resizeMode="cover"
        />
      )}
      <Text style={[styles.productName, isDark && styles.textDark]}>
        {item.name}
      </Text>
      <View style={styles.rowBetween}>
        <Text style={[styles.stock, item.stock < 5 && styles.lowStock]}>
          Stock: {item.stock}
        </Text>
        {item.stock === 0 && (
          <View style={styles.badgeOut}>
            <Text style={styles.badgeText}>Out of Stock</Text>
          </View>
        )}
      </View>
      <Text style={[styles.price, isDark && styles.priceDark]}>
        ₹{item.price} <Text style={styles.mrp}>₹{item.mrp}</Text>
      </Text>
      <Text
        style={[styles.description, isDark && styles.textDark2]}
        numberOfLines={2}
      >
        {item.description}
      </Text>
      <View style={styles.actionRow}>
        <TouchableOpacity
          onPress={() => handleEdit(item)}
          style={styles.iconBtn}
          accessibilityLabel="Edit product"
        >
          <Icon
            name="pencil-outline"
            size={20}
            color={isDark ? '#60A5FA' : '#2563EB'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDelete(item)}
          style={styles.iconBtn}
          accessibilityLabel="Delete product"
        >
          <Icon
            name="trash-outline"
            size={20}
            color={isDark ? '#F87171' : '#DC2626'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? '#111827' : '#F9FAFB' },
      ]}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <Text></Text>
        <View style={styles.toggleRow}>
          <Icon
            name="list-outline"
            size={24}
            color={!isGrid ? '#22c55e' : isDark ? '#9CA3AF' : '#6B7280'}
            onPress={() => setIsGrid(false)}
            style={styles.toggleIcon}
          />
          <Icon
            name="grid-outline"
            size={24}
            color={isGrid ? '#22c55e' : isDark ? '#9CA3AF' : '#6B7280'}
            onPress={() => setIsGrid(true)}
            style={styles.toggleIcon}
          />
        </View>
      </View>
      <View style={styles.divider} />

      {/* Product List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#22c55e" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <FlatList
          data={storedProducts}
          key={isGrid ? 'G' : 'L'}
          keyExtractor={item => item.product_id.toString()}
          renderItem={renderItem}
          numColumns={isGrid ? numColumns : 1}
          columnWrapperStyle={
            isGrid ? { justifyContent: 'space-between' } : null
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#22c55e']}
              tintColor="#22c55e"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="cube-outline" size={60} color="#94A3B8" />
              <Text style={styles.emptyText}>No products found.</Text>
              <TouchableOpacity
                style={styles.addFirstBtn}
                onPress={handleAddProduct}
              >
                <Text style={styles.addFirstBtnText}>
                  Add your first product
                </Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

      {/* FAB */}
      <FloatingActionButton onPress={handleAddProduct} color="#22c55e" />

      {/* Subscription Modal */}
      {showSubscriptionModal && (
        <Modal visible transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Icon
                name={remainingDays > 0 ? 'checkmark-circle' : 'alert-circle'}
                size={48}
                color={remainingDays > 0 ? '#22c55e' : '#DC2626'}
                style={{ marginBottom: 12 }}
              />
              <Text style={styles.modalTitle}>
                {remainingDays > 0
                  ? 'Subscription Active'
                  : 'Subscription Expired'}
              </Text>
              <Text style={styles.modalDesc}>
                {remainingDays > 0
                  ? `You have ${remainingDays} day(s) left in your subscription.`
                  : 'Your subscription has expired. Please subscribe.'}
              </Text>
              {remainingDays > 0 && (
                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={() => setShowSubscriptionModal(false)}
                >
                  <Icon name="close" size={22} color="#9CA3AF" />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.upgradeBtn}
                onPress={() => {
                  // setShowSubscriptionModal(false);
                  navigation.navigate('Payment');
                }}
              >
                <Text style={styles.upgradeBtnText}>Upgrade Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

// --- Enhanced Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#22c55e',
    letterSpacing: 0.5,
  },
  headerTextDark: {
    color: '#4ade80',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleIcon: {
    marginLeft: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 14,
    opacity: 0.7,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    minHeight: 160,
    justifyContent: 'space-between',
  },
  cardDark: {
    backgroundColor: '#1e293b',
  },
  productImage: {
    width: '100%',
    height: 90,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#F1F5F9',
  },
  productName: {
    fontWeight: '600',
    fontSize: 18,
    color: '#111827',
    marginBottom: 4,
  },
  textDark: { color: '#F3F4F6' },
  textDark2: { color: '#CBD5E1' },
  stock: {
    color: '#22c55e',
    marginBottom: 2,
    fontWeight: '500',
  },
  lowStock: {
    color: '#DC2626',
    fontWeight: 'bold',
  },
  badgeOut: {
    backgroundColor: '#F87171',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 6,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  price: {
    color: '#065f46',
    fontWeight: 'bold',
    marginBottom: 2,
    fontSize: 16,
  },
  priceDark: { color: '#bbf7d0' },
  mrp: {
    color: '#94a3b8',
    textDecorationLine: 'line-through',
    fontWeight: 'normal',
    fontSize: 13,
    marginLeft: 4,
  },
  description: {
    color: '#64748b',
    fontSize: 14,
    marginBottom: 6,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  iconBtn: {
    marginLeft: 20,
    padding: 6,
    borderRadius: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#64748b',
    fontSize: 16,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 17,
    marginTop: 14,
    marginBottom: 8,
  },
  addFirstBtn: {
    marginTop: 10,
    backgroundColor: '#22c55e',
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 20,
  },
  addFirstBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 28,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    position: 'relative',
    elevation: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#22c55e',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalDesc: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 20,
    textAlign: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    padding: 4,
  },
  upgradeBtn: {
    backgroundColor: '#22c55e',
    borderRadius: 24,
    paddingHorizontal: 32,
    paddingVertical: 10,
    marginTop: 6,
  },
  upgradeBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
