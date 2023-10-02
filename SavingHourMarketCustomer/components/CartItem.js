/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */

import React, {useState} from 'react';
import {Image, Text, View, Pressable} from 'react-native';
import CheckBox from 'react-native-check-box';
import {COLORS} from '../constants/theme';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {icons} from '../constants';
import {format} from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartItem = ({item, cartItems, setcartItems, navigation}) => {
  const handleAddQuantity = async () => {
    const newCart = cartItems.map(data => {
      if (data.id === item.id) {
        return {...data, cartQuantity: data.cartQuantity + 1};
      }
      return data;
    });
    setcartItems(newCart);
    try {
      await AsyncStorage.setItem('CartList', JSON.stringify(newCart));
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveQuantity = async () => {
    const newCart = cartItems.map(data => {
      if (data.id === item.id) {
        return {...data, cartQuantity: data.cartQuantity - 1};
      }
      return data;
    });
    setcartItems(newCart);
    try {
      await AsyncStorage.setItem('CartList', JSON.stringify(newCart));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View
      style={{
        backgroundColor: 'white',
        marginVertical: '2%',
        paddingBottom: 20,
      }}>
      <Pressable
        onPress={() => {
          navigation.navigate('ProductDetails', {product: item});
        }}
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          paddingHorizontal: 10,
          paddingTop: 20,
          paddingBottom: 10,
          gap: 10,
        }}>
        <CheckBox
          uncheckedCheckBoxColor="#000000"
          checkedCheckBoxColor={COLORS.primary}
          style={{flex: 0.5}}
          onClick={async () => {
            const newCart = cartItems.map(data => {
              if (data.id === item.id) {
                return {...data, isChecked: !data.isChecked};
              }
              return data;
            });

            setcartItems(newCart);

            try {
              await AsyncStorage.setItem('CartList', JSON.stringify(newCart));
            } catch (error) {
              console.log(error);
            }
          }}
          isChecked={item.isChecked}
        />

        <Image
          resizeMode="contain"
          style={{flex: 3, width: '100%', height: 160, borderRadius: 10}}
          source={{
            uri: item.imageUrl,
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
            {item.productSubCategory.productCategory.name}
          </Text>
          <Text
            style={{
              fontSize: 18,
              color: 'black',
              fontFamily: 'Roboto',
              fontWeight: 'bold',
            }}>
            HSD:{format(new Date(item.expiredDate), 'dd/MM/yyyy')}
          </Text>
          <Text
            style={{
              fontSize: 20,
              color: 'red',
              fontFamily: 'Roboto',
              fontWeight: 'bold',
            }}>
            {item.price.toLocaleString('vi-VN', {
              style: 'currency',
              currency: 'VND',
            })}
          </Text>
        </View>
      </Pressable>
      <View style={{flexDirection: 'row'}}>
        <View style={{flex: 4}} />
        <View
          style={{
            flex: 4,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
          }}>
          <TouchableOpacity
            onPress={() => handleRemoveQuantity()}
            style={{
              backgroundColor: '#F5F5F5',
              borderRadius: 5,
              padding: 5,
            }}>
            <Image
              resizeMode="contain"
              style={{height: 20, width: 20}}
              source={icons.minus}
            />
          </TouchableOpacity>
          <Text style={{fontSize: 22, color: 'black', fontFamily: 'Roboto'}}>
            {item.cartQuantity}
          </Text>
          <TouchableOpacity
            onPress={() => handleAddQuantity()}
            style={{
              backgroundColor: '#F5F5F5',
              borderRadius: 5,
              padding: 5,
            }}>
            <Image
              resizeMode="contain"
              style={{height: 20, width: 20}}
              source={icons.plus}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CartItem;
