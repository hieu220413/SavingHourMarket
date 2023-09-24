/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Image, Text} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {icons} from '../constants';
import {COLORS} from '../constants/theme';

const EditCustomerLocation = ({navigation}) => {
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

        <View
          onPress={() => {
            navigation.navigate('Select customer location');
          }}>
          <View
            style={{
              padding: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View style={{flex: 9}}>
              <View
                style={{
                  flexDirection: 'row',
                  gap: 10,
                  alignItems: 'center',
                }}>
                <View>
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: 'Roboto',
                      color: 'black',
                    }}>
                    Số 121, Trần Văn Dư
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: 'Roboto',
                      color: 'black',
                    }}>
                    Phường 13, Quận Tân Bình, TP.HCM
                  </Text>
                </View>
              </View>
            </View>

            <Image
              resizeMode="contain"
              style={{
                width: 25,
                height: 25,
                flex: 1,
              }}
              source={icons.rightArrow}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default EditCustomerLocation;
