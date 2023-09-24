/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Image, Text} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {icons} from '../constants';
import {COLORS} from '../constants/theme';

const SelectVoucher = ({navigation}) => {
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
          Select voucher
        </Text>
      </View>

      {/* Voucher item */}
      <View>
        <View
          style={{
            backgroundColor: 'white',
            alignItems: 'center',
            flexDirection: 'row',
            marginVertical: '2%',
            paddingHorizontal: 10,
            paddingVertical: 20,
            justifyContent: 'space-between',
          }}>
          <View style={{flex: 4, alignItems: 'start', gap: 5, marginLeft: 10}}>
            <Text
              style={{
                fontSize: 23,
                color: 'black',
                fontFamily: 'Roboto',
                fontWeight: 'bold',
              }}>
              Free Ship Extra
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
              -50%
            </Text>
            <Text
              style={{
                fontSize: 18,
                color: 'black',
                fontFamily: 'Roboto',
              }}>
              Spent:50.000 VNĐ
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Roboto',
                fontWeight: 'bold',
              }}>
              Exp Date: 30-09-2023
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Payment');
            }}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: COLORS.secondary,
              borderRadius: 5,
              padding: 15,
            }}>
            <Text style={{fontSize: 18, fontFamily: 'Roboto', color: 'black'}}>
              Select
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <View
          style={{
            backgroundColor: 'white',
            alignItems: 'center',
            flexDirection: 'row',
            marginVertical: '2%',
            paddingHorizontal: 10,
            paddingVertical: 20,
            justifyContent: 'space-between',
          }}>
          <View style={{flex: 4, alignItems: 'start', gap: 5, marginLeft: 10}}>
            <Text
              style={{
                fontSize: 23,
                color: 'black',
                fontFamily: 'Roboto',
                fontWeight: 'bold',
              }}>
              Free Ship Extra
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
              -50%
            </Text>
            <Text
              style={{
                fontSize: 18,
                color: 'black',
                fontFamily: 'Roboto',
              }}>
              Spent:50.000 VNĐ
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Roboto',
                fontWeight: 'bold',
              }}>
              Exp Date: 30-09-2023
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Payment');
            }}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: COLORS.secondary,
              borderRadius: 5,
              padding: 15,
            }}>
            <Text style={{fontSize: 18, fontFamily: 'Roboto', color: 'black'}}>
              Select
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <View
          style={{
            backgroundColor: 'white',
            alignItems: 'center',
            flexDirection: 'row',
            marginVertical: '2%',
            paddingHorizontal: 10,
            paddingVertical: 20,
            justifyContent: 'space-between',
          }}>
          <View style={{flex: 4, alignItems: 'start', gap: 5, marginLeft: 10}}>
            <Text
              style={{
                fontSize: 23,
                color: 'black',
                fontFamily: 'Roboto',
                fontWeight: 'bold',
              }}>
              Free Ship Extra
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
              -50%
            </Text>
            <Text
              style={{
                fontSize: 18,
                color: 'black',
                fontFamily: 'Roboto',
              }}>
              Spent:50.000 VNĐ
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Roboto',
                fontWeight: 'bold',
              }}>
              Exp Date: 30-09-2023
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Payment');
            }}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: COLORS.secondary,
              borderRadius: 5,
              padding: 15,
            }}>
            <Text style={{fontSize: 18, fontFamily: 'Roboto', color: 'black'}}>
              Select
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* ******************** */}
    </ScrollView>
  );
};

export default SelectVoucher;
