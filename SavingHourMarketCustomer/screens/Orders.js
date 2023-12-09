/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useCallback, useEffect} from 'react';
import {View, Image, Text} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {icons} from '../constants';
import {COLORS} from '../constants/theme';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import {API} from '../constants/api';
import {format} from 'date-fns';
import CartEmpty from '../assets/image/search-empty.png';
import Modal, {
  ModalFooter,
  ModalButton,
  ScaleAnimation,
} from 'react-native-modals';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import LoadingScreen from '../components/LoadingScreen';
import AccountDisable from '../components/AccountDisable';
import database from '@react-native-firebase/database';

const Orders = ({navigation}) => {
  const orderStatus = [
    {display: 'Chờ xác nhận', value: 'PROCESSING'},
    {display: 'Đóng gói', value: 'PACKAGING'},
    {display: 'Giao hàng', value: 'DELIVERING'},
    {display: 'Đã giao', value: 'SUCCESS'},
    {display: 'Đơn thất bại', value: 'FAIL'},
    {display: 'Đã hủy', value: 'CANCEL'},
  ];
  const [currentStatus, setCurrentStatus] = useState({
    display: 'Chờ xác nhận',
    value: 'PROCESSING',
  });
  const [cartList, setCartList] = useState([]);
  const [initializing, setInitializing] = useState(true);
  const [orderList, setOrderList] = useState([]);
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [pickupPoint, setPickupPoint] = useState(null);

  const [isDisableAccount, setIsDisableAccount] = useState(false);

  // state open/close modal
  const [openAccountDisableModal, setOpenAccountDisableModal] = useState(false);

  useFocusEffect(
    useCallback(() => {
      // Get pickup point from AS
      (async () => {
        try {
          const value = await AsyncStorage.getItem('PickupPoint');
          setPickupPoint(value ? JSON.parse(value) : pickupPoint);
        } catch (err) {
          console.log(err);
        }
      })();
    }, []),
  );

  //authen check
  const onAuthStateChange = async userInfo => {
    // console.log(userInfo);
    setLoading(true);
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
        setLoading(false);
        return;
      }
    } else {
      // no sessions found.
      setOpenAuthModal(true);
      setLoading(false);
    }
  };

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
              routes: [{name: 'Initial'}],
            });
          } else {
            // setSystemStatus(snapshot.val());
          }
        });
    }, []),
  );

  // delete user unpaid vnpay order
  const deleteUserUnpaidVnpayOrders = async tokenId => {
    // delete vnpay fail payment order
    const getProcessingUnpaidOrderRequest = await fetch(
      `${API.baseURL}/api/order/getOrdersForCustomer?orderStatus=PROCESSING&isPaid=false`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenId}`,
        },
      },
    ).catch(e => {
      console.log(e);
      return null;
    });

    if (!getProcessingUnpaidOrderRequest) {
      return;
    }

    if (getProcessingUnpaidOrderRequest.status === 200) {
      const orderFailList = await getProcessingUnpaidOrderRequest.json();
      for (const order of orderFailList) {
        // if order paymentMethod is vnpay
        if (order.paymentMethod === 1) {
          const deleteOrderRequest = await fetch(
            `${API.baseURL}/api/order/deleteOrder/${order.id}`,
            {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${tokenId}`,
              },
            },
          ).catch(err => {
            console.log(err);
            return null;
          });
          if (deleteOrderRequest && deleteOrderRequest.status === 200) {
            console.log(await deleteOrderRequest.text());
          }
        }
      }
    }
    //
  };

  useFocusEffect(
    useCallback(() => {
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
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setOrderList([]);
        if (auth().currentUser) {
          const tokenId = await auth().currentUser.getIdToken();

          setLoading(true);
          await deleteUserUnpaidVnpayOrders(tokenId);
          if (currentStatus.display !== 'Đóng gói') {
            // setLoading(true);
            fetch(
              `${API.baseURL}/api/order/getOrdersForCustomer?orderStatus=${currentStatus.value}&createdTimeSortType=DESC`,
              {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${tokenId}`,
                },
              },
            )
              .then(res => res.json())
              .then(respond => {
                console.log(respond);
                if (respond.code === 403) {
                  setOpenAccountDisableModal(true);
                  setLoading(false);
                  return;
                }
                if (respond.code === 401) {
                  setOpenAuthModal(true);
                  setLoading(false);
                  return;
                }
                if (respond.error) {
                  setLoading(false);
                  return;
                }

                setOrderList(respond);
                setLoading(false);
              })
              .catch(err => {
                console.log(err);
                setLoading(false);
              });
          } else {
            // setLoading(true);
            let list = [];
            fetch(
              `${API.baseURL}/api/order/getOrdersForCustomer?page=0&orderStatus=PACKAGING&createdTimeSortType=DESC`,
              {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${tokenId}`,
                },
              },
            )
              .then(res => res.json())
              .then(respond => {
                console.log(respond);
                if (respond.code === 403) {
                  setOpenAccountDisableModal(true);
                  setLoading(false);
                  return;
                }
                if (respond.code === 401) {
                  setOpenAuthModal(true);
                  setLoading(false);
                  return;
                }
                if (respond.error) {
                  setLoading(false);
                  return;
                }
                list = list.concat(respond);

                fetch(
                  `${API.baseURL}/api/order/getOrdersForCustomer?page=0&orderStatus=PACKAGED&createdTimeSortType=DESC`,
                  {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${tokenId}`,
                    },
                  },
                )
                  .then(res => res.json())
                  .then(respond => {
                    console.log(respond);
                    if (respond.code === 403) {
                      setOpenAccountDisableModal(true);
                      setLoading(false);
                      return;
                    }
                    if (respond.code === 401) {
                      setOpenAuthModal(true);
                      setLoading(false);
                      return;
                    }
                    if (respond.error) {
                      setLoading(false);
                      return;
                    }

                    list = list.concat(respond);
                    setOrderList(list);
                    setLoading(false);
                  })
                  .catch(err => {
                    console.log(err);
                    setLoading(false);
                  });
              })
              .catch(err => {
                console.log(err);
                setLoading(false);
              });
          }
        }
      };
      fetchData();
    }, [currentStatus, isDisableAccount]),
  );

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const cartList = await AsyncStorage.getItem(
            'CartList' + pickupPoint.id,
          );
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
            marginVertical: 15,
            marginHorizontal: 15,
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
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {orderStatus.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setCurrentStatus(item);
              }}>
              <View
                style={[
                  {
                    paddingHorizontal: 15,
                    paddingBottom: 15,
                  },
                  currentStatus.display === item.display && {
                    borderBottomColor: COLORS.primary,
                    borderBottomWidth: 2,
                  },
                ]}>
                <Text
                  style={{
                    fontFamily: 'Roboto',
                    fontSize: 16,
                    color:
                      currentStatus.display === item.display
                        ? COLORS.primary
                        : 'black',
                    fontWeight:
                      currentStatus.display === item.display ? 'bold' : 400,
                  }}>
                  {item.display}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Order list */}
      {orderList.length === 0 ? (
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Image
            style={{width: '100%', height: '50%'}}
            resizeMode="contain"
            source={CartEmpty}
          />
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'Roboto',
              // color: 'black',
              fontWeight: 'bold',
            }}>
            Chưa có sản phẩm nào trong giỏ hàng
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{marginTop: 20}}>
          <View style={{marginBottom: 100}}>
            {orderList.map(item => (
              <View
                key={item.id}
                style={{backgroundColor: 'white', marginBottom: 20}}>
                {/* Order detail */}
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('OrderDetail', {
                      id: item.id,
                      orderSuccess: false,
                    });
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
                        {item?.status === 0 && 'Chờ xác nhận'}
                        {item?.status === 1 && 'Đang đóng gói'}
                        {item?.status === 2 && 'Đã đóng gói'}
                        {item?.status === 3 && 'Đang giao hàng'}
                        {item?.status === 4 && 'Thành công'}
                        {item?.status === 5 && 'Đơn thất bại'}
                        {item?.status === 6 && 'Đã hủy'}
                      </Text>
                      <Text
                        style={{
                          fontSize: 17,
                          fontWeight: 'bold',
                          fontFamily: 'Roboto',
                          color: 'black',
                        }}>
                        Mã đơn hàng : {item.code}
                      </Text>

                      <Text
                        style={{
                          fontSize: 17,
                          fontWeight: 'bold',
                          fontFamily: 'Roboto',
                          color: 'black',
                        }}>
                        Ngày đặt :{' '}
                        {format(Date.parse(item?.createdTime), 'dd/MM/yyyy')}
                      </Text>
                      <Text
                        style={{
                          fontSize: 17,
                          fontWeight: 'bold',
                          fontFamily: 'Roboto',
                          color: 'black',
                        }}>
                        Ngày giao :{' '}
                        {format(Date.parse(item?.deliveryDate), 'dd/MM/yyyy')}
                      </Text>
                      <Text
                        style={{
                          fontSize: 17,
                          fontWeight: 'bold',
                          fontFamily: 'Roboto',
                          color: 'black',
                        }}>
                        Tổng tiền:{' '}
                        {item?.totalPrice?.toLocaleString('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        })}
                      </Text>
                      <Text
                        style={{
                          fontSize: 17,
                          fontWeight: 'bold',
                          fontFamily: 'Roboto',
                          color: 'black',
                        }}>
                        Phương thức thanh toán:{' '}
                        {item?.paymentMethod === 0 ? 'COD' : 'VN Pay'}
                      </Text>
                      {(item.status === 4 || item.status === 5) && (
                        <TouchableOpacity onPress={() => {
                          navigation.navigate('Order Feedback');
                        }}>
                          <Text
                            style={{
                              fontSize: 18,
                              fontWeight: '100',
                              fontFamily: 'Roboto',
                              color: COLORS.primary,
                            }}>
                            Đánh giá đơn hàng
                          </Text>
                        </TouchableOpacity>
                      )}
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
                {/* <TouchableOpacity>
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
              </TouchableOpacity> */}

                {/* ******************** */}
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {/* ************************ */}
      {/* auth modal */}
      <Modal
        width={0.8}
        visible={openAuthModal}
        onTouchOutside={() => {
          setOpenAuthModal(false);
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
              text="Ở lại trang"
              onPress={async () => {
                setOpenAuthModal(false);
              }}
            />
            <ModalButton
              text="Đăng nhập"
              textStyle={{color: COLORS.primary}}
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
          style={{padding: 20, alignItems: 'center', justifyContent: 'center'}}>
          <Text
            style={{
              fontSize: 20,
              fontFamily: 'Roboto',
              color: 'black',
              textAlign: 'center',
            }}>
            Vui lòng đăng nhập để thực hiện chức năng này
          </Text>
        </View>
      </Modal>

      {/* account disable modal  */}
      <AccountDisable
        openAccountDisableModal={openAccountDisableModal}
        setOpenAccountDisableModal={setOpenAccountDisableModal}
        navigation={navigation}
      />
      {loading && <LoadingScreen />}
    </>
  );
};

export default Orders;
