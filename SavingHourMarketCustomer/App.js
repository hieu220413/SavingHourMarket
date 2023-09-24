/* eslint-disable prettier/prettier */
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import 'react-native-gesture-handler';

import Tabs from './navigation/tabs';
import Discount from './screens/Discount';
import Orders from './screens/Orders';
import Cart from './screens/Cart';
import Profile from './screens/Profile';
import VNPayTest from './screens/VNPayTest';
const Stack = createStackNavigator();
export default function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName={'VNPayTest'}>
          <Stack.Screen name="VNPayTest" component={VNPayTest} />
          <Stack.Screen name="Home" component={Tabs} />
          <Stack.Screen name="Discount" component={Discount} />
          <Stack.Screen name="Orders" component={Orders} />
          <Stack.Screen name="Cart" component={Cart} />
          <Stack.Screen name="Profile" component={Profile} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
