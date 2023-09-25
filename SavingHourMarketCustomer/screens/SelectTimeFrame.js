/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */

import React from 'react';
import {View, TouchableOpacity, Image, Text} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {icons} from '../constants';
import {COLORS} from '../constants/theme';

const SelectTimeFrame = ({navigation}) => {
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
          Select time frame
        </Text>
      </View>
      <View style={{backgroundColor: 'white', padding: 20}}>
        <Text
          style={{
            fontSize: 20,
            color: 'black',
            fontFamily: 'Roboto',
            fontWeight: 'bold',
            marginBottom: 20,
          }}>
          Time frames
        </Text>
        {/* Time Frames */}
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Payment');
          }}
          style={{
            paddingVertical: 15,
            borderTopColor: '#decbcb',
            borderTopWidth: 0.75,
            borderBottomColor: '#decbcb',
            borderBottomWidth: 0.75,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 15,
              flex: 1,
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontSize: 17,
                color: 'black',
                fontFamily: 'Roboto',
              }}>
              07:00 PM to 09:00 PM
            </Text>
            <Text
              style={{
                fontSize: 17,
                color: 'black',
                fontFamily: 'Roboto',
              }}>
              Everyday
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Payment');
          }}
          style={{
            paddingVertical: 15,
            borderTopColor: '#decbcb',
            borderTopWidth: 0.75,
            borderBottomColor: '#decbcb',
            borderBottomWidth: 0.75,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 15,
              flex: 1,
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontSize: 17,
                color: 'black',
                fontFamily: 'Roboto',
              }}>
              07:00 PM to 09:00 PM
            </Text>
            <Text
              style={{
                fontSize: 17,
                color: 'black',
                fontFamily: 'Roboto',
              }}>
              Everyday
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Payment');
          }}
          style={{
            paddingVertical: 15,
            borderTopColor: '#decbcb',
            borderTopWidth: 0.75,
            borderBottomColor: '#decbcb',
            borderBottomWidth: 0.75,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 15,
              flex: 1,
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontSize: 17,
                color: 'black',
                fontFamily: 'Roboto',
              }}>
              07:00 PM to 09:00 PM
            </Text>
            <Text
              style={{
                fontSize: 17,
                color: 'black',
                fontFamily: 'Roboto',
              }}>
              Everyday
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SelectTimeFrame;
