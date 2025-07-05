import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../../screens/retailer/HomeScreen';
import WholesalerProducts from '../../screens/retailer/WholesalerProducts';


const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="WholeSalerProducts" component={WholesalerProducts} />
    </Stack.Navigator>
  );
};

export default HomeStack;
