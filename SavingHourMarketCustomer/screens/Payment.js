/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable no-shadow */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */

import React, {useEffect, useState, useCallback, useRef} from 'react';
import {
  Image,
  Keyboard,
  Text,
  TouchableOpacity,
  View,
  LogBox,
  NativeEventEmitter,
  Alert,
} from 'react-native';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import {icons} from '../constants';
import {COLORS} from '../constants/theme';
import CheckBox from 'react-native-check-box';
import DatePicker from 'react-native-date-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {format} from 'date-fns';
import Modal, {
  ModalFooter,
  ModalButton,
  ScaleAnimation,
} from 'react-native-modals';
import {useFocusEffect} from '@react-navigation/native';
import {API} from '../constants/api';
import auth from '@react-native-firebase/auth';
import VnpayMerchant, {
  VnpayMerchantModule,
} from '../react-native-vnpay-merchant';
LogBox.ignoreLogs(['new NativeEventEmitter']);
const eventEmitter = new NativeEventEmitter(VnpayMerchantModule);

const Payment = ({navigation, route}) => {
  const [customerLocationIsChecked, setCustomerLocationIsChecked] =
    useState(false);
  const [pickUpPointIsChecked, setpickUpPointIsChecked] = useState(true);
  const [date, setDate] = useState(null);
  const [open, setOpen] = useState(false);

  const [pickupPoint, setPickupPoint] = useState(null);

  const [timeFrame, setTimeFrame] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState(null);

  const [openValidateDialog, setOpenValidateDialog] = useState(false);

  const [voucherList, setVoucherList] = useState([]);

  const [name, setName] = useState('Hà Anh Tú');

  const [phone, setPhone] = useState('0898449505');

  const [validateMessage, setValidateMessage] = useState('');

  const [minDate, setMinDate] = useState(new Date());

  const [maxDate, setMaxDate] = useState(new Date());

  const [cannotChangeDate, setCannotChangeDate] = useState(false);

  const [tokenId, setTokenId] = useState(null);

  const [initializing, setInitializing] = useState(true);

  const [customerLocation, setCustomerLocation] = useState({
    address: 'Số 121, Trần Văn Dư, Phường 13, Tân Bình,TP.HCM',
    long: 106.644295,
    lat: 10.8022319,
  });

  const [keyboard, setKeyboard] = useState(Boolean);

  //VNPAY function/param
  const orderIdDummy = useRef('ec5dcac6-56dc-11ee-8a50-a85e45c41921');
  const totalPriceDummy = useRef(111111);
  const processVNPay = async (totalPrice, orderId, idToken) => {
    console.log('is in process');
    // lay payment url
    const getPaymentResponse = await fetch(
      `${API.baseURL}/api/transaction/getPaymentUrl?paidAmount=${totalPrice}&orderId=${orderId}`,
      {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        // truyen idToken vao
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      },
    )
      .then(res => res)
      .catch(e => {
        console.log(e);
        return null;
      });

    if (!getPaymentResponse) {
      //Handle internal error
      Alert.alert('Unexpected error happened');
      return;
    }

    if (getPaymentResponse.status === 401) {
      //Handle Unauthorized (chuyen ve log in hay sao do)
      Alert.alert('Unauthorized');
      return;
    }

    if (getPaymentResponse.status === 404) {
      Alert.alert('Order not found');
    }

    if (getPaymentResponse.status === 403) {
      const responseBody = await getPaymentResponse.json();
      if (responseBody.message === 'ORDER_IS_PAID') {
        Alert.alert('This Order has already been paid');
      }

      if (responseBody.message === 'REQUIRED_E_PAYMENT') {
        Alert.alert('This order payment method is COD');
      }
      return;
    }

    if (getPaymentResponse.status === 200) {
      const paymentUrl = await getPaymentResponse.text();
      console.log(paymentUrl);
      if (!paymentUrl) {
        return;
      }
      // mở sdk
      eventEmitter.addListener('PaymentBack', e => {
        console.log('Sdk back!');
        if (e) {
          console.log('e.resultCode = ' + e.resultCode);
          switch (e.resultCode) {
            case -1:
              // Khi nguoi dung nhan nut back tu device (Khong phai nhan nut back tu VNPAY UI)
              console.log('nguoi dung nhan nut back tu device');
              break;
            case 97:
              // Giao dich thanh cong.
              console.log('Giao dich thanh cong');
              break;
            case 98:
              // Giao dich khong thanh cong. (bao gom case nguoi dung an nut back tu VNPAY UI)
              console.log('Giao dich khong thanh cong');
              break;
          }

          //   khi tắt sdk
          eventEmitter.removeAllListeners('PaymentBack');
        }
      });

      VnpayMerchant.show({
        isSandbox: true,
        scheme: 'savingHourMarket',
        title: 'Thanh toán VNPAY',
        titleColor: '#333333',
        beginColor: '#ffffff',
        endColor: '#ffffff',
        iconBackName: 'close',
        paymentUrl: paymentUrl,
      });

      console.log('Sdk opened');
    }
  };

  // end VNPay function/param

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

    return () => {
      Keyboard.removeAllListeners('keyboardDidShow', _keyboardDidShow);
      Keyboard.removeAllListeners('keyboardDidHide', _keyboardDidHide);
    };
  }, []);

  //authen check
  const onAuthStateChange = async userInfo => {
    // console.log(userInfo);
    if (initializing) {
      setInitializing(false);
    }
    if (userInfo) {
      // check if user sessions is still available. If yes => redirect to another screen
      const userTokenId = await userInfo
        .getIdToken(true)
        .then(token => token)
        .catch(async e => {
          console.log(e);
          return null;
        });
      if (!userTokenId) {
        // sessions end. (revoke refresh token like password change, disable account, ....)
        await AsyncStorage.removeItem('userInfo');
        return;
      }

      const token = await auth().currentUser.getIdToken();

      setTokenId(token);
      console.log('user is logged in');
      console.log(await AsyncStorage.getItem('userInfo'));
    } else {
      // no sessions found.
      await AsyncStorage.removeItem('userInfo');
      console.log('user is not logged in');
    }
  };

  useEffect(() => {
    // auth().currentUser.reload()
    const subscriber = auth().onAuthStateChanged(
      async userInfo => await onAuthStateChange(userInfo),
    );
    return subscriber;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _keyboardDidShow = () => {
    setKeyboard(true);
  };

  const _keyboardDidHide = () => {
    setKeyboard(false);
  };

  const [orderItems, setOrderItems] = useState([]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const orders = await AsyncStorage.getItem('OrderItems');
          setOrderItems(orders ? JSON.parse(orders) : []);
        } catch (err) {
          console.log(err);
        }
      })();
    }, []),
  );

  function groupByKey(array, key) {
    return array.reduce((hash, obj) => {
      if (obj[key] === undefined) return hash;
      return Object.assign(hash, {
        [obj[key]]: (hash[obj[key]] || []).concat(obj),
      });
    }, {});
  }

  const dayDiffFromToday = expDate => {
    return Math.ceil((expDate - new Date()) / (1000 * 3600 * 24));
  };

  const getDateAfterToday = numberOfDays => {
    const today = new Date();
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + numberOfDays);
    return nextDate;
  };

  const getMaxDate = expDate => {
    const maxDate = new Date(expDate);
    maxDate.setDate(expDate.getDate() - 1);
    return maxDate;
  };

  useFocusEffect(
    useCallback(() => {
      const minExpDateOrderItems = new Date(
        Math.min(...orderItems.map(item => item.expiredDate)),
      );
      if (dayDiffFromToday(minExpDateOrderItems) > 3) {
        setMinDate(getDateAfterToday(2));
        setMaxDate(getMaxDate(minExpDateOrderItems));
      }
      if (
        dayDiffFromToday(minExpDateOrderItems) == 1 ||
        dayDiffFromToday(minExpDateOrderItems) == 2
      ) {
        setMinDate(getDateAfterToday(1));
        setMaxDate(getDateAfterToday(1));
        setDate(getDateAfterToday(1));
        setCannotChangeDate(true);
      }
      if (dayDiffFromToday(minExpDateOrderItems) == 3) {
        setMinDate(getDateAfterToday(2));
        setMaxDate(getDateAfterToday(2));
        setDate(getDateAfterToday(2));
        setCannotChangeDate(true);
      }
    }, [orderItems]),
  );

  const groupByCategory = groupByKey(orderItems, 'productCategoryId');

  const totalDiscountPrice = Object.keys(groupByCategory).reduce(
    (total, key) => {
      const totalPriceByCategory = groupByCategory[key].reduce(
        (sum, {price, quantity}) => sum + price * quantity,
        0,
      );

      const voucherApplied = voucherList.find(item => item?.categoryId === key);

      const discountPrice =
        totalPriceByCategory * (voucherApplied?.percentage / 100);

      return discountPrice ? total + discountPrice : total;
    },
    0,
  );

  const totalProductPrice = orderItems.reduce(
    (sum, {price, quantity}) => sum + price * quantity,
    0,
  );

  const validatePhoneNumber = () => {
    if (
      /^[(]{0,1}[0-9]{3}[)]{0,1}[-s.]{0,1}[0-9]{3}[-s.]{0,1}[0-9]{4}$/.test(
        phone,
      )
    ) {
      return true;
    }

    return false;
  };

  const validate = () => {
    if (totalProductPrice - totalDiscountPrice > 2000000) {
      setValidateMessage('Đơn hàng của bạn không thể vượt quá 2.000.000 VNĐ');
      setOpenValidateDialog(true);
      return false;
    }
    if (pickUpPointIsChecked) {
      if (!pickupPoint) {
        setValidateMessage('Vui lòng chọn địa điểm giao hàng');
        setOpenValidateDialog(true);
        return false;
      }
      if (!timeFrame) {
        setValidateMessage('Vui lòng chọn khung giờ');
        setOpenValidateDialog(true);
        return false;
      }
    }

    if (customerLocationIsChecked) {
      if (!customerLocation) {
        setValidateMessage('Vui lòng chọn địa chỉ giao hàng');
        setOpenValidateDialog(true);
        return false;
      }
    }
    if (!date) {
      setValidateMessage('Vui lòng chọn ngày giao hàng');
      setOpenValidateDialog(true);
      return false;
    }
    if (!paymentMethod) {
      setValidateMessage('Vui lòng chọn phương thức thanh toán');
      setOpenValidateDialog(true);
      return false;
    }
    if (!name || !phone) {
      setValidateMessage('Vui lòng điền đầy đủ thông tin liên lạc');
      setOpenValidateDialog(true);
      return false;
    }

    if (!validatePhoneNumber()) {
      setValidateMessage('Số điện thoại không hợp lệ');
      setOpenValidateDialog(true);
      return false;
    }
    return true;
  };

  const handleOrder = async () => {
    if (!validate()) {
      return;
    }
    let submitOrder = {};
    const voucherListId = voucherList.map(item => {
      return item.id;
    });
    const orderDetailList = orderItems.map(item => {
      return {
        id: item.id,
        productPrice: item.price,
        productOriginalPrice: item.priceOriginal,
        boughtQuantity: item.quantity,
      };
    });
    if (pickUpPointIsChecked) {
      submitOrder = {
        shippingFee: 0,
        totalPrice: totalProductPrice,
        totalDiscountPrice: totalDiscountPrice,
        deliveryDate: format(date, 'yyyy-MM-dd'),
        customerName: name,
        phone: phone,
        pickupPointId: pickupPoint.id,
        timeFrameId: timeFrame.id,
        paymentStatus: 'UNPAID',
        paymentMethod: paymentMethod.id,
        addressDelivery: customerLocation.address,
        discountID: voucherListId,
        orderDetailList: orderDetailList,
      };
    }

    if (customerLocationIsChecked) {
      submitOrder = {
        shippingFee: 0,
        totalPrice: totalProductPrice,
        totalDiscountPrice: totalDiscountPrice,
        deliveryDate: format(date, 'yyyy-MM-dd'),
        customerName: name,
        phone: phone,
        paymentStatus: 'UNPAID',
        paymentMethod: paymentMethod.id,
        addressDelivery: customerLocation.address,
        discountID: voucherListId,
        orderDetailList: orderDetailList,
      };
    }

    console.log(submitOrder);

    const createOrderRequest = await fetch(
      `${API.baseURL}/api/order/createOrder`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenId}`,
        },
        body: JSON.stringify(submitOrder),
      },
    ).catch(err => {
      console.log(err);
      return null;
    });

    if (createOrderRequest) {
      // handle vnpay payment method
      if (paymentMethod.id === 1 && createOrderRequest.status === 200) {
        const createdOrderBody = await createOrderRequest.json();
        const createdOrderId = createdOrderBody.id;
        const createdOrderTotalPrice = createdOrderBody.totalPrice;
        const idToken = await auth().currentUser.getIdToken();
        console.log('processing vnpay')
        await processVNPay(
          createdOrderTotalPrice,
          createdOrderId,
          idToken
        );
        return;
      }
      console.log(await createOrderRequest.json())
      // Handle other request status
    }
  };

  return (
    <>
      <View>
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            gap: 20,
            marginBottom: 10,
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
              fontSize: 25,
              textAlign: 'center',
              color: '#000000',
              fontWeight: 'bold',
              fontFamily: 'Roboto',
            }}>
            Thanh toán
          </Text>
        </View>
        <ScrollView automaticallyAdjustKeyboardInsets={true}>
          <View style={{marginBottom: 190}}>
            {/* OrderItem */}
            {Object.keys(groupByCategory).map(function (key) {
              const totalPriceByCategory = groupByCategory[key].reduce(
                (sum, {price, quantity}) => sum + price * quantity,
                0,
              );

              const totalQuantityByCategory = groupByCategory[key].reduce(
                (sum, {quantity}) => sum + quantity,
                0,
              );

              const voucherApplied = voucherList.find(
                item => item?.categoryId === key,
              );

              const categoryName = groupByCategory[key][0].productCategoryName;

              const discountPrice =
                totalPriceByCategory * (voucherApplied?.percentage / 100);

              return (
                <View
                  key={key}
                  style={{
                    backgroundColor: 'white',
                    paddingBottom: 10,
                    marginBottom: 20,
                  }}>
                  {/* item group by category */}
                  {groupByCategory[key].map(item => (
                    <View
                      key={item.id}
                      style={{
                        flexDirection: 'row',
                        gap: 10,
                        alignItems: 'center',
                        backgroundColor: 'white',
                        borderBottomColor: '#decbcb',
                        borderBottomWidth: 0.75,
                        padding: 20,
                      }}>
                      <Image
                        resizeMode="contain"
                        source={{
                          uri: item.imageUrl,
                        }}
                        style={{flex: 4, width: '100%', height: '100%'}}
                      />
                      <View
                        style={{
                          flexDirection: 'column',
                          gap: 10,
                          flex: 7,
                        }}>
                        <Text
                          style={{
                            fontSize: 23,
                            color: 'black',
                            fontFamily: 'Roboto',
                            fontWeight: 'bold',
                          }}>
                          {item.name}
                        </Text>
                        <Text
                          style={{
                            fontSize: 18,
                            color: 'black',
                            fontFamily: 'Roboto',
                            backgroundColor: '#7ae19c',
                            alignSelf: 'flex-start',
                            paddingVertical: 5,
                            paddingHorizontal: 10,
                            borderRadius: 5,
                          }}>
                          {item.productCategoryName}
                        </Text>
                        <Text
                          style={{
                            fontSize: 18,
                            color: 'black',
                            fontFamily: 'Roboto',
                            fontWeight: 'bold',
                          }}>
                          HSD:{format(item.expiredDate, 'dd/MM/yyyy')}
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}>
                          <Text
                            style={{
                              fontSize: 20,

                              fontFamily: 'Roboto',
                            }}>
                            {item.price.toLocaleString('vi-VN', {
                              style: 'currency',
                              currency: 'VND',
                            })}
                          </Text>
                          <Text
                            style={{
                              fontSize: 18,
                              fontFamily: 'Roboto',
                            }}>
                            x{item.quantity}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                  {/* ************************* */}
                  {/* manage voucher */}
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('Select voucher', {
                        setVoucherList: setVoucherList,
                        voucherList: voucherList,
                        categoryId: key,
                        categoryName: categoryName,
                        totalPriceByCategory: totalPriceByCategory,
                      });
                    }}>
                    <View
                      style={{
                        padding: 20,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottomColor: '#decbcb',
                        borderBottomWidth: 0.75,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          gap: 10,
                          alignItems: 'center',
                          flex: 9,
                        }}>
                        <Text
                          style={{
                            fontSize: 20,
                            fontFamily: 'Roboto',
                            color: 'black',
                          }}>
                          {voucherApplied
                            ? voucherApplied.name
                            : 'Chọn voucher '}
                        </Text>
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
                  </TouchableOpacity>
                  {voucherApplied && (
                    <View
                      style={{
                        paddingHorizontal: 20,
                        paddingVertical: 20,
                        // marginTop: 20,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottomColor: '#decbcb',
                        borderBottomWidth: 0.75,
                      }}>
                      <Text
                        style={{
                          fontSize: 20,
                          fontFamily: 'Roboto',
                          color: 'black',
                        }}>
                        Giá giảm
                      </Text>
                      <Text
                        style={{
                          fontSize: 20,
                          color: 'red',
                          fontFamily: 'Roboto',
                          fontWeight: 'bold',
                        }}>
                        {discountPrice.toLocaleString('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        })}
                      </Text>
                    </View>
                  )}

                  <View
                    style={{
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                      marginTop: 20,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontFamily: 'Roboto',
                        color: 'black',
                      }}>
                      Total price ({totalQuantityByCategory} item):
                    </Text>
                    <Text
                      style={{
                        fontSize: 20,
                        color: 'red',
                        fontFamily: 'Roboto',
                        fontWeight: 'bold',
                      }}>
                      {(discountPrice
                        ? totalPriceByCategory - discountPrice
                        : totalPriceByCategory
                      ).toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      })}
                    </Text>
                  </View>
                </View>
              );
            })}

            {/* Select deliver location */}
            <View
              style={{backgroundColor: 'white', padding: 20, marginTop: 10}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 20,
                }}>
                {/* <Image
                resizeMode="contain"
                style={{width: 25, height: 25}}
                source={icons.location}
              /> */}
                <Text
                  style={{
                    fontSize: 22,
                    fontFamily: 'Roboto',
                    color: 'black',
                    fontWeight: 'bold',
                  }}>
                  Địa điểm giao
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 15,
                  paddingVertical: 15,
                  borderTopColor: '#decbcb',
                  borderTopWidth: 0.75,
                }}>
                <CheckBox
                  disabled={pickUpPointIsChecked}
                  uncheckedCheckBoxColor="#000000"
                  checkedCheckBoxColor={COLORS.primary}
                  onClick={() => {
                    setpickUpPointIsChecked(!pickUpPointIsChecked);
                    setCustomerLocationIsChecked(!customerLocationIsChecked);
                  }}
                  isChecked={pickUpPointIsChecked}
                />
                <Text
                  style={{fontSize: 20, fontFamily: 'Roboto', color: 'black'}}>
                  Điểm nhận hàng
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 15,
                  paddingVertical: 15,
                }}>
                <CheckBox
                  uncheckedCheckBoxColor="#000000"
                  checkedCheckBoxColor={COLORS.primary}
                  onClick={() => {
                    setCustomerLocationIsChecked(!customerLocationIsChecked);
                    setpickUpPointIsChecked(!pickUpPointIsChecked);
                  }}
                  isChecked={customerLocationIsChecked}
                  disabled={customerLocationIsChecked}
                />
                <Text
                  style={{fontSize: 20, fontFamily: 'Roboto', color: 'black'}}>
                  Địa chỉ khách hàng
                </Text>
              </View>
            </View>
            {/* Manage PickupPoint / TimeFrame/ Date */}
            {pickUpPointIsChecked && (
              <View style={{backgroundColor: 'white', marginTop: 20}}>
                {/* Manage Pickup Point */}
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Select pickup point', {
                      setPickupPoint: setPickupPoint,
                    });
                  }}>
                  <View
                    style={{
                      padding: 20,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        gap: 10,
                        alignItems: 'center',
                        width: '80%',
                      }}>
                      <Image
                        resizeMode="contain"
                        style={{width: 25, height: 25}}
                        source={icons.location}
                      />
                      <Text
                        style={{
                          fontSize: 20,
                          fontFamily: 'Roboto',
                          color: 'black',
                        }}>
                        {pickupPoint
                          ? pickupPoint.address
                          : 'Chọn điểm nhận hàng'}
                      </Text>
                    </View>

                    <Image
                      resizeMode="contain"
                      style={{
                        width: 25,
                        height: 25,
                      }}
                      source={icons.rightArrow}
                    />
                  </View>
                </TouchableOpacity>
                {/* Manage Date */}
                <TouchableOpacity
                  onPress={() => {
                    if (cannotChangeDate) {
                      setValidateMessage(
                        'Một trong số sản phẩm của bạn sắp hết hạn, chỉ có thể giao vào ngày này !',
                      );
                      setOpenValidateDialog(true);
                      return;
                    }
                    setOpen(true);
                  }}>
                  <View
                    style={{
                      padding: 20,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTopColor: '#decbcb',
                      borderTopWidth: 0.75,
                      borderBottomColor: '#decbcb',
                      borderBottomWidth: 0.75,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        gap: 10,
                        alignItems: 'center',
                        flex: 9,
                      }}>
                      <Image
                        resizeMode="contain"
                        style={{width: 25, height: 25}}
                        source={icons.calendar}
                      />
                      <Text
                        style={{
                          fontSize: 20,
                          fontFamily: 'Roboto',
                          color: 'black',
                        }}>
                        {date ? format(date, 'dd-MM-yyyy') : 'Chọn ngày giao'}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
                <DatePicker
                  modal
                  mode="date"
                  open={open}
                  date={date ? date : minDate}
                  minimumDate={minDate}
                  maximumDate={maxDate}
                  onConfirm={date => {
                    setOpen(false);
                    setDate(date);
                  }}
                  onCancel={() => {
                    setOpen(false);
                  }}
                />
                {/* Manage time frame */}
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Select time frame', {setTimeFrame});
                  }}>
                  <View
                    style={{
                      padding: 20,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        gap: 10,
                        alignItems: 'center',
                        width: '80%',
                      }}>
                      <Image
                        resizeMode="contain"
                        style={{width: 25, height: 25}}
                        source={icons.time}
                      />
                      <Text
                        style={{
                          fontSize: 20,
                          fontFamily: 'Roboto',
                          color: 'black',
                        }}>
                        {timeFrame
                          ? `${timeFrame?.fromHour.slice(
                              0,
                              5,
                            )} đến ${timeFrame?.toHour.slice(0, 5)}`
                          : 'Chọn khung giờ'}
                      </Text>
                    </View>

                    <Image
                      resizeMode="contain"
                      style={{
                        width: 25,
                        height: 25,
                      }}
                      source={icons.rightArrow}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            )}
            {customerLocationIsChecked && (
              <View style={{backgroundColor: 'white', marginTop: 20}}>
                {/* Manage customer location */}
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Edit customer location', {
                      setCustomerLocation,
                      customerLocation,
                    });
                  }}>
                  <View
                    style={{
                      padding: 20,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <View style={{width: '80%'}}>
                      <View
                        style={{
                          flexDirection: 'row',
                          gap: 10,
                          alignItems: 'center',
                        }}>
                        <Image
                          style={{
                            width: 25,
                            height: 25,
                          }}
                          source={icons.location}
                        />
                        <Text
                          style={{
                            fontSize: 20,
                            fontFamily: 'Roboto',
                            color: 'black',
                          }}>
                          Current location
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          gap: 10,
                          alignItems: 'center',
                          marginTop: 10,
                        }}>
                        <View style={{width: 25}}></View>
                        <View>
                          <Text
                            style={{
                              fontSize: 18,
                              fontFamily: 'Roboto',
                              color: 'black',
                            }}>
                            {customerLocation.address}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <Image
                      resizeMode="contain"
                      style={{
                        width: 25,
                        height: 25,
                      }}
                      source={icons.rightArrow}
                    />
                  </View>
                </TouchableOpacity>
                {/* Manage Date */}
                <TouchableOpacity onPress={() => setOpen(true)}>
                  <View
                    style={{
                      padding: 20,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTopColor: '#decbcb',
                      borderTopWidth: 0.75,
                      borderBottomColor: '#decbcb',
                      borderBottomWidth: 0.75,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        gap: 10,
                        alignItems: 'center',
                        flex: 9,
                      }}>
                      <Image
                        style={{width: 25, height: 25}}
                        source={icons.calendar}
                      />
                      <Text
                        style={{
                          fontSize: 20,
                          fontFamily: 'Roboto',
                          color: 'black',
                        }}>
                        {date ? format(date, 'dd-MM-yyyy') : 'Select date'}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
                <DatePicker
                  modal
                  mode="date"
                  open={open}
                  date={date ? date : minDate}
                  minimumDate={minDate}
                  maximumDate={maxDate}
                  onConfirm={date => {
                    setOpen(false);
                    setDate(date);
                  }}
                  onCancel={() => {
                    setOpen(false);
                  }}
                />
              </View>
            )}
            {/* Manage payment method */}
            <View style={{backgroundColor: 'white', marginTop: 20}}>
              {/* manage payment method */}
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Select payment method', {
                    setPaymentMethod,
                  })
                }>
                <View
                  style={{
                    padding: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottomColor: '#decbcb',
                    borderBottomWidth: 0.75,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 10,
                      alignItems: 'center',
                      width: '80%',
                    }}>
                    <Image
                      resizeMode="contain"
                      style={{width: 25, height: 25}}
                      source={icons.cash}
                    />
                    <Text
                      style={{
                        fontSize: 20,
                        fontFamily: 'Roboto',
                        color: 'black',
                      }}>
                      {paymentMethod
                        ? paymentMethod.display
                        : 'Phương thức thanh toán'}
                    </Text>
                  </View>

                  <Image
                    resizeMode="contain"
                    style={{
                      width: 25,
                      height: 25,
                    }}
                    source={icons.rightArrow}
                  />
                </View>
              </TouchableOpacity>
            </View>

            {/* Thong tin lien lac */}
            <View style={{backgroundColor: 'white', marginTop: 20}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,

                  padding: 20,
                  borderBottomColor: '#decbcb',
                  borderBottomWidth: 0.75,
                }}>
                <Text
                  style={{
                    fontSize: 22,
                    fontFamily: 'Roboto',
                    color: 'black',
                    fontWeight: 'bold',
                  }}>
                  Thông tin liên lạc
                </Text>
              </View>
              <TextInput
                placeholder="Nhập tên"
                style={{
                  fontSize: 20,
                  borderBottomColor: '#decbcb',
                  borderBottomWidth: 0.75,
                  paddingHorizontal: 20,
                  paddingVertical: 20,
                }}
                value={name}
                onChangeText={text => {
                  setName(text);
                }}
              />
              <TextInput
                placeholder="Nhập số điện thoại"
                style={{
                  fontSize: 20,
                  borderBottomColor: '#decbcb',
                  borderBottomWidth: 0.75,
                  paddingHorizontal: 20,
                  paddingVertical: 20,
                }}
                value={phone}
                onChangeText={text => {
                  setPhone(text);
                }}
              />
            </View>

            {/* Payment Detail */}
            <View
              style={{backgroundColor: 'white', padding: 20, marginTop: 20}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 20,
                }}>
                <Text
                  style={{
                    fontSize: 22,
                    fontFamily: 'Roboto',
                    color: 'black',
                    fontWeight: 'bold',
                  }}>
                  Chi tiết đơn hàng
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 15,
                  paddingTop: 20,
                  borderTopColor: '#decbcb',
                  borderTopWidth: 0.75,
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{fontSize: 20, fontFamily: 'Roboto', color: 'black'}}>
                  Tổng giá sản phẩm:
                </Text>
                <Text style={{fontSize: 20, fontFamily: 'Roboto'}}>
                  {totalProductPrice.toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  })}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 15,
                  paddingTop: 20,

                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{fontSize: 20, fontFamily: 'Roboto', color: 'black'}}>
                  Tổng giá giảm:
                </Text>
                <Text style={{fontSize: 20, fontFamily: 'Roboto'}}>
                  {totalDiscountPrice.toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  })}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 15,
                  paddingVertical: 15,
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{fontSize: 20, fontFamily: 'Roboto', color: 'black'}}>
                  Shipping Cost:
                </Text>
                <Text style={{fontSize: 20, fontFamily: 'Roboto'}}>
                  {(0).toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  })}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 15,
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{fontSize: 20, fontFamily: 'Roboto', color: 'black'}}>
                  Thành tiền:
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                    fontFamily: 'Roboto',
                    color: 'red',
                    fontWeight: 'bold',
                  }}>
                  {(totalProductPrice - totalDiscountPrice).toLocaleString(
                    'vi-VN',
                    {
                      style: 'currency',
                      currency: 'VND',
                    },
                  )}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
      {!keyboard && (
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
            marginTop: 20,
          }}>
          <View></View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{fontSize: 18, color: 'black', fontFamily: 'Roboto'}}>
              Tổng cộng:{' '}
            </Text>
            <Text
              style={{
                fontSize: 18,
                color: 'red',
                fontFamily: 'Roboto',
                fontWeight: 'bold',
              }}>
              {(totalProductPrice - totalDiscountPrice).toLocaleString(
                'vi-VN',
                {
                  style: 'currency',
                  currency: 'VND',
                },
              )}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              handleOrder();
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
              Đặt hàng
            </Text>
          </TouchableOpacity>
        </View>
      )}

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
              textStyle={{color: 'red'}}
              text="Đóng"
              onPress={() => {
                setOpenValidateDialog(false);
              }}
            />
          </ModalFooter>
        }>
        <View
          style={{padding: 20, alignItems: 'center', justifyContent: 'center'}}>
          <Text
            style={{
              fontSize: 20,
              fontFamily: 'Roboto',
              color: 'black',
              textAlign: 'center',
            }}>
            {validateMessage}
          </Text>
        </View>
      </Modal>
    </>
  );
};

export default Payment;
