/* eslint-disable prettier/prettier */
import React, {useEffect, useState, useCallback} from 'react';
import {View, Dimensions} from 'react-native';
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
// import Batching from '../screens/deliveryManager/Batching';
import OrderGroupForOrderStaff from '../screens/orderStaff/OrderGroup';
import OrderListForManager from '../screens/deliveryManager/OrderListForManager';
import ReportForManager from '../screens/deliveryManager/ReportForManager';
import HistoryList from '../screens/deliveryStaff/HistoryList';
import auth from '@react-native-firebase/auth';
import ModalAlertSignOut from '../components/ModalAlertSignOut';

const Tab = createBottomTabNavigator();

const Tabs = ({navigation}) => {
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
              routes: [{name: 'Login'}],
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
              routes: [{name: 'Login'}],
            });
            return;
          });
        }, 3000);
      } else {
        console.log('user is not logged in');
        await AsyncStorage.removeItem('userInfo').then(() => {
          navigation.reset({
            index: 0,
            routes: [{name: 'Login'}],
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
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              elevation: 10,
              backgroundColor: COLORS.tabBackground,
              opacity: 0.95,
              borderTopColor: 'transparent',
              height: '10%',
            },
            
          }}>
          {user?.role === 'STAFF_ORD' && (
            <>
              <Tab.Screen
                name="Report"
                component={Report}
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
                name="OrderGroupForOrderStaff"
                component={OrderGroupForOrderStaff}
                options={{
                  tabBarIcon: ({focused}) => (
                    <TabIcon
                      display={'Nhóm Đơn'}
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
                name="OrderGroup"
                component={OrderGroup}
                options={{
                  tabBarIcon: ({focused}) => (
                    <TabIcon
                      display={'Điểm giao hàng'}
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
                      display={'Giao tận nhà'}
                      focused={focused}
                      icon={icons.homedelivery}
                    />
                  ),
                }}
              />
              <Tab.Screen
                name="OrderListForManager"
                component={OrderListForManager}
                options={{
                  tabBarIcon: ({focused}) => (
                    <TabIcon
                      display={'Chưa gom'}
                      focused={focused}
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
                name="QrCodeScanner"
                component={QrCodeScanner}
                options={{
                  tabBarIcon: ({focused}) => (
                    <TabIcon
                      display={'Quét QR'}
                      focused={focused}
                      icon={icons.qrCodeScanner}
                    />
                  ),
                }}
              />
              <Tab.Screen
                name="HistoryList"
                component={HistoryList}
                options={{
                  tabBarIcon: ({focused}) => (
                    <TabIcon
                      display={'Lịch sử'}
                      focused={focused}
                      icon={icons.historyList}
                    />
                  ),
                }}
              />
            </>
          )}
        </Tab.Navigator>
        <ModalAlertSignOut alertVisible={alertVisible} />
      </>
    )
  );
};

export default Tabs;
