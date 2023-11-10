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
  Modal,
  Pressable,
  Alert,
} from 'react-native';
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

const OrderBatch = ({navigation}) => {
  const [initializing, setInitializing] = useState(true);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [groupListNotYetAssigned, setGroupListNotYetAssigned] = useState([]);
  const [groupListAssigned, setGroupListAssigned] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [showLogout, setShowLogout] = useState(false);
  const [date, setDate] = useState(null);
  const [currentStatus, setCurrentStatus] = useState({
    display: 'Chưa có nhân viên giao hàng',
    value: 1,
  });

  const groupStatus = [
    {display: 'Chưa có nhân viên giao hàng', value: 1},
    {display: 'Đã có nhân viên giao hàng', value: 2},
  ];

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
        navigation.navigate('Login');
        return;
      }
      const currentUser = await AsyncStorage.getItem('userInfo');
      // console.log('currentUser', currentUser);
      setCurrentUser(JSON.parse(currentUser));
    } else {
      // no sessions found.
      console.log('user is not logged in');
      await AsyncStorage.removeItem('userInfo');
      navigation.navigate('Login');
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
            if (date) {
              const deliverDate = format(date, 'yyyy-MM-dd');
              fetch(
                `${API.baseURL}/api/order/staff/getOrderBatch?deliverDate=${deliverDate}`,
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
                  console.log('group', respond);
                  if (respond.code === 404) {
                    setGroupListNotYetAssigned([]);
                    setGroupListAssigned([]);
                    setLoading(false);
                    return;
                  }
                  const notYetAssigned = respond.filter(item => {
                    return item.deliverer === null;
                  });
                  const Assigned = respond.filter(item => {
                    return item.deliverer !== null;
                  });
                  setGroupListNotYetAssigned(notYetAssigned);
                  setGroupListAssigned(Assigned);
                  setLoading(false);
                })
                .catch(err => {
                  console.log(err);
                  setLoading(false);
                });
            } else {
              fetch(`${API.baseURL}/api/order/staff/getOrderBatch`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${tokenId}`,
                },
              })
                .then(res => res.json())
                .then(respond => {
                  console.log('batch', respond);
                  if (respond.error) {
                    setLoading(false);
                    return;
                  }
                  const notYetAssigned = respond.filter(item => {
                    return item.deliverer === null;
                  });
                  const Assigned = respond.filter(item => {
                    return item.deliverer !== null;
                  });
                  setGroupListNotYetAssigned(notYetAssigned);
                  setGroupListAssigned(Assigned);
                  setLoading(false);
                })
                .catch(err => {
                  console.log(err);
                  setLoading(false);
                });
            }
          }
        }
      };
      fetchData();
    }, [date]),
  );

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss;
        setOpen(false);
        setShowLogout(false);
      }}
      accessible={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.pagenameAndLogout}>
            <View style={styles.pageName}>
              <Text style={{fontSize: 25, color: 'black', fontWeight: 'bold'}}>
                Nhóm đơn giao tận nhà
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
          {/* Search */}
          <TouchableOpacity
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
          />
          <View
            style={{
              flexDirection: 'row',
            }}>
            <View style={{flex: 6}}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {groupStatus.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setCurrentStatus(item);
                    }}>
                    <View
                      style={[
                        {
                          paddingTop: 15,
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
                            currentStatus.display === item.display
                              ? 'bold'
                              : 400,
                        }}>
                        {item.display}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'flex-end',
                flex: 1,
              }}>
              <TouchableOpacity
                onPress={() => {
                  //   setModalVisible(true);
                }}>
                <Image
                  resizeMode="contain"
                  style={{
                    height: 35,
                    tintColor: COLORS.primary,
                    width: 35,
                    marginHorizontal: '1%',
                  }}
                  source={icons.filter}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.body}>
          {/* Group list */}
          {currentStatus.value === 1 && (
            <>
              {groupListNotYetAssigned.length === 0 ? (
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
                <View style={{marginTop: 10, marginBottom: 100}}>
                  <SwipeListView
                    data={groupListNotYetAssigned}
                    renderItem={(data, rowMap) => (
                      <View
                        key={data.item.id}
                        style={{
                          marginBottom: 20,
                          backgroundColor: 'rgb(240,240,240)',
                          padding: 10,
                          borderRadius: 10,
                        }}>
                        {/* Group detail */}
                        <TouchableOpacity
                          onPress={() => {
                            navigation.navigate('OrderGroupDetail', {
                              orderList: data.item.orderList,
                              orderSuccess: false,
                            });
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}>
                            <View style={{flexDirection: 'column', gap: 8}}>
                              <Text
                                style={{
                                  fontSize: 20,
                                  fontWeight: 'bold',
                                  fontFamily: 'Roboto',
                                  color: COLORS.primary,
                                }}>
                                Nhóm đơn hàng
                              </Text>
                              {data.item?.deliverer ? (
                                <View
                                  style={{
                                    position: 'absolute',
                                    right: -30,
                                  }}>
                                  <Image
                                    style={{
                                      width: 35,
                                      height: 35,
                                      borderRadius: 40,
                                    }}
                                    resizeMode="contain"
                                    source={{
                                      uri: `${data.item?.deliverer.avatarUrl}`,
                                    }}
                                  />
                                </View>
                              ) : (
                                <></>
                              )}
                              <Text
                                style={{
                                  fontSize: 17,
                                  fontWeight: 'bold',
                                  fontFamily: 'Roboto',
                                  color: 'black',
                                }}>
                                Ngày giao hàng :{' '}
                                {format(
                                  Date.parse(data.item?.deliverDate),
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
                                Giờ giao hàng : {data.item?.timeFrame?.fromHour}{' '}
                                đến {data.item?.timeFrame?.toHour}
                              </Text>
                              <View style={{width: 320}}>
                                <Text
                                  style={{
                                    fontSize: 17,
                                    fontWeight: 'bold',
                                    fontFamily: 'Roboto',
                                    color: 'black',
                                  }}>
                                  Điểm giao hàng : 123
                                  {/* {data.item?.pickupPoint.address} */}
                                </Text>
                              </View>
                              <Text
                                style={{
                                  fontSize: 17,
                                  fontWeight: 'bold',
                                  fontFamily: 'Roboto',
                                  color: 'black',
                                }}>
                                Nhân viên đóng gói:{' '}
                                {data.item?.deliverer === null
                                  ? 'Chưa có'
                                  : data.item?.deliverer.fullName}
                              </Text>
                            </View>
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
                        </TouchableOpacity>
                        {/* *********************** */}
                      </View>
                    )}
                    renderHiddenItem={(data, rowMap) => (
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'flex-end',
                          height: '90%',
                          // marginVertical: '2%',
                        }}>
                        <TouchableOpacity
                          style={{
                            width: 120,
                            height: '100%',
                            backgroundColor: COLORS.primary,
                            borderRadius: 10,
                            // flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                          onPress={() => {
                            // setVisible(true);
                            // console.log(data.item.id);
                            // setOrder(data.item);
                          }}>
                          <View>
                            <Image
                              source={icons.assign}
                              resizeMode="contain"
                              style={{
                                width: 40,
                                height: 40,
                                tintColor: 'white',
                              }}
                            />
                          </View>
                        </TouchableOpacity>
                      </View>
                    )}
                    leftOpenValue={0}
                    rightOpenValue={-120}
                  />
                </View>
              )}
            </>
          )}
          {currentStatus.value === 2 && (
            <>
              {groupListAssigned.length === 0 ? (
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
                <View style={{marginTop: 10, marginBottom: 100}}>
                  <SwipeListView
                    data={groupListAssigned}
                    renderItem={(data, rowMap) => (
                      <View
                        key={data.item.id}
                        style={{
                          marginBottom: 20,
                          backgroundColor: 'rgb(240,240,240)',
                          padding: 10,
                          borderRadius: 10,
                        }}>
                        {/* Group detail */}
                        <TouchableOpacity
                          onPress={() => {
                            navigation.navigate('OrderGroupDetail', {
                              orderList: data.item.orderList,
                              deliverer: data.item.deliverer,
                            });
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}>
                            <View style={{flexDirection: 'column', gap: 8}}>
                              <Text
                                style={{
                                  fontSize: 20,
                                  fontWeight: 'bold',
                                  fontFamily: 'Roboto',
                                  color: COLORS.primary,
                                }}>
                                Nhóm đơn hàng
                              </Text>
                              {data.item?.deliverer ? (
                                <View
                                  style={{
                                    position: 'absolute',
                                    right: -30,
                                  }}>
                                  <Image
                                    style={{
                                      width: 35,
                                      height: 35,
                                      borderRadius: 40,
                                    }}
                                    resizeMode="contain"
                                    source={{
                                      uri: `${data.item?.deliverer.avatarUrl}`,
                                    }}
                                  />
                                </View>
                              ) : (
                                <></>
                              )}
                              <Text
                                style={{
                                  fontSize: 17,
                                  fontWeight: 'bold',
                                  fontFamily: 'Roboto',
                                  color: 'black',
                                }}>
                                Ngày giao hàng :{' '}
                                {format(
                                  Date.parse(data.item?.deliverDate),
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
                                Giờ giao hàng : {data.item?.timeFrame?.fromHour}{' '}
                                đến {data.item?.timeFrame?.toHour}
                              </Text>
                              <View style={{width: 320}}>
                                <Text
                                  style={{
                                    fontSize: 17,
                                    fontWeight: 'bold',
                                    fontFamily: 'Roboto',
                                    color: 'black',
                                  }}>
                                  Điểm giao hàng :{' '}
                                  {data.item?.pickupPoint?.address}
                                </Text>
                              </View>
                              <Text
                                style={{
                                  fontSize: 17,
                                  fontWeight: 'bold',
                                  fontFamily: 'Roboto',
                                  color: 'black',
                                }}>
                                Nhân viên đóng gói:{' '}
                                {data.item?.deliverer === null
                                  ? 'Chưa có'
                                  : data.item?.deliverer.fullName}
                              </Text>
                            </View>
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
                        </TouchableOpacity>
                        {/* *********************** */}
                      </View>
                    )}
                    renderHiddenItem={(data, rowMap) => (
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'flex-end',
                          height: '90%',
                          // marginVertical: '2%',
                        }}>
                        <TouchableOpacity
                          style={{
                            width: 120,
                            height: '100%',
                            backgroundColor: COLORS.primary,
                            borderRadius: 10,
                            // flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                          onPress={() => {
                            // setVisible(true);
                            // console.log(data.item.id);
                            // setOrder(data.item);
                          }}>
                          <View>
                            <Image
                              source={icons.assign}
                              resizeMode="contain"
                              style={{
                                width: 40,
                                height: 40,
                                tintColor: 'white',
                              }}
                            />
                          </View>
                        </TouchableOpacity>
                      </View>
                    )}
                    leftOpenValue={0}
                    rightOpenValue={-120}
                  />
                </View>
              )}
            </>
          )}

          {/* ************************ */}
        </View>
        {loading && <LoadingScreen />}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default OrderBatch;

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
    flex: 3,
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
