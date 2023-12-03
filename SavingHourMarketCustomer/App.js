/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';
import { Alert } from 'react-native';
import Tabs from './navigation/tabs';

import Cart from './screens/Cart';

import AsyncStorage from '@react-native-async-storage/async-storage';
import EditProfile from './screens/EditProfile';
import Login from './screens/Login';
import Signup from './screens/Signup';
import { ModalPortal } from 'react-native-modals';
import Payment from './screens/Payment';
import SelectPickupPoint from './screens/SelectPickupPoint';
import SelectTimeFrame from './screens/SelectTimeFrame';
import SelectPaymentMethod from './screens/SelectPaymentMethod';
import SelectVoucher from './screens/SelectVoucher';
import SelectCustomerLocation from './screens/SelectCustomerLocation';
import EditCustomerLocation from './screens/EditCustomerLocation';
import OrderDetail from './screens/OrderDetail';
import Search from './screens/Search';
import SearchResult from './screens/SearchResult';
import SearchBar from './components/SearchBar';
import ProductsBySubCategories from './screens/ProductsBySubCategories';
import ChangePickupPoint from './screens/ChangePickupPoint';

import { LogBox } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

Geolocation.setRNConfiguration({
  skipPermissionRequests: false,
  locationProvider: 'playServices',
});

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);
import ProductDetails from './screens/ProductDetails';
import DiscountForCategories from './screens/DiscountForCategories';
import OrderSuccess from './screens/OrderSuccess';
import messaging from '@react-native-firebase/messaging';
import {
  getToken,
  notificationListener,
  requestUserPermission,
} from './src/utils/commonUtils';
import ForgetPassword from './screens/ForgetPassword';
import CodeReset from './screens/CodeReset';
import ResetPassword from './screens/ResetPassword';
import Feedback from './screens/Feedback';
import UploadScreen from './screens/Upload';
import Toast, { BaseToast } from 'react-native-toast-message';
import { COLORS } from './constants/theme';
import OrderFeedback from './screens/OrderFeedback';
import FeedbackList from './screens/FeedbackList';
import RemotePushController from './src/services/RemotePushController';
import StartScreen from './screens/StartScreen';

const Stack = createStackNavigator();
export default function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const notification = async () => {
      let userInfo = await AsyncStorage.getItem('userInfo');
      userInfo = userInfo ? JSON.parse(userInfo) : null;
      let isEnable = await AsyncStorage.getItem('isEnable');
      isEnable = isEnable ? JSON.parse(isEnable) : true;
      if (isEnable) {
        messaging()
          .subscribeToTopic(userInfo ? userInfo.id : '.')
          .then(() => console.log('Subscribed to topic!'));
      } else {
        messaging()
          .unsubscribeFromTopic(userInfo ? userInfo.id : '.')
          .then(() => console.log('Unsubscribed to topic!'));
      }
    };

    notification();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
      console.log('remoteMessage', remoteMessage.notification.body);
      Toast.show({
        type: 'success',
        text1: remoteMessage.notification.title,
        text2: remoteMessage.notification.body,
        visibilityTime: 2000,
      });
    });

    return unsubscribe;
  }, []);
  useEffect(() => {
    requestUserPermission();
    notificationListener();
    getToken();
    // const installationId = firebase.installations().getId();
    // console.log(installationId);
  }, []);

  /*
  1. Create the config
*/
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
    unsuccess: props => (
      <BaseToast
        {...props}
        style={{ backgroundColor: 'red', borderLeftWidth: 0 }}
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
          initialRouteName={'Initial'}>
          <Stack.Screen name="Initial" component={StartScreen} />
          <Stack.Screen name="Start" component={Tabs} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Cart" component={Cart} />
          <Stack.Screen name="OrderDetail" component={OrderDetail} />
          <Stack.Screen name="Search" component={Search} />
          <Stack.Screen name="SearchResult" component={SearchResult} />
          <Stack.Screen name="SearchBar" component={SearchBar} />

          <Stack.Screen name="Edit Profile" component={EditProfile} />
          <Stack.Screen name="Sign Up" component={Signup} />

          <Stack.Screen name="Payment" component={Payment} />
          <Stack.Screen name="ProductDetails" component={ProductDetails} />
          <Stack.Screen
            name="ProductsBySubCategories"
            component={ProductsBySubCategories}
          />
          <Stack.Screen
            name="DiscountForCategories"
            component={DiscountForCategories}
          />
          <Stack.Screen
            name="Select pickup point"
            component={SelectPickupPoint}
          />
          <Stack.Screen name="Select time frame" component={SelectTimeFrame} />
          <Stack.Screen
            name="Select payment method"
            component={SelectPaymentMethod}
          />
          <Stack.Screen name="Select voucher" component={SelectVoucher} />
          <Stack.Screen
            name="Select customer location"
            component={SelectCustomerLocation}
          />
          <Stack.Screen
            name="Edit customer location"
            component={EditCustomerLocation}
          />
          <Stack.Screen
            name="Order success"
            component={OrderSuccess}
            options={{ swipeEnabled: false }}
          />
          <Stack.Screen name="Forgot password" component={ForgetPassword} />
          <Stack.Screen name="Code reset" component={CodeReset} />
          <Stack.Screen name="Reset password" component={ResetPassword} />
          <Stack.Screen name="Feedback" component={Feedback} />
          <Stack.Screen name="Upload" component={UploadScreen} />
          <Stack.Screen name="Order Feedback" component={OrderFeedback} />
          <Stack.Screen name="List Feedback" component={FeedbackList} />
          <Stack.Screen
            name="ChangePickupPoint"
            component={ChangePickupPoint}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <ModalPortal />
      <Toast config={toastConfig} />
      <RemotePushController />
    </>
  );
}
