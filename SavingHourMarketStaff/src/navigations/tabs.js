/* eslint-disable prettier/prettier */
import React, { useEffect, useState, useCallback } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabIcon from '../components/TabIcon';
import Home from '../screens/orderStaff/Home';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { icons } from '../constants';
import { COLORS } from '../constants/theme';
import { useFocusEffect } from '@react-navigation/native';

import Report from '../screens/orderStaff/Report';
import HomeDeliver from '../screens/deliveryStaff/HomeDeliver';
import QrCodeScanner from '../screens/deliveryStaff/QrCodeScanner';
import Product from '../screens/orderStaff/Product';
import OrderGroup from '../screens/deliveryManager/OrderGroup';
import OrderBatch from '../screens/deliveryManager/OrderBatch';
// import Batching from '../screens/deliveryManager/Batching';
import OrderGroupForOrderStaff from '../screens/orderStaff/OrderGroup';
import OrderListForManager from '../screens/deliveryManager/OrderListForManager';
import ReportForManager from '../screens/deliveryManager/ReportForManager';
import Profile from '../screens/Profile';
import HistoryList from '../screens/deliveryStaff/HistoryList';
import auth from '@react-native-firebase/auth';
import ModalAlertSignOut from '../components/ModalAlertSignOut';

const Tab = createBottomTabNavigator();

const Tabs = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [alertVisible, setAlertVisible] = useState(false);
  const onAuthStateChange = async userInfo => {
    // console.log(userInfo);
    if (initializing) {
      setInitializing(false);
    }
    if (userInfo) {
      console.log('on auth change');
      // check if user sessions is still available. If yes => redirect to another screen
      const userTokenId = await userInfo.getIdToken(true).catch(e => {
        console.log('err', e);
        return null;
      });

      if (!userTokenId) {
        setAlertVisible(true);
        setTimeout(async () => {
          setAlertVisible(false);
          // sessions end. (revoke refresh token like password change, disable account, ....)
          await AsyncStorage.removeItem('userInfo').then(() => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
            return;
          });
        }, 3000);
      }
      const currentUser = await AsyncStorage.getItem('userInfo');
      if (currentUser) {
        navigation.navigate('Tabs');
      }
    } else {
      const isDisableAccount = await AsyncStorage.getItem('isDisableAccount');
      if (isDisableAccount === '1') {
        await AsyncStorage.setItem('isDisableAccount', '0');
        setAlertVisible(true);
        setTimeout(async () => {
          setAlertVisible(false);
          // sessions end. (revoke refresh token like password change, disable account, ....)
          await AsyncStorage.removeItem('userInfo').then(() => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
            return;
          });
        }, 3000);
      } else {
        console.log('user is not logged in');
        await AsyncStorage.removeItem('userInfo').then(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        });
      }
    }
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(
      async userInfo => await onAuthStateChange(userInfo),
    );
    return subscriber;
  }, []);

  useFocusEffect(
    useCallback(() => {
      const getUser = async () => {
        const currentUser = await AsyncStorage.getItem('userInfo');
        setUser(currentUser ? JSON.parse(currentUser) : null);
      };
      getUser();
    }, []),
  );

  return (
    user && (
      <>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarStyle: {
              height: '7%',
              position: 'absolute',
              bottom: 3,
              right: 7,
              left: 7,
              borderRadius: 16,
              backgroundColor: COLORS.tabBackground
            },

          }}>
          {user?.role === 'STAFF_ORD' && (
            <>
              <Tab.Screen
                key={"Report"}
                name="Report"
                component={Report}
                options={{
                  tabBarButton: (props) => (
                    <TabIcon
                      {...props}
                      display={'Trang chủ'}
                      icon={icons.home}
                    />
                  ),
                }}
              />
              <Tab.Screen
                key={"Home"}
                name="Home"
                component={Home}
                options={{
                  tabBarButton: (props) => (
                    <TabIcon
                      {...props}
                      display={'Đơn hàng'}
                      icon={icons.order}
                    />
                  ),
                }}
              />
              <Tab.Screen
                key={"OrderGroupForOrderStaff"}
                name="OrderGroupForOrderStaff"
                component={OrderGroupForOrderStaff}
                options={{
                  tabBarButton: (props) => (
                    <TabIcon
                      {...props}
                      display={'Nhóm Đơn'}
                      icon={icons.pickuppoint}
                    />
                  ),
                }}
              />
              <Tab.Screen
                key={"Product"}
                name="Product"
                component={Product}
                options={{
                  tabBarButton: (props) => (
                    <TabIcon
                      {...props}
                      display={'Sản phẩm'}
                      icon={icons.product}
                    />
                  ),
                }}
              />
              {/* <Tab.Screen
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
          /> */}
            </>
          )}
          {user?.role === 'STAFF_DLV_1' && (
            <>
              <Tab.Screen
                name="ReportForManager"
                component={ReportForManager}
                options={{
                  tabBarButton: (props) => (
                    <TabIcon
                      {...props}
                      display={'Trang chủ'}
                      icon={icons.home}
                    />
                  ),
                }}
              />
              <Tab.Screen
                name="OrderGroup"
                component={OrderGroup}
                options={{
                  tabBarButton: (props) => (
                    <TabIcon
                      {...props}
                      display={'Điểm giao hàng'}
                      icon={icons.pickuppoint}
                    />
                  ),
                }}
              />
              <Tab.Screen
                name="OrderBatch"
                component={OrderBatch}
                options={{
                  tabBarButton: (props) => (
                    <TabIcon
                      {...props}
                      display={'Giao tận nhà'}
                      icon={icons.homedelivery}
                    />
                  ),
                }}
              />
              <Tab.Screen
                name="OrderListForManager"
                component={OrderListForManager}
                options={{
                  tabBarButton: (props) => (
                    <TabIcon
                      {...props}
                      display={'Chưa gom'}
                      icon={icons.orderIcon}
                    />
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
                  tabBarButton: (props) => (
                    <TabIcon
                      {...props}
                      display={'Trang chủ'}
                      icon={icons.home}
                    />
                  ),
                }}
              />
              <Tab.Screen
                name="QrCodeScanner"
                component={QrCodeScanner}
                options={{
                  tabBarButton: (props) => (
                    <TabIcon
                      {...props}
                      display={'Quét QR'}
                      icon={icons.qrCodeScanner}
                    />
                  ),
                }}
              />
              <Tab.Screen
                name="HistoryList"
                component={HistoryList}
                options={{
                  tabBarButton: (props) => (
                    <TabIcon
                      {...props}
                      display={'Lịch sử'}
                      icon={icons.historyList}
                    />
                  ),
                }}
              />
            </>
          )}
          <Tab.Screen
            name="Profile"
            component={Profile}
            options={{
              tabBarButton: (props) => (
                <TabIcon
                  {...props}
                  display={'Tôi'}
                  icon={icons.user}
                />
              ),
            }}
          />
        </Tab.Navigator>
        <ModalAlertSignOut alertVisible={alertVisible} />
      </>
    )
  );
};

export default Tabs;
