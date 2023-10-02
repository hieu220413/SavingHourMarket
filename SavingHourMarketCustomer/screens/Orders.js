/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useCallback} from 'react';
import {View, Image, Text} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {icons} from '../constants';
import {COLORS} from '../constants/theme';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Orders = ({navigation}) => {
  const orderStatus = [
    {display: 'Chờ xác nhận'},
    {display: 'Đóng gói'},
    {display: 'Giao hàng'},
    {display: 'Đã giao'},
    {display: 'Đơn thất bại'},
    {display: 'Đã hủy'},
  ];
  const [currentStatus, setCurrentStatus] = useState('Chờ xác nhận');
  const [cartList, setCartList] = useState([]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const cartList = await AsyncStorage.getItem('CartList');
          setCartList(cartList ? JSON.parse(cartList) : []);
        } catch (err) {
          console.log(err);
        }
      })();
    }, []),
  );
  return (
    <>
      <View
        style={{
          paddingHorizontal: 15,
          paddingTop: 15,
          backgroundColor: 'white',
        }}>
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 30,
            backgroundColor: '#ffffff',
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
            Đơn hàng
          </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Cart');
            }}>
            <Image
              resizeMode="contain"
              style={{
                height: 40,
                tintColor: COLORS.primary,
                width: 35,
              }}
              source={icons.cart}
            />
            {cartList.lenght !== 0 && (
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  right: -10,
                  backgroundColor: COLORS.primary,
                  borderRadius: 50,
                  width: 20,
                  height: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{fontSize: 12, color: 'white', fontFamily: 'Roboto'}}>
                  {cartList.length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <ScrollView
          contentContainerStyle={{}}
          horizontal
          showsHorizontalScrollIndicator={false}>
          {orderStatus.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setCurrentStatus(item.display);
              }}>
              <View
                style={[
                  {
                    paddingHorizontal: 15,
                    paddingBottom: 15,
                  },
                  currentStatus === item.display && {
                    borderBottomColor: COLORS.primary,
                    borderBottomWidth: 2,
                  },
                ]}>
                <Text
                  style={{
                    fontFamily: 'Roboto',
                    fontSize: 16,
                    color:
                      currentStatus === item.display ? COLORS.primary : 'black',
                  }}>
                  {item.display}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <ScrollView contentContainerStyle={{marginTop: 20}}>
        <View style={{marginBottom: 100}}>
          {/* Order list */}

          <View style={{backgroundColor: 'white', marginBottom: 20}}>
            {/* Order detail */}
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('OrderDetail');
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 20,
                }}>
                <View style={{flexDirection: 'column', gap: 8}}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      fontFamily: 'Roboto',
                      color: COLORS.primary,
                    }}>
                    {currentStatus}
                  </Text>
                  <Text
                    style={{
                      fontSize: 17,
                      fontWeight: 'bold',
                      fontFamily: 'Roboto',
                      color: 'black',
                    }}>
                    Ngày đặt : 03-05-2023
                  </Text>
                  <Text
                    style={{
                      fontSize: 17,
                      fontWeight: 'bold',
                      fontFamily: 'Roboto',
                      color: 'black',
                    }}>
                    Ngày giao : 05-05-2023
                  </Text>
                  <Text
                    style={{
                      fontSize: 17,
                      fontWeight: 'bold',
                      fontFamily: 'Roboto',
                      color: 'black',
                    }}>
                    Tổng tiền: 130.000 VNĐ
                  </Text>
                  <Text
                    style={{
                      fontSize: 17,
                      fontWeight: 'bold',
                      fontFamily: 'Roboto',
                      color: 'black',
                    }}>
                    Phương thức thanh toán: COD
                  </Text>
                </View>
                <Image
                  resizeMode="contain"
                  style={{width: 30, height: 30, tintColor: COLORS.primary}}
                  source={icons.rightArrow}
                />
              </View>
            </TouchableOpacity>
            {/* *********************** */}

            {/* Order again */}
            <TouchableOpacity>
              <View
                style={{
                  borderTopColor: '#decbcb',
                  borderTopWidth: 1,
                  paddingVertical: 15,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    color: COLORS.primary,
                    fontFamily: 'Roboto',
                  }}>
                  Đặt lại
                </Text>
              </View>
            </TouchableOpacity>

            {/* ******************** */}
          </View>

          {/* ************************ */}
        </View>
      </ScrollView>
    </>
  );
};

export default Orders;
