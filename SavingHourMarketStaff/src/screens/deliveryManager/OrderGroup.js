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
import database from '@react-native-firebase/database';
import { checkSystemState } from '../../common/utils';

const OrderGroup = ({navigation}) => {
  // listen to system state
  useFocusEffect(
    useCallback(() => {
        checkSystemState();
      }, []),
  );

  const [initializing, setInitializing] = useState(true);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [groupListNotYetAssigned, setGroupListNotYetAssigned] = useState([]);
  const [groupListAssigned, setGroupListAssigned] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [showLogout, setShowLogout] = useState(false);
  const [date, setDate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [currentStatus, setCurrentStatus] = useState({
    display: 'Chưa có nhân viên giao hàng',
    value: 1,
  });

  const groupStatus = [
    {display: 'Chưa có nhân viên giao hàng', value: 1},
    {display: 'Đã có nhân viên giao hàng', value: 2},
  ];

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
  //     // console.log('currentUser', currentUser);
  //     setCurrentUser(JSON.parse(currentUser));
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

  const sortOptions = [
    {
      id: 1,
      name: 'Ngày giao gần nhất',
      active: false,
    },
    {
      id: 2,
      name: 'Ngày giao xa nhất',
      active: false,
    },
  ];
  const [selectSort, setSelectSort] = useState(sortOptions);

  //get Current User Info
  useFocusEffect(
    useCallback(() => {
      const getCurrentUser = async () => {
        const currentUser = await AsyncStorage.getItem('userInfo');
        // console.log(JSON.parse(currentUser));
        setCurrentUser(JSON.parse(currentUser));
      }
      getCurrentUser();
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
              `${API.baseURL}/api/order/staff/getOrderGroup?status=PACKAGED`,
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
                console.log('group1', respond.orderGroups);
                if (respond.error) {
                  setLoading(false);
                  return;
                }
                setGroupListNotYetAssigned(respond.orderGroups);
                setLoading(false);
              })
              .catch(err => {
                console.log(err);
                setLoading(false);
              });

            fetch(
              `${API.baseURL}/api/order/staff/getOrderGroup?status=DELIVERING`,
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
                console.log('group2', respond.orderGroups);
                if (respond.error) {
                  setLoading(false);
                  return;
                }
                setGroupListAssigned(respond.orderGroups);
                setLoading(false);
              })
              .catch(err => {
                console.log(err);
                setLoading(false);
              });
          }
        }
      };
      setDate(null);
      setSelectSort(sortOptions);
      fetchData();
    }, []),
  );

  const ModalSortItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          const newArray = selectSort.map(i => {
            if (i.id === item.id) {
              if (i.active === true) {
                return {...i, active: false};
              } else {
                return {...i, active: true};
              }
            }
            return {...i, active: false};
          });
          // console.log(newArray);
          setSelectSort(newArray);
        }}
        style={
          item.active == true
            ? {
                borderColor: COLORS.primary,
                borderWidth: 1,
                borderRadius: 10,
                margin: 5,
              }
            : {
                borderColor: '#c8c8c8',
                borderWidth: 0.2,
                borderRadius: 10,
                margin: 5,
              }
        }>
        <Text
          style={
            item.active == true
              ? {
                  width: 150,
                  paddingVertical: 10,
                  textAlign: 'center',
                  color: COLORS.primary,

                  fontSize: 12,
                }
              : {
                  width: 150,
                  paddingVertical: 10,
                  textAlign: 'center',
                  color: 'black',

                  fontSize: 12,
                }
          }>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const sortOrder = selectSort => {
    const sortItem = selectSort.find(item => item.active === true);
    setLoading(true);
    if (sortItem) {
      const fetchData = async () => {
        if (auth().currentUser) {
          const tokenId = await auth().currentUser.getIdToken();
          if (tokenId) {
            setLoading(true);

            fetch(
              `${API.baseURL}/api/order/staff/getOrderGroup?status=PACKAGED${
                sortItem?.id == 1 ? '&deliverDateSortType=ASC' : ''
              }${sortItem?.id == 2 ? '&deliverDateSortType=DESC' : ''}`,
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
                console.log('group1', respond);
                if (respond.error) {
                  setLoading(false);
                  return;
                }
                // const notYetAssigned = respond.orderGroups.filter(item => {
                //   return item.deliverer === null;
                // });
                // const Assigned = respond.orderGroups.filter(item => {
                //   return item.deliverer !== null;
                // });
                setGroupListNotYetAssigned(respond.orderGroups);
                setLoading(false);
              })
              .catch(err => {
                console.log(err);
                setLoading(false);
              });

            fetch(
              `${API.baseURL}/api/order/staff/getOrderGroup?status=DELIVERING${
                sortItem?.id == 1 ? '&deliverDateSortType=ASC' : ''
              }${sortItem?.id == 2 ? '&deliverDateSortType=DESC' : ''}`,
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
                console.log('group2', respond);
                if (respond.error) {
                  setLoading(false);
                  return;
                }
                // const notYetAssigned = respond.orderGroups.filter(item => {
                //   return item.deliverer === null;
                // });
                // const Assigned = respond.orderGroups.filter(item => {
                //   return item.deliverer !== null;
                // });
                setGroupListAssigned(respond.orderGroups);
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
    } else {
      const fetchData = async () => {
        if (auth().currentUser) {
          const tokenId = await auth().currentUser.getIdToken();
          if (tokenId) {
            setLoading(true);
            fetch(
              `${API.baseURL}/api/order/staff/getOrderGroup?status=PACKAGED`,
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
                console.log('group1', respond.orderGroups);
                if (respond.error) {
                  setLoading(false);
                  return;
                }
                setGroupListNotYetAssigned(respond.orderGroups);
                setLoading(false);
              })
              .catch(err => {
                console.log(err);
                setLoading(false);
              });

            fetch(
              `${API.baseURL}/api/order/staff/getOrderGroup?status=DELIVERING`,
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
                console.log('group2', respond.orderGroups);
                if (respond.error) {
                  setLoading(false);
                  return;
                }
                setGroupListAssigned(respond.orderGroups);
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
    }
  };

  const handleApplySort = async () => {
    setDate(null);
    setModalVisible(!modalVisible);
    setLoading(true);
    sortOrder(selectSort);
  };

  const handleClear = () => {
    setDate(null);
    setModalVisible(!modalVisible);
    setSelectSort(sortOptions);
    setLoading(true);
    const fetchData = async () => {
      if (auth().currentUser) {
        const tokenId = await auth().currentUser.getIdToken();
        if (tokenId) {
          setLoading(true);
          fetch(
            `${API.baseURL}/api/order/staff/getOrderGroup?status=PACKAGED`,
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
              console.log('group1', respond.orderGroups);
              if (respond.error) {
                setLoading(false);
                return;
              }
              setGroupListNotYetAssigned(respond.orderGroups);
              setLoading(false);
            })
            .catch(err => {
              console.log(err);
              setLoading(false);
            });

          fetch(
            `${API.baseURL}/api/order/staff/getOrderGroup?status=DELIVERING`,
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
              console.log('group2', respond.orderGroups);
              if (respond.error) {
                setLoading(false);
                return;
              }
              setGroupListAssigned(respond.orderGroups);
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
  };

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
                Nhóm đơn điểm giao hàng
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
                  source={{
                    uri: currentUser?.avatarUrl,
                  }}
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
                  source={icons.calendar}
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
              setSelectSort(sortOptions);
              setOpen(false);
              setDate(date);
              const fetchData = async () => {
                if (auth().currentUser) {
                  const tokenId = await auth().currentUser.getIdToken();
                  if (tokenId) {
                    setLoading(true);
                    const deliverDate = format(date, 'yyyy-MM-dd');
                    fetch(
                      `${API.baseURL}/api/order/staff/getOrderGroup?deliverDate=${deliverDate}&status=PACKAGED`,
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
                        console.log('group1', respond);
                        if (respond.code === 404) {
                          setGroupListNotYetAssigned([]);
                          setGroupListAssigned([]);
                          setLoading(false);
                          return;
                        }
                        // const notYetAssigned = respond.orderGroups.filter(
                        //   item => {
                        //     return item.deliverer === null;
                        //   },
                        // );
                        // const Assigned = respond.orderGroups.filter(item => {
                        //   return item.deliverer !== null;
                        // });

                        setGroupListNotYetAssigned(respond.orderGroups);
                        setLoading(false);
                      })
                      .catch(err => {
                        console.log(err);
                        setLoading(false);
                      });

                    fetch(
                      `${API.baseURL}/api/order/staff/getOrderGroup?deliverDate=${deliverDate}&status=DELIVERING`,
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
                        console.log('group2', respond);
                        if (respond.code === 404) {
                          setGroupListNotYetAssigned([]);
                          setGroupListAssigned([]);
                          setLoading(false);
                          return;
                        }
                        // const notYetAssigned = respond.orderGroups.filter(
                        //   item => {
                        //     return item.deliverer === null;
                        //   },
                        // );
                        // const Assigned = respond.orderGroups.filter(item => {
                        //   return item.deliverer !== null;
                        // });

                        setGroupListAssigned(respond.orderGroups);
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
            }}
            onCancel={() => {
              setSelectSort(sortOptions);
              setDate(null);
              setOpen(false);
              const fetchData = async () => {
                if (auth().currentUser) {
                  const tokenId = await auth().currentUser.getIdToken();
                  if (tokenId) {
                    setLoading(true);
                    fetch(
                      `${API.baseURL}/api/order/staff/getOrderGroup?status=PACKAGED`,
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
                        console.log('group1', respond.orderGroups);
                        if (respond.error) {
                          setLoading(false);
                          return;
                        }
                        setGroupListNotYetAssigned(respond.orderGroups);
                        setLoading(false);
                      })
                      .catch(err => {
                        console.log(err);
                        setLoading(false);
                      });

                    fetch(
                      `${API.baseURL}/api/order/staff/getOrderGroup?status=DELIVERING`,
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
                        console.log('group2', respond.orderGroups);
                        if (respond.error) {
                          setLoading(false);
                          return;
                        }
                        setGroupListAssigned(respond.orderGroups);
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
                  setModalVisible(true);
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
                              deliverer: data.item.deliverer,
                              orderGroupId: data.item.id,
                              deliverDate: data.item.deliverDate,
                              timeFrame: data.item.timeFrame,
                              mode: 1,
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
                                  {data.item?.pickupPoint.address}
                                </Text>
                              </View>
                              <Text
                                style={{
                                  fontSize: 17,
                                  fontWeight: 'bold',
                                  fontFamily: 'Roboto',
                                  color: 'black',
                                }}>
                                Nhân viên giao hàng :{' '}
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
                            navigation.navigate('PickStaff', {
                              orderGroupId: data.item.id,
                              deliverDate: data.item.deliverDate,
                              timeFrame: data.item?.timeFrame,
                              staff: data.item?.deliverer,
                              mode: 1,
                            });

                            // setVisible(true);
                            // console.log(data.item.timeFrame.id);
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
                              orderGroupId: data.item.id,
                              deliverDate: data.item.deliverDate,
                              timeFrame: data.item.timeFrame,
                              mode: 1,
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
                                  {data.item?.pickupPoint.address}
                                </Text>
                              </View>
                              <Text
                                style={{
                                  fontSize: 17,
                                  fontWeight: 'bold',
                                  fontFamily: 'Roboto',
                                  color: 'black',
                                }}>
                                Nhân viên giao hàng :{' '}
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
                            navigation.navigate('PickStaff', {
                              orderGroupId: data.item.id,
                              deliverDate: data.item.deliverDate,
                              timeFrame: data.item?.timeFrame,
                              staff: data.item?.deliverer,
                              mode: 1,
                            });
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
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}>
            <Pressable
              onPress={() => setModalVisible(false)}
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
                    Bộ lọc tìm kiếm
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(!modalVisible);
                      setSelectSort(sortOptions);
                    }}>
                    <Image
                      resizeMode="contain"
                      style={{
                        width: 20,
                        height: 20,
                        tintColor: 'grey',
                      }}
                      source={icons.close}
                    />
                  </TouchableOpacity>
                </View>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 16,
                    fontWeight: 700,
                  }}>
                  Sắp xếp theo
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginVertical: 10,
                  }}>
                  {selectSort.map((item, index) => (
                    <ModalSortItem item={item} key={index} />
                  ))}
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginTop: '5%',
                  }}>
                  <TouchableOpacity
                    style={{
                      width: '50%',
                      paddingHorizontal: 15,
                      paddingVertical: 10,
                      backgroundColor: 'white',
                      borderRadius: 10,
                      borderColor: COLORS.primary,
                      borderWidth: 0.5,
                      marginRight: '2%',
                    }}
                    onPress={handleClear}>
                    <Text
                      style={{
                        color: COLORS.primary,
                        fontWeight: 'bold',
                        textAlign: 'center',
                      }}>
                      Thiết lập lại
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      width: '50%',
                      paddingHorizontal: 15,
                      paddingVertical: 10,
                      backgroundColor: COLORS.primary,
                      color: 'white',
                      borderRadius: 10,
                    }}
                    onPress={handleApplySort}>
                    <Text style={styles.textStyle}>Áp dụng</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Pressable>
          </Modal>
        </View>
        {loading && <LoadingScreen />}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default OrderGroup;

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
    flex: 3.5,
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
