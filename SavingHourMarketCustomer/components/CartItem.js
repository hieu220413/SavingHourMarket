/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */

import React, {useState} from 'react';
import {Image, Text, View, Pressable} from 'react-native';
import CheckBox from 'react-native-check-box';
import {COLORS} from '../constants/theme';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {icons} from '../constants';

const CartItem = ({item}) => {
  const [isChecked, setIsChecked] = useState(false);
  return (
    <Pressable>
      <View
        style={{
          backgroundColor: 'white',
          alignItems: 'center',
          flexDirection: 'row',
          marginVertical: '2%',
          paddingHorizontal: 10,
          paddingVertical: 20,
          gap: 10,
        }}>
        <CheckBox
          uncheckedCheckBoxColor="#000000"
          checkedCheckBoxColor={COLORS.primary}
          style={{flex: 0.5}}
          onClick={() => {
            setIsChecked(!isChecked);
          }}
          isChecked={isChecked}
        />
        <Image
          resizeMode="contain"
          style={{flex: 3, width: '100%', height: '100%', borderRadius: 10}}
          source={{
            uri: item.img,
          }}
        />
        <View style={{flex: 4, alignItems: 'start', gap: 5, marginLeft: 10}}>
          <Text
            style={{
              fontSize: 23,
              color: 'black',
              fontFamily: 'Roboto',
              fontWeight: 'bold',
            }}>
            {item.name}{' '}
          </Text>
          <Text
            style={{
              fontSize: 18,
              color: 'black',
              fontFamily: 'Roboto',
              backgroundColor: '#7ae19c',
              alignSelf: 'flex-start',
              paddingVertical: 5,
              paddingHorizontal: 10,
              borderRadius: 5,
            }}>
            {item.category}
          </Text>
          <Text
            style={{
              fontSize: 20,
              color: 'red',
              fontFamily: 'Roboto',
              fontWeight: 'bold',
            }}>
            {item.price}
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
            <TouchableOpacity
              style={{backgroundColor: '#F5F5F5', borderRadius: 5, padding: 5}}>
              <Image
                resizeMode="contain"
                style={{height: 20, width: 20}}
                source={icons.minus}
              />
            </TouchableOpacity>
            <Text style={{fontSize: 22, color: 'black', fontFamily: 'Roboto'}}>
              {item.quantity}
            </Text>
            <TouchableOpacity
              style={{backgroundColor: '#F5F5F5', borderRadius: 5, padding: 5}}>
              <Image
                resizeMode="contain"
                style={{height: 20, width: 20}}
                source={icons.plus}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default CartItem;
