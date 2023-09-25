import {View, Text, Image} from 'react-native';
import React from 'react';
import {icons} from '../constants';
import {COLORS} from '../constants/theme';

const Header = () => {
  return (
    <View
      style={{
        flexDirection: 'row',
        paddingLeft: '4%',
        paddingRight: '4%',
        paddingBottom: '2%',
        backgroundColor: COLORS.secondary,
      }}>
      <Image
        source={icons.logo}
        resizeMode="contain"
        style={{
          width: 35,
          height: 35,
          marginRight: '2%',
          marginTop: '2%',
          borderRadius: 10,
          justifyContent: 'center',
          tintColor: 'black',
        }}></Image>
      <Text
        style={{
          fontSize: 20,
          fontWeight: 600,
          paddingTop: '3%',
          color: 'black',
        }}>
        Saving Hour Market
      </Text>
    </View>
  );
};

export default Header;
