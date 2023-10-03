/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useCallback, useEffect} from 'react';
import {View, Image, Text} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {icons} from '../constants';
import {COLORS} from '../constants/theme';
import QrCode from '../assets/image/test-qrcode.png';
import {API} from '../constants/api';
import {useFocusEffect} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {format} from 'date-fns';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

const OrderDetail = ({navigation, route}) => {
  const {id, orderSuccess} = route.params;
  const [initializing, setInitializing] = useState(true);
  const [tokenId, setTokenId] = useState(null);
  const [item, setItem] = useState(null);

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
    } else {
      // no sessions found.
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

  useFocusEffect(
    useCallback(() => {
      if (tokenId) {
        fetch(`${API.baseURL}/api/order/getOrderDetail/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokenId}`,
          },
        })
          .then(res => res.json())
          .then(respond => setItem(respond))
          .catch(err => console.log(err));
      }
    }, [tokenId]),
  );

  const cancelOrder = () => {
    fetch(`${API.baseURL}/api/order/cancelOrder/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenId}`,
      },
    })
      .then(res => {
        fetch(`${API.baseURL}/api/order/getOrderDetail/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokenId}`,
          },
        })
          .then(res => res.json())
          .then(respond => setItem(respond))
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
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
        </View>
        {item && (
          <ScrollView>
            <View style={{padding: 20, backgroundColor: '#23ba9c'}}>
              <Text
                style={{color: 'white', fontSize: 18, fontFamily: 'Roboto'}}>
                {item?.status === 0 && 'Đơn hàng đang chờ xác nhận'}
                {item?.status === 1 && 'Đơn hàng đang đóng gói'}
                {item?.status === 2 && 'Đơn hàng đã đóng gói'}
                {item?.status === 3 && 'Đơn hàng đang được giao '}
                {item?.status === 4 && 'Đơn hàng thành công'}
                {item?.status === 5 && 'Đơn hàng thất bại'}
                {item?.status === 6 && 'Đơn hàng đã hủy'}
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
                    <View style={{gap: 3}}>
                      {/* <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                  Điểm giao hàng:
                </Text> */}
                      <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                        {item?.addressDeliver}
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
                  <Image
                    source={{
                      uri: product.imageUrl,
                    }}
                    style={{flex: 4, width: '100%', height: '95%'}}
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
                        color: 'black',
                        fontFamily: 'Roboto',
                        backgroundColor: '#7ae19c',
                        alignSelf: 'flex-start',
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        borderRadius: 5,
                      }}>
                      {product.productCategory}
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
                      <Text
                        style={{
                          fontSize: 18,
                          fontFamily: 'Roboto',
                        }}>
                        x{product.boughtQuantity}
                      </Text>
                    </View>
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

              {/* <View
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
                <Text style={{fontSize: 20, fontFamily: 'Roboto', width: '60%'}}>
                  3f720006-64e6-4701-9b7f-dc45aea76570
                </Text>
              </View> */}

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
                  {item.paymentStatus === 0 ? 'COD' : 'VN Pay'}
                </Text>
              </View>
            </View>

            {/* ******************* */}

            {/* Price information */}
            <View
              style={{
                backgroundColor: 'white',
                padding: 20,
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
                  Giá tiền
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 15,
                  paddingTop: 20,
                  justifyContent: 'space-between',
                  borderTopColor: '#decbcb',
                  borderTopWidth: 0.75,
                }}>
                <Text
                  style={{fontSize: 20, fontFamily: 'Roboto', color: 'black'}}>
                  Tổng tiền sản phẩm:
                </Text>
                <Text style={{fontSize: 20, fontFamily: 'Roboto'}}>
                  {item.totalPrice.toLocaleString('vi-VN', {
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
                  {item.shippingFee.toLocaleString('vi-VN', {
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
                  paddingBottom: 15,
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{fontSize: 20, fontFamily: 'Roboto', color: 'black'}}>
                  Giá đã giảm:
                </Text>
                <Text style={{fontSize: 20, fontFamily: 'Roboto'}}>
                  {item.totalDiscountPrice.toLocaleString('vi-VN', {
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
                  Tổng cộng:
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                    fontFamily: 'Roboto',
                    color: 'red',
                    fontWeight: 'bold',
                  }}>
                  {(item.totalPrice - item.totalDiscountPrice).toLocaleString(
                    'vi-VN',
                    {
                      style: 'currency',
                      currency: 'VND',
                    },
                  )}
                </Text>
              </View>
            </View>
            {/* ******************** */}

            {/* QR code */}
            <View
              style={{
                backgroundColor: 'white',
                padding: 20,
                marginTop: 20,
                marginBottom: 180,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                resizeMode="contain"
                style={{width: '100%', height: 300}}
                source={{uri: item.qrCodeUrl}}
              />
            </View>
          </ScrollView>
        )}
      </View>
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
        <View style={{width: '95%'}}>
          {item?.status === 0 ? (
            <TouchableOpacity
              onPress={() => {
                cancelOrder();
              }}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#23ba9c',
                paddingVertical: 10,
                width: '100%',
                borderRadius: 5,
              }}>
              <Text
                style={{
                  fontSize: 18,
                  color: 'white',
                  fontFamily: 'Roboto',
                  fontWeight: 'bold',
                }}>
                Hủy đơn hàng
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                console.log('abc');
              }}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#23ba9c',
                paddingVertical: 10,
                width: '100%',
                borderRadius: 5,
              }}>
              <Text
                style={{
                  fontSize: 18,
                  color: 'white',
                  fontFamily: 'Roboto',
                  fontWeight: 'bold',
                }}>
                Đặt lại
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  );
};

export default OrderDetail;
