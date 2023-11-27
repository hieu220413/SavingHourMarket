/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  Image,
  Text,
  Modal,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  FlatList,
} from 'react-native';
import {
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import {icons} from '../../constants';
import {COLORS} from '../../constants/theme';
import QrCode from '../../assets/image/test-qrcode.png';
import {API} from '../../constants/api';
import {useFocusEffect} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {format} from 'date-fns';
import Toast from 'react-native-toast-message';
import LoadingScreen from '../../components/LoadingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import database from '@react-native-firebase/database';
import {checkSystemState} from '../../common/utils';

const OrderDetail = ({navigation, route}) => {
  // listen to system state
  useFocusEffect(
    useCallback(() => {
      checkSystemState(navigation);
    }, []),
  );

  const {id, orderSuccess, isFromOrderGroup} = route.params;
  const [initializing, setInitializing] = useState(true);
  const [tokenId, setTokenId] = useState(null);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [visibleCancel, setVisibleCancel] = useState(false);

  const [consolidationAreaList, setConsolidationAreaList] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedConsolidationAreaId, setSelectedConsolidationAreaId] =
    useState('');

  const showToast = message => {
    Toast.show({
      type: 'success',
      text1: 'Thành công',
      text2: message + '👋',
      visibilityTime: 1000,
    });
  };

  const getConsolidationArea = async pickupPointId => {
    const tokenId = await auth().currentUser.getIdToken();
    if (tokenId) {
      setLoading(true);
      await fetch(
        `${API.baseURL}/api/productConsolidationArea/getByPickupPointForStaff?pickupPointId=${pickupPointId}`,
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
        .then(respond => {
          // console.log('order group', respond);
          if (respond.error) {
            setLoading(false);
            return;
          }
          setSelectedConsolidationAreaId('');
          setConsolidationAreaList(respond);
          setLoading(false);
          setVisible(true);
        })
        .catch(err => {
          console.log(err);
          setLoading(false);
        });
    }
  };

  // const onAuthStateChange = async userInfo => {
  //   setLoading(true);
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
  //       setLoading(false);
  //       return;
  //     }

  //     const token = await auth().currentUser.getIdToken();
  //     setTokenId(token);
  //     setLoading(false);
  //   } else {
  //     // no sessions found.
  //     console.log('user is not logged in');
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   // auth().currentUser.reload()
  //   const subscriber = auth().onAuthStateChanged(
  //     async userInfo => await onAuthStateChange(userInfo),
  //   );
  //   return subscriber;
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  useFocusEffect(
    useCallback(() => {
      if (tokenId) {
        setLoading(true);
        fetch(`${API.baseURL}/api/order/getOrderDetail/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokenId}`,
          },
        })
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
          .then(respond => {
            console.log(respond);
            setItem(respond);
            setLoading(false);
          })
          .catch(err => {
            console.log(err);
            setLoading(false);
          });
      }
    }, [tokenId]),
  );

  const handleCancel = () => {
    setVisible(false);
    setVisibleCancel(false);
  };

  const handleConfirm = () => {
    const confirmPackaging = async () => {
      console.log('confirm');
      if (auth().currentUser) {
        const tokenId = await auth().currentUser.getIdToken();
        if (tokenId) {
          setLoading(true);
          fetch(
            `${API.baseURL}/api/order/packageStaff/confirmPackaging?orderId=${item.id}&productConsolidationAreaId=${selectedConsolidationAreaId}`,
            {
              method: 'PUT',
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
              return res.text();
            })
            .then(respond => {
              console.log(respond);
              showToast(respond);
              navigation.goBack();
            })
            .catch(err => {
              console.log(err);
              setLoading(false);
            });
        }
      }
    };

    const confirmPackaged = async () => {
      if (auth().currentUser) {
        const tokenId = await auth().currentUser.getIdToken();
        if (tokenId) {
          setLoading(true);
          fetch(
            `${API.baseURL}/api/order/packageStaff/confirmPackaged?orderId=${item.id}`,
            {
              method: 'PUT',
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
              return res.text();
            })
            .then(respond => {
              showToast(respond);
              navigation.goBack();
            })
            .catch(err => {
              console.log(err);
              setLoading(false);
            });
        }
      }
    };
    if (item.status === 0) {
      confirmPackaging();
    } else {
      confirmPackaged();
    }
    // fetchData();
    // setLoading(false);
    // The user has pressed the "Delete" button, so here you can do your own logic.
    // ...Your logic
    setVisible(false);
  };

  const handleCancelPackage = () => {
    const confirmCancel = async () => {
      console.log('confirm');
      if (auth().currentUser) {
        const tokenId = await auth().currentUser.getIdToken();
        if (tokenId) {
          setLoading(true);
          fetch(
            `${API.baseURL}/api/order/packageStaff/cancelOrder/${item.id}`,
            {
              method: 'PUT',
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
              return res.text();
            })
            .then(respond => {
              console.log(respond);
              showToast(respond);
              navigation.goBack();
            })
            .catch(err => {
              console.log(err);
              setLoading(false);
            });
        }
      }
    };
    confirmCancel();
    setVisibleCancel(false);
  };

  // print
  const print = async orderId => {
    setLoading(true);
    console.log('print');
    const tokenId = await auth().currentUser.getIdToken();
    if (tokenId) {
      await fetch(
        `${API.baseURL}/api/order/packageStaff/printOrderPackaging?orderId=${orderId}`,
        {
          method: 'PUT',
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
          return res.text();
        })
        .then(respond => {
          // console.log('order group', respond);
          if (respond.error) {
            setLoading(false);
            return;
          }
          console.log(respond);
          navigation.navigate('OrderPrint', {
            uri: respond,
          });
          setLoading(false);
        })
        .catch(err => {
          console.log(err);
          setLoading(false);
        });
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
            backgroundColor: '#ffffff',
            padding: 20,
            elevation: 4,
            marginBottom: 10,
          }}>
          <TouchableOpacity
            onPress={() =>
              orderSuccess ? navigation.navigate('Home') : navigation.goBack()
            }>
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
            Chi tiết đơn hàng
          </Text>
          {(item?.status === 1 || item?.status === 2) && (
            <TouchableOpacity
              style={{marginLeft: 'auto'}}
              onPress={() => {
                print(id);
              }}>
              <Image
                source={icons.print}
                resizeMode="contain"
                style={{width: 35, height: 35, tintColor: COLORS.primary}}
              />
            </TouchableOpacity>
          )}
        </View>
        {item && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            style={{
              height: item?.status === 0 || item?.status === 1 ? '84%' : '90%',
            }}>
            <View
              style={{
                padding: 20,
                backgroundColor:
                  item?.status === 6 || item?.status === 5
                    ? COLORS.red
                    : COLORS.primary,
              }}>
              <Text
                style={{color: 'white', fontSize: 18, fontFamily: 'Roboto'}}>
                {item?.status === 0 && 'Đơn hàng đang chờ đóng gói'}
                {item?.status === 1 && 'Đơn hàng đang đóng gói'}
                {item?.status === 2 && 'Đơn hàng đã đóng gói'}
                {item?.status === 3 && 'Đơn hàng đang được giao'}
                {item?.status === 4 && 'Đơn hàng đã giao thành công'}
                {item?.status === 5 && 'Đơn hàng giao thất bại'}
                {item?.status === 6 && 'Đơn hàng đã huỷ'}
              </Text>
            </View>
            <View
              style={{padding: 20, backgroundColor: 'white', marginBottom: 20}}>
              {/* pickup location */}
              <View
                style={{
                  backgroundColor: 'white',
                  paddingVertical: 20,
                  gap: 10,
                  borderBottomColor: '#decbcb',
                  borderBottomWidth: 0.75,
                }}>
                <View
                  style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                  <Image
                    style={{width: 20, height: 20}}
                    resizeMode="contain"
                    source={icons.location}
                  />
                  <Text
                    style={{fontSize: 20, color: 'black', fontWeight: 'bold'}}>
                    Thông tin giao hàng
                  </Text>
                </View>
                <View
                  style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                  <View style={{width: 20}} />
                  <View style={{gap: 8}}>
                    <View style={{gap: 3, paddingRight: 20}}>
                      {/* <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                  Điểm giao hàng:
                </Text> */}
                      <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                        {item?.addressDeliver
                          ? item?.addressDeliver
                          : item?.pickupPoint.address}
                      </Text>
                    </View>
                    {item.timeFrame && (
                      <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                        {item?.timeFrame
                          ? `${item?.timeFrame?.fromHour.slice(
                              0,
                              5,
                            )} đến ${item?.timeFrame?.toHour.slice(0, 5)}`
                          : ''}
                      </Text>
                    )}
                    <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                      Ngày giao hàng:{' '}
                      {format(new Date(item?.deliveryDate), 'dd/MM/yyyy')}
                    </Text>
                  </View>
                </View>
              </View>
              {/* ******************* */}
              {/* Customer information */}
              <View
                style={{
                  backgroundColor: 'white',
                  paddingVertical: 20,
                  gap: 10,
                }}>
                <View
                  style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                  <Image
                    style={{width: 20, height: 20}}
                    resizeMode="contain"
                    source={icons.phone}
                  />
                  <Text
                    style={{fontSize: 20, color: 'black', fontWeight: 'bold'}}>
                    Thông tin liên lạc
                  </Text>
                </View>
                <View
                  style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                  <View style={{width: 20}} />
                  <View style={{gap: 5}}>
                    <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                      {item.receiverName}
                    </Text>
                    <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                      {item.receiverPhone}
                    </Text>
                  </View>
                </View>
              </View>
              {/* *********************** */}
            </View>

            {/* Order Item */}
            <View
              style={{
                backgroundColor: 'white',
                paddingBottom: 10,
                marginBottom: 10,
                padding: 20,
              }}>
              {item?.orderDetailList?.map(product => (
                <View
                  key={product.id}
                  style={{
                    flexDirection: 'row',
                    gap: 10,
                    alignItems: 'center',
                    backgroundColor: 'white',
                    borderBottomColor: '#decbcb',
                    borderBottomWidth: 0.5,
                    paddingVertical: 20,
                  }}>
                  <View
                    style={{
                      flexDirection: 'column',
                      gap: 10,
                      flex: 7,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        gap: 10,
                        alignItems: 'center',
                        backgroundColor: 'white',
                        borderBottomColor: '#decbcb',
                        borderBottomWidth: 0.5,
                        paddingVertical: 20,
                      }}>
                      <Image
                        source={{
                          uri: product.images[0].imageUrl,
                        }}
                        style={{width: 100, height: 100}}
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
                          {product.name}
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
                          {product.productCategory}
                        </Text>
                        <Text
                          style={{
                            fontSize: 18,
                            color: 'black',
                            fontFamily: 'Roboto',
                            fontWeight: 'bold',
                          }}>
                          HSD:
                          {format(
                            new Date(
                              product.orderDetailProductBatches[0].expiredDate,
                            ),
                            'dd/MM/yyyy',
                          )}
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
                            {product.productPrice.toLocaleString('vi-VN', {
                              style: 'currency',
                              currency: 'VND',
                            })}
                          </Text>
                        </View>
                      </View>
                    </View>
                    {product.orderDetailProductBatches.map((item, index) => (
                      <>
                        <View key={index}>
                          <Text
                            style={{
                              fontSize: 18,
                              color: 'black',
                              fontFamily: 'Roboto',
                              fontWeight: 'bold',
                            }}>
                            {item.supermarketName}
                          </Text>
                          <Text
                            style={{
                              fontSize: 18,
                              color: 'black',
                              fontFamily: 'Roboto',
                            }}>
                            Chi nhánh: {item.supermarketAddress}
                          </Text>
                          <Text
                            style={{
                              fontSize: 18,
                              color: 'black',
                              fontFamily: 'Roboto',
                            }}>
                            Số lượng: {item.boughtQuantity} {product.unit}
                          </Text>
                        </View>
                      </>
                    ))}
                  </View>
                </View>
              ))}

              <View
                style={{
                  paddingHorizontal: 20,
                  paddingBottom: 20,
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
                  Tổng cộng :
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                    color: 'red',
                    fontFamily: 'Roboto',
                    fontWeight: 'bold',
                  }}>
                  {item.totalPrice.toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  })}
                </Text>
              </View>
            </View>
            {/* ********************* */}

            {/* Detail information */}
            <View
              style={{
                backgroundColor: 'white',
                padding: 20,
                marginTop: 20,
                marginBottom: 20,
              }}>
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
                  Thanh toán
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
                  Mã đơn hàng:
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                    fontFamily: 'Roboto',
                    width: '60%',
                    paddingBottom: 9,
                  }}>
                  {item.id}
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
                  Trạng thái
                </Text>
                <Text style={{fontSize: 20, fontFamily: 'Roboto'}}>
                  {item.paymentStatus === 0
                    ? 'Chưa thanh toán'
                    : 'Đã thanh toán'}
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
                  Phương thức
                </Text>
                <Text style={{fontSize: 20, fontFamily: 'Roboto'}}>
                  {item.paymentMethod === 0 ? 'COD' : 'VN Pay'}
                </Text>
              </View>
            </View>

            {/* ******************* */}
          </ScrollView>
        )}
        {/* Modal Package */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={visible}
          onRequestClose={() => {
            setVisible(!visible);
          }}>
          <Pressable
            onPress={() => setVisible(false)}
            style={styles.centeredView}>
            <View style={styles.modalView}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 20,
                    fontWeight: 700,
                    textAlign: 'center',
                    paddingBottom: 20,
                  }}>
                  {item?.status === 0 && 'Xác nhận đóng gói đơn hàng'}
                  {item?.status === 1 && 'Hoàn thành đóng gói đơn hàng'}
                </Text>
              </View>
              {item?.status === 0 && (
                <>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 18,
                        fontWeight: 400,
                        paddingBottom: 15,
                      }}>
                      Vui lòng chọn điểm tập kết:
                    </Text>
                  </View>
                  <FlatList
                    style={{maxHeight: 170}}
                    data={consolidationAreaList}
                    renderItem={data => (
                      <TouchableOpacity
                        key={data.item.id}
                        onPress={() => {
                          setSelectedConsolidationAreaId(data.item.id);
                        }}
                        style={{
                          paddingVertical: 15,
                          borderTopColor: '#decbcb',
                          borderTopWidth: 0.75,
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 15,
                            flex: 1,
                            justifyContent: 'space-between',
                          }}>
                          <Image
                            resizeMode="contain"
                            style={{width: 20, height: 20}}
                            source={icons.location}
                            tintColor={
                              data.item.id === selectedConsolidationAreaId
                                ? COLORS.secondary
                                : 'black'
                            }
                          />
                          <Text
                            style={{
                              fontSize: 16,
                              color:
                                data.item.id === selectedConsolidationAreaId
                                  ? COLORS.secondary
                                  : 'black',
                              fontFamily: 'Roboto',
                              textDecorationColor: 'red',
                              flexShrink: 1,
                            }}>
                            {data.item.address}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                </>
              )}
              {item?.status === 1 && (
                <Text
                  style={{
                    color: 'black',
                    fontSize: 18,
                    fontWeight: 400,
                    paddingBottom: 20,
                  }}>
                  Bạn đã hoàn thành đóng gói đơn hàng này ?
                </Text>
              )}

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  style={{
                    width: 150,
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                    backgroundColor: 'white',
                    borderRadius: 10,
                    borderColor: COLORS.primary,
                    borderWidth: 0.5,
                    marginRight: '2%',
                  }}
                  onPress={handleCancel}>
                  <Text
                    style={{
                      color: COLORS.primary,
                      fontWeight: 'bold',
                      textAlign: 'center',
                    }}>
                    Đóng
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    width: 150,
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                    backgroundColor: COLORS.primary,
                    color: 'white',
                    borderRadius: 10,
                  }}
                  onPress={() => {
                    handleConfirm();
                  }}>
                  <Text style={styles.textStyle}>Xác nhận</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </Modal>
        {/* Modal Cancel */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={visibleCancel}
          onRequestClose={() => {
            setVisibleCancel(!visibleCancel);
          }}>
          <Pressable
            onPress={() => setVisibleCancel(false)}
            style={styles.centeredView}>
            <View style={styles.modalView}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 20,
                    fontWeight: 700,
                    textAlign: 'center',
                    paddingBottom: 20,
                  }}>
                  Xác nhận huỷ đóng gói
                </Text>
              </View>

              <Text
                style={{
                  color: 'black',
                  fontSize: 18,
                  fontWeight: 400,
                  paddingBottom: 20,
                }}>
                Đơn hàng này thực sự không thể đóng gói ?
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  style={{
                    width: 150,
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                    backgroundColor: 'white',
                    borderRadius: 10,
                    borderColor: COLORS.primary,
                    borderWidth: 0.5,
                    marginRight: '2%',
                  }}
                  onPress={handleCancel}>
                  <Text
                    style={{
                      color: COLORS.primary,
                      fontWeight: 'bold',
                      textAlign: 'center',
                    }}>
                    Đóng
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    width: 150,
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                    backgroundColor: COLORS.primary,
                    color: 'white',
                    borderRadius: 10,
                  }}
                  onPress={() => {
                    handleCancelPackage();
                  }}>
                  <Text style={styles.textStyle}>Xác nhận</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </Modal>
      </View>
      {item?.status === 0 && (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
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
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              gap: 10,
              justifyContent: 'center',
            }}>
            {!isFromOrderGroup && (
              <TouchableOpacity
                onPress={() => {
                  setLoading(true);
                  setConsolidationAreaList([]);
                  getConsolidationArea(item.pickupPoint.id);
                }}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: COLORS.primary,
                  paddingVertical: 10,
                  width: '45%',
                  borderRadius: 30,
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    color: 'white',
                    fontFamily: 'Roboto',
                    fontWeight: 'bold',
                  }}>
                  Nhận đóng gói {isFromOrderGroup}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => {
                setVisibleCancel(true);
              }}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'grey',
                paddingVertical: 10,
                width: !isFromOrderGroup ? '45%' : '95%',
                borderRadius: 30,
              }}>
              <Text
                style={{
                  fontSize: 18,
                  color: 'white',
                  fontFamily: 'Roboto',
                  fontWeight: 'bold',
                }}>
                Huỷ đóng gói
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {item?.status === 1 && (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
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
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              gap: 10,
              justifyContent: 'center',
            }}>
            {!isFromOrderGroup && (
              <TouchableOpacity
                onPress={() => {
                  setVisible(true);
                }}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: COLORS.primary,
                  paddingVertical: 10,
                  width: '47%',
                  borderRadius: 30,
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    color: 'white',
                    fontFamily: 'Roboto',
                    fontWeight: 'bold',
                  }}>
                  Hoàn thành đóng gói
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => {
                setVisibleCancel(true);
              }}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'grey',
                paddingVertical: 10,
                width: !isFromOrderGroup ? '45%' : '95%',
                borderRadius: 30,
              }}>
              <Text
                style={{
                  fontSize: 18,
                  color: 'white',
                  fontFamily: 'Roboto',
                  fontWeight: 'bold',
                }}>
                Huỷ đóng gói
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {loading && <LoadingScreen />}
    </>
  );
};

export default OrderDetail;
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22,
    backgroundColor: 'rgba(50,50,50,0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    zIndex: 999,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
