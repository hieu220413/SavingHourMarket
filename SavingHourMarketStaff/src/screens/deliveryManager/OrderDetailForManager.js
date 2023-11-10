import React, {useState, useCallback, useEffect} from 'react';
import {View, Image, Text, Modal, Pressable, StyleSheet} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {icons} from '../../constants';
import {COLORS} from '../../constants/theme';
import QrCode from '../../assets/image/test-qrcode.png';
import {API} from '../../constants/api';
import {useFocusEffect} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {format} from 'date-fns';
import Toast from 'react-native-toast-message';
import LoadingScreen from '../../components/LoadingScreen';

const OrderDetailForManager = ({navigation, route}) => {
  const {id, orderSuccess} = route.params;
  const [initializing, setInitializing] = useState(true);
  const [tokenId, setTokenId] = useState(null);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const showToast = () => {
    Toast.show({
      type: 'success',
      text1: 'Thành công',
      text2: 'Đơn hàng đã hủy thành công 👋',
      duration: 1500,
    });
  };

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
        setLoading(false);
        return;
      }

      const token = await auth().currentUser.getIdToken();
      setTokenId(token);
      setLoading(false);
    } else {
      // no sessions found.
      console.log('user is not logged in');
      setLoading(false);
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
          .then(res => res.json())
          .then(respond => {
            console.log('asd', respond);
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
  };

  const handleConfirm = () => {
    // The user has pressed the "Delete" button, so here you can do your own logic.
    // ...Your logic
    setVisible(false);
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
            <View style={{padding: 20, backgroundColor: COLORS.primary}}>
              <Text
                style={{color: 'white', fontSize: 18, fontFamily: 'Roboto'}}>
                Đơn hàng
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
                          : item?.pickupPoint?.address}
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
                      uri: product.images[0].imageUrl,
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
                  {item.paymentMethod === 0 ? 'COD' : 'VN Pay'}
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
                marginBottom: 110,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                resizeMode="contain"
                style={{width: '100%', height: 300}}
                source={QrCode}
              />
            </View>
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
              <Text
                style={{
                  color: 'black',
                  fontSize: 18,
                  fontWeight: 400,
                }}>
                {item?.status === 0 && 'Bạn sẽ đóng gói đơn hàng này ?'}
                {item?.status === 1 &&
                  'Bạn đã hoàn thành đóng gói đơn hàng này ?'}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginTop: '7%',
                  // backgroundColor: 'pink',
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
                  onPress={handleConfirm}>
                  <Text style={styles.textStyle}>Xác nhận</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </Modal>
      </View>
      {/* {item?.status === 0 && (
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
            <TouchableOpacity
              onPress={() => {
                setVisible(true);
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
                Nhận đóng gói
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
          <View style={{width: '95%'}}>
            <TouchableOpacity
              onPress={() => {
                setVisible(true);
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
                Hoàn thành đóng gói
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )} */}
      {loading && <LoadingScreen />}
    </>
  );
};

export default OrderDetailForManager;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22,
    backgroundColor: 'rgba(50,50,50,0.5)',
  },
  modalView: {
    margin: 20,
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
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
