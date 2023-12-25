/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */

import React, {useCallback, useState} from 'react';
import {View, TouchableOpacity, Image, Text} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {icons} from '../constants';
import {COLORS} from '../constants/theme';
import {useFocusEffect} from '@react-navigation/native';
import {API} from '../constants/api';
import LoadingScreen from '../components/LoadingScreen';
import database from '@react-native-firebase/database';

const SelectTimeFrame = ({navigation, route}) => {
  const [timeFrameList, setTimeFrameList] = useState([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      database().ref(`systemStatus`).off('value');
      database()
        .ref('systemStatus')
        .on('value', async snapshot => {
          if (snapshot.val() === 0) {
            navigation.reset({
              index: 0,
              routes: [{name: 'Initial'}],
            });
          } else {
            // setSystemStatus(snapshot.val());
          }
        });
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      if (route.params.picked == 0) {
        fetch(`${API.baseURL}/api/timeframe/getForPickupPoint`)
          .then(res => res.json())
          .then(response => {
            setTimeFrameList(response);
            setLoading(false);
          })
          .catch(err => {
            console.log(err);
            setLoading(false);
          });
      } else {
        fetch(`${API.baseURL}/api/timeframe/getForHomeDelivery`)
          .then(res => res.json())
          .then(response => {
            setTimeFrameList(response);
            setLoading(false);
          })
          .catch(err => {
            console.log(err);
            setLoading(false);
          });
      }
    }, []),
  );
  return (
    <>
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
              fontSize: 25,
              textAlign: 'center',
              color: '#000000',
              fontWeight: 'bold',
              fontFamily: 'Roboto',
            }}>
            Chọn khung giờ
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
            Khung giờ
          </Text>
          {/* Time Frames */}
          {timeFrameList.map(item => (
            <TouchableOpacity
              key={item.id}
              onPress={() => {
                if (route.params.picked == 0) {
                  route.params.setTimeFrame(item);
                } else {
                  route.params.setCustomerTimeFrame(item);
                }

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
      {loading && <LoadingScreen />}
    </>
  );
};

export default SelectTimeFrame;
