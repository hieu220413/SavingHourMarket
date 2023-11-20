/* eslint-disable prettier/prettier */
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
  FlatList,
} from 'react-native';
import React, {useEffect, useState, useCallback, useRef} from 'react';
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
import Toast from 'react-native-toast-message';
import Pdf from 'react-native-pdf';

const SearchBar = () => {
  return (
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
        <TextInput
          style={{
            fontSize: 16,
            paddingLeft: 20,
          }}
          placeholder="Tìm kiếm đơn hàng"
        />
      </View>
    </View>
  );
};

const Home = ({navigation}) => {
  const [initializing, setInitializing] = useState(true);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderList, setOrderList] = useState([]);
  const [currentStatus, setCurrentStatus] = useState({
    display: 'Chờ đóng gói',
    value: 'PROCESSING',
  });
  const [visible, setVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [pickupPoint, setPickupPoint] = useState(null);
  const [order, setOrder] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const [consolidationAreaList, setConsolidationAreaList] = useState([]);
  const [editConsolidationAreaList, isEditConsolidationAreaList] =
    useState(false);
  const [selectedConsolidationAreaId, setSelectedConsolidationAreaId] =
    useState('');

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
        .then(res => res.text())
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

  const showToast = message => {
    Toast.show({
      type: 'success',
      text1: 'Thành công',
      text2: message + '👋',
      visibilityTime: 1000,
    });
  };

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

  const getConsolidationArea = async (pickupPointId, orderStatus) => {
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
        .then(res => res.json())
        .then(respond => {
          // console.log('order group', respond);
          if (respond.error) {
            setLoading(false);
            return;
          }
          if (orderStatus === 1) {
            setConsolidationAreaList(respond);
            setLoading(false);
            setEditVisible(true);
          } else {
            setSelectedConsolidationAreaId('');
            setConsolidationAreaList(respond);
            setLoading(false);
            setVisible(true);
          }
        })
        .catch(err => {
          console.log(err);
          setLoading(false);
        });
    }
  };

  const swipeListViewRef = useRef();

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  // edit consolidation  area function
  const editConsolidationArea = async () => {
    const fetchData = async () => {
      if (auth().currentUser) {
        const tokenId = await auth().currentUser.getIdToken();
        if (tokenId) {
          setLoading(true);
          if (pickupPoint && pickupPoint.id) {
            fetch(
              `${API.baseURL}/api/order/packageStaff/getOrders?pickupPointId=${pickupPoint?.id}&orderStatus=${currentStatus.value}&deliveryMethod=DOOR_TO_DOOR`,
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
            fetch(
              `${API.baseURL}/api/order/packageStaff/getOrders?orderStatus=${currentStatus.value}&deliveryMethod=DOOR_TO_DOOR`,
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
          }
        }
      }
    };
    const tokenId = await auth().currentUser.getIdToken();
    if (tokenId) {
      const consolidationAreaEditRequest = await fetch(
        `${API.baseURL}/api/order/packageStaff/editProductConsolidationArea?orderId=${order.id}&productConsolidationAreaId=${selectedConsolidationAreaId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokenId}`,
          },
        },
      ).catch(err => {
        console.log(err);
        return null;
        // setLoading(false);
      });

      if (!consolidationAreaEditRequest) {
        return;
      }

      if (consolidationAreaEditRequest.status === 200) {
        const result = await consolidationAreaEditRequest.text();
        console.log(result);
        fetchData();
        showToast(result);
        console.log(editVisible);
        setEditVisible(false);
      } else {
        const result = await consolidationAreaEditRequest.json();
        setEditVisible(false);
        console.log(result);
      }
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

  // init pickup point
  useFocusEffect(
    useCallback(() => {
      const initPickupPoint = async () => {
        // console.log('pick up point :', pickupPoint)
        const pickupPointStorage = await AsyncStorage.getItem('pickupPoint')
          .then(result => JSON.parse(result))
          .catch(error => {
            console.log(error);
            return null;
          });
        if (pickupPointStorage) {
          setPickupPoint(pickupPointStorage);
        } else {
          setPickupPoint({
            id: null,
          });
        }
      };
      initPickupPoint();
    }, []),
  );

  const isMountingRef = useRef(false);

  useEffect(() => {
    isMountingRef.current = true;
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (auth().currentUser) {
        const tokenId = await auth().currentUser.getIdToken();
        if (tokenId) {
          setLoading(true);
          if (pickupPoint && pickupPoint.id) {
            fetch(
              `${API.baseURL}/api/order/packageStaff/getOrders?pickupPointId=${pickupPoint?.id}&orderStatus=${currentStatus.value}&deliveryMethod=DOOR_TO_DOOR`,
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
            fetch(
              `${API.baseURL}/api/order/packageStaff/getOrders?orderStatus=${currentStatus.value}&deliveryMethod=DOOR_TO_DOOR`,
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
          }
        }
      }
    };

    if (!isMountingRef.current) {
      fetchData();
    } else {
      isMountingRef.current = false;
    }
  }, [currentStatus, pickupPoint]);

  // useFocusEffect(
  //   useCallback(() => {
  //     const fetchData = async () => {
  //       if (auth().currentUser) {
  //         const tokenId = await auth().currentUser.getIdToken();
  //         if (tokenId) {
  //           setLoading(true);
  //           if (pickupPoint) {
  //             fetch(
  //               `${API.baseURL}/api/order/packageStaff/getOrders?pickupPointId=${pickupPoint?.id}&orderStatus=${currentStatus.value}&deliveryMethod=DOOR_TO_DOOR`,
  //               {
  //                 method: 'GET',
  //                 headers: {
  //                   'Content-Type': 'application/json',
  //                   Authorization: `Bearer ${tokenId}`,
  //                 },
  //               },
  //             )
  //               .then(res => res.json())
  //               .then(respond => {
  //                 if (respond.error) {
  //                   setLoading(false);
  //                   return;
  //                 }

  //                 setOrderList(respond);
  //                 setLoading(false);
  //               })
  //               .catch(err => {
  //                 console.log(err);
  //                 setLoading(false);
  //               });
  //           } else {
  //             fetch(
  //               `${API.baseURL}/api/order/packageStaff/getOrders?orderStatus=${currentStatus.value}&deliveryMethod=DOOR_TO_DOOR`,
  //               {
  //                 method: 'GET',
  //                 headers: {
  //                   'Content-Type': 'application/json',
  //                   Authorization: `Bearer ${tokenId}`,
  //                 },
  //               },
  //             )
  //               .then(res => res.json())
  //               .then(respond => {
  //                 if (respond.error) {
  //                   setLoading(false);
  //                   return;
  //                 }

  //                 setOrderList(respond);
  //                 setLoading(false);
  //               })
  //               .catch(err => {
  //                 console.log(err);
  //                 setLoading(false);
  //               });
  //           }
  //         }
  //       }
  //     };
  //     fetchData();
  //   }, [currentStatus, pickupPoint]),
  // );

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (auth().currentUser) {
  //       const tokenId = await auth().currentUser.getIdToken();
  //       if (tokenId) {
  //         setLoading(true);

  //         fetch(`${API.baseURL}/api/staff/getInfo`, {
  //           method: 'GET',
  //           headers: {
  //             'Content-Type': 'application/json',
  //             Authorization: `Bearer ${tokenId}`,
  //           },
  //         })
  //           .then(res => res.json())
  //           .then(respond => {
  //             // console.log(respond.pickupPoint);
  //             if (respond.error) {
  //               setLoading(false);
  //               return;
  //             }
  //             setPickupPoint(respond.pickupPoint[0]);
  //             setLoading(false);
  //           })
  //           .catch(err => {
  //             console.log(err);
  //             setLoading(false);
  //           });
  //       }
  //     }
  //   };
  //   fetchData();
  // }, []);

  const orderStatus = [
    {display: 'Chờ đóng gói', value: 'PROCESSING'},
    {display: 'Đang đóng gói', value: 'PACKAGING'},
    {display: 'Đã đóng gói', value: 'PACKAGED'},
  ];

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
    {
      id: 3,
      name: 'Đơn mới nhất',
      active: false,
    },
    {
      id: 4,
      name: 'Đơn cũ nhất',
      active: false,
    },
  ];
  const [selectSort, setSelectSort] = useState(sortOptions);
  const [modalVisible, setModalVisible] = useState(false);

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
              `${
                API.baseURL
              }/api/order/packageStaff/getOrders?deliveryMethod=DOOR_TO_DOOR&${
                pickupPoint && pickupPoint.id
                  ? `pickupPointId=${pickupPoint.id}`
                  : ''
              }&orderStatus=${currentStatus.value}${
                sortItem?.id == 1 ? '&deliveryDateSortType=ASC' : ''
              }${sortItem?.id == 2 ? '&deliveryDateSortType=DESC' : ''}${
                sortItem?.id == 3 ? '&createdTimeSortType=DESC' : ''
              }${sortItem?.id == 4 ? '&createdTimeSortType=ASC' : ''}`,
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
                console.log('sort');
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
              `${API.baseURL}/api/order/packageStaff/getOrders?${
                pickupPoint && pickupPoint.id
                  ? `pickupPointId=${pickupPoint.id}`
                  : ''
              }&orderStatus=${currentStatus.value}&deliveryMethod=DOOR_TO_DOOR`,
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
                if (respond.error) {
                  setLoading(false);
                  return;
                }
                setOrderList(respond);
                setLoading(false);
              })
              .catch(err => {
                console.log(err + '1');
                setLoading(false);
              });
          }
        }
      };
      fetchData();
    }
  };

  const handleApplySort = () => {
    setModalVisible(!modalVisible);
    setLoading(true);
    sortOrder(selectSort);
  };

  const handleClear = () => {
    setModalVisible(!modalVisible);
    setLoading(true);
    const fetchData = async () => {
      if (auth().currentUser) {
        const tokenId = await auth().currentUser.getIdToken();
        if (tokenId) {
          setLoading(true);

          fetch(
            `${API.baseURL}/api/order/packageStaff/getOrders?${
              pickupPoint && pickupPoint.id
                ? `pickupPointId=${pickupPoint.id}`
                : ''
            }&orderStatus=${currentStatus.value}&deliveryMethod=DOOR_TO_DOOR`,
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
              if (respond.error) {
                setLoading(false);
                return;
              }
              setSelectSort(sortOptions);
              setOrderList(respond);
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

  const handleCancel = () => {
    setVisible(false);
    setEditVisible(false);
  };

  const handleConfirm = () => {
    const fetchData = async () => {
      if (auth().currentUser) {
        const tokenId = await auth().currentUser.getIdToken();
        if (tokenId) {
          setLoading(true);
          if (pickupPoint && pickupPoint.id) {
            fetch(
              `${API.baseURL}/api/order/packageStaff/getOrders?pickupPointId=${pickupPoint?.id}&orderStatus=${currentStatus.value}&deliveryMethod=DOOR_TO_DOOR`,
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
            fetch(
              `${API.baseURL}/api/order/packageStaff/getOrders?orderStatus=${currentStatus.value}&deliveryMethod=DOOR_TO_DOOR`,
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
          }
        }
      }
    };
    const confirmPackaging = async () => {
      if (auth().currentUser) {
        const tokenId = await auth().currentUser.getIdToken();
        if (tokenId) {
          setLoading(true);
          fetch(
            `${API.baseURL}/api/order/packageStaff/confirmPackaging?orderId=${order.id}&productConsolidationAreaId=${selectedConsolidationAreaId}`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${tokenId}`,
              },
            },
          )
            .then(res => res.text())
            .then(respond => {
              fetchData();
              showToast(respond);
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
            `${API.baseURL}/api/order/packageStaff/confirmPackaged?orderId=${order.id}`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${tokenId}`,
              },
            },
          )
            .then(res => res.text())
            .then(respond => {
              fetchData();
              showToast(respond);
            })
            .catch(err => {
              console.log(err);
              setLoading(false);
            });
        }
      }
    };
    if (order.status === 0) {
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
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss;
        setOpen(false);
      }}
      accessible={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.areaAndLogout}>
            <View style={styles.area}>
              <Text style={{fontSize: 16}}>Khu vực:</Text>
              <View style={styles.pickArea}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('SelectPickupPoint', {
                      setPickupPoint: setPickupPoint,
                    });
                  }}>
                  <View style={styles.pickAreaItem}>
                    <Image
                      resizeMode="contain"
                      style={{
                        width: 20,
                        height: 20,
                        tintColor: COLORS.primary,
                      }}
                      source={icons.location}
                    />

                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: 'Roboto',
                        color: 'black'
                      }}
                      numberOfLines={1}>
                      {pickupPoint && pickupPoint.id
                        ? pickupPoint.address
                        : 'Chọn điểm giao hàng'}
                      {/* Chọn điểm giao hàng */}
                    </Text>
                  </View>
                </TouchableOpacity>
                {pickupPoint && pickupPoint.id ? (
                  <TouchableOpacity
                    onPress={async () => {
                      setPickupPoint(null);
                      await AsyncStorage.removeItem('pickupPoint');
                    }}>
                    <Image
                      resizeMode="contain"
                      style={{
                        width: 22,
                        height: 22,
                        tintColor: COLORS.primary,
                      }}
                      source={icons.clearText}
                    />
                  </TouchableOpacity>
                ) : (
                  <></>
                )}
              </View>
            </View>
            <View style={styles.logout}>
              <TouchableOpacity
                onPress={() => {
                  setOpen(!open);
                }}>
                <Image
                  resizeMode="contain"
                  style={{width: 38, height: 38}}
                  source={{
                    uri: currentUser?.avatarUrl,
                  }}
                />
              </TouchableOpacity>
              {open && (
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    bottom: -30,
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
          {/* <SearchBar /> */}
          <View
            style={{
              flexDirection: 'row',
            }}>
            <View style={{flex: 6}}>
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
                  fontSize: 20,
                  fontFamily: 'Roboto',
                  // color: 'black',
                  fontWeight: 'bold',
                }}>
                Chưa có đơn hàng nào
              </Text>
            </View>
          ) : (
            <View style={{height: '87%'}}>
              <SwipeListView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                ref={swipeListViewRef}
                data={orderList}
                keyExtractor={(item, index) => item.id}
                renderItem={(data, rowMap) => (
                  <View
                    key={data.item.id}
                    style={{
                      marginBottom: 20,
                      backgroundColor: 'rgb(240,240,240)',
                      zIndex: 100,
                      padding: 10,
                      borderRadius: 10,
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 3,
                      },
                      shadowOpacity: 0.27,
                      shadowRadius: 4.65,
                      elevation: 6,
                      paddingHorizontal: 10,
                      margin: 4,
                    }}>
                    {/* Order detail */}
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('OrderDetail', {
                          id: data.item.id,
                          orderSuccess: false,
                        });
                      }}>
                      <View style={{flexDirection: 'row', paddingBottom: 9}}>
                        <Text
                          style={{
                            flex: 13,
                            fontSize: 20,
                            paddingTop: 6,
                            fontWeight: 'bold',
                            fontFamily: 'Roboto',
                            color: COLORS.primary,
                          }}>
                          {data.item?.status === 0 && 'Chờ đóng gói'}
                          {data.item?.status === 1 && 'Đang đóng gói'}
                          {data.item?.status === 2 && 'Đã đóng gói'}
                        </Text>
                        {data.item?.status === 2 &&
                          data.item?.packager?.fullName != null && (
                            <>
                              <View
                                style={{
                                  flex: 3,
                                  alignItems: 'flex-end',
                                  marginTop: 4,
                                  width: 30,
                                  height: 40,
                                  borderRadius: 50, // Half of width and height to make it circular
                                }}>
                                <Image
                                  source={icons.packaged}
                                  resizeMode="contain"
                                  style={{
                                    width: 30,
                                    height: 30,
                                    padding: 15,
                                    tintColor: 'white',
                                    borderRadius: 50, // Half of width and height to make it circular
                                    overflow: 'hidden',
                                    backgroundColor: 'green',
                                  }}
                                />
                              </View>
                              <Text
                                style={{
                                  flex: 7,
                                  alignItems: 'flex-end',
                                  fontSize: 16,
                                  paddingLeft: 5,
                                  paddingTop: 7,
                                  fontWeight: 'bold',
                                  fontFamily: 'Roboto',
                                  color: COLORS.secondary,
                                }}>
                                {data.item?.packager?.fullName}
                              </Text>
                            </>
                          )}
                        {data.item?.status === 1 &&
                          data.item?.packager?.fullName != null && (
                            <>
                              <View
                                style={{
                                  marginLeft: 15,
                                  marginTop: 4,
                                  marginBottom: 10,
                                  width: 30,
                                  height: 30,
                                  borderRadius: 50,
                                  backgroundColor: 'green',
                                  alignItems: 'center',
                                }}>
                                <Image
                                  source={icons.packaging}
                                  resizeMode="contain"
                                  style={{
                                    width: 20,
                                    height: 30,
                                    tintColor: 'white',
                                  }}
                                />
                              </View>
                              <Text
                                style={{
                                  flex: 7,
                                  alignItems: 'flex-end',
                                  fontSize: 16,
                                  paddingLeft: 5,
                                  paddingTop: 7,
                                  fontWeight: 'bold',
                                  fontFamily: 'Roboto',
                                  color: COLORS.secondary,
                                }}>
                                {data.item?.packager?.fullName}
                              </Text>
                            </>
                          )}
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                        <View style={{flexDirection: 'column', gap: 8}}>
                          <Text
                            style={{
                              fontSize: 17,
                              fontWeight: 'bold',
                              fontFamily: 'Roboto',
                              color: 'black',
                            }}>
                            Ngày đặt :{' '}
                            {format(
                              Date.parse(data.item?.createdTime),
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
                              Date.parse(data.item?.deliveryDate),
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
                            Tổng tiền:{' '}
                            {data.item?.totalPrice?.toLocaleString('vi-VN', {
                              style: 'currency',
                              currency: 'VND',
                            })}
                          </Text>
                          {data.item?.productConsolidationArea?.address && (
                            <Text
                              style={{
                                fontSize: 17,
                                fontWeight: 'bold',
                                fontFamily: 'Roboto',
                                color: 'black',
                                maxWidth: '84%',
                              }}>
                              Điểm tập kết:{' '}
                              {data.item?.productConsolidationArea.address}
                            </Text>
                          )}
                        </View>
                        <Image
                          resizeMode="contain"
                          style={{
                            width: 30,
                            height: 30,
                            marginBottom: 30,
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
                    key={data.item.id}
                    style={{
                      flexDirection: 'row',
                      justifyContent:
                        data.item?.status === 1 ? 'space-between' : 'flex-end',
                      height: data.item?.status === 0 ? '86%' : '90.5%',
                      paddingHorizontal: 10,
                      margin: 4,
                    }}>
                    {data.item?.status === 1 && (
                      <TouchableOpacity
                        style={{
                          width: 120,
                          height: '100%',
                          backgroundColor: 'grey',
                          borderBottomLeftRadius: 10,

                          borderTopLeftRadius: 10,
                          // flex: 1,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        onPress={() => {
                          print(data.item?.id);
                          closeRow(rowMap, data.item.id);
                        }}>
                        <View>
                          <Image
                            source={icons.print}
                            resizeMode="contain"
                            style={{width: 40, height: 40, tintColor: 'white'}}
                          />
                        </View>
                      </TouchableOpacity>
                    )}
                    {(data.item?.status === 1 || data.item?.status === 0) && (
                      <>
                        {data.item?.status === 1 && (
                          <TouchableOpacity
                            style={{
                              width: 100,
                              height: '100%',
                              backgroundColor: COLORS.secondary,
                              // flex: 1,
                              marginLeft: 20,
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                            onPress={() => {
                              setLoading(true);
                              setConsolidationAreaList([]);
                              getConsolidationArea(
                                data.item.pickupPoint.id,
                                data.item.status,
                              );
                              setSelectedConsolidationAreaId(
                                data.item?.productConsolidationArea.id,
                              );
                              isEditConsolidationAreaList(true);
                              setOrder(data.item);
                              closeRow(rowMap, data.item.id);
                            }}>
                            <View>
                              <Image
                                source={icons.edit}
                                resizeMode="contain"
                                style={{
                                  width: 30,
                                  height: 30,
                                  tintColor: 'white',
                                }}
                              />
                            </View>
                          </TouchableOpacity>
                        )}

                        <TouchableOpacity
                          style={{
                            width: 110,
                            height: '100%',
                            backgroundColor: COLORS.primary,
                            borderBottomRightRadius: 10,
                            borderTopRightRadius: 10,
                            // flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                          onPress={() => {
                            setLoading(true);
                            setConsolidationAreaList([]);
                            getConsolidationArea(data.item.pickupPoint.id);
                            // console.log(data.item.id);
                            setOrder(data.item);
                            closeRow(rowMap, data.item.id);
                          }}>
                          <View>
                            {data.item?.status === 0 && (
                              <Image
                                source={icons.packaging}
                                resizeMode="contain"
                                style={{
                                  width: 40,
                                  height: 40,
                                  tintColor: 'white',
                                }}
                              />
                            )}
                            {data.item?.status === 1 && (
                              <Image
                                source={icons.packaged}
                                resizeMode="contain"
                                style={{
                                  width: 55,
                                  height: 55,
                                  tintColor: 'white',
                                }}
                              />
                            )}
                          </View>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                )}
                disableLeftSwipe={orderList[0]?.status === 2 ? true : false}
                disableRightSwipe={
                  orderList[0]?.status === 2 || orderList[0]?.status === 0
                    ? true
                    : false
                }
                leftOpenValue={orderList[0]?.status === 1 ? 120 : 0}
                rightOpenValue={orderList[0]?.status === 0 ? -120 : -200}
              />
            </View>
          )}
          {/* ************************ */}
          {/* Modal Sort */}
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
                    {orderList[0]?.status === 0 && 'Xác nhận đóng gói đơn hàng'}
                    {orderList[0]?.status === 1 &&
                      'Hoàn thành đóng gói đơn hàng'}
                  </Text>
                </View>
                {orderList[0]?.status === 0 && (
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
                {orderList[0]?.status === 1 && (
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
                      width: '50%',
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
                      width: '50%',
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
          {/* Modal Edit */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={editVisible}
            onRequestClose={() => {
              setEditVisible(!editVisible);
            }}>
            <Pressable
              onPress={() => setEditVisible(false)}
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
                    Chỉnh sửa điểm tập kết
                  </Text>
                </View>
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
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  style={{maxHeight: 200, marginHorizontal: 7}}
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

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
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
                      width: '50%',
                      paddingHorizontal: 15,
                      paddingVertical: 10,
                      backgroundColor: COLORS.primary,
                      color: 'white',
                      borderRadius: 10,
                    }}
                    onPress={() => {
                      editConsolidationArea();
                    }}>
                    <Text style={styles.textStyle}>Xác nhận</Text>
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

export default Home;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flex: 2,
    // backgroundColor: 'orange',
    paddingHorizontal: 20,
    zIndex: 100,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  body: {
    flex: 11,
    // backgroundColor: 'pink',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  areaAndLogout: {
    paddingTop: 10,
    flexDirection: 'row',
  },
  pickArea: {
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  area: {
    flex: 7,
    // backgroundColor: 'white',
  },
  logout: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginLeft: 10,
  },
  pickAreaItem: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    width: '90%',
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
