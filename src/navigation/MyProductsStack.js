import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MyProductsScreen from '../screens/wholeSaler/products/ProductList';
import AddProduct from '../screens/wholeSaler/products/AddProduct';
import EditProduct from '../screens/wholeSaler/products/EditProduct';
const Stack = createNativeStackNavigator();

const MyProductsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MyProducts" component={MyProductsScreen} />
      <Stack.Screen name="AddProduct" component={AddProduct} />
      <Stack.Screen name="EditProduct" component={EditProduct} />
    </Stack.Navigator>
  );
};

export default MyProductsStack;
