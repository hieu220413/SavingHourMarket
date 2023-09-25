/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';
import { icons } from '../constants';

const CategoryCard = ({ imgUrl, title }) => {
  return (
    <TouchableOpacity style={{
      marginRight: 10,
    }}>
      <Image source={{
        uri: imgUrl,
      }}
        style={{
          height: 100,
          width: 100,
          borderRadius: 10,
        }}
      />
      <Text
        style={{
          // top: '-20%',
          // color: 'white',
          // backgroundColor: COLORS.secondary,
          padding: 5,
          fontSize: 18,
          fontFamily: FONTS.fontFamily,
          borderRadius: 20,
          textAlign: 'center',
        }}
      >{title}</Text>
    </TouchableOpacity>
  );
};


export default CategoryCard;
