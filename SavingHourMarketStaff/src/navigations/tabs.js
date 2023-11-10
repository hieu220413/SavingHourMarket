/* eslint-disable prettier/prettier */
import React, {useEffect, useState, useCallback} from 'react';
import {View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import TabIcon from '../components/TabIcon';
import Home from '../screens/orderStaff/Home';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {icons} from '../constants';
import {COLORS} from '../constants/theme';
import {useFocusEffect} from '@react-navigation/native';
import Test from '../components/Test';
import Report from '../screens/orderStaff/Report';
import HomeDeliver from '../screens/deliveryStaff/HomeDeliver';
import QrCodeScanner from '../screens/deliveryStaff/QrCodeScanner';
import Product from '../screens/orderStaff/Product';
import OrderGroup from '../screens/deliveryManager/OrderGroup';
import OrderBatch from '../screens/deliveryManager/OrderBatch';
import Batching from '../screens/deliveryManager/Batching';

const Tab = createBottomTabNavigator();

const Tabs = () => {
  const [user, setUser] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const getUser = async () => {
        const currentUser = await AsyncStorage.getItem('userInfo');
        setUser(currentUser ? JSON.parse(currentUser) : null);
      };
      getUser();
    }, []),
  );

  console.log(user);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          backgroundColor: COLORS.tabBackground,
          opacity: 0.95,
          borderTopColor: 'transparent',
          height: 80,
        },
      }}>
      {!user && (
        <Tab.Screen
          name="Temp"
          component={Test}
          options={{
            tabBarIcon: ({focused}) => (
              <TabIcon display={'Order'} focused={focused} icon={icons.home} />
            ),
          }}
        />
      )}

      {user?.role === 'STAFF_ORD' && (
        <>
          <Tab.Screen
            name="Home"
            component={Home}
            options={{
              tabBarIcon: ({focused}) => (
                <TabIcon
                  display={'Đơn hàng'}
                  focused={focused}
                  icon={icons.order}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Product"
            component={Product}
            options={{
              tabBarIcon: ({focused}) => (
                <TabIcon
                  display={'Sản phẩm'}
                  focused={focused}
                  icon={icons.product}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Report"
            component={Report}
            options={{
              tabBarIcon: ({focused}) => (
                <TabIcon
                  display={'Thống kê'}
                  focused={focused}
                  icon={icons.statistic}
                />
              ),
            }}
          />
        </>
      )}
      {user?.role === 'STAFF_DLV_1' && (
        <>
          <Tab.Screen
            name="OrderGroup"
            component={OrderGroup}
            options={{
              tabBarIcon: ({focused}) => (
                <TabIcon
                  display={'Đơn điểm giao hàng'}
                  focused={focused}
                  icon={icons.pickuppoint}
                />
              ),
            }}
          />
          <Tab.Screen
            name="OrderBatch"
            component={OrderBatch}
            options={{
              tabBarIcon: ({focused}) => (
                <TabIcon
                  display={'Đơn giao tận nhà'}
                  focused={focused}
                  icon={icons.homedelivery}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Batching"
            component={Batching}
            options={{
              tabBarIcon: ({focused}) => (
                <TabIcon display={'Gom đơn hàng'} focused={focused} icon={icons.batching} />
              ),
            }}
          />
        </>
      )}
      {user?.role === 'STAFF_DLV_0' && (
        <>
          <Tab.Screen
            name="HomeDeliver"
            component={HomeDeliver}
            options={{
              tabBarIcon: ({focused}) => (
                <TabIcon
                  display={'Trang chủ'}
                  focused={focused}
                  icon={icons.home}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Home2"
            component={QrCodeScanner}
            options={{
              tabBarIcon: ({focused}) => (
                <TabIcon
                  display={'Scan QR'}
                  focused={focused}
                  icon={icons.qrCodeScanner}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Home3"
            component={Home}
            options={{
              tabBarIcon: ({focused}) => (
                <TabIcon display={'DLV0'} focused={focused} icon={icons.home} />
              ),
            }}
          />
        </>
      )}
    </Tab.Navigator>
  );
};

export default Tabs;
