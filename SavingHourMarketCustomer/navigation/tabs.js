/* eslint-disable prettier/prettier */
import React from 'react';
import {View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import TabIcon from '../components/TabIcon';
import Home from '../screens/Home';

import {icons} from '../constants';
import {COLORS} from '../constants/theme';
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
          tabBarIcon: ({focused}) => (
            <TabIcon display={'Home'} focused={focused} icon={icons.home} />
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
          tabBarIcon: ({focused}) => (
            <TabIcon display={'D&P'} focused={focused} icon={icons.discount} />
          ),
        }}
      />
      <Tab.Screen
        name="Orders"
        component={Orders}
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon display={'Orders'} focused={focused} icon={icons.order} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon display={'Profile'} focused={focused} icon={icons.user} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Tabs;
