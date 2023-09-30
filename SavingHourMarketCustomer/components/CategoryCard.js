/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';
import { icons } from '../constants';

const CategoryCard = ({ title }) => {

  const handleSelectCategory = () => {
    console.log('select cate:' + title);
  };
  return (
    <TouchableOpacity

      onPress={handleSelectCategory}
      style={{
        marginRight: 5,
      }}>
      <Text
        style={{
          padding: 5,
          fontSize: 20,
          fontFamily: FONTS.fontFamily,
          borderRadius: 20,
          textAlign: 'center',
        }}
      >{title}</Text>
    </TouchableOpacity>
  );
};


export default CategoryCard;
