/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */

import React from 'react';
import {View, TouchableOpacity, Image, Text} from 'react-native';
import {icons} from '../constants';
import {COLORS} from '../constants/theme';
import {ScrollView} from 'react-native-gesture-handler';

const SelectPaymentMethod = ({navigation, route}) => {
  return (
    <ScrollView>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          flexDirection: 'row',
          gap: 20,
          marginBottom: 30,
          backgroundColor: '#ffffff',
          padding: 20,
          elevation: 4,
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={icons.leftArrow}
            resizeMode="contain"
            style={{width: 35, height: 35, tintColor: COLORS.primary}}
          />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 30,
            textAlign: 'center',
            color: '#000000',
            fontWeight: 'bold',
            fontFamily: 'Roboto',
          }}>
          Payment Method
        </Text>
      </View>
      <View style={{backgroundColor: 'white', padding: 20}}>
        {/* Payment method */}
        <TouchableOpacity
          onPress={() => {
            route.params.setPaymentMethod({id: 0, display: 'COD'});
            navigation.navigate('Payment');
          }}
          style={{
            paddingBottom: 15,
            borderBottomColor: '#decbcb',
            borderBottomWidth: 0.75,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 15,
              flex: 1,
            }}>
            <Image
              resizeMode="contain"
              style={{width: 30, height: 30}}
              source={icons.cash}
            />
            <Text
              style={{
                fontSize: 20,
                color: 'black',
                fontFamily: 'Roboto',
              }}>
              Cost On Delivery
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            route.params.setPaymentMethod({id: 1, display: 'VN Pay'});
            navigation.navigate('Payment');
          }}
          style={{
            paddingTop: 15,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 15,
              flex: 1,
            }}>
            <Image
              resizeMode="contain"
              style={{width: 30, height: 30}}
              source={icons.creditCard}
            />
            <Text
              style={{
                fontSize: 20,
                color: 'black',
                fontFamily: 'Roboto',
              }}>
              VN Pay
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SelectPaymentMethod;
