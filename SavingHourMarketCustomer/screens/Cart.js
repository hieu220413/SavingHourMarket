/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */

import React, {useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {icons} from '../constants';
import {COLORS} from '../constants/theme';
import CartItem from '../components/CartItem';
import CheckBox from 'react-native-check-box';
import {SwipeListView} from 'react-native-swipe-list-view';

const Cart = ({navigation}) => {
  const [isChecked, setIsChecked] = useState(false);

  const [cartItems, setcartItems] = useState([
    {
      id: 0,
      name: 'Chuối to chín vàng',
      category: 'Fruit',
      price: '30.000 VNĐ',
      quantity: 1,
      img: 'https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2022/11/23/a-va-dai-thao-duong-co-an-duoc-chuoi-16691977534161220101928.jpg',
    },
    {
      id: 1,
      name: 'Táo to chín vàng',
      category: 'Fruit',
      price: '35.000 VNĐ',
      quantity: 1,
      img: 'https://tfruit.com.vn/wp-content/uploads/2021/07/tao-xanh-my.jpg',
    },
    {
      id: 2,
      name: 'Nho to chín vàng',
      category: 'Fruit',
      price: '20.000 VNĐ',
      quantity: 1,
      img: 'data:image/jpeg;base64,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',
    },
    {
      id: 3,
      name: 'Thịt to chín vàng',
      category: 'Meat',
      price: '40.000 VNĐ',
      quantity: 1,
      img: 'https://cdn.tgdd.vn/2021/05/CookProduct/0-1200x676-2.jpg',
    },
  ]);

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = (rowMap, rowKey) => {
    closeRow(rowMap, rowKey);
    setcartItems(cartItems.filter(item => item.id !== rowKey));
  };

  return (
    <>
      <View
        style={{
          marginBottom: 80,
        }}>
        <SwipeListView
          data={cartItems}
          renderItem={(data, rowMap) => <CartItem item={data.item} />}
          ListHeaderComponent={
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                flexDirection: 'row',
                gap: 20,
                marginBottom: 20,
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
                Cart
              </Text>
            </View>
          }
          renderHiddenItem={(data, rowMap) => (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                height: '91%',
                marginVertical: '2%',
              }}>
              <View></View>
              <TouchableOpacity
                style={{
                  width: 120,
                  height: '100%',
                  backgroundColor: 'red',
                  // flex: 1,

                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => {
                  deleteRow(rowMap, data.item.id);
                }}>
                <View>
                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: 'Roboto',
                      color: 'white',
                    }}>
                    Delete
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
          leftOpenValue={0}
          rightOpenValue={-120}
        />
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'white',
          borderTopColor: 'transparent',
          height: 80,
          width: '100%',
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: 20,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}>
          <CheckBox
            uncheckedCheckBoxColor="#000000"
            checkedCheckBoxColor={COLORS.primary}
            onClick={() => {
              setIsChecked(!isChecked);
            }}
            isChecked={isChecked}
          />
          <Text
            style={{
              fontSize: 18,
              color: 'black',
              fontFamily: 'Roboto',
            }}>
            All
          </Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{fontSize: 18, color: 'black', fontFamily: 'Roboto'}}>
            Total:{' '}
          </Text>
          <Text
            style={{
              fontSize: 18,
              color: 'red',
              fontFamily: 'Roboto',
              fontWeight: 'bold',
            }}>
            1.300.000 VNĐ
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Payment');
          }}
          style={{
            height: '100%',
            width: '30%',
            backgroundColor: COLORS.primary,
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: 20,
              fontFamily: 'Roboto',
              fontWeight: 'bold',
            }}>
            Order
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default Cart;
