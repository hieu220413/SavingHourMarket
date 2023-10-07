/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import {View, Text, TouchableOpacity, Image, ScrollView} from 'react-native';
import React, {useCallback, useState} from 'react';
import {icons} from '../constants';
import {COLORS, FONTS} from '../constants/theme';
import dayjs from 'dayjs';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductDetails = ({navigation, route}) => {
  const product = route.params.product;
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

  const handleBuy = async () => {
    const item = product;
    const orderItem = [
      {
        id: item.id,
        name: item.name,
        price: item.price,
        priceOriginal: item.priceOriginal,
        expiredDate: Date.parse(item.expiredDate),
        imageUrl: item.imageUrl,
        productCategoryName: item.productSubCategory.productCategory.name,
        productCategoryId: item.productSubCategory.productCategory.id,
        quantity: 1,
      },
    ];
    try {
      await AsyncStorage.setItem('OrderItems', JSON.stringify(orderItem));
      navigation.navigate('Payment');
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToCart = async data => {
    try {
      const jsonValue = await AsyncStorage.getItem('CartList');
      let newCartList = jsonValue ? JSON.parse(jsonValue) : [];
      const itemExisted = newCartList.some(item => item.id === data.id);
      if (itemExisted) {
        const index = newCartList.findIndex(item => item.id === data.id);
        newCartList[index].cartQuantity = newCartList[index].cartQuantity + 1;
        setCartList(newCartList);
        await AsyncStorage.setItem('CartList', JSON.stringify(newCartList));
        return;
      }

      const cartData = {...data, isChecked: false, cartQuantity: 1};
      newCartList = [...newCartList, cartData];
      setCartList(newCartList);
      await AsyncStorage.setItem('CartList', JSON.stringify(newCartList));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View
      style={{
        backgroundColor: '#fff',
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginVertical: 15,
          marginHorizontal: 25,
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
            textAlign: 'center',
            color: 'black',
            fontSize: 24,
            fontFamily: FONTS.fontFamily,
          }}>
          Thông tin sản phẩm
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

      <ScrollView>
        <Image
          style={{
            width: '85%',
            height: 250,
            marginHorizontal: 30,
            borderRadius: 20,
            backgroundColor: 'green',
          }}
          resizeMode="contain"
          source={{
            uri: product.imageUrl,
          }}
        />
        <View
          style={{
            marginHorizontal: 30,
            marginVertical: 20,
          }}>
          <Text
            style={{
              fontFamily: FONTS.fontFamily,
              fontSize: 22,
              fontWeight: 700,
              maxWidth: '95%',
              color: 'black',
            }}>
            {product.name}
          </Text>
          <View
            style={{
              borderBottomColor: '#C8C8C8',
              borderBottomWidth: 1,
              width: '100%',
              paddingVertical: 5,
            }}>
            <Text
              style={{
                fontFamily: FONTS.fontFamily,
                fontSize: 16,
                marginTop: 5,
              }}>
              HSD: {dayjs(product.expiredDate).format('DD/MM/YYYY')}
            </Text>
          </View>

          <Text
            style={{
              fontFamily: FONTS.fontFamily,
              fontSize: 18,
              marginVertical: 10,
              color: 'black',
            }}>
            {product.description}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#F5F5F5',
            marginHorizontal: 30,
            paddingHorizontal: 10,
            paddingTop: '8%',
            paddingBottom: 80,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontSize: 24,
                lineHeight: 30,
                color: COLORS.secondary,
                fontWeight: 700,
                fontFamily: FONTS.fontFamily,
              }}>
              {product.price.toLocaleString('vi-VN', {
                currency: 'VND',
              })}
            </Text>
            <Text
              style={{
                fontSize: 16,
                lineHeight: 18,
                color: COLORS.secondary,
                fontWeight: 700,
                fontFamily: FONTS.fontFamily,
                paddingRight: '10%',
              }}>
              ₫
            </Text>
          </View>

          <TouchableOpacity onPress={() => handleAddToCart(product)}>
            <Text
              style={{
                paddingVertical: 8,
                paddingHorizontal: '8%',
                backgroundColor: '#ffffff',
                borderRadius: 20,
                fontWeight: 700,
                textAlign: 'center',
                color: COLORS.primary,
                fontSize: 18,
                fontFamily: FONTS.fontFamily,
                borderColor: COLORS.primary,
                borderWidth: 1,
              }}>
              Thêm
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleBuy}>
            <Text
              style={{
                paddingVertical: 10,
                paddingHorizontal: '10%',
                backgroundColor: COLORS.primary,
                borderRadius: 20,
                fontWeight: 700,
                textAlign: 'center',
                color: '#ffffff',
                fontSize: 18,
                fontFamily: FONTS.fontFamily,
              }}>
              Mua
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProductDetails;
