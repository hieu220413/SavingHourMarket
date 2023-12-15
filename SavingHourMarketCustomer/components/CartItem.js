/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */

import React, { useState } from 'react';
import { Image, Text, View, Pressable } from 'react-native';
import CheckBox from 'react-native-check-box';
import { COLORS } from '../constants/theme';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { icons } from '../constants';
import { format } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartItem = ({ item, cartItems, setcartItems, navigation, pickupPoint }) => {
  const handleAddQuantity = async () => {
    const newCart = cartItems.map(data => {
      if (data.idList[0] === item.idList[0]) {
        return { ...data, cartQuantity: data.cartQuantity + 1 };
      }
      return data;
    });
    setcartItems(newCart);
    try {
      await AsyncStorage.setItem(
        'CartList' + pickupPoint.id,
        JSON.stringify(newCart),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const itemIndex = cartItems.findIndex(i => i.idList[0] === item.idList[0]);

  const handleRemoveQuantity = async () => {
    const newCart = cartItems.map(data => {
      if (data.idList[0] === item.idList[0]) {
        if (data.cartQuantity === 1) {
          return data;
        }
        return { ...data, cartQuantity: data.cartQuantity - 1 };
      }
      return data;
    });
    setcartItems(newCart);
    try {
      await AsyncStorage.setItem(
        'CartList' + pickupPoint.id,
        JSON.stringify(newCart),
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View
      key={item.idList[0]}
      style={{
        backgroundColor: 'white',

        paddingHorizontal: '5%',
        marginVertical:'1%',
        marginHorizontal:'1%',
        borderRadius:10,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 1.5,
        
      }}>
      <View
        style={[
          {
            paddingBottom: '3%',
            paddingTop: '2%'
          },
          // itemIndex !== 0 && {
          //   borderTopColor: '#decbcb',
          //   borderTopWidth: 1,
          // },
        ]}>
        <Pressable
          onPress={() => {
            navigation.navigate('ProductDetails', { product: item });
          }}
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            paddingHorizontal: '1%',
            gap: 10,
          }}>
          <CheckBox
            uncheckedCheckBoxColor="#000000"
            checkedCheckBoxColor={COLORS.primary}
            style={{ flex: 0.5}}
            onClick={async () => {
              const newCart = cartItems.map(data => {
                if (data.idList[0] === item.idList[0]) {
                  return { ...data, isChecked: !data.isChecked };
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
            style={{ flex: 2, width: '80%', height: 110, borderRadius: 10, marginTop: '2%' }}
            source={{
              uri: item.imageUrlImageList[0].imageUrl,
            }}
          />

          <View style={{ flex: 4, alignItems: 'start', gap: 5, marginLeft: 10 }}>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 18,
                color: 'black',
                fontFamily: 'Roboto',
                fontWeight: 'bold',
              }}>
              {item.name}{' '}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: COLORS.primary,

                fontFamily: 'Roboto',
                backgroundColor: 'white',
                alignSelf: 'flex-start',
                paddingVertical: 2,
                paddingHorizontal: 17,
                marginVertical:1,
                borderRadius: 15,
                borderColor: COLORS.primary,
                borderWidth: 1.5,
                fontWeight: 700,
              }}>
              {item.productSubCategory.productCategory.name}
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: 'black',
                fontFamily: 'Roboto',
                fontWeight: 'bold',
              }}>
              HSD:{format(new Date(item.expiredDate), 'dd/MM/yyyy')}
            </Text>

          </View>
        </Pressable>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 4 }} />
          <View style={{ flex: 5.2, flexDirection: 'row' }} >
            <Text
              style={{
                fontSize: 16,
                color: COLORS.primary,
                fontFamily: 'Roboto',
                fontWeight: 'bold',
                flex: 5,
                justifyContent: 'flex-start'
              }}>
              {item.price.toLocaleString('vi-VN', {
                style: 'currency',
                currency: 'VND',
              })}
            </Text>
            <View
              style={{
                flex: 5,
                justifyContent: 'flex-end',
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
                  style={{ height: 15, width: 15 }}
                  source={icons.minus}
                />
              </TouchableOpacity>
              <Text style={{ fontSize: 14, color: 'black', fontFamily: 'Roboto' }}>
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
                  style={{ height: 15, width: 15 }}
                  source={icons.plus}
                />
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </View>
    </View>
  );
};

export default CartItem;
