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

import EditProfile from './screens/EditProfile';
import Login from './screens/Login';
import Signup from './screens/Signup';

import Payment from './screens/Payment';
import SelectPickupPoint from './screens/SelectPickupPoint';
import SelectTimeFrame from './screens/SelectTimeFrame';
import SelectPaymentMethod from './screens/SelectPaymentMethod';
import SelectVoucher from './screens/SelectVoucher';
import SelectCustomerLocation from './screens/SelectCustomerLocation';
import EditCustomerLocation from './screens/EditCustomerLocation';

const Stack = createStackNavigator();
export default function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName={'Start'}>
          <Stack.Screen name="Start" component={Tabs} />
          <Stack.Screen name="Discount" component={Discount} />
          <Stack.Screen name="Orders" component={Orders} />
          <Stack.Screen name="Cart" component={Cart} />
          <Stack.Screen name="Profile" component={Profile} />

          <Stack.Screen name="Edit Profile" component={EditProfile} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Sign Up" component={Signup} />

          <Stack.Screen name="Payment" component={Payment} />
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
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
