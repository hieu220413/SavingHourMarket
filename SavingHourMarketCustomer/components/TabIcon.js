/* eslint-disable prettier/prettier */
import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import {COLORS, FONTS} from '../constants/theme';

const TabIcon = ({focused, icon, display}) => {
  return (
    <View
      style={{
        alignItems: 'center',
        height: 80,
        width: 80,
        justifyContent: 'center',
        gap: 5,
      }}>
      <Image
        source={icon}
        resizeMode="contain"
        style={{
          width: 30,
          height: 30,
          tintColor: focused ? COLORS.secondary : COLORS.tabIcon,
        }}
      />
      <Text
        style={{
          fontSize: 15,
          color: focused ? COLORS.secondary : COLORS.tabIcon,
          fontWeight: 400,
          fontFamily: FONTS.fontFamily,
        }}>
        {display}
      </Text>

      {/* {focused && (
        <View
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            right: 0,
            height: 5,
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
            backgroundColor: COLORS.darkGreen,
          }}
        />
      )} */}
    </View>
  );
};

export default TabIcon;

const styles = StyleSheet.create({});
