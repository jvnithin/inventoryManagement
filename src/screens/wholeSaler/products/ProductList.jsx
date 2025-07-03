import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FloatingActionButton from '../../../components/FloatingActionButton';

const { width } = Dimensions.get('window');
const numColumns = 2;
const spacing = 12;
const sidePadding = 32;
const itemWidth =
  (width - sidePadding - (numColumns - 1) * spacing) / numColumns;

const dummyProducts = [
  {
    product_id: 'P001',
    name: 'Organic Apples',
    stock: 120,
    price: 80,
    mrp: 100,
    description: 'Fresh organic apples from the farm.',
  },
  {
    product_id: 'P002',
    name: 'Natural Honey',
    stock: 50,
    price: 200,
    mrp: 250,
    description: 'Pure natural honey, no additives.',
  },
  {
    product_id: 'P003',
    name: 'Almonds',
    stock: 75,
    price: 500,
    mrp: 600,
    description: 'Premium quality almonds, rich in protein.',
  },
  {
    product_id: 'P004',
    name: 'Green Tea',
    stock: 200,
    price: 150,
    mrp: 180,
    description: 'Organic green tea leaves.',
  },
];

export default function MyProductsScreen({ navigation }) {
  const [isGrid, setIsGrid] = useState(true);

  const handleAddProduct = () => {
    console.log('Add Product clicked');
    navigation.navigate('AddProduct');
  };

  const handleEdit = item => {
    console.log('Edit', item.product_id);
  };

  const handleDelete = item => {
    console.log('Delete', item.product_id);
  };

  const renderItem = ({ item }) => (
    <View
      className={`bg-green-50 rounded-2xl p-4 mb-4 mx-1 shadow-md`}
      style={isGrid ? { width: itemWidth } : { width: '100%' }}
    >
      <Text className="font-semibold text-green-800 text-lg mb-1">
        {item.name}
      </Text>
      <Text className="text-gray-600 mb-1">Stock: {item.stock}</Text>
      <Text className="text-gray-700 mb-1">
        Price: ₹{item.price}{' '}
        <Text className="line-through text-gray-400">₹{item.mrp}</Text>
      </Text>
      <Text className="text-gray-500 text-sm mb-2" numberOfLines={2}>
        {item.description}
      </Text>
      <View className="flex-row justify-end space-x-4 mt-2">
        <TouchableOpacity onPress={() => handleEdit(item)}>
          <Icon name="pencil-outline" size={20} color="#065F46" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item)}>
          <Icon name="trash-outline" size={20} color="#DC2626" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-white px-4 pt-6">
      {/* Header with toggle */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-2xl font-bold text-green-800">My Products</Text>
        <View className="flex-row space-x-4">
          <Icon
            name="list-outline"
            size={24}
            color={isGrid ? '#4B5563' : '#065F46'}
            onPress={() => setIsGrid(false)}
          />
          <Icon
            name="grid-outline"
            size={24}
            color={isGrid ? '#065F46' : '#4B5563'}
            onPress={() => setIsGrid(true)}
          />
        </View>
      </View>

      {/* Product List/Grid */}
      <FlatList
        data={dummyProducts}
        key={isGrid ? 'G' : 'L'} // Force re-render on layout change
        keyExtractor={item => item.product_id}
        renderItem={renderItem}
        numColumns={isGrid ? numColumns : 1}
        columnWrapperStyle={isGrid ? { justifyContent: 'space-between' } : null}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Floating Action Button */}
      <FloatingActionButton onPress={handleAddProduct} />
    </View>
  );
}
