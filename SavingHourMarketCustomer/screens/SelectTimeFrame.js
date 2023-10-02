/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */

import React, {useCallback, useState} from 'react';
import {View, TouchableOpacity, Image, Text} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {icons} from '../constants';
import {COLORS} from '../constants/theme';
import {useFocusEffect} from '@react-navigation/native';
import {API} from '../constants/api';

const SelectTimeFrame = ({navigation, route}) => {
  const [timeFrameList, setTimeFrameList] = useState([]);

  useFocusEffect(
    useCallback(() => {
      fetch(`${API.baseURL}/api/timeframe/getAll`)
        .then(res => res.json())
        .then(response => {
          setTimeFrameList(response);
        })
        .catch(err => console.log(err));
    }, []),
  );
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
        {timeFrameList.map(item => (
          <TouchableOpacity
            key={item.id}
            onPress={() => {
              route.params.setTimeFrame(item);
              navigation.navigate('Payment');
            }}
            style={{
              paddingVertical: 15,
              borderTopColor: '#decbcb',
              borderTopWidth: 0.75,
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
                {item.fromHour.slice(0, 5)} đến {item.toHour.slice(0, 5)}
              </Text>
              <Text
                style={{
                  fontSize: 17,
                  color: 'black',
                  fontFamily: 'Roboto',
                }}>
                {item.dayOfWeek === 0 && 'Mỗi ngày'}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default SelectTimeFrame;
