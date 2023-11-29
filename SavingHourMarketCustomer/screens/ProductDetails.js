/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native';
import React, { useCallback, useState, useRef, useMemo } from 'react';
import { icons } from '../constants';
import { COLORS, FONTS } from '../constants/theme';
import dayjs from 'dayjs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Modal, {
  ModalFooter,
  ModalButton,
  SlideAnimation,
  ScaleAnimation,
} from 'react-native-modals';
import Toast from 'react-native-toast-message';
import Swiper from 'react-native-swiper';
import BottomSheet, {
  useBottomSheet,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { format } from 'date-fns';
import database from '@react-native-firebase/database';

const ProductDetails = ({ navigation, route }) => {
  const product = route.params.product;
  const pickupPointId = route.params.pickupPointId;
  const [cartList, setCartList] = useState([]);
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [openWarnModal, setOpenWarnModal] = useState(false);
  const [isAddToCart, setIsAddToCart] = useState(false);
  const [index, setIndex] = useState(-1);

  const [productBatchList, setProductBatchList] = useState([
    ...product.otherProductBatchList,
    product.nearestExpiredBatch,
  ]);

  const [selectedProductBatch, setSelectedProductBatch] = useState(null);
  var minPrice = Math.min(...productBatchList.map(item => item.price));
  var maxPrice = Math.max(...productBatchList.map(item => item.price));
  const [cartQuantity, setCartQuantity] = useState(1);

  const totalQuantity = productBatchList.reduce(
    (sum, item) => item.quantity + sum,
    0,
  );

  // ref
  const bottomSheetRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ['70%'], []);

  const handlePresentBottomSheet = useCallback(() => {
    // bottomSheetRef.current?.present();
    setIndex(0);
  }, []);

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
          const cartList = await AsyncStorage.getItem(
            'CartList' + pickupPointId,
          );
          setCartList(cartList ? JSON.parse(cartList) : []);
        } catch (err) {
          console.log(err);
        }
      })();
    }, []),
  );

  const handleBuy = async () => {
    try {
      const user = await AsyncStorage.getItem('userInfo');
      if (!user) {
        setOpenAuthModal(true);
        return;
      }
      const item = product;
      const orderItem = [
        {
          id: item.id,
          name: item.name,
          price: selectedProductBatch.price,
          priceOriginal: selectedProductBatch.priceOriginal,
          expiredDate: Date.parse(selectedProductBatch.expiredDate),
          imageUrl: item.imageUrlImageList[0].imageUrl,
          productCategoryName: item.productSubCategory.productCategory.name,
          productCategoryId: item.productSubCategory.productCategory.id,
          quantity: cartQuantity,
          idList: selectedProductBatch.idList,
          addToCart: false,
        },
      ];

      await AsyncStorage.setItem('OrderItems', JSON.stringify(orderItem));
      navigation.navigate('Payment');
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToCart = async data => {
    try {
      const user = await AsyncStorage.getItem('userInfo');
      if (!user) {
        setOpenAuthModal(true);
        return;
      }
      if (!selectedProductBatch) {
        setOpenWarnModal(true);
        return;
      }

      const jsonValue = await AsyncStorage.getItem('CartList' + pickupPointId);
      let newCartList = jsonValue ? JSON.parse(jsonValue) : [];
      const itemExisted = newCartList.some(
        item =>
          item.id === data.id &&
          item.expiredDate === selectedProductBatch.expiredDate,
      );
      if (itemExisted) {
        const index = newCartList.findIndex(item => item.id === data.id);
        newCartList[index].cartQuantity =
          newCartList[index].cartQuantity + cartQuantity;
        setCartList(newCartList);
        await AsyncStorage.setItem(
          'CartList' + pickupPointId,
          JSON.stringify(newCartList),
        );
        setIndex(-1);
        bottomSheetRef.current?.close();
        setSelectedProductBatch(null);
        setCartQuantity(1);
        showToast();
        return;
      }

      const cartData = {
        ...data,
        price: selectedProductBatch.price,
        idList: selectedProductBatch.idList,
        priceOriginal: selectedProductBatch.priceOriginal,
        expiredDate: selectedProductBatch.expiredDate,
        isChecked: false,
        cartQuantity: cartQuantity,
      };
      newCartList = [...newCartList, cartData];
      setCartList(newCartList);

      setIndex(-1);
      bottomSheetRef.current?.close();
      setSelectedProductBatch(null);
      setCartQuantity(1);
      await AsyncStorage.setItem(
        'CartList' + pickupPointId,
        JSON.stringify(newCartList),
      );
      showToast();
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
            style={{ width: 35, height: 35, tintColor: COLORS.primary }}
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

      <ScrollView
        contentContainerStyle={{
          paddingBottom: 150,
        }}
      >
        <Swiper
          style={{
            height: 250,
          }}
          activeDotColor="#37A65B"
          showsButtons={false}>
          {product?.imageUrlImageList.map((item, index) => (
            <View key={index}>
              <Image
                style={{
                  width: '85%',
                  height: '100%',
                  marginHorizontal: 30,
                  borderRadius: 20,
                  backgroundColor: 'green',
                }}
                resizeMode="stretch"
                source={{
                  uri: item.imageUrl,
                }}
              />
              {product?.imageUrlImageList.length !== 1 && (
                <View
                  style={{
                    position: 'absolute',
                    bottom: 10,
                    right: 20,
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    marginHorizontal: 20,
                    borderWidth: 1,
                    borderColor: 'black',
                    borderRadius: 10,
                    backgroundColor: 'white',
                  }}>
                  <Text
                    style={{
                      color: 'black',
                      fontFamily: FONTS.fontFamily,
                    }}>
                    {index + 1}/{product?.imageUrlImageList.length}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </Swiper>

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
              HSD:{' '}
              {dayjs(product.nearestExpiredBatch.expiredDate).format(
                'DD/MM/YYYY',
              )}
            </Text>
          </View>

          <Text
            style={{
              fontFamily: FONTS.fontFamily,
              fontSize: 18,
              marginVertical: 10,
              color: 'black',
              lineHeight: 26,
            }}>
            {product.description}
          </Text>
        </View>
      </ScrollView>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          flexDirection: 'row',
          backgroundColor: '#F5F5F5',
          marginHorizontal: 20,
          paddingHorizontal: 20,
          paddingTop: '8%',
          paddingBottom: '22%',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          alignItems: 'center',
          justifyContent: 'space-between',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.27,
          shadowRadius: 4.65,
          elevation: 2,
        }}>
        <View style={{ flexDirection: 'row' }}>
          <Text
            style={{
              fontSize: 24,
              lineHeight: 30,
              color: COLORS.secondary,
              fontWeight: 700,
              fontFamily: FONTS.fontFamily,
            }}>
            {product.nearestExpiredBatch.price.toLocaleString('vi-VN', {
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
        <TouchableOpacity
          onPress={() => {
            setIsAddToCart(true);
            handlePresentBottomSheet();
          }}>
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
        <TouchableOpacity
          onPress={() => {
            setIsAddToCart(false);
            handlePresentBottomSheet();
          }}>
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
              marginLeft: 5,
            }}>
            Mua
          </Text>
        </TouchableOpacity>
      </View>
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
                  await AsyncStorage.removeItem('userInfo');
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
      {/* warn modal */}
      <Modal
        width={0.8}
        visible={openWarnModal}
        dialogAnimation={
          new ScaleAnimation({
            initialValue: 0, // optional
            useNativeDriver: true, // optional
          })
        }
        footer={
          <ModalFooter>
            <ModalButton
              text="Đóng"
              onPress={() => {
                setOpenWarnModal(false);
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
            Vui lòng chọn lô hàng
          </Text>
        </View>
      </Modal>
      <BottomSheetModalProvider>
        <BottomSheet
          ref={bottomSheetRef}
          enableOverDrag={false}
          index={index}
          snapPoints={snapPoints}>
          <View style={{ padding: 3 }}>
            <View
              style={{
                flexDirection: 'row',
                height: 150,
                gap: 20,
                borderBottomColor: '#decbcb',
                borderBottomWidth: 0.75,
                paddingBottom: 10,
              }}>
              <Image
                style={{
                  flex: 5,
                  width: '100%',
                  height: '100%',
                  borderRadius: 20,
                }}
                resizeMode="contain"
                source={{ uri: product.imageUrlImageList[0].imageUrl }}
              />
              <View style={{ flex: 6, justifyContent: 'space-between' }}>
                <View></View>
                <View>
                  <Text
                    style={{
                      fontSize: 16,
                      color: 'red',
                      fontFamily: FONTS.fontFamily,
                    }}>
                    {minPrice === maxPrice
                      ? `${minPrice.toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      })}`
                      : `${minPrice.toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      })} - ${maxPrice.toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      })}`}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {
                  bottomSheetRef.current?.close();
                  setIndex(-1);
                }}
                style={{ flex: 1 }}>
                <Image
                  style={{ width: 25, height: 25 }}
                  resizeMode="contain"
                  source={icons.cross}
                />
              </TouchableOpacity>
            </View>
          </View>
          <BottomSheetScrollView>
            <View
              style={{
                paddingBottom: 15,
                marginBottom: 140,
              }}>
              <View style={{ paddingHorizontal: 15 }}>
                <Text
                  style={{
                    fontSize: 18,
                    color: 'black',
                    fontFamily: FONTS.fontFamily,
                    fontWeight: 'bold',
                    marginTop: 10,
                    marginBottom: 10,
                  }}>
                  Lô hàng :
                </Text>
                {productBatchList.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setSelectedProductBatch(item);
                    }}
                    style={{
                      borderColor: '#c8c8c8',
                      borderWidth: 0.2,
                      borderRadius: 10,
                      marginTop: 10,
                      marginBottom: 10,
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                      backgroundColor:
                        item.idList === selectedProductBatch?.idList
                          ? COLORS.primary
                          : '#F5F5F5',
                    }}>
                    <Text
                      style={{
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        textAlign: 'center',
                        color:
                          item.idList === selectedProductBatch?.idList
                            ? 'white'
                            : 'black',
                        fontFamily: FONTS.fontFamily,
                        fontWeight: 'bold',
                        fontSize: 14,
                      }}>
                      HSD: {format(new Date(item.expiredDate), 'dd/MM/yyyy')}
                    </Text>
                    <Text
                      style={{
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        textAlign: 'center',
                        color:
                          item.idList === selectedProductBatch?.idList
                            ? 'white'
                            : 'black',
                        fontFamily: FONTS.fontFamily,
                        fontWeight: 'bold',
                        fontSize: 14,
                      }}>
                      {item.price.toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      })}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTopColor: '#decbcb',
                  borderTopWidth: 0.43,
                  paddingHorizontal: 15,
                  marginTop: 20,
                  paddingTop: 10,
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    color: 'black',
                    fontFamily: FONTS.fontFamily,
                    fontWeight: 'bold',
                    marginTop: 10,
                    marginBottom: 10,
                  }}>
                  Số lượng :
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      if (cartQuantity > 1) {
                        setCartQuantity(cartQuantity - 1);
                      }
                    }}
                    style={{
                      backgroundColor: '#F5F5F5',
                      borderRadius: 5,
                      padding: 5,
                    }}>
                    <Image
                      resizeMode="contain"
                      style={{ height: 20, width: 20 }}
                      source={icons.minus}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontSize: 22,
                      color: 'black',
                      fontFamily: 'Roboto',
                    }}>
                    {cartQuantity}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setCartQuantity(cartQuantity + 1);
                    }}
                    style={{
                      backgroundColor: '#F5F5F5',
                      borderRadius: 5,
                      padding: 5,
                    }}>
                    <Image
                      resizeMode="contain"
                      style={{ height: 20, width: 20 }}
                      source={icons.plus}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </BottomSheetScrollView>
          <View
            style={{
              position: 'absolute',
              bottom: 70,
              left: 0,
              right: 0,

              backgroundColor: 'white',
              borderTopColor: 'transparent',
              height: 70,
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',

              marginTop: 20,
              elevation: 10,
            }}>
            <View style={{ width: '95%' }}>
              <TouchableOpacity
                onPress={() => {
                  isAddToCart ? handleAddToCart(product) : handleBuy();
                }}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: COLORS.primary,
                  paddingVertical: 10,
                  width: '100%',
                  borderRadius: 30,
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    color: 'white',
                    fontFamily: 'Roboto',
                    fontWeight: 'bold',
                  }}>
                  {isAddToCart ? 'Mua hàng' : 'Đặt hàng'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </BottomSheet>
      </BottomSheetModalProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
});

export default ProductDetails;
