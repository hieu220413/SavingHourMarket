/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Toast, { BaseToast } from 'react-native-toast-message';
import { COLORS } from './src/constants/theme';
import 'react-native-gesture-handler';
import Tabs from './src/navigations/tabs';
import Login from './src/screens/Login';
import OrderDetails from './src/screens/deliveryStaff/OrderDetails';
import OrderDetail from './src/screens/orderStaff/OrderDetail';
import EditDeliveryDate from './src/screens/deliveryStaff/EditDeliveryDate';
import { LogBox } from 'react-native';
import SelectPickupPoint from './src/screens/orderStaff/SelectPickupPoint';
import OrderGroupDetail from './src/screens/deliveryManager/OrderGroupDetail';
import OrderDetailForManager from './src/screens/deliveryManager/OrderDetailForManager';
import PickStaff from './src/screens/deliveryManager/PickStaff';
import SelectTimeFrame from './src/screens/deliveryManager/SelectTimeFrame';
import SelectProductConsolidationArea from './src/screens/deliveryManager/SelectProductConsolidationArea';
import { ModalPortal } from 'react-native-modals';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);


const Stack = createStackNavigator();
export default function App() {
  const toastConfig = {
    /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
    success: props => (
      <BaseToast
        {...props}
        style={{ backgroundColor: COLORS.primary, borderLeftWidth: 0 }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 16,
          fontWeight: '700',
          color: 'white',
        }}
        text2Style={{
          fontSize: 14,
          fontWeight: '400',
          color: 'white',
        }}
      />
    ),
  };
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
          <Stack.Screen name="OrderDetail" component={OrderDetail} />
          <Stack.Screen name="OrderDetails" component={OrderDetails} />
          <Stack.Screen name="EditDeliveryDate" component={EditDeliveryDate} />
          <Stack.Screen
            name="SelectPickupPoint"
            component={SelectPickupPoint}
          />
          <Stack.Screen name="OrderGroupDetail" component={OrderGroupDetail} />
          <Stack.Screen
            name="OrderDetailForManager"
            component={OrderDetailForManager}
          />
          <Stack.Screen name="PickStaff" component={PickStaff} />
          <Stack.Screen name="SelectTimeFrame" component={SelectTimeFrame} />
          <Stack.Screen
            name="SelectProductConsolidationArea"
            component={SelectProductConsolidationArea}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <ModalPortal />
      <Toast config={toastConfig} />
    </>
  );
}
