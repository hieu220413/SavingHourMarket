/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import 'react-native-gesture-handler';
import Tabs from './src/navigations/tabs';
import Login from './src/screens/Login';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OrderDetail from './src/screens/OrderDetail';
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
            options={{swipeEnabled: false}}
          />
          <Stack.Screen name="OrderDetail" component={OrderDetail} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
