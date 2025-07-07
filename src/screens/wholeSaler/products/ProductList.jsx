import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  Appearance,
  RefreshControl,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FloatingActionButton from '../../../components/FloatingActionButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useAppContext } from '../../../context/AppContext';
import { emit } from '../../../services/socketService';

const { width } = Dimensions.get('window');
const numColumns = 2;
const spacing = 12;
const sidePadding = 32;
const itemWidth =
  (width - sidePadding - (numColumns - 1) * spacing) / numColumns;

export default function MyProductsScreen({ navigation }) {
  const { apiUrl, user, storedProducts, setStoredProducts } = useAppContext();
  const [isGrid, setIsGrid] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setColorScheme(colorScheme);
    });
    emit("wholesaler-connect", { message: "wholesaler connected", id: user.userId });
    return () => subscription.remove();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const userToken = await AsyncStorage.getItem('token');
      const response = await axios.get(
        `${apiUrl}/api/wholesaler/get-products/me`,
        { headers: { Authorization: `Bearer ${userToken}` } },
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
    // eslint-disable-next-line
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProducts();
  }, []);

  const handleAddProduct = () => navigation.navigate('AddProduct');

  const handleEdit = item => {
    navigation.navigate('EditProduct', { product: item });
  };

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
                { headers: { Authorization: `Bearer ${userToken}` } },
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

  // Theme styles
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const styles = themedStyles(theme);

  const renderItem = ({ item }) => (
    <View
      style={[styles.card, isGrid ? { width: itemWidth } : { width: '100%' }]}
    >
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.stock}>Stock: {item.stock}</Text>
      <Text style={styles.price}>
        Price : ₹{item.price} <Text style={styles.mrp}>₹{item.mrp}</Text>
      </Text>
      <Text style={styles.description} numberOfLines={2}>
        {item.description}
      </Text>
      <View style={styles.actionRow}>
        <TouchableOpacity
          onPress={() => handleEdit(item)}
          style={styles.iconBtn}
        >
          <Icon name="pencil-outline" size={20} color={theme.editIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDelete(item)}
          style={styles.iconBtn}
        >
          <Icon name="trash-outline" size={20} color={theme.deleteIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container]}>
      {/* Header */}
      <View style={styles.headerRow} >
        <View >
          {/* <Text style={styles.headerText} className='px-1'>My Products</Text> */}
        </View>
        <View style={styles.toggleRow}>
          <Icon
            name="list-outline"
            size={24}
            color={isGrid ? theme.iconInactive : theme.iconActive}
            onPress={() => setIsGrid(false)}
            style={styles.toggleIcon}
          />
          <Icon
            name="grid-outline"
            size={24}
            color={isGrid ? theme.iconActive : theme.iconInactive}
            onPress={() => setIsGrid(true)}
            style={styles.toggleIcon}
          />
        </View>
      </View>
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
            <Text style={styles.emptyText}>No products found.</Text>
          }
        />
      )}
      <FloatingActionButton onPress={handleAddProduct} color="#22c55e" />
    </View>
  );
}

// ... keep your themedStyles, lightTheme, darkTheme as before


// Theme colors
const lightTheme = {
  background: '#f8fafc',
  card: '#e6f9ed',
  text: '#065f46',
  description: '#64748b',
  header: '#22c55e',
  price: '#065f46',
  mrp: '#94a3b8',
  stock: '#065f46',
  iconActive: '#22c55e',
  iconInactive: '#64748b',
  editIcon: '#22c55e',
  deleteIcon: '#dc2626',
  shadow: '#000',
  empty: '#64748b',
  loading: '#065f46',
};

const darkTheme = {
  background: '#181c1f',
  card: '#1e293b',
  text: '#bbf7d0',
  description: '#94a3b8',
  header: '#4ade80',
  price: '#bbf7d0',
  mrp: '#64748b',
  stock: '#4ade80',
  iconActive: '#4ade80',
  iconInactive: '#64748b',
  editIcon: '#4ade80',
  deleteIcon: '#f87171',
  shadow: '#000',
  empty: '#94a3b8',
  loading: '#bbf7d0',
};

// Theme-aware styles
const themedStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingHorizontal: 16,
      paddingTop: 24,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'right',
      marginBottom: 18,
    },
    headerText: {
      fontSize: 26,
      fontWeight: 'bold',
      color: theme.header,
    },
    toggleRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    toggleIcon: {
      marginLeft: 16,
    },
    card: {
      backgroundColor: theme.card,
      borderRadius: 18,
      padding: 16,
      marginBottom: 16,
      shadowColor: theme.shadow,
      shadowOpacity: 0.12,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
      elevation: 4,
    },
    productName: {
      fontWeight: '600',
      fontSize: 18,
      color: theme.text,
      marginBottom: 4,
    },
    stock: {
      color: theme.stock,
      marginBottom: 2,
    },
    price: {
      color: theme.price,
      fontWeight: 'bold',
      marginBottom: 2,
    },
    mrp: {
      color: theme.mrp,
      textDecorationLine: 'line-through',
      fontWeight: 'normal',
      fontSize: 14,
    },
    description: {
      color: theme.description,
      fontSize: 14,
      marginBottom: 6,
    },
    actionRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 8,
    },
    iconBtn: {
      marginLeft: 20,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: 12,
      color: theme.loading,
      fontSize: 16,
      fontWeight: '500',
    },
    emptyText: {
      textAlign: 'center',
      color: theme.empty,
      fontSize: 16,
      marginTop: 40,
    },
  });
