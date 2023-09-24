/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */

import React from 'react';
import {View, Image, Text} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {icons} from '../constants';
import {COLORS} from '../constants/theme';

const SelectPickupPoint = ({navigation}) => {
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
          Select pickup point
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
          Suggest by your current location
        </Text>
        {/* Suggest Pickup point */}
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
            }}>
            <Image
              resizeMode="contain"
              style={{width: 25, height: 25}}
              source={icons.location}
            />
            <Text
              style={{
                fontSize: 17,
                color: 'black',
                fontFamily: 'Roboto',
                flex: 0.9,
              }}>
              121 Tran Van Du , Phường 13, Quận Tân Bình, TP HCM
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
            }}>
            <Image
              resizeMode="contain"
              style={{width: 25, height: 25}}
              source={icons.location}
            />
            <Text
              style={{
                fontSize: 17,
                color: 'black',
                fontFamily: 'Roboto',
                flex: 0.9,
              }}>
              121 Tran Van Du , Phường 13, Quận Tân Bình, TP HCM
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
            }}>
            <Image
              resizeMode="contain"
              style={{width: 25, height: 25}}
              source={icons.location}
            />
            <Text
              style={{
                fontSize: 17,
                color: 'black',
                fontFamily: 'Roboto',
                flex: 0.9,
              }}>
              121 Tran Van Du , Phường 13, Quận Tân Bình, TP HCM
            </Text>
          </View>
        </TouchableOpacity>
        {/* ******* */}
        <Text
          style={{
            fontSize: 20,
            color: 'black',
            fontFamily: 'Roboto',
            fontWeight: 'bold',
            marginBottom: 20,
            marginTop: 20,
          }}>
          Order pickup point
        </Text>
        {/* Order pickup point */}
        <TouchableOpacity
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
            }}>
            <Image
              resizeMode="contain"
              style={{width: 25, height: 25}}
              source={icons.location}
            />
            <Text
              style={{
                fontSize: 17,
                color: 'black',
                fontFamily: 'Roboto',
                flex: 0.9,
              }}>
              121 Tran Van Du , Phường 13, Quận Tân Bình, TP HCM
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
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
            }}>
            <Image
              resizeMode="contain"
              style={{width: 25, height: 25}}
              source={icons.location}
            />
            <Text
              style={{
                fontSize: 17,
                color: 'black',
                fontFamily: 'Roboto',
                flex: 0.9,
              }}>
              121 Tran Van Du , Phường 13, Quận Tân Bình, TP HCM
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
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
            }}>
            <Image
              resizeMode="contain"
              style={{width: 25, height: 25}}
              source={icons.location}
            />
            <Text
              style={{
                fontSize: 17,
                color: 'black',
                fontFamily: 'Roboto',
                flex: 0.9,
              }}>
              121 Tran Van Du , Phường 13, Quận Tân Bình, TP HCM
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
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
            }}>
            <Image
              resizeMode="contain"
              style={{width: 25, height: 25}}
              source={icons.location}
            />
            <Text
              style={{
                fontSize: 17,
                color: 'black',
                fontFamily: 'Roboto',
                flex: 0.9,
              }}>
              121 Tran Van Du , Phường 13, Quận Tân Bình, TP HCM
            </Text>
          </View>
        </TouchableOpacity>

        {/* *************************** */}
      </View>
    </ScrollView>
  );
};

export default SelectPickupPoint;
