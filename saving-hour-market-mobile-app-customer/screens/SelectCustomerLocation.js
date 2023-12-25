/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useCallback} from 'react';
import {View, Image, Text} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {icons} from '../constants';
import {COLORS} from '../constants/theme';
import {useFocusEffect} from '@react-navigation/native';
import database from '@react-native-firebase/database';

const SelectCustomerLocation = ({navigation, route}) => {
  const {setCustomerLocation, customerLocation} = route.params;
  // system status check
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
          Customer location
        </Text>
      </View>
      <View style={{backgroundColor: 'white', marginTop: 20}}>
        {/* Manage customer location */}

        <TouchableOpacity
          style={{borderBottomColor: '#decbcb', borderBottomWidth: 0.75}}
          onPress={() => {
            navigation.navigate('Payment');
          }}>
          <View
            style={{
              padding: 20,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 20,
            }}>
            <View
              style={{
                flexDirection: 'row',
                gap: 10,
                alignItems: 'center',
                flex: 7,
              }}>
              <View>
                {/* <Text
                    style={{
                      fontSize: 18,
                      fontFamily: 'Roboto',
                      color: 'black',
                    }}>
                  </Text> */}
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: 'Roboto',
                    color: 'black',
                  }}>
                  Số 121, Trần Văn Dư Phường 13, Quận Tân Bình, TP.HCM
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Edit customer location', {
                  setCustomerLocation,
                  customerLocation,
                });
              }}
              style={{flex: 3}}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'Roboto',
                  color: COLORS.primary,
                }}>
                Sửa
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* Add Button */}
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            paddingVertical: 15,
          }}>
          <Text
            style={{fontSize: 20, fontFamily: 'Roboto', color: COLORS.primary}}>
            Hoàn tất
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SelectCustomerLocation;
