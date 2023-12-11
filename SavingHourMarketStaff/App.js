/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer,useNavigation } from '@react-navigation/native';
import Toast, { BaseToast } from 'react-native-toast-message';
import { COLORS } from './src/constants/theme';
import 'react-native-gesture-handler';
import Tabs from './src/navigations/tabs';
import Login from './src/screens/Login';
import Loading from './src/screens/Loading';
import OrderDetails from './src/screens/deliveryStaff/OrderDetails';
import OrderDetail from './src/screens/orderStaff/OrderDetail';
import OrderPrint from './src/screens/orderStaff/OrderPrint';
import EditDeliveryDate from './src/screens/deliveryStaff/EditDeliveryDate';
import { LogBox } from 'react-native';
import SelectPickupPoint from './src/screens/orderStaff/SelectPickupPoint';
import OrderGroupDetail from './src/screens/deliveryManager/OrderGroupDetail';
import OrderDetailForManager from './src/screens/deliveryManager/OrderDetailForManager';
import PickStaff from './src/screens/deliveryManager/PickStaff';
import SelectTimeFrame from './src/screens/deliveryManager/SelectTimeFrame';
import SelectProductConsolidationArea from './src/screens/deliveryManager/SelectProductConsolidationArea';
import { ModalPortal } from 'react-native-modals';
import BatchList from './src/screens/deliveryManager/BatchList';
import BatchingDetail from './src/screens/deliveryManager/BatchingDetail';
import OrderListForManager from './src/screens/deliveryManager/OrderListForManager';
import DailyReportForManager from './src/screens/deliveryManager/DailyReportForManager';
import OrderListForReport from './src/screens/deliveryManager/OrderListForReport';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EditPassword from './src/screens/EditPassword';

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
        contentContainerStyle={{ paddingHorizontal: "5%"}}
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
    unsuccess: props => (
      <BaseToast
        {...props}
        style={{ backgroundColor: 'red', borderLeftWidth: 0 }}
        contentContainerStyle={{ paddingHorizontal: "5%"}}
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

  useEffect(() => {
    const setDisableAccount = async () => (await AsyncStorage.setItem('isDisableAccount', '0'));
    setDisableAccount();
  }, []);

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName={'Start'}>
          <Stack.Screen name="Start" component={Loading} />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ swipeEnabled: false }}
          />
          <Stack.Screen
            name="Tabs"
            component={Tabs}
            options={{ swipeEnabled: false }}
          />
          <Stack.Screen name="OrderDetail" component={OrderDetail} />
          <Stack.Screen name="OrderPrint" component={OrderPrint} />
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
          <Stack.Screen name="BatchList" component={BatchList} />
          <Stack.Screen name="BatchingDetail" component={BatchingDetail} />
          <Stack.Screen
            name="DailyReportForManager"
            component={DailyReportForManager}
          />
          <Stack.Screen
            name="OrderListForReport"
            component={OrderListForReport}
          />
          <Stack.Screen name="Edit Password" component={EditPassword} />
        </Stack.Navigator>
      </NavigationContainer>
      <ModalPortal />
      <Toast config={toastConfig} />
      
    </>
  );
}
