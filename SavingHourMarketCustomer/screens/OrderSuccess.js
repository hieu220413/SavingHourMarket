import React, {useCallback, useState} from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
} from 'react-native';
import {icons} from '../constants';
import {COLORS} from '../constants/theme';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OrderSuccess = ({navigation}) => {
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
    <View
      style={{
        marginBottom: 10,
        backgroundColor: '#ffffff',
      }}>
      <ImageBackground
        resizeMode="cover"
        source={{
          uri: 'https://photomedia.in/wp-content/uploads/2023/05/abstract-background-green-1-scaled.jpg',
        }}
        style={{padding: 15}}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}>
          <TouchableOpacity onPress={() => navigation.navigate('Orders')}>
            <Image
              source={icons.leftArrow}
              resizeMode="contain"
              style={{width: 35, height: 35, tintColor: 'white'}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Cart');
            }}>
            <Image
              resizeMode="contain"
              style={{
                height: 40,
                tintColor: 'white',
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
        <View style={{alignItems: 'center', justifyContent: 'center', gap: 15}}>
          <Text
            style={{
              fontSize: 22,
              color: 'white',
              fontFamily: 'Roboto',
              fontWeight: 'bold',
            }}>
            Đặt hàng thành công
          </Text>
          <Text
            style={{
              fontSize: 18,
              color: 'white',
              fontFamily: 'Roboto',
              textAlign: 'center',
            }}>
            Cùng SVH bảo vệ quyền lợi của bạn - Hãy bật thông báo để nhận thông
            tin mới nhất về trạng thái đơn hàng
          </Text>
        </View>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: 15,
            marginTop: 30,
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Home');
            }}
            style={{
              borderColor: 'white',
              borderWidth: 1,
              width: '45%',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 5,
              paddingVertical: 10,
            }}>
            <Text style={{fontSize: 18, fontFamily: 'Roboto', color: 'white'}}>
              Trang chủ
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('OrderDetail');
            }}
            style={{
              borderColor: 'white',
              borderWidth: 1,
              width: '45%',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 5,
              paddingVertical: 10,
            }}>
            <Text style={{fontSize: 18, fontFamily: 'Roboto', color: 'white'}}>
              Đơn hàng
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

export default OrderSuccess;
