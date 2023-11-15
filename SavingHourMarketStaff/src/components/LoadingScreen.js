/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import * as Progress from 'react-native-progress';
import {COLORS} from '../constants/theme';

const LoadingScreen = () => {
  return (
    <View
      style={[
        StyleSheet.absoluteFillObject,
        {
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.3)',
          zIndex:999
        },
      ]}>
      <Progress.CircleSnail
        strokeCap="butt"
        fill="transparent"
        size={80}
        color={COLORS.secondary}
        thickness={4}
      />
    </View>
  );
};

export default LoadingScreen;
