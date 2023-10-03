/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */

import React, {useCallback, useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {icons} from '../constants';
import {COLORS} from '../constants/theme';
import CartItem from '../components/CartItem';
import CheckBox from 'react-native-check-box';
import {SwipeListView} from 'react-native-swipe-list-view';
import Modal, {
  ModalFooter,
  ModalButton,
  ScaleAnimation,
  ModalContent,
} from 'react-native-modals';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CartEmpty from '../assets/image/search-empty.png';
import {useFocusEffect} from '@react-navigation/native';

const Cart = ({navigation}) => {
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    rowMap: null,
    rowKey: null,
  });

  const [openValidateDialog, setOpenValidateDialog] = useState(false);
  const [cartItems, setcartItems] = useState([]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const cartList = await AsyncStorage.getItem('CartList');
          setcartItems(cartList ? JSON.parse(cartList) : []);
        } catch (err) {
          console.log(err);
        }
      })();
    }, []),
  );

  const totalPrice = cartItems.reduce((sum, item) => {
    if (item.isChecked) return sum + item.price * item.cartQuantity;

    return sum;
  }, 0);

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = async (rowMap, rowKey) => {
    closeRow(rowMap, rowKey);
    const newCart = cartItems.filter(item => item.id !== rowKey);
    setcartItems(newCart);
    try {
      await AsyncStorage.setItem('CartList', JSON.stringify(newCart));
    } catch (error) {
      console.log(error);
    }
  };

  const handleBuyButton = async () => {
    if (!cartItems.some(item => item.isChecked === true)) {
      setOpenValidateDialog(true);
      return;
    }

    let orderItems = [];
    cartItems.map(item => {
      if (item.isChecked) {
        const orderItem = {
          id: item.id,
          name: item.name,
          price: item.price,
          priceOriginal: item.priceOriginal,
          expiredDate: Date.parse(item.expiredDate),
          imageUrl: item.imageUrl,
          productCategoryName: item.productSubCategory.productCategory.name,
          productCategoryId: item.productSubCategory.productCategory.id,
          quantity: item.cartQuantity,
        };
        orderItems = [...orderItems, orderItem];
      }
    });

    try {
      await AsyncStorage.setItem('OrderItems', JSON.stringify(orderItems));
      navigation.navigate('Payment');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          gap: 20,

          backgroundColor: '#ffffff',
          padding: 20,
          marginBottom: 10,
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
          Giỏ hàng
        </Text>
      </View>
      {cartItems.length === 0 ? (
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Image
            style={{width: '100%', height: '65%'}}
            resizeMode="contain"
            source={CartEmpty}
          />
          <Text
            style={{
              fontSize: 20,
              fontFamily: 'Roboto',
              // color: 'black',
              fontWeight: 'bold',
            }}>
            Chưa có sản phẩm nào trong giỏ hàng
          </Text>
        </View>
      ) : (
        <>
          <View
            style={{
              marginBottom: 175,
            }}>
            <SwipeListView
              data={cartItems}
              renderItem={(data, rowMap) => (
                <CartItem
                  setcartItems={setcartItems}
                  cartItems={cartItems}
                  item={data.item}
                  navigation={navigation}
                  index={rowMap}
                />
              )}
              renderHiddenItem={(data, rowMap) => (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    height: '100%',
                    // marginVertical: '2%',
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
                      setDeleteDialog({
                        open: true,
                        rowMap: rowMap,
                        rowKey: data.item.id,
                      });
                    }}>
                    <View>
                      <Image
                        source={icons.trashBin}
                        resizeMode="contain"
                        style={{width: 30, height: 30, tintColor: 'white'}}
                      />
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
              paddingHorizontal: 20,
              marginTop: 10,
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
                onClick={async () => {
                  let newCart;
                  if (!cartItems.every(item => item.isChecked === true)) {
                    newCart = cartItems.map(data => {
                      return {...data, isChecked: true};
                    });
                  } else {
                    newCart = cartItems.map(data => {
                      return {...data, isChecked: false};
                    });
                  }

                  setcartItems(newCart);
                  try {
                    await AsyncStorage.setItem(
                      'CartList',
                      JSON.stringify(newCart),
                    );
                  } catch (error) {
                    console.log(error);
                  }
                }}
                isChecked={cartItems.every(item => item.isChecked === true)}
              />
              <Text
                style={{
                  fontSize: 18,
                  color: 'black',
                  fontFamily: 'Roboto',
                }}>
                Chọn tất cả
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {/* <Text style={{fontSize: 18, color: 'black', fontFamily: 'Roboto'}}>
              Tổng cộng:
            </Text> */}
              <Text
                style={{
                  fontSize: 18,
                  color: 'red',
                  fontFamily: 'Roboto',
                  fontWeight: 'bold',
                }}>
                {totalPrice.toLocaleString('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                })}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => handleBuyButton()}
              style={{
                height: '60%',
                width: '30%',
                backgroundColor: COLORS.primary,
                textAlign: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 30,
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 20,
                  fontFamily: 'Roboto',
                  fontWeight: 'bold',
                }}>
                Mua
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* delete dialog */}
      <Modal
        width={0.8}
        visible={deleteDialog.open}
        onTouchOutside={() => {
          setDeleteDialog({...deleteDialog, open: false});
        }}
        dialogAnimation={
          new ScaleAnimation({
            initialValue: 0, // optional
            useNativeDriver: true, // optional
          })
        }
        footer={
          <ModalFooter>
            <ModalButton
              // textStyle={{color: 'red'}}
              text="Đóng"
              onPress={() => {
                setDeleteDialog({...deleteDialog, open: false});
              }}
            />
            <ModalButton
              textStyle={{color: 'red'}}
              text="Xóa"
              onPress={() => {
                deleteRow(deleteDialog.rowMap, deleteDialog.rowKey);
                setDeleteDialog({...deleteDialog, open: false});
              }}
            />
          </ModalFooter>
        }>
        <ModalContent>
          <View
            style={{
              padding: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: 'Roboto',
                color: 'black',
                textAlign: 'center',
              }}>
              Bạn có chắc muốn xóa sản phẩm khỏi giỏ hàng
            </Text>
          </View>
        </ModalContent>
      </Modal>
      {/* ****************** */}
      <Modal
        width={0.8}
        visible={openValidateDialog}
        onTouchOutside={() => {
          setOpenValidateDialog(false);
        }}
        dialogAnimation={
          new ScaleAnimation({
            initialValue: 0, // optional
            useNativeDriver: true, // optional
          })
        }
        footer={
          <ModalFooter>
            <ModalButton
              // textStyle={{color: 'red'}}
              text="Đóng"
              onPress={() => {
                setOpenValidateDialog(false);
              }}
            />
          </ModalFooter>
        }>
        <ModalContent>
          <View
            style={{
              padding: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: 'Roboto',
                color: 'black',
                textAlign: 'center',
              }}>
              Vui lòng chọn sản phẩm để tiến hành đặt hàng
            </Text>
          </View>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Cart;
