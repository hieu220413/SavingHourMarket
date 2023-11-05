/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';
import Tabs from './src/navigations/tabs';
import Login from './src/screens/Login';
import OrderDetails from './src/screens/OrderDetails';
import EditDeliveryDate from './src/screens/EditDeliveryDate';
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const Stack = createStackNavigator();
export default function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName={'Login'}>
          <Stack.Screen name="Start" component={Tabs} />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ swipeEnabled: false }}
          />
          <Stack.Screen name="OrderDetails" component={OrderDetails} />
          <Stack.Screen name="EditDeliveryDate" component={EditDeliveryDate} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
