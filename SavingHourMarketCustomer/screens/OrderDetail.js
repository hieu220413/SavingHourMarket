/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useCallback, useEffect} from 'react';
import {View, Image, Text, Dimensions} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {icons} from '../constants';
import {COLORS} from '../constants/theme';
import QrCode from '../assets/image/test-qrcode.png';
import {API} from '../constants/api';
import {useFocusEffect} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {format} from 'date-fns';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import Toast from 'react-native-toast-message';
import LoadingScreen from '../components/LoadingScreen';
import AccountDisable from '../components/AccountDisable';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import database from '@react-native-firebase/database';
import Modal, {
  ModalFooter,
  ModalButton,
  ScaleAnimation,
} from 'react-native-modals';

const OrderDetail = ({navigation, route}) => {
  const {id, orderSuccess} = route.params;
  const [initializing, setInitializing] = useState(true);

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [isDisableAccount, setIsDisableAccount] = useState(false);
  const [openQrModal, setOpenQrModal] = useState(false);
  const [openConfirmCancel, setOpenConfirmCancel] = useState(false);
  const [openCancelFail, setOpenCancelFail] = useState(false);

  // state open/close modal
  const [openAccountDisableModal, setOpenAccountDisableModal] = useState(false);

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

  const showToast = () => {
    Toast.show({
      type: 'success',
      text1: 'Thành công',
      text2: 'Đơn hàng đã hủy thành công 👋',
      duration: 1500,
    });
  };

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

        return;
      }
    } else {
      // no sessions found.
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
      const fetchDetail = async () => {
        if (auth().currentUser) {
          const tokenId = await auth().currentUser.getIdToken();
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
                console.log(respond);
                setItem(respond);
                setLoading(false);
              })
              .catch(err => {
                console.log(err);
                setLoading(false);
              });
          }
        } else {
          if (!isDisableAccount) {
            setOpenAuthModal(true);
            setLoading(false);
          }
        }
      };
      fetchDetail();
    }, []),
  );

  const cancelOrder = async () => {
    setLoading(true);
    const tokenId = await auth().currentUser.getIdToken();
    fetch(`${API.baseURL}/api/order/cancelOrder/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenId}`,
      },
    })
      .then(res => res.json())
      .then(res => {
        if (res.code === 409) {
          setOpenCancelFail(true);
          return;
        }
        fetch(`${API.baseURL}/api/order/getOrderDetail/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokenId}`,
          },
        })
          .then(res => res.json())
          .then(respond => {
            setItem(respond);
            showToast();
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
              flexGrow: 1,
              fontSize: 25,
              textAlign: 'left',
              color: '#000000',
              fontWeight: 'bold',
              fontFamily: 'Roboto',
            }}>
            Chi tiết đơn hàng
          </Text>
          {item?.status < 4 && (
            <View>
              <TouchableOpacity
                style={{marginLeft: 'auto', marginRight: '5%'}}
                onPress={() => {
                  setOpenQrModal(true);
                }}>
                <AntDesign name="qrcode" size={30} color="black"></AntDesign>
              </TouchableOpacity>
              <Text style={{marginLeft: 'auto', marginTop: 2}}>Mã QR</Text>
            </View>
          )}
          {item?.status === 4 && !item?.isFeedback && (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Order Feedback', {orderId: item.id});
              }}>
              <MaterialIcons
                name="feedback"
                size={30}
                color="black"></MaterialIcons>
              {/* <Text
              style={{
                fontSize: 18,
                fontWeight: '100',
                fontFamily: 'Roboto',
                color: COLORS.primary,
              }}>
              Đánh giá đơn hàng
            </Text> */}
            </TouchableOpacity>
          )}
        </View>
        {item && (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={{
                padding: 20,
                backgroundColor:
                  item?.status === 5 || item?.status === 6
                    ? 'red'
                    : COLORS.primary,
              }}>
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
              <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                Mã đơn hàng : {item.code}
              </Text>
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
                      <Text
                        style={{fontSize: 16, color: 'black', maxWidth: '95%'}}>
                        {item?.addressDeliver
                          ? item?.addressDeliver
                          : item?.pickupPoint.address}
                      </Text>
                    </View>
                    {item.timeFrame && (
                      <Text style={{fontSize: 16, color: 'black'}}>
                        Khung giờ:{' '}
                        {item?.timeFrame
                          ? `${item?.timeFrame?.fromHour.slice(
                              0,
                              5,
                            )} đến ${item?.timeFrame?.toHour.slice(0, 5)}`
                          : ''}
                      </Text>
                    )}
                    <Text style={{fontSize: 16, color: 'black'}}>
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
                    <Text style={{fontSize: 16, color: 'black'}}>
                      Họ và tên KH: {item.receiverName}
                    </Text>
                    <Text style={{fontSize: 16, color: 'black'}}>
                      SĐT: {item.receiverPhone}
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
                marginBottom: 5,
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
                        fontSize: 18,
                        color: 'black',
                        fontFamily: 'Roboto',
                        fontWeight: 'bold',
                      }}>
                      {product.name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 15,
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
                        fontSize: 16,
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
                          fontSize: 16,
                          fontFamily: 'Roboto',
                        }}>
                        {product.productPrice.toLocaleString('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        })}
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          fontFamily: 'Roboto',
                        }}>
                        x{product.boughtQuantity}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
            {/* ********************* */}
            {/* Price information */}
            <View
              style={{
                backgroundColor: 'white',
                marginTop: 10,
                padding: 20,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,

                  marginBottom: 10,
                }}>
                <Text
                  style={{
                    fontSize: 20,
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
                  style={{fontSize: 18, fontFamily: 'Roboto', color: 'black'}}>
                  Tổng tiền sản phẩm:
                </Text>
                <Text style={{fontSize: 18, fontFamily: 'Roboto'}}>
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
                  style={{fontSize: 18, fontFamily: 'Roboto', color: 'black'}}>
                  Phí giao hàng:
                </Text>
                <Text style={{fontSize: 18, fontFamily: 'Roboto'}}>
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
                  style={{fontSize: 18, fontFamily: 'Roboto', color: 'black'}}>
                  Giá đã giảm:
                </Text>
                <Text style={{fontSize: 18, fontFamily: 'Roboto'}}>
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
                  style={{fontSize: 18, fontFamily: 'Roboto', color: 'black'}}>
                  Tổng cộng:
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: 'Roboto',
                    color: COLORS.primary,
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

            {/* Detail information */}
            <View
              style={{
                backgroundColor: 'white',
                padding: 20,
                marginTop: 20,
                marginBottom: item?.status === 0 ? 180 : 110,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 10,
                }}>
                <Text
                  style={{
                    fontSize: 20,
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
                  style={{fontSize: 18, fontFamily: 'Roboto', color: 'black'}}>
                  Trạng thái
                </Text>
                <Text style={{fontSize: 18, fontFamily: 'Roboto'}}>
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
                  style={{fontSize: 18, fontFamily: 'Roboto', color: 'black'}}>
                  Phương thức
                </Text>
                <Text style={{fontSize: 18, fontFamily: 'Roboto'}}>
                  {item.paymentMethod === 0 ? 'COD' : 'VN Pay'}
                </Text>
              </View>
            </View>

            {/* ******************* */}

            {/* QR code */}
            {/* <View
              style={{
                backgroundColor: 'white',
                padding: 20,
                marginTop: 20,
                marginBottom: item?.status === 0 ? 180 : 110,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                resizeMode="contain"
                style={{ width: '100%', height: 300 }}
                source={{ uri: item.qrCodeUrl }}
              />
            </View> */}
          </ScrollView>
        )}
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
          <View style={{width: '95%'}}>
            <TouchableOpacity
              onPress={() => {
                setOpenConfirmCancel(true);
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
                Hủy đơn hàng
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
      {/* cancel fail modal */}
      <Modal
        width={0.8}
        visible={openCancelFail}
        onTouchOutside={() => {
          setOpenCancelFail(false);
        }}
        dialogAnimation={
          new ScaleAnimation({
            initialValue: 0, // optional
            useNativeDriver: true, // optional
          })
        }
        footer={
          <ModalFooter>
            <ModalButton text="Đóng" onPress={() => setOpenCancelFail(false)} />
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
            Đã quá thời gian cho phép hủy đơn hàng
          </Text>
        </View>
      </Modal>
      {/* QR code modal */}
      {item && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={openQrModal}
          onTouchOutside={() => {
            setOpenQrModal(false);
          }}>
          <Image
            resizeMode="contain"
            style={{
              width: Dimensions.get('window').width * 0.8,
              height: Dimensions.get('window').width * 0.8,
            }}
            source={{uri: item.qrCodeUrl}}
          />
        </Modal>
      )}
      {/* confirm cancel modal */}
      <Modal
        width={0.8}
        visible={openConfirmCancel}
        onTouchOutside={() => {
          setOpenConfirmCancel(false);
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
              text="Đóng"
              onPress={async () => {
                setOpenConfirmCancel(false);
              }}
            />
            <ModalButton
              text="Đồng ý"
              textStyle={{color: COLORS.primary}}
              onPress={async () => {
                cancelOrder();
                setOpenConfirmCancel(false);
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
            Bạn có chắc muốn hủy đơn hàng này
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

export default OrderDetail;
