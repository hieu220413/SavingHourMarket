import React, {useCallback, useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import {icons} from '../../constants';
import {COLORS} from '../../constants/theme';
import {useFocusEffect} from '@react-navigation/native';
import {API} from '../../constants/api';
import LoadingScreen from '../../components/LoadingScreen';
import CartEmpty from '../../assets/image/search-empty.png';
import {format} from 'date-fns';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import database from '@react-native-firebase/database';
import {checkSystemState} from '../../common/utils';

const OrderListForReport = ({navigation, route}) => {
  // listen to system state
  useFocusEffect(
    useCallback(() => {
      checkSystemState(navigation);
    }, []),
  );

  const {type, mode, date} = route.params;
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [orderList, setOrderList] = useState(null);

  // const onAuthStateChange = async userInfo => {
  //   // console.log(userInfo);
  //   if (initializing) {
  //     setInitializing(false);
  //   }
  //   if (userInfo) {
  //     // check if user sessions is still available. If yes => redirect to another screen
  //     const userTokenId = await userInfo
  //       .getIdToken(true)
  //       .then(token => token)
  //       .catch(async e => {
  //         console.log(e);
  //         return null;
  //       });
  //     if (!userTokenId) {
  //       // sessions end. (revoke refresh token like password change, disable account, ....)
  //       await AsyncStorage.removeItem('userInfo');
  //       // navigation.navigate('Login');
  //       navigation.reset({
  //         index: 0,
  //         routes: [{name: 'Login'}],
  //       });
  //       return;
  //     }
  //     const currentUser = await AsyncStorage.getItem('userInfo');
  //     //   console.log('currentUser', currentUser);
  //   } else {
  //     // no sessions found.
  //     console.log('user is not logged in');
  //     await AsyncStorage.removeItem('userInfo');
  //     // navigation.navigate('Login');
  //     navigation.reset({
  //       index: 0,
  //       routes: [{name: 'Login'}],
  //     });
  //   }
  // };

  // useFocusEffect(
  //   useCallback(() => {
  //     // auth().currentUser.reload()
  //     const subscriber = auth().onAuthStateChanged(
  //       async userInfo => await onAuthStateChange(userInfo),
  //     );

  //     return subscriber;
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, []),
  // );

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        if (auth().currentUser) {
          const tokenId = await auth().currentUser.getIdToken();
          if (tokenId) {
            setLoading(true);
            if (type === 'success') {
              if (mode === 1) {
                fetch(
                  `${API.baseURL}/api/order/staff/getOrders?getOldOrder=true&orderStatus=SUCCESS`,
                  {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${tokenId}`,
                    },
                  },
                )
                  .then(async res => {
                    if (res.status === 403 || res.status === 401) {
                      const tokenIdCheck = await auth()
                        .currentUser.getIdToken(true)
                        .catch(async err => {
                          await AsyncStorage.setItem('isDisableAccount', '1');
                          return null;
                        });
                      if (!tokenIdCheck) {
                        throw new Error();
                      }
                      // Cac loi 403 khac thi handle duoi day neu co
                    }
                    return res.json();
                  })
                  .then(response => {
                    console.log(response[3].deliveryMethod);
                    setOrderList(response);
                    setLoading(false);
                  })
                  .catch(err => {
                    console.log(err);
                    setLoading(false);
                  });
              }
              if (mode === 2) {
                fetch(
                  `${API.baseURL}/api/order/staff/getOrders?getOldOrder=true&deliveryDate=${date}&orderStatus=SUCCESS`,
                  {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${tokenId}`,
                    },
                  },
                )
                  .then(async res => {
                    if (res.status === 403 || res.status === 401) {
                      const tokenIdCheck = await auth()
                        .currentUser.getIdToken(true)
                        .catch(async err => {
                          await AsyncStorage.setItem('isDisableAccount', '1');
                          return null;
                        });
                      if (!tokenIdCheck) {
                        throw new Error();
                      }
                      // Cac loi 403 khac thi handle duoi day neu co
                    }
                    return res.json();
                  })
                  .then(response => {
                    console.log(response.length);
                    setOrderList(response);
                    setLoading(false);
                  })
                  .catch(err => {
                    console.log(err);
                    setLoading(false);
                  });
              }
            }
            if (type === 'delivering') {
              if (mode === 1) {
                fetch(
                  `${API.baseURL}/api/order/staff/getOrders?orderStatus=DELIVERING`,
                  {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${tokenId}`,
                    },
                  },
                )
                  .then(async res => {
                    if (res.status === 403 || res.status === 401) {
                      const tokenIdCheck = await auth()
                        .currentUser.getIdToken(true)
                        .catch(async err => {
                          await AsyncStorage.setItem('isDisableAccount', '1');
                          return null;
                        });
                      if (!tokenIdCheck) {
                        throw new Error();
                      }
                      // Cac loi 403 khac thi handle duoi day neu co
                    }
                    return res.json();
                  })
                  .then(response => {
                    console.log(response.length);
                    setOrderList(response);
                    setLoading(false);
                  })
                  .catch(err => {
                    console.log(err);
                    setLoading(false);
                  });
              }
              if (mode === 2) {
                fetch(
                  `${API.baseURL}/api/order/staff/getOrders?deliveryDate=${date}&orderStatus=DELIVERING`,
                  {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${tokenId}`,
                    },
                  },
                )
                  .then(async res => {
                    if (res.status === 403 || res.status === 401) {
                      const tokenIdCheck = await auth()
                        .currentUser.getIdToken(true)
                        .catch(async err => {
                          await AsyncStorage.setItem('isDisableAccount', '1');
                          return null;
                        });
                      if (!tokenIdCheck) {
                        throw new Error();
                      }
                      // Cac loi 403 khac thi handle duoi day neu co
                    }
                    return res.json();
                  })
                  .then(response => {
                    console.log(response.length);
                    setOrderList(response);
                    setLoading(false);
                  })
                  .catch(err => {
                    console.log(err);
                    setLoading(false);
                  });
              }
            }
            if (type === 'fail') {
              if (mode === 1) {
                fetch(
                  `${API.baseURL}/api/order/staff/getOrders?getOldOrder=true&orderStatus=FAIL`,
                  {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${tokenId}`,
                    },
                  },
                )
                  .then(async res => {
                    if (res.status === 403 || res.status === 401) {
                      const tokenIdCheck = await auth()
                        .currentUser.getIdToken(true)
                        .catch(async err => {
                          await AsyncStorage.setItem('isDisableAccount', '1');
                          return null;
                        });
                      if (!tokenIdCheck) {
                        throw new Error();
                      }
                      // Cac loi 403 khac thi handle duoi day neu co
                    }
                    return res.json();
                  })
                  .then(response => {
                    console.log(response.length);
                    setOrderList(response);
                    setLoading(false);
                  })
                  .catch(err => {
                    console.log(err);
                    setLoading(false);
                  });
              }
              if (mode === 2) {
                fetch(
                  `${API.baseURL}/api/order/staff/getOrders?getOldOrder=true&deliveryDate=${date}&orderStatus=FAIL`,
                  {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${tokenId}`,
                    },
                  },
                )
                  .then(async res => {
                    if (res.status === 403 || res.status === 401) {
                      const tokenIdCheck = await auth()
                        .currentUser.getIdToken(true)
                        .catch(async err => {
                          await AsyncStorage.setItem('isDisableAccount', '1');
                          return null;
                        });
                      if (!tokenIdCheck) {
                        throw new Error();
                      }
                      // Cac loi 403 khac thi handle duoi day neu co
                    }
                    return res.json();
                  })
                  .then(response => {
                    console.log(response.length);
                    setOrderList(response);
                    setLoading(false);
                  })
                  .catch(err => {
                    console.log(err);
                    setLoading(false);
                  });
              }
            }
          }
        }
      };
      fetchData();
    }, []),
  );
  return (
    <>
      <View>
        <View
          style={{
            // flex: 1,
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
              style={{width: 25, height: 25, tintColor: COLORS.primary}}
            />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 20,
              textAlign: 'center',
              color: '#000000',
              fontWeight: 'bold',
              fontFamily: 'Roboto',
            }}>
            {type === 'success' && 'Đơn thành công'}
            {type === 'delivering' && 'Đơn đang giao'}
            {type === 'fail' && 'Đơn trả hàng'}
          </Text>
        </View>

        {orderList?.length === 0 ? (
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Image
              style={{width: '100%', height: '50%'}}
              resizeMode="contain"
              source={CartEmpty}
            />
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Roboto',
                // color: 'black',
                fontWeight: 'bold',
              }}>
              Chưa có đơn hàng nào
            </Text>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            style={{marginBottom: '25%', marginTop: '2%'}}>
            {orderList?.map((item, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: 'white',
                  padding: '5%',
                  marginVertical: '3%',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('OrderDetailForManager', {
                      id: item?.id,
                      orderSuccess: false,
                    });
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <View style={{flexDirection: 'column', gap: 8, flex: 9}}>
                      {type === 'success' && (
                        <Text
                          style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            fontFamily: 'Roboto',
                            color: COLORS.primary,
                          }}>
                          Đơn giao thành công
                        </Text>
                      )}
                      {type === 'delivering' && (
                        <Text
                          style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            fontFamily: 'Roboto',
                            color: COLORS.primary,
                          }}>
                          Đơn đang giao
                        </Text>
                      )}
                      {type === 'fail' && (
                        <Text
                          style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            fontFamily: 'Roboto',
                            color: 'red',
                          }}>
                          Đơn trả hàng
                        </Text>
                      )}

                      {item?.deliverer ? (
                        <View
                          style={{
                            position: 'absolute',
                            right: '2%',
                            bottom: '86%',
                          }}>
                          <Image
                            style={{
                              width: 35,
                              height: 35,
                              borderRadius: 40,
                            }}
                            resizeMode="contain"
                            source={{
                              uri: `${item?.deliverer.avatarUrl}`,
                            }}
                          />
                        </View>
                      ) : (
                        <></>
                      )}
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          fontFamily: 'Roboto',
                          color: 'black',
                        }}>
                        Ngày giao hàng :{' '}
                        {format(Date.parse(item?.deliveryDate), 'dd/MM/yyyy')}
                      </Text>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          fontFamily: 'Roboto',
                          color: 'black',
                        }}>
                        Giờ giao hàng : {item?.timeFrame?.fromHour} đến{' '}
                        {item?.timeFrame?.toHour}
                      </Text>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          fontFamily: 'Roboto',
                          color: 'black',
                        }}>
                        Loại đơn :{' '}
                        {item?.deliveryMethod === 1
                          ? 'Giao tận nhà'
                          : 'Giao đến điểm giao hàng'}
                      </Text>

                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          fontFamily: 'Roboto',
                          color: 'black',
                        }}>
                        {item.deliveryMethod === 1
                          ? `Địa chỉ : ${item?.addressDeliver}`
                          : `Điểm giao hàng : ${item?.addressDeliver}`}
                      </Text>

                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          fontFamily: 'Roboto',
                          color: 'black',
                        }}>
                        Nhân viên giao hàng :{' '}
                        {item?.deliverer === null
                          ? 'Chưa có'
                          : item?.deliverer.fullName}
                      </Text>
                    </View>
                    <View style={{flex: 1}}>
                      <Image
                        resizeMode="contain"
                        style={{
                          width: 30,
                          height: 30,
                          tintColor: COLORS.primary,
                        }}
                        source={icons.rightArrow}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
      {loading && <LoadingScreen />}
    </>
  );
};

export default OrderListForReport;

const styles = StyleSheet.create({});
