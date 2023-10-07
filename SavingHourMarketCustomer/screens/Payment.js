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
  SlideAnimation,
  ScaleAnimation,
} from 'react-native-modals';
import {useFocusEffect} from '@react-navigation/native';
import {API} from '../constants/api';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import VnpayMerchant, {
  VnpayMerchantModule,
} from '../react-native-vnpay-merchant';
import LoadingScreen from '../components/LoadingScreen';

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

  const [name, setName] = useState(null);

  const [phone, setPhone] = useState(null);

  const [validateMessage, setValidateMessage] = useState('');

  const [minDate, setMinDate] = useState(new Date());

  const [maxDate, setMaxDate] = useState(new Date());

  const [cannotChangeDate, setCannotChangeDate] = useState(false);

  const [initializing, setInitializing] = useState(true);

  const [openAuthModal, setOpenAuthModal] = useState(false);

  const [helpModal, setHelpModal] = useState(false);

  const [loading, setLoading] = useState(false);

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
      setValidateMessage('Hệ thống hiện đang có lỗi');
      setOpenValidateDialog(true);

      return;
    }

    if (getPaymentResponse.status === 401) {
      //Handle Unauthorized (chuyen ve log in hay sao do)
      setOpenAuthModal(true);
      return;
    }

    if (getPaymentResponse.status === 404) {
      setValidateMessage('Không tìm thấy đơn hàng');
      setOpenValidateDialog(true);
    }

    if (getPaymentResponse.status === 403) {
      const responseBody = await getPaymentResponse.json();
      if (responseBody.message === 'ORDER_IS_PAID') {
        setValidateMessage('Đơn hàng đã được thanh toán');
        setOpenValidateDialog(true);
      }

      if (responseBody.message === 'REQUIRED_E_PAYMENT') {
        setValidateMessage('Đơn hàng có phương thức thanh toán là COD');
        setOpenValidateDialog(true);
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
      eventEmitter.addListener('PaymentBack', async e => {
        console.log('Sdk back!');
        if (e) {
          console.log('e.resultCode = ' + e.resultCode);
          switch (e.resultCode) {
            case -1:
              await fetch(`${API.baseURL}/api/order/deleteOrder/${orderId}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${idToken}`,
                },
              })
                .then(res => {
                  return res.json();
                })
                .then(respond => {
                  console.log(respond);
                  setValidateMessage('Thanh toán thất bại ');
                  setOpenValidateDialog(true);
                  // setItem(respond);
                })
                .catch(err => console.log(err));

              console.log('nguoi dung nhan nut back tu device');

              break;
            case 97:
              // Giao dich thanh cong.
              navigation.navigate('Order success', {id: orderId});
              break;
            case 98:
              // Giao dich khong thanh cong. (bao gom case nguoi dung an nut back tu VNPAY UI)
              await fetch(`${API.baseURL}/api/order/deleteOrder/${orderId}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${idToken}`,
                },
              })
                .then(res => {
                  return res.json();
                })
                .then(respond => {
                  console.log(respond);
                  setValidateMessage('Thanh toán thất bại ');
                  setOpenValidateDialog(true);
                  // setItem(respond);
                })
                .catch(err => console.log(err));

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
    setLoading(true);
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
        await AsyncStorage.removeItem('CartList');
        setLoading(false);
        setOpenAuthModal(true);

        return;
      }

      console.log('user is logged in');
      const json = await AsyncStorage.getItem('userInfo');
      const user = JSON.parse(json);

      setName(user.fullName);
      setPhone(user.phone);
      setLoading(false);
    } else {
      // no sessions found.
      await AsyncStorage.removeItem('userInfo');
      await AsyncStorage.removeItem('CartList');
      setLoading(false);
      setOpenAuthModal(true);
      console.log('user is not logged in');
    }
  };

  useEffect(() => {
    // auth().currentUser.reload()
    const subscriber = auth().onAuthStateChanged(
      async userInfo => await onAuthStateChange(userInfo),
    );
    GoogleSignin.configure({
      webClientId:
        '857253936194-dmrh0nls647fpqbuou6mte9c7e4o6e6h.apps.googleusercontent.com',
    });
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

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const orders = await AsyncStorage.getItem('OrderItems');
        setOrderItems(orders ? JSON.parse(orders) : []);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    })();
  }, []);

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
    const tokenId = await auth().currentUser.getIdToken();

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
        receiverName: name,
        receiverPhone: phone,
        pickupPointId: pickupPoint.id,
        timeFrameId: timeFrame.id,
        paymentStatus: 'UNPAID',
        paymentMethod: paymentMethod.id,
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
        receiverName: name,
        receiverPhone: phone,
        paymentStatus: 'UNPAID',
        paymentMethod: paymentMethod.id,
        addressDeliver: customerLocation.address,
        longitude: customerLocation.long,
        latitude: customerLocation.lat,
        discountID: voucherListId,
        orderDetailList: orderDetailList,
      };
    }

    console.log(submitOrder);

    setLoading(true);

    fetch(`${API.baseURL}/api/order/createOrder`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenId}`,
      },
      body: JSON.stringify(submitOrder),
    })
      .then(res => {
        return res.json();
      })
      .then(async respond => {
        console.log(respond);

        if (respond.code === 409) {
          setValidateMessage(respond.message);
          setLoading(false);
          setOpenValidateDialog(true);
          return;
        }
        if (respond.code === 403) {
          setLoading(false);
          setOpenAuthModal(true);
          return;
        }
        // handle vnpay payment method
        if (paymentMethod.id === 1) {
          const createdOrderBody = respond;
          const createdOrderId = createdOrderBody.id;
          const createdOrderTotalPrice = createdOrderBody.totalPrice;
          const idToken = await auth().currentUser.getIdToken();
          console.log('processing vnpay');
          await processVNPay(createdOrderTotalPrice, createdOrderId, idToken);
          setLoading(false);
          return;
        }
        // hangle COD payment method
        if (paymentMethod.id === 0) {
          const createdOrderBody = respond;
          setLoading(false);
          navigation.navigate('Order success', {id: createdOrderBody.id});
          return;
        }
      })

      .catch(err => {
        console.log(err);
        return null;
      });

    // if (!createOrderRequest) {
    //   setValidateMessage('Hệ thống hiện đang có lỗi');
    //   setOpenValidateDialog(true);
    // }

    // if (createOrderRequest) {
    //   // handle vnpay payment method
    //   // hangle COD payment method
    //   // console.log(await createOrderRequest.json());
    //   // Handle other request status
    // }
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
          <View style={{marginBottom: 200}}>
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
                    paddingHorizontal: 20,
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
                        paddingVertical: 20,
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
                            color: COLORS.primary,

                            fontFamily: 'Roboto',
                            backgroundColor: 'white',
                            alignSelf: 'flex-start',
                            paddingVertical: 5,
                            paddingHorizontal: 15,
                            borderRadius: 15,
                            borderColor: COLORS.primary,
                            borderWidth: 1.5,
                            fontWeight: 700,
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
                        paddingVertical: 20,
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
                      Thành tiền ({totalQuantityByCategory} sản phẩm):
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
              <View
                style={{
                  backgroundColor: 'white',
                  marginTop: 20,
                  paddingHorizontal: 20,
                }}>
                {/* Manage Pickup Point */}
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Select pickup point', {
                      setPickupPoint: setPickupPoint,
                    });
                  }}>
                  <View
                    style={{
                      paddingVertical: 20,
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

                {/* Manage time frame */}
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Select time frame', {setTimeFrame});
                  }}>
                  <View
                    style={{
                      paddingVertical: 20,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTopColor: '#decbcb',
                      borderTopWidth: 0.75,
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
                      paddingVertical: 20,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTopColor: '#decbcb',
                      borderTopWidth: 0.75,
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
              </View>
            )}
            {customerLocationIsChecked && (
              <View
                style={{
                  backgroundColor: 'white',
                  marginTop: 20,
                  paddingHorizontal: 20,
                }}>
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
                      paddingVertical: 20,
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
                          Địa chỉ hiện tại
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
                      paddingVertical: 20,
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
              </View>
            )}

            <TouchableOpacity
              onPress={() => {
                setHelpModal(true);
              }}
              style={{
                padding: 20,
                marginTop: 20,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: 10,
                backgroundColor: 'white',
              }}>
              <Image
                resizeMode="contain"
                style={{width: 25, height: 25}}
                source={icons.questionMark}
              />

              <Text
                style={{
                  fontSize: 20,
                  color: 'black',
                  fontFamily: 'Roboto',
                }}>
                Qui định ngày giao hàng
              </Text>
            </TouchableOpacity>

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
            <View
              style={{
                backgroundColor: 'white',
                marginTop: 20,
                paddingHorizontal: 20,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,

                  paddingVertical: 20,
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
                  Phí giao hàng:
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
            height: 100,
            width: '100%',

            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingLeft: 20,
            marginTop: 20,
            elevation: 3,
          }}>
          <TouchableOpacity
            onPress={() => {
              handleOrder();
            }}
            style={{
              height: '60%',
              width: '95%',
              backgroundColor: COLORS.primary,
              textAlign: 'center',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
              paddingHorizontal: 40,
              borderRadius: 30,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 15}}>
              <Image
                resizeMode="contain"
                source={icons.bike}
                style={{width: 25, height: 25, tintColor: 'white'}}
              />
              <Text
                style={{
                  color: 'white',
                  fontSize: 20,
                  fontFamily: 'Roboto',
                  fontWeight: 'bold',
                }}>
                Đặt hàng
              </Text>
            </View>

            <Text
              style={{
                color: 'white',
                fontSize: 18,
                fontFamily: 'Roboto',
              }}>
              {(totalProductPrice - totalDiscountPrice).toLocaleString(
                'vi-VN',
                {
                  style: 'currency',
                  currency: 'VND',
                },
              )}
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
              textStyle={{color: 'red'}}
              onPress={() => {
                setOpenAuthModal(false);
              }}
            />
            <ModalButton
              text="Đăng nhập"
              onPress={async () => {
                try {
                  setOpenAuthModal(false);
                  await GoogleSignin.signOut();
                  auth()
                    .signOut()
                    .then(async () => {
                      await AsyncStorage.removeItem('userInfo');
                      await AsyncStorage.removeItem('CartList');
                      setOpenAuthModal(false);
                      navigation.navigate('Login');
                    })
                    .catch(e => console.log(e));
                } catch (error) {
                  console.log(error);
                }
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
            Phiên bản đăng nhập của bạn đã hết hạn vui lòng đăng nhập lại
          </Text>
        </View>
      </Modal>

      {/* auth modal */}
      <Modal
        width={0.8}
        visible={helpModal}
        onTouchOutside={() => {
          setHelpModal(false);
        }}
        dialogAnimation={
          new SlideAnimation({
            initialValue: 0, // optional
            slideFrom: 'bottom', // optional
            useNativeDriver: true, // optional
          })
        }
        footer={
          <ModalFooter>
            <ModalButton
              text="Tôi đã hiểu"
              onPress={() => {
                setHelpModal(false);
              }}
            />
          </ModalFooter>
        }>
        <View
          style={{
            padding: 20,
          }}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              borderBottomColor: '#decbcb',
              borderBottomWidth: 0.75,
              paddingBottom: 20,
            }}>
            <Text
              style={{
                fontSize: 20,
                color: 'black',
                fontFamily: 'Roboto',
                fontWeight: 'bold',
              }}>
              Qui định chọn ngày giao hàng
            </Text>
          </View>
          <View style={{marginTop: 20, alignItems: 'flex-start', gap: 15}}>
            <View
              style={{flexDirection: 'row', alignItems: 'flex-start', gap: 10}}>
              <Text
                style={{
                  fontSize: 22,
                  color: 'black',
                  fontFamily: 'Roboto',
                  fontWeight: 'bold',
                }}>
                •
              </Text>
              <Text
                style={{fontSize: 18, color: 'black', fontFamily: 'Roboto'}}>
                Đơn hàng luôn được giao sau 2 ngày kể từ ngày đặt hàng trở đi.
              </Text>
            </View>
            <View
              style={{flexDirection: 'row', alignItems: 'flex-start', gap: 10}}>
              <Text
                style={{
                  fontSize: 22,
                  color: 'black',
                  fontFamily: 'Roboto',
                  fontWeight: 'bold',
                }}>
                •
              </Text>
              <Text
                style={{fontSize: 18, color: 'black', fontFamily: 'Roboto'}}>
                Đơn hàng phải giao trước HSD của sản phẩm có HSD gần nhất một
                ngày.
              </Text>
            </View>
            <View
              style={{flexDirection: 'row', alignItems: 'flex-start', gap: 10}}>
              <Text
                style={{
                  fontSize: 22,
                  color: 'black',
                  fontFamily: 'Roboto',
                  fontWeight: 'bold',
                }}>
                •
              </Text>
              <Text
                style={{fontSize: 18, color: 'black', fontFamily: 'Roboto'}}>
                Nếu sản phẩm có HSD gần nhất cách ngày đặt hàng một hoặc hai
                ngày thì sẽ giao vào ngày hôm sau kể từ ngày đặt hàng
              </Text>
            </View>
          </View>
        </View>
      </Modal>
      {loading && <LoadingScreen />}
    </>
  );
};

export default Payment;
