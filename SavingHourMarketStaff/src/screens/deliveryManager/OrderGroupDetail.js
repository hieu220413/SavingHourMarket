import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  Image,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
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
import {SwipeListView} from 'react-native-swipe-list-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CartEmpty from '../../assets/image/search-empty.png';
import database from '@react-native-firebase/database';
import { checkSystemState } from '../../common/utils';

const OrderGroupDetail = ({navigation, route}) => {
  // listen to system state
  useFocusEffect(
    useCallback(() => {
        checkSystemState(navigation);
      }, []),
  );

  const {orderList, deliverer, orderGroupId, deliverDate, timeFrame, mode} =
    route.params;
  const [initializing, setInitializing] = useState(true);
  const [tokenId, setTokenId] = useState(null);
  const [loading, setLoading] = useState(false);

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

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss;
        // setOpen(false);
        // setShowLogout(false);
      }}
      accessible={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.pagenameAndLogout}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={icons.leftArrow}
                resizeMode="contain"
                style={{width: 35, height: 35, tintColor: COLORS.primary}}
              />
            </TouchableOpacity>
            <View style={styles.pageName}>
              <Text style={{fontSize: 25, color: 'black', fontWeight: 'bold'}}>
                Chi tiết nhóm đơn
              </Text>
            </View>
          </View>
          {/* Search */}
          {/* <TouchableOpacity
            onPress={() => {
              setOpen(true);
            }}>
            <View
              style={{
                backgroundColor: '#f5f5f5',
                width: '100%',
                height: 45,
                borderRadius: 40,
                paddingLeft: 10,
                marginTop: 10,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 40,
                  flexWrap: 'wrap',
                  paddingLeft: 5,
                }}>
                <Image
                  resizeMode="contain"
                  style={{
                    width: 20,
                    height: 20,
                  }}
                  source={icons.search}
                />
                <Text
                  style={{
                    fontSize: 16,
                    paddingLeft: 20,
                  }}>
                  {date ? format(date, 'dd/MM/yyyy') : 'Chọn ngày giao'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <DatePicker
            // minimumDate={new Date()}
            modal
            mode="date"
            open={open}
            date={date ? date : new Date()}
            onConfirm={date => {
              setOpen(false);
              setDate(date);
            }}
            onCancel={() => {
              setDate(null);
              setOpen(false);
            }}
          /> */}
        </View>
        <View style={styles.body}>
          {/* Order list */}
          <View>
            <Text style={{fontSize: 20, fontWeight: '500', color: 'black'}}>
              Thông tin nhân viên giao hàng :
            </Text>
            <View
              style={{
                backgroundColor: 'rgb(240,240,240)',
                marginBottom: 10,
                borderRadius: 10,
                marginTop: 10,
              }}>
              {deliverer === null ? (
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
                      Nhân viên
                    </Text>
                    <Text
                      style={{
                        fontSize: 17,
                        fontWeight: 'bold',
                        fontFamily: 'Roboto',
                        color: 'black',
                      }}>
                      Chưa có nhân viên giao hàng
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('PickStaff', {
                          orderGroupId: orderGroupId,
                          deliverDate: deliverDate,
                          timeFrame: timeFrame,
                          staff: deliverer,
                          mode: mode,
                        });
                      }}>
                      <Text
                        style={{
                          fontSize: 17,
                          fontWeight: '100',
                          fontFamily: 'Roboto',
                          color: COLORS.primary,
                        }}>
                        Chọn nhân viên giao hàng
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
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
                      Nhân viên
                    </Text>
                    <View
                      style={{
                        position: 'absolute',
                        right: -60,
                        top: -10,
                      }}>
                      <Image
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 40,
                        }}
                        resizeMode="contain"
                        source={{
                          uri: `${deliverer?.avatarUrl}`,
                        }}
                      />
                    </View>
                    <Text
                      style={{
                        fontSize: 17,
                        fontWeight: 'bold',
                        fontFamily: 'Roboto',
                        color: 'black',
                      }}>
                      Họ tên : {deliverer?.fullName}
                    </Text>
                    <Text
                      style={{
                        fontSize: 17,
                        fontWeight: 'bold',
                        fontFamily: 'Roboto',
                        color: 'black',
                      }}>
                      Email : {deliverer?.email}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('PickStaff', {
                          orderGroupId: orderGroupId,
                          deliverDate: deliverDate,
                          timeFrame: timeFrame,
                          staff: deliverer,
                          mode: mode,
                        });
                      }}>
                      <Text
                        style={{
                          fontSize: 17,
                          fontWeight: '100',
                          fontFamily: 'Roboto',
                          color: COLORS.primary,
                        }}>
                        Đổi nhân viên giao hàng
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </View>

          {orderList.length === 0 ? (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Image
                style={{width: '100%', height: '50%'}}
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
                Chưa có nhóm đơn hàng nào
              </Text>
            </View>
          ) : (
            <ScrollView contentContainerStyle={{marginTop: 10}}>
              <View style={{marginBottom: 10}}>
                <View style={{marginBottom: 10}}>
                  <Text
                    style={{fontSize: 20, fontWeight: '500', color: 'black'}}>
                    Danh sách đơn hàng :
                  </Text>
                </View>
                {orderList.map(item => (
                  <View
                    key={item.id}
                    style={{
                      backgroundColor: 'rgb(240,240,240)',
                      marginBottom: 20,
                      borderRadius: 10,
                    }}>
                    {/* Order detail */}
                    <TouchableOpacity
                      onPress={() => {
                        console.log(item.id);
                        navigation.navigate('OrderDetailForManager', {
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
                            Đơn hàng
                          </Text>
                          <Text
                            style={{
                              fontSize: 17,
                              fontWeight: 'bold',
                              fontFamily: 'Roboto',
                              color: 'black',
                            }}>
                            Ngày đặt :{' '}
                            {format(
                              Date.parse(item?.createdTime),
                              'dd/MM/yyyy',
                            )}
                          </Text>
                          <Text
                            style={{
                              fontSize: 17,
                              fontWeight: 'bold',
                              fontFamily: 'Roboto',
                              color: 'black',
                            }}>
                            Ngày giao :{' '}
                            {format(
                              Date.parse(item?.deliveryDate),
                              'dd/MM/yyyy',
                            )}
                          </Text>
                          {mode === 1 ? (
                            <Text
                              style={{
                                fontSize: 17,
                                fontWeight: 'bold',
                                fontFamily: 'Roboto',
                                color: 'black',
                              }}>
                              Điểm giao hàng : {item?.addressDeliver}
                            </Text>
                          ) : (
                            <Text
                              style={{
                                fontSize: 17,
                                fontWeight: 'bold',
                                fontFamily: 'Roboto',
                                color: 'black',
                              }}>
                              Địa chỉ : {item?.addressDeliver}
                            </Text>
                          )}
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
                        </View>
                        {/* <Image
                          resizeMode="contain"
                          style={{
                            width: 30,
                            height: 30,
                            tintColor: COLORS.primary,
                          }}
                          source={icons.rightArrow}
                        /> */}
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
        </View>
        {loading && <LoadingScreen />}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default OrderGroupDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flex: 1,
    // backgroundColor: 'orange',
    paddingHorizontal: 20,
  },
  body: {
    flex: 10,
    // backgroundColor: 'pink',
    paddingHorizontal: 20,
  },
  pagenameAndLogout: {
    paddingTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  pageName: {
    flex: 7,
    // backgroundColor: 'white',
  },
});
