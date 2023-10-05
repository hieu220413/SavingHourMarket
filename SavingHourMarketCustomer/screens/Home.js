/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unstable-nested-components */
import React, { useCallback, useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import SearchBar from '../components/SearchBar';
import Categories from '../components/Categories';
import DiscountRow from '../components/DiscountRow';
import { COLORS, FONTS } from '../constants/theme';
import { icons } from '../constants';
import dayjs from 'dayjs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '../constants/api';
import { useFocusEffect } from '@react-navigation/native';
import { Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';

const Home = ({ navigation }) => {
  const [categoryList, setCategoryList] = useState([]);
  const [products, setProducts] = useState([]);
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

  useEffect(() => {
    fetch(
      `${API.baseURL}/api/product/getProductsForCustomer?page=0&quantitySortType=DESC&expiredSortType=DESC`,
    )
      .then(res => res.json())
      .then(data => {
        setProducts(data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

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

      const cartData = { ...data, isChecked: false, cartQuantity: 1 };
      newCartList = [...newCartList, cartData];
      setCartList(newCartList);
      await AsyncStorage.setItem('CartList', JSON.stringify(newCartList));
    } catch (error) {
      console.log(error);
    }
  };

  const Item = ({ data }) => {
    return (
      <TouchableOpacity
        key={data.id}
        onPress={() => {
          navigation.navigate('ProductDetails', {
            product: data,
          });
        }}>
        <View style={styles.itemContainer}>
          {/* Image Product */}
          <Image
            resizeMode="contain"
            source={{
              uri: data.imageUrl,
            }}
            style={styles.itemImage}
          />

          <View style={{ justifyContent: 'center', flex: 1, marginRight: 10 }}>
            <Text
              numberOfLines={1}
              style={{
                fontFamily: FONTS.fontFamily,
                fontSize: 18,
                fontWeight: 700,
                maxWidth: '95%',
                color: 'black',
              }}>
              {data.name}
            </Text>

            <View style={{ flexDirection: 'row' }}>
              <Text
                style={{
                  maxWidth: '70%',
                  fontSize: 18,
                  lineHeight: 30,
                  color: COLORS.secondary,
                  fontWeight: 600,
                  fontFamily: FONTS.fontFamily,
                }}>
                {data.price.toLocaleString('vi-VN', {
                  currency: 'VND',
                })}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  lineHeight: 18,
                  color: COLORS.secondary,
                  fontWeight: 600,
                  fontFamily: FONTS.fontFamily,
                }}>
                ₫
              </Text>
            </View>

            <Text
              style={{
                fontFamily: FONTS.fontFamily,
                fontSize: 18,
                marginBottom: 10,
              }}>
              HSD: {dayjs(data.expiredDate).format('DD/MM/YYYY')}
            </Text>
            {/* Button buy */}
            <TouchableOpacity onPress={() => handleAddToCart(data)}>
              <Text
                style={{
                  maxWidth: 150,
                  maxHeight: 40,
                  padding: 10,
                  backgroundColor: COLORS.primary,
                  borderRadius: 10,
                  textAlign: 'center',
                  color: '#ffffff',
                  fontFamily: FONTS.fontFamily,
                }}>
                Thêm vào giỏ hàng
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Search */}
      <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
        <SearchBar />
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
                style={{ fontSize: 12, color: 'white', fontFamily: 'Roboto' }}>
                {cartList.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Body */}
      <ScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{
          paddingBottom: 100,
        }}>
        {/* Categories */}
        <Categories />
        {/* Sale, Discount */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 20,
          }}
        >
          <Text
            style={{
              fontFamily: FONTS.fontFamily,
              fontSize: 22,
              color: 'black',
              fontWeight: 700,
              marginTop: '5%',
              marginBottom: 10,
            }}>
            Khuyến Mãi Cực Sốc
          </Text>

          <TouchableOpacity
            style={{
              marginTop: '5%',
            }}
            onPress={() => {
              navigation.navigate('Discount');
            }}>
            <Text
              style={{
                fontFamily: FONTS.fontFamily,
                fontSize: 22,
                color: COLORS.primary,
                fontWeight: 700,
                marginBottom: 10,
              }}
            >
              Tất cả
            </Text>
          </TouchableOpacity>
        </View>

        <DiscountRow />
        {/* List Product */}
        <Text
          style={{
            fontFamily: FONTS.fontFamily,
            fontSize: 22,
            color: COLORS.secondary,
            fontWeight: 700,
            marginLeft: 20,
            marginTop: '5%',
            marginBottom: 10,
          }}>
          Danh sách sản phẩm
        </Text>
        {products.map((item, index) => (
          <Item data={item} key={index} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  itemContainer: {
    backgroundColor: '#F5F5F5',
    maxWidth: '90%',
    borderRadius: 20,
    marginHorizontal: '5%',
    marginBottom: 20,
    flexDirection: 'row',
  },
  itemImage: {
    width: 130,
    height: 130,
    borderRadius: 20,
    padding: 10,
    margin: 15,
  },
  itemText: {
    fontFamily: FONTS.fontFamily,
    fontSize: 20,
  },
});

export default Home;
