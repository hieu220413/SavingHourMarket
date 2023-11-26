import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import Modal, {
  ModalFooter,
  ModalButton,
  ScaleAnimation,
  ModalContent,
} from 'react-native-modals';
import React, {useEffect, useState, useCallback} from 'react';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {COLORS} from '../../constants/theme';
import {icons} from '../../constants';
import {useFocusEffect} from '@react-navigation/native';
import {API} from '../../constants/api';
import {format} from 'date-fns';
import CartEmpty from '../../assets/image/search-empty.png';
import {SwipeListView} from 'react-native-swipe-list-view';
import LoadingScreen from '../../components/LoadingScreen';
import DatePicker from 'react-native-date-picker';
import NumericInput from 'react-native-numeric-input';
import database from '@react-native-firebase/database';
import { checkSystemState } from '../../common/utils';

const Batching = ({navigation}) => {
  // listen to system state
  useFocusEffect(
    useCallback(() => {
        checkSystemState();
      }, []),
  );

  const [initializing, setInitializing] = useState(true);
  const [tokenId, setTokenId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [date, setDate] = useState(null);
  const [timeFrame, setTimeFrame] = useState(null);
  const [productConsolidationArea, setProductConsolidationArea] =
    useState(null);
  const [orderList, setOrderList] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const [openValidateDialog, setOpenValidateDialog] = useState(false);
  const [batchList, setBatchList] = useState([]);

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
        // navigation.navigate('Login');
        navigation.reset({
          index: 0,
          routes: [{name: 'Login'}],
        });
        return;
      }
      const currentUser = await AsyncStorage.getItem('userInfo');
      // console.log('currentUser', currentUser);
      setCurrentUser(JSON.parse(currentUser));
    } else {
      // no sessions found.
      console.log('user is not logged in');
      await AsyncStorage.removeItem('userInfo');
      // navigation.navigate('Login');
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      // auth().currentUser.reload()
      const subscriber = auth().onAuthStateChanged(
        async userInfo => await onAuthStateChange(userInfo),
      );

      return subscriber;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        if (auth().currentUser) {
          const tokenId = await auth().currentUser.getIdToken();
          if (tokenId) {
            setLoading(true);
            fetch(
              `${API.baseURL}/api/order/staff/getOrders?orderStatus=PACKAGED&isGrouped=false&isBatched=false`,
              {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${tokenId}`,
                },
              },
            )
              .then(res => res.json())
              .then(response => {
                console.log(response);
                setOrderList(response);
                setLoading(false);
              })
              .catch(err => {
                console.log(err);
                setLoading(false);
              });
          }
        }
      };
      fetchData();
    }, []),
  );

  const handleCreate = () => {
    console.log(quantity);
    console.log(timeFrame);
    console.log(format(new Date(date), 'yyyy-MM-dd'));
    console.log(productConsolidationArea);
    if (
      date === null ||
      timeFrame === null ||
      productConsolidationArea === null ||
      quantity === 0
    ) {
      setOpenValidateDialog(true);
      return;
    }
    // const fetchData = async () => {
    //   if (auth().currentUser) {
    //     const tokenId = await auth().currentUser.getIdToken();
    //     if (tokenId) {
    //       setLoading(true);
    //       fetch(
    //         `${
    //           API.baseURL
    //         }/api/order/deliveryManager/batchingForStaff?deliverDate=${format(
    //           new Date(date),
    //           'yyyy-MM-dd',
    //         )}&timeFrameId=${timeFrame.id}&productConsolidationAreaId=${
    //           productConsolidationArea.id
    //         }&batchQuantity=${quantity}`,
    //         {
    //           method: 'GET',
    //           headers: {
    //             'Content-Type': 'application/json',
    //             Authorization: `Bearer ${tokenId}`,
    //           },
    //         },
    //       )
    //         .then(res => res.json())
    //         .then(response => {
    //           console.log(response.length);
    //           console.log(quantity);
    //           // setBatchList(response);
    //           setLoading(false);
    //         })
    //         .catch(err => {
    //           console.log(err);
    //           setLoading(false);
    //         });
    //     }
    //   }
    // };
    // fetchData();

    navigation.navigate('BatchList', {
      date: format(new Date(date), 'yyyy-MM-dd'),
      timeFrame: timeFrame,
      productConsolidationArea: productConsolidationArea,
      quantity: quantity,
    });
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss;
        setShowLogout(false);
      }}
      accessible={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.pagenameAndLogout}>
            <View style={styles.pageName}>
              <Text style={{fontSize: 25, color: 'black', fontWeight: 'bold'}}>
                Gom đơn giao tận nhà
              </Text>
            </View>
            <View style={styles.logout}>
              <TouchableOpacity
                onPress={() => {
                  setShowLogout(!showLogout);
                }}>
                <Image
                  resizeMode="contain"
                  style={{width: 38, height: 38}}
                  source={icons.userCircle}
                />
              </TouchableOpacity>
              {showLogout && (
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    bottom: -38,
                    left: -12,
                    zIndex: 100,
                    width: 75,
                    height: 35,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 10,
                    backgroundColor: 'rgb(240,240,240)',
                  }}
                  onPress={() => {
                    auth()
                      .signOut()
                      .then(async () => {
                        await AsyncStorage.removeItem('userInfo');
                      })
                      .catch(e => console.log(e));
                  }}>
                  <Text style={{color: 'red', fontWeight: 'bold'}}>
                    Đăng xuất
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
        <View style={styles.body}>
          <ScrollView contentContainerStyle={{paddingBottom: 80}}>
            <View>
              <Text style={{fontSize: 20, fontWeight: '500', color: 'black'}}>
                Tạo nhóm đơn hàng :
              </Text>
              <View
                style={{
                  backgroundColor: 'rgb(240,240,240)',
                  marginBottom: 20,
                  borderRadius: 10,
                  marginTop: 10,
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
                      Thông tin
                    </Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text
                        style={{
                          fontSize: 17,
                          fontWeight: 'bold',
                          fontFamily: 'Roboto',
                          color: 'black',
                          paddingRight: 10,
                        }}>
                        Ngày giao :
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          setOpen(true);
                        }}>
                        <View
                          style={{
                            backgroundColor: '#f5f5f5',
                            // width: '100%',
                            height: 45,
                            borderRadius: 40,
                            paddingHorizontal: 10,
                            // marginTop: 10,
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <View
                            style={{
                              justifyContent: 'center',
                              alignItems: 'center',
                              height: 40,
                              flexWrap: 'wrap',
                              // paddingLeft: 5,
                            }}>
                            <Image
                              resizeMode="contain"
                              style={{
                                width: 20,
                                height: 20,
                              }}
                              source={icons.calendar}
                            />
                            <Text
                              style={{
                                fontSize: 16,
                                paddingLeft: 10,
                                color: 'black',
                              }}>
                              {date
                                ? format(date, 'dd/MM/yyyy')
                                : 'Chọn ngày giao'}
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
                      />
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text
                        style={{
                          fontSize: 17,
                          fontWeight: 'bold',
                          fontFamily: 'Roboto',
                          color: 'black',
                          paddingRight: 10,
                        }}>
                        Khung giờ :
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('SelectTimeFrame', {
                            setTimeFrame,
                          });
                        }}>
                        <View
                          style={{
                            backgroundColor: '#f5f5f5',
                            // width: '100%',
                            height: 45,
                            borderRadius: 40,
                            paddingHorizontal: 10,
                            // marginTop: 10,
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <View
                            style={{
                              justifyContent: 'center',
                              alignItems: 'center',
                              height: 40,
                              flexWrap: 'wrap',
                              // paddingLeft: 5,
                            }}>
                            <Image
                              resizeMode="contain"
                              style={{
                                width: 20,
                                height: 20,
                              }}
                              source={icons.time}
                            />
                            <Text
                              style={{
                                fontSize: 16,
                                paddingLeft: 10,
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
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        flexDirection: 'column',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          fontSize: 17,
                          fontWeight: 'bold',
                          fontFamily: 'Roboto',
                          color: 'black',
                          paddingBottom: 10,
                        }}>
                        Điểm tập kết :
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate(
                            'SelectProductConsolidationArea',
                            {
                              setProductConsolidationArea,
                            },
                          );
                        }}>
                        <View
                          style={{
                            backgroundColor: '#f5f5f5',
                            // width: '100%',
                            height: 45,
                            borderRadius: 40,
                            paddingHorizontal: 10,
                            // marginTop: 10,
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <View
                            style={{
                              justifyContent: 'center',
                              alignItems: 'center',
                              height: 40,
                              flexWrap: 'wrap',
                              // paddingLeft: 5,
                            }}>
                            <Image
                              resizeMode="contain"
                              style={{
                                width: 20,
                                height: 20,
                              }}
                              source={icons.location}
                            />
                            <Text
                              style={{
                                fontSize: 16,
                                paddingLeft: 10,
                                color: 'black',
                                width: 290,
                              }}>
                              {productConsolidationArea
                                ? productConsolidationArea.address
                                : 'Chọn điểm tập kết'}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text
                        style={{
                          fontSize: 17,
                          fontWeight: 'bold',
                          fontFamily: 'Roboto',
                          color: 'black',
                          paddingRight: 10,
                        }}>
                        Số lượng nhóm đơn :
                      </Text>

                      <NumericInput
                        value={quantity}
                        onChange={value => setQuantity(value)}
                        minValue={0}
                        // maxValue={orderList.length}
                        rounded
                      />
                    </View>
                    <View style={{paddingTop: 10}}>
                      <TouchableOpacity
                        onPress={() => {
                          handleCreate();
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
                          Thiết lập
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
              <Text style={{fontSize: 20, fontWeight: '500', color: 'black'}}>
                Danh sách đơn hàng chưa được gom:
              </Text>
              <View style={{marginBottom: 0}}>
                {orderList?.map(item => (
                  <View
                    key={item.id}
                    style={{
                      backgroundColor: 'rgb(240,240,240)',
                      marginBottom: 20,
                      borderRadius: 10,
                      marginTop: 10,
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
                          <Text
                            style={{
                              fontSize: 17,
                              fontWeight: 'bold',
                              fontFamily: 'Roboto',
                              color: 'black',
                            }}>
                            Địa chỉ : {item?.addressDeliver}
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
                          {/* <Text
                            style={{
                              fontSize: 17,
                              fontWeight: 'bold',
                              fontFamily: 'Roboto',
                              color: 'black',
                            }}>
                            Phương thức thanh toán:{' '}
                            {item?.paymentMethod === 0 ? 'COD' : 'VN Pay'}
                          </Text> */}
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
            </View>
          </ScrollView>
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
                  Vui lòng điền đủ thông tin để tạo nhóm đơn hàng
                </Text>
              </View>
            </ModalContent>
          </Modal>
        </View>
        {loading && <LoadingScreen />}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Batching;

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
    flex: 9,
    // backgroundColor: 'pink',
    paddingHorizontal: 20,
  },
  pagenameAndLogout: {
    paddingTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pageName: {
    flex: 7,
    // backgroundColor: 'white',
  },
  logout: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginLeft: 10,
  },
});
