/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, { useState, useCallback } from 'react';
import { icons } from '../constants';
import { COLORS, FONTS } from '../constants/theme';
import dayjs from 'dayjs';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal, {
  ModalFooter,
  ModalButton,
  SlideAnimation,
  ScaleAnimation,
} from 'react-native-modals';
import Toast from 'react-native-toast-message';
import database from '@react-native-firebase/database';

const DiscountForCategories = ({ navigation, route }) => {
  const discount = route.params.discount;
  const products = route.params.products.productList;
  const [cartList, setCartList] = useState([]);
  const [openAuthModal, setOpenAuthModal] = useState(false);

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
              routes: [{ name: 'Initial' }],
            });
          } else {
            // setSystemStatus(snapshot.val());
          }
        });
    }, []),
  );

  const showToast = () => {
    Toast.show({
      type: 'success',
      text1: 'Thành công',
      text2: 'Thêm sản phẩm vào giỏ hàng thành công 👋',
      visibilityTime: 1000,
    });
  };

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

  const handleAddToCart = async data => {
    try {
      const user = await AsyncStorage.getItem('userInfo');
      if (!user) {
        setOpenAuthModal(true);
        return;
      }
      const jsonValue = await AsyncStorage.getItem('CartList');
      let newCartList = jsonValue ? JSON.parse(jsonValue) : [];
      const itemExisted = newCartList.some(item => item.id === data.id);
      if (itemExisted) {
        const index = newCartList.findIndex(item => item.id === data.id);
        newCartList[index].cartQuantity = newCartList[index].cartQuantity + 1;
        setCartList(newCartList);
        await AsyncStorage.setItem('CartList', JSON.stringify(newCartList));
        showToast();
        return;
      }

      const cartData = { ...data, isChecked: false, cartQuantity: 1 };
      newCartList = [...newCartList, cartData];
      setCartList(newCartList);
      await AsyncStorage.setItem('CartList', JSON.stringify(newCartList));
      showToast();
    } catch (error) {
      console.log(error);
    }
  };

  const Item = ({ data }) => (
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
            uri: data?.imageUrlImageList[0].imageUrl,
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
              {data?.nearestExpiredBatch.price.toLocaleString('vi-VN', {
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
            HSD:{' '}
            {dayjs(data?.nearestExpiredBatch.expiredDate).format('DD/MM/YYYY')}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View
      style={
        {
          // backgroundColor: '#fff'
        }
      }>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginVertical: 15,
          marginHorizontal: 30,
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={icons.leftArrow}
            resizeMode="contain"
            style={{ width: 35, height: 35, tintColor: COLORS.primary }}
          />
        </TouchableOpacity>
        <Text
          style={{
            textAlign: 'center',
            color: 'black',
            fontSize: 20,
            fontFamily: FONTS.fontFamily,
          }}>
          {discount.name}
        </Text>
        <TouchableOpacity
          onPress={async () => {
            const user = await AsyncStorage.getItem('userInfo');
            if (!user) {
              setOpenAuthModal(true);
              return;
            }
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
          {cartList.length !== 0 && (
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

      {/* List product of Category */}
      <ScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{
          paddingBottom: 100,
          paddingTop: 20,
        }}>
        {products.map((item, index) => (
          <Item data={item} key={index} />
        ))}
      </ScrollView>
      {/* auth modal */}
      <Modal
        width={0.8}
        visible={openAuthModal}
        dialogAnimation={
          new ScaleAnimation({
            initialValue: 0, // optional
            useNativeDriver: true, // optional
          })
        }
        footer={
          <ModalFooter>
            <ModalButton
              text="Ở lại trang"
              onPress={() => {
                setOpenAuthModal(false);
              }}
            />
            <ModalButton
              text="Đăng nhập"
              textStyle={{ color: COLORS.primary }}
              onPress={async () => {
                try {
                  await AsyncStorage.clear();
                  navigation.navigate('Login');
                  setOpenAuthModal(false);
                } catch (error) {
                  console.log(error);
                }
              }}
            />
          </ModalFooter>
        }>
        <View
          style={{ padding: 20, alignItems: 'center', justifyContent: 'center' }}>
          <Text
            style={{
              fontSize: 20,
              fontFamily: 'Roboto',
              color: 'black',
              textAlign: 'center',
            }}>
            Vui lòng đăng nhập để thực hiện thao tác này
          </Text>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  itemContainer: {
    backgroundColor: '#fff',
    maxWidth: '90%',
    borderRadius: 20,
    marginHorizontal: '7%',
    marginBottom: 20,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 2,
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

export default DiscountForCategories;
