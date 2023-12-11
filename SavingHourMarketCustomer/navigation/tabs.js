/* eslint-disable prettier/prettier */
import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabIcon from '../components/TabIcon';
import Home from '../screens/Home';
import { icons } from '../constants';
import { COLORS } from '../constants/theme';
import Discount from '../screens/Discount';
import Orders from '../screens/Orders';
import Cart from '../screens/Cart';
import Profile from '../screens/Profile';

const Tab = createBottomTabNavigator();

const Tabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: '6%',
          position: 'absolute',
          bottom: 3,
          right: 7,
          left: 7,
          borderRadius: 16,
          backgroundColor: COLORS.tabBackground
        },
      }}
    //   tabBarOptions={{
    //     showLabel: true,
    //     style: {
    //       position: "absolute",
    //       bottom: 0,
    //       left: 0,
    //       right: 0,
    //       elevation: 0,
    //       backgroundColor: COLORS.white,
    //       borderTopColor: "transparent",
    //       height: 100,
    //     },
    //   }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarButton: (props) => (
            <TabIcon
              {...props}
              display={'Sản phẩm'}
              icon={icons.products}
            />
          ),
        }}
      />
      {/* <Tab.Screen
        name="Search"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.search} />
          ),
        }}
      /> */}

      <Tab.Screen
        name="Discount"
        component={Discount}
        options={{
          tabBarButton: (props) => (
            <TabIcon
              {...props}
              display={'Giảm giá'}
              icon={icons.discount}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Orders"
        component={Orders}
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
        name="CartBottom"
        component={Cart}
        options={{
          tabBarStyle: { display: 'none' },
          tabBarButton: (props) => (
            <TabIcon
              {...props}
              display={'Giỏ hàng'}
              icon={icons.cart}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarButton: (props) => (
            <TabIcon
              {...props} display={'Tôi'} icon={icons.user} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Tabs;
