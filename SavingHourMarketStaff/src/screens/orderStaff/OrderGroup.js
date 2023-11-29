/* eslint-disable react-native/no-inline-styles */
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
  Switch,
} from 'react-native';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../../constants/theme';
import { icons } from '../../constants';
import { useFocusEffect } from '@react-navigation/native';
import { API } from '../../constants/api';
import { format } from 'date-fns';
import CartEmpty from '../../assets/image/search-empty.png';
import { SwipeListView } from 'react-native-swipe-list-view';
import LoadingScreen from '../../components/LoadingScreen';
import { da } from 'date-fns/locale';
import DatePicker from 'react-native-date-picker';
import {
  ModalButton,
  ModalContent,
  ModalFooter,
  ScaleAnimation,
} from 'react-native-modals';
import database from '@react-native-firebase/database';
import { checkSystemState } from '../../common/utils';

const OrderGroupForOrderStaff = ({ navigation, route }) => {
  // listen to system state
  useFocusEffect(
    useCallback(() => {
      checkSystemState(navigation);
    }, []),
  );

  const [initializing, setInitializing] = useState(true);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState({
    display: 'Chờ đóng gói',
    value: 'PROCESSING',
  });
  const [visible, setVisible] = useState(false);
  const [pickupPoint, setPickupPoint] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const orderGroupAreaState = [
    { display: 'Chờ đóng gói', value: 'PROCESSING' },
    { display: 'Đang đóng gói', value: 'PACKAGING' },
    { display: 'Đã đóng gói', value: 'PACKAGED' },
    { display: 'Giao hàng', value: 'DELIVERING_SUCCESS' },
    { display: 'Đã huỷ', value: 'FAIL' },
  ];

  // init fake timeframe
  const [timeFrameList, setTimeFrameList] = useState([
    // {
    //   id: 'accf0876-5541-11ee-8a50-a85e45c41921',
    //   fromHour: '19:00:00',
    //   toHour: '20:30:00',
    //   status: 1,
    //   allowableDeliverMethod: 0,
    // },
    // {
    //   id: 'accf0996-5541-11ee-8a50-a85e45c41921',
    //   fromHour: '21:00:00',
    //   toHour: '22:30:00',
    //   status: 1,
    //   allowableDeliverMethod: 0,
    // },
  ]);

  // init area fake data
  const [consolidationAreaList, setConsolidationAreaList] = useState([]);

  // init fake order group data
  const [orderGroupList, setOrderGroupList] = useState([]);

  const [orderFailList, setOrderFailList] = useState([]);

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

  // value to make sure that data not fetch second time when init pickup point
  // init pickup point

  //get Current User Info
  useFocusEffect(
    useCallback(() => {
      const getCurrentUser = async () => {
        const currentUser = await AsyncStorage.getItem('userInfo');
        // console.log(JSON.parse(currentUser));
        setCurrentUser(JSON.parse(currentUser));
      };
      getCurrentUser();
    }, []),
  );
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  // intit fetch time frame + order group
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        // await filterOrderGroup();
      };
      // fetch time frame
      fetch(`${API.baseURL}/api/timeframe/getForPickupPoint`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
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
          if (respond.error) {
            return;
          }
          setTimeFrameList(respond);
        })
        .catch(err => {
          console.log(err);
        });
      // console.log(route.params?.goBackFromPickupPoint);
      // if (!route.params?.goBackFromPickupPoint) {
      // console.log(' go back false')
      // } else {
      //   route.params.goBackFromPickupPoint = undefined;
      // }

      fetchData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectSort, selectedDate, selectedTimeFrameId]),
  );

  // response message view modal
  const [openResponseDialog, setOpenResponseDialog] = useState(false);
  const [messageResult, setMessageResult] = useState('');

  // handle sort date
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const sortOptions = [
    {
      id: 1,
      name: 'Ngày giao gần nhất',
      param: '&deliverDateSortType=ASC',
      active: false,
    },
    {
      id: 2,
      name: 'Ngày giao xa nhất',
      param: '&deliverDateSortType=DESC',
      active: false,
    },
  ];

  const [selectSort, setSelectSort] = useState(sortOptions);
  const [tempSelectedSortId, setTempSelectedSortId] = useState('');

  //  filter pickup point
  const [selectedTimeFrameId, setSelectedTimeFrameId] = useState('');
  const [tempSelectedTimeFrameId, setTempSelectedTimeFrameId] = useState('');
  //  filter date
  const [selectedDate, setSelectedDate] = useState('');
  const [tempSelectedDate, setTempSelectedDate] = useState('');
  // isEnable date filter
  const [isEnableDateFilter, setIsEnableDateFilter] = useState(false);

  // filter function
  const filterOrderGroup = async () => {
    console.log('filter order gorup is run');
    const tokenId = await auth().currentUser.getIdToken();
    if (tokenId) {
      setLoading(true);
      // console.log('selectedDate: ', selectedDate);
      // console.log('selectedTimeFrame: ', selectedTimeFrameId);
      // console.log('tempSelectedDate: ', tempSelectedDate);
      // console.log('tempSelectedTimeFrame: ', tempSelectedTimeFrameId);
      // console.log('pickupPoint: ', pickupPoint);
      await fetch(
        `${API.baseURL
        }/api/order/packageStaff/getOrderGroup?getOldOrderGroup=true&${pickupPoint && pickupPoint.id
          ? 'pickupPointId=' + pickupPoint?.id
          : ''
        }${selectedDate === ''
          ? ''
          : '&deliverDate=' + format(Date.parse(selectedDate), 'yyyy-MM-dd')
        }${selectedTimeFrameId === ''
          ? ''
          : '&timeFrameId=' + selectedTimeFrameId
        }${tempSelectedSortId === ''
          ? ''
          : selectSort.find(item => item.id === tempSelectedSortId)?.param
        }`,
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

          setOrderGroupList(
            respond.map(item => {
              return {
                ...item,
                isExpand: false,
              };
            }),
          );
          setLoading(false);
        })
        .catch(err => {
          console.log(err);
          setLoading(false);
        });
    }
  };

  const filterOrderFail = async () => {
    console.log('filter order fail is run');
    const tokenId = await auth().currentUser.getIdToken();
    if (tokenId) {
      setLoading(true);
      // console.log('selectedDate: ', selectedDate);
      // console.log('selectedTimeFrame: ', selectedTimeFrameId);
      // console.log('tempSelectedDate: ', tempSelectedDate);
      // console.log('tempSelectedTimeFrame: ', tempSelectedTimeFrameId);
      // console.log('pickupPoint: ', pickupPoint);
      await fetch(
        `${API.baseURL
        }/api/order/packageStaff/getOrders?getOldOrder=true&orderStatus=CANCEL&deliveryMethod=PICKUP_POINT&${pickupPoint && pickupPoint.id
          ? 'pickupPointId=' + pickupPoint?.id
          : ''
        }${selectedDate === ''
          ? ''
          : '&deliveryDate=' + format(Date.parse(selectedDate), 'yyyy-MM-dd')
        }${selectedTimeFrameId === ''
          ? ''
          : '&timeFrameId=' + selectedTimeFrameId
        }${tempSelectedSortId === ''
          ? ''
          : selectSort.find(item => item.id === tempSelectedSortId)?.param
        }`,
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
          setOrderFailList(respond);
          setLoading(false);
        })
        .catch(err => {
          console.log(err);
          setLoading(false);
        });
    }
  };

  // handle apply filter
  const handleApplyFilter = () => {
    setSelectSort(
      selectSort.map(item => {
        if (item.id === tempSelectedSortId) {
          return { ...item, active: true };
        }
        return { ...item, active: false };
      }),
    );
    setSelectedTimeFrameId(tempSelectedTimeFrameId);
    setSelectedDate(tempSelectedDate);
    setSortModalVisible(!sortModalVisible);
  };

  // fetch data after handle apply filter
  const isMountingRef = useRef(false);

  useEffect(() => {
    isMountingRef.current = true;
  }, []);

  // useEffect(() => {
  //   if (!isMountingRef.current) {
  //     console.log('ndafbsdhjfbhsdfbj');
  //     setSelectSort(sortOptions);
  //     setTempSelectedSortId('');
  //     setSelectedDate('');
  //     setTempSelectedDate('');
  //     setSelectedTimeFrameId('');
  //     setTempSelectedTimeFrameId('');
  //   }

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [pickupPoint]);

  useEffect(() => {
    const fetchData = async () => {
      // console.log(pickupPoint);
      if (!isMountingRef.current) {
        if (currentStatus.value !== 'FAIL') {
          await filterOrderGroup();
        } else {
          await filterOrderFail();
        }
      } else {
        isMountingRef.current = false;
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectSort,
    selectedDate,
    selectedTimeFrameId,
    pickupPoint,
    currentStatus,
  ]);

  // handle toggle date filter
  const toggleSwitchFilterDate = value => {
    if (value) {
      setTempSelectedDate(new Date());
    } else {
      setTempSelectedDate('');
    }
    setIsEnableDateFilter(value);
  };

  // handle clear sort modal
  const handleClearSortModal = () => {
    // setSelectSort(sortOptions);
    setTempSelectedSortId('');
    setTempSelectedTimeFrameId(' ');
    setTempSelectedDate('');
    setIsEnableDateFilter(false);
    // setSelectedDate(new Date());
    setSelectSort(
      selectSort.map(item => {
        return { ...item, active: false };
      }),
    );
    setSelectedTimeFrameId('');
    setSelectedDate('');
    console.log('thiet lap lai');
    setSortModalVisible(!sortModalVisible);
  };

  // handle close sort modal
  const handleCloseSortModal = () => {
    console.log('close sort modal');
    const activeSortOption = selectSort.find(item => item.active === true);
    setTempSelectedSortId(activeSortOption ? activeSortOption.id : '');
    setTempSelectedDate(selectedDate);
    setTempSelectedTimeFrameId(selectedTimeFrameId);
    setSortModalVisible(!sortModalVisible);
  };

  // handle confirm packaging model & edit consolidation area
  const [confirmPackagingModalVisible, setConfirmPackagingModalVisible] =
    useState(false);
  const [isConfirmPackagingHaveArea, setIsConfirmPackagingHaveArea] =
    useState(false);
  const [
    editConsolidationAreaModalVisible,
    setEditConsolidationAreaModalVisible,
  ] = useState(false);
  const [editStatusPackagedModalVisible, setEditStatusPackagedModalVisible] =
    useState(false);
  const [selectedEditGroupId, setSelectedEditGroupId] = useState('');

  const [selectedConsolidationAreaId, setSelectedConsolidationAreaId] =
    useState('');

  // fetch area for group
  const getConsolidationAreaForGroup = async groupPickupPointId => {
    setLoading(true);
    const tokenId = await auth().currentUser.getIdToken();
    if (tokenId) {
      await fetch(
        `${API.baseURL}/api/productConsolidationArea/getByPickupPointForStaff?pickupPointId=${groupPickupPointId}`,
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
          console.log('consolidation area: ', respond);
          if (respond.error) {
            setLoading(false);
            return;
          }

          setConsolidationAreaList(respond);
          setLoading(false);
        })
        .catch(err => {
          console.log(err);
          setLoading(false);
        });
    }
  };

  // edit consolidation area function
  const editConsolidationArea = async () => {
    setLoading(true);
    const tokenId = await auth().currentUser.getIdToken();
    if (tokenId) {
      const editConsolidationAreaRequest = await fetch(
        `${API.baseURL}/api/order/packageStaff/editProductConsolidationAreaGroup?orderGroupId=${selectedEditGroupId}&productConsolidationAreaId=${selectedConsolidationAreaId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokenId}`,
          },
        },
      ).catch(err => {
        console.log(err);
        setLoading(false);
        return null;
        // setLoading(false);
      });

      if (!editConsolidationAreaRequest) {
        return;
      }

      if (
        editConsolidationAreaRequest.status === 403 ||
        editConsolidationAreaRequest.status === 401
      ) {
        await auth()
          .currentUser.getIdToken(true)
          .catch(async err => {
            await AsyncStorage.setItem('isDisableAccount', '1');
            return null;
          });
      }

      if (editConsolidationAreaRequest.status === 200) {
        setLoading(false);
        const result = await editConsolidationAreaRequest.text();
        setMessageResult('Nhóm đơn hàng đã thay đổi điểm tập kết thành công!');
        setOpenResponseDialog(true);
        await filterOrderGroup();
      } else {
        setLoading(false);
        const result = await editConsolidationAreaRequest.json();
        // console.log(result);
        setMessageResult(result.message);
        setOpenResponseDialog(true);
      }
    }
  };

  // confirm packaging group function
  const confirmPackagingGroup = async () => {
    setLoading(true);
    const tokenId = await auth().currentUser.getIdToken();
    if (tokenId) {
      const confirmPackagingGroupRequest = await fetch(
        `${API.baseURL}/api/order/packageStaff/confirmPackagingGroup?orderGroupId=${selectedEditGroupId}&productConsolidationAreaId=${selectedConsolidationAreaId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokenId}`,
          },
        },
      ).catch(err => {
        console.log(err);
        setLoading(false);
        return null;
        // setLoading(false);
      });

      if (!confirmPackagingGroupRequest) {
        return;
      }

      if (
        confirmPackagingGroupRequest.status === 403 ||
        confirmPackagingGroupRequest.status === 401
      ) {
        await auth()
          .currentUser.getIdToken(true)
          .catch(async err => {
            await AsyncStorage.setItem('isDisableAccount', '1');
            return null;
          });
      }

      if (confirmPackagingGroupRequest.status === 200) {
        setLoading(false);
        const result = await confirmPackagingGroupRequest.text();
        setMessageResult(result);
        setOpenResponseDialog(true);
        await filterOrderGroup();
      } else {
        setLoading(false);
        const result = await confirmPackagingGroupRequest.json();
        // console.log(result);
        setMessageResult(result.message);
        setOpenResponseDialog(true);
      }
    }
  };

  // update group status to packaged
  const updateStatusToPackaged = async () => {
    setLoading(true);
    const tokenId = await auth().currentUser.getIdToken();
    if (tokenId) {
      const updateStatusToPackagedRequest = await fetch(
        `${API.baseURL}/api/order/packageStaff/confirmPackagedGroup?orderGroupId=${selectedEditGroupId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokenId}`,
          },
        },
      ).catch(err => {
        console.log(err);
        setLoading(true);
        return null;
        // setLoading(false);
      });

      if (!updateStatusToPackagedRequest) {
        return;
      }

      if (
        updateStatusToPackagedRequest.status === 403 ||
        updateStatusToPackagedRequest.status === 401
      ) {
        await auth()
          .currentUser.getIdToken(true)
          .catch(async err => {
            await AsyncStorage.setItem('isDisableAccount', '1');
            return null;
          });
      }

      if (updateStatusToPackagedRequest.status === 200) {
        setLoading(false);
        const result = await updateStatusToPackagedRequest.text();
        await filterOrderGroup();
        setMessageResult(result);
        setOpenResponseDialog(true);
      } else {
        setLoading(false);
        const result = await updateStatusToPackagedRequest.json();
        console.log(result);
        setMessageResult(result.message);
        setOpenResponseDialog(true);
      }
    }
  };

  const handleOpenEditModal = async (
    groupId,
    groupConsolidationArea,
    groupPickupPointId,
  ) => {
    setSelectedEditGroupId(groupId);
    await getConsolidationAreaForGroup(groupPickupPointId);
    if (groupConsolidationArea) {
      setSelectedConsolidationAreaId(groupConsolidationArea.id);
      setIsConfirmPackagingHaveArea(true);
    }
    setConfirmPackagingModalVisible(true);

    // if (!groupConsolidationArea) {
    //   // handle confirm packaging
    //   setConfirmPackagingModalVisible(true);
    // } else {
    //   setSelectedConsolidationAreaId(groupConsolidationArea.id);
    //   // handle update status for all order in group to packaged
    //   setEditConsolidationAreaModalVisible(true);
    // }
  };

  const handlOpenEditStatusPackagedModal = groupId => {
    setSelectedEditGroupId(groupId);
    setEditStatusPackagedModalVisible(true);
  };

  const handlCloseEditStatusPackagedModal = groupId => {
    setSelectedEditGroupId('');
    setEditStatusPackagedModalVisible(false);
  };

  const handleCloseEditModal = groupId => {
    setSelectedEditGroupId('');
    setConfirmPackagingModalVisible(false);
    setIsConfirmPackagingHaveArea(false);
    setEditConsolidationAreaModalVisible(false);

    setSelectedConsolidationAreaId('');
  };

  const handleSubmitEditStatusPackaged = async () => {
    setEditStatusPackagedModalVisible(false);
    await updateStatusToPackaged();
    setSelectedEditGroupId('');
  };

  const handleSubmitConfirmPackagingModal = async () => {
    setConfirmPackagingModalVisible(false);
    await confirmPackagingGroup();
    setSelectedEditGroupId('');
    setSelectedConsolidationAreaId('');
  };

  const handleEditAreaModal = async () => {
    setEditConsolidationAreaModalVisible(false);
    await editConsolidationArea();
    setSelectedEditGroupId('');
    setSelectedConsolidationAreaId('');
  };

  return (
    <>
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
                <Text style={{ fontSize: 16 }}>Khu vực:</Text>
                <View style={styles.pickArea}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('SelectPickupPoint', {
                        isFromOrderGroupRoute: true,
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
                          color: 'black',
                          maxWidth: 270,
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
                    style={{ width: 38, height: 38 }}
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
                    <Text style={{ color: 'red', fontWeight: 'bold' }}>
                      Đăng xuất
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <View style={{ flex: 6, paddingTop: '3%' }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {orderGroupAreaState.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        setCurrentStatus(item);
                      }}>
                      <View
                        style={[
                          {
                            paddingHorizontal: 15,
                            paddingBottom: 10,
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
                    setSortModalVisible(true);
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
            {/* Order group list */}
            {currentStatus.value === 'FAIL' ? (
              <>
                {!orderFailList || orderFailList.length === 0 ? (
                  <View
                    style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Image
                      style={{ width: '100%', height: '50%' }}
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
                      Không có nhóm nào
                    </Text>
                  </View>
                ) : (
                  orderFailList.map((order, index) => (
                    <TouchableOpacity
                      style={{
                        paddingHorizontal: 0,
                        paddingVertical: 10,
                      }}
                      onPress={() => {
                        navigation.navigate('OrderDetail', {
                          id: order.id,
                          orderSuccess: false,
                        });
                      }}
                      key={index}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          backgroundColor: 'rgb(240,240,240)',
                          marginHorizontal: 5,
                          paddingHorizontal: 10,
                          paddingVertical: 10,
                          borderRadius: 10,
                          shadowColor: '#000',
                          shadowOffset: {
                            width: 0,
                            height: 2,
                          },
                          shadowOpacity: 0.25,
                          shadowRadius: 4,
                          elevation: 5,
                        }}>
                        <View
                          style={{
                            flexDirection: 'column',
                            gap: 8,
                          }}>
                          <Text
                            style={{
                              fontSize: 20,
                              fontWeight: 'bold',
                              fontFamily: 'Roboto',
                              color: COLORS.red,
                            }}>
                            Hủy đóng gói
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
                              Date.parse(order?.createdTime),
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
                              Date.parse(order?.deliveryDate),
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
                            {order?.totalPrice?.toLocaleString('vi-VN', {
                              style: 'currency',
                              currency: 'VND',
                            })}
                          </Text>
                          <Text
                            style={{
                              fontSize: 17,
                              fontWeight: 'bold',
                              fontFamily: 'Roboto',
                              color: 'black',
                            }}>
                            Nhân viên đóng gói:{' '}
                            {order?.packager === null
                              ? 'Chưa có'
                              : order?.packager.fullName}
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
                  ))
                )}
              </>
            ) : (
              <>
                {!orderGroupList ||
                  orderGroupList.filter(group => {
                    if (currentStatus.value === 'PROCESSING') {
                      return (
                        group.orderList.find(order => order.status === 0) !==
                        undefined
                      );
                    }
                    if (currentStatus.value === 'PACKAGING') {
                      return (
                        group.productConsolidationArea !== null &&
                        group.orderList.find(order => order.status === 1) !==
                        undefined
                      );
                    }
                    if (currentStatus.value === 'PACKAGED') {
                      return (
                        group.productConsolidationArea !== null &&
                        group.orderList.find(order => order.status === 2) !==
                        undefined
                      );
                    }
                    if (currentStatus.value === 'DELIVERING_SUCCESS') {
                      return (
                        group.productConsolidationArea !== null &&
                        group.orderList.find(
                          order => order.status === 3 || order.status === 4,
                        ) !== undefined
                      );
                    }
                  }).length === 0 ? (
                  <View
                    style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Image
                      style={{ width: '100%', height: '50%' }}
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
                      Không có nhóm nào
                    </Text>
                  </View>
                ) : (
                  <View style={{ marginTop: 10, marginBottom: 100 }}>
                    {
                      <FlatList
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        data={orderGroupList.filter(group => {
                          if (currentStatus.value === 'PROCESSING') {
                            return group.orderList.find(
                              order => order.status === 0,
                            );
                          }
                          if (currentStatus.value === 'PACKAGING') {
                            return (
                              group.productConsolidationArea !== null &&
                              group.orderList.find(
                                order => order.status === 1,
                              ) !== undefined
                            );
                          }
                          if (currentStatus.value === 'PACKAGED') {
                            return (
                              group.productConsolidationArea !== null &&
                              group.orderList.find(
                                order => order.status === 2,
                              ) !== undefined
                            );
                          }
                          if (currentStatus.value === 'DELIVERING_SUCCESS') {
                            return (
                              group.productConsolidationArea !== null &&
                              group.orderList.find(
                                order =>
                                  order.status === 3 || order.status === 4,
                              ) !== undefined
                            );
                          }
                        })}
                        renderItem={data => (
                          <View
                            key={data.item.id}
                            style={{
                              marginBottom: 20,
                            }}>
                            {/* Group detail */}
                            <View>
                              <View
                                style={{
                                  backgroundColor: COLORS.secondary,
                                  marginBottom: 5,
                                  alignItems: 'center',
                                  borderRadius: 5,
                                  flexDirection: 'row',
                                  columnGap: 15,
                                  shadowColor: '#000',
                                  shadowOffset: {
                                    width: 0,
                                    height: 2,
                                  },
                                  shadowOpacity: 0.25,
                                  shadowRadius: 4,
                                  elevation: 10,
                                  zIndex: 20,
                                }}>
                                <TouchableOpacity
                                  style={{
                                    height: '100%',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    padding: 5,
                                    borderColor: 'white',
                                    borderRadius: 1,
                                    borderRightWidth: 1,
                                    borderTopLeftRadius: 5,
                                    borderBottomLeftRadius: 5,
                                  }}
                                  onPress={() => {
                                    setOrderGroupList(
                                      orderGroupList.map(group => {
                                        if (group.id === data.item.id) {
                                          group.isExpand = !group.isExpand;
                                        }
                                        return group;
                                      }),
                                    );
                                  }}>
                                  <Image
                                    resizeMode="contain"
                                    style={{
                                      width: 25,
                                      height: 25,
                                      tintColor: 'white',
                                    }}
                                    source={
                                      data.item.isExpand
                                        ? icons.minus
                                        : icons.plus
                                    }
                                  />
                                </TouchableOpacity>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    flexGrow: 1,
                                    flexShrink: 1,
                                    justifyContent: 'center',
                                  }}>
                                  {data.item.isExpand ? (
                                    <Text
                                      style={{
                                        fontSize: 18,
                                        fontWeight: 'bold',
                                        fontFamily: 'Roboto',
                                        color: 'white',
                                      }}>
                                      {data.item.timeFrame.fromHour.slice(
                                        0,
                                        5,
                                      ) +
                                        '-' +
                                        data.item.timeFrame.toHour.slice(0, 5) +
                                        ' ' +
                                        format(
                                          Date.parse(data.item.deliverDate),
                                          'dd/MM/yyyy',
                                        )}
                                    </Text>
                                  ) : (
                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        gap: 8,
                                        paddingVertical: 10,
                                      }}>
                                      <Text
                                        style={{
                                          fontSize: 18,
                                          fontWeight: 'bold',
                                          fontFamily: 'Roboto',
                                          color: 'white',
                                        }}>
                                        Khung giờ:{' '}
                                        {data.item.timeFrame.fromHour.slice(
                                          0,
                                          5,
                                        ) +
                                          '-' +
                                          data.item.timeFrame.toHour.slice(
                                            0,
                                            5,
                                          )}
                                      </Text>
                                      <Text
                                        style={{
                                          fontSize: 18,
                                          fontWeight: 'bold',
                                          fontFamily: 'Roboto',
                                          color: 'white',
                                        }}>
                                        Ngày giao:{' '}
                                        {format(
                                          Date.parse(data.item.deliverDate),
                                          'dd/MM/yyyy',
                                        )}
                                      </Text>
                                      <Text
                                        style={{
                                          fontSize: 18,
                                          fontWeight: 'bold',
                                          fontFamily: 'Roboto',
                                          color: 'white',
                                        }}
                                        numberOfLines={2}>
                                        Điểm giao:
                                        {' ' + data.item.pickupPoint.address}
                                      </Text>
                                      {data.item.productConsolidationArea && (
                                        <Text
                                          style={{
                                            fontSize: 18,
                                            fontWeight: 'bold',
                                            fontFamily: 'Roboto',
                                            color: 'white',
                                          }}
                                          numberOfLines={2}>
                                          Điểm tập kết:
                                          {' ' +
                                            data.item.productConsolidationArea
                                              .address}
                                        </Text>
                                      )}
                                    </View>
                                  )}
                                </View>
                                <View
                                  style={{
                                    height: '100%',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                  }}>
                                  {currentStatus.value === 'PROCESSING' && (
                                    <TouchableOpacity
                                      style={{
                                        flexGrow: 1,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        borderColor: 'white',
                                        borderLeftWidth: 1,
                                        borderBottomWidth: 0.5,
                                        borderTopRightRadius: 5,
                                        padding: 5,
                                      }}
                                      onPress={() =>
                                        handleOpenEditModal(
                                          data.item.id,
                                          data.item.productConsolidationArea,
                                          data.item.pickupPoint.id,
                                        )
                                      }>
                                      <Image
                                        resizeMode="contain"
                                        style={{
                                          width: 30,
                                          height: 30,
                                          tintColor: 'white',
                                        }}
                                        source={icons.packaging}
                                      />
                                    </TouchableOpacity>
                                  )}
                                  {currentStatus.value === 'PACKAGING' && (
                                    <TouchableOpacity
                                      style={{
                                        flexGrow: 1,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        borderColor: 'white',
                                        borderLeftWidth: 1,
                                        // borderTopWidth: 0.5,
                                        borderBottomRightRadius: 5,
                                        padding: 5,
                                      }}
                                      onPress={() =>
                                        handlOpenEditStatusPackagedModal(
                                          data.item.id,
                                        )
                                      }>
                                      <Image
                                        resizeMode="contain"
                                        style={{
                                          width: 30,
                                          height: 30,
                                          tintColor: 'white',
                                        }}
                                        source={icons.packageIcon}
                                      />
                                    </TouchableOpacity>
                                  )}
                                </View>
                              </View>

                              {/* order list in group */}
                              {data.item.isExpand &&
                                data.item.orderList != null &&
                                data.item.orderList.length > 0 &&
                                data.item.orderList
                                  .filter(order => {
                                    if (currentStatus.value === 'PROCESSING') {
                                      return order.status === 0;
                                    }
                                    if (currentStatus.value === 'PACKAGING') {
                                      return order.status === 1;
                                    }
                                    if (currentStatus.value === 'PACKAGED') {
                                      return order.status === 2;
                                    }
                                    if (
                                      currentStatus.value ===
                                      'DELIVERING_SUCCESS'
                                    ) {
                                      return (
                                        order.status === 3 || order.status === 4
                                      );
                                    }
                                  })
                                  .map((order, index) => (
                                    <TouchableOpacity
                                      style={{
                                        paddingHorizontal: 0,
                                        paddingVertical: 10,
                                      }}
                                      onPress={() => {
                                        navigation.navigate('OrderDetail', {
                                          id: order.id,
                                          orderSuccess: false,
                                          isFromOrderGroup: true,
                                        });
                                      }}
                                      key={index}>
                                      <View
                                        style={{
                                          flexDirection: 'row',
                                          alignItems: 'center',
                                          justifyContent: 'space-between',
                                          backgroundColor: 'rgb(240,240,240)',
                                          marginHorizontal: 5,
                                          paddingHorizontal: 10,
                                          paddingVertical: 10,
                                          borderRadius: 10,
                                          shadowColor: '#000',
                                          shadowOffset: {
                                            width: 0,
                                            height: 2,
                                          },
                                          shadowOpacity: 0.25,
                                          shadowRadius: 4,
                                          elevation: 5,
                                        }}>
                                        <View
                                          style={{
                                            flexDirection: 'column',
                                            gap: 8,
                                          }}>
                                          <Text
                                            style={{
                                              fontSize: 20,
                                              fontWeight: 'bold',
                                              fontFamily: 'Roboto',
                                              color: COLORS.primary,
                                            }}>
                                            {order?.status === 0 &&
                                              'Chờ đóng gói'}
                                            {order?.status === 1 &&
                                              'Đang đóng gói'}
                                            {order?.status === 2 &&
                                              'Đã đóng gói'}
                                            {order?.status === 3 && 'Đang giao'}
                                            {order?.status === 4 &&
                                              'Giao thành công'}
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
                                              Date.parse(order?.createdTime),
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
                                              Date.parse(order?.deliveryDate),
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
                                            {order?.totalPrice?.toLocaleString(
                                              'vi-VN',
                                              {
                                                style: 'currency',
                                                currency: 'VND',
                                              },
                                            )}
                                          </Text>
                                          <Text
                                            style={{
                                              fontSize: 17,
                                              fontWeight: 'bold',
                                              fontFamily: 'Roboto',
                                              color: 'black',
                                            }}>
                                            Nhân viên đóng gói:{' '}
                                            {order?.packager === null
                                              ? 'Chưa có'
                                              : order?.packager.fullName}
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
                                  ))}
                            </View>
                            {/* *********************** */}
                          </View>
                        )}
                      // renderHiddenItem={(data, rowMap) => (
                      //   <View
                      //     style={{
                      //       flexDirection: 'row',
                      //       justifyContent: 'flex-end',
                      //       height: '89%',
                      //       // marginVertical: '2%',
                      //     }}>
                      //     <TouchableOpacity
                      //       style={{
                      //         width: 120,
                      //         height: '100%',
                      //         backgroundColor: COLORS.primary,
                      //         borderRadius: 10,
                      //         // flex: 1,
                      //         alignItems: 'center',
                      //         justifyContent: 'center',
                      //       }}
                      //       onPress={() => {
                      //         setVisible(true);
                      //         // console.log(data.item.id);
                      //         setOrder(data.item);
                      //       }}>
                      //       <View>
                      //         {data.item?.status === 0 && (
                      //           <Image
                      //             source={icons.packaging}
                      //             resizeMode="contain"
                      //             style={{
                      //               width: 40,
                      //               height: 40,
                      //               tintColor: 'white',
                      //             }}
                      //           />
                      //         )}
                      //         {data.item?.status === 1 && (
                      //           <Image
                      //             source={icons.packaged}
                      //             resizeMode="contain"
                      //             style={{
                      //               width: 55,
                      //               height: 55,
                      //               tintColor: 'white',
                      //             }}
                      //           />
                      //         )}
                      //       </View>
                      //     </TouchableOpacity>
                      //   </View>
                      // )}
                      />
                    }
                  </View>
                )}
              </>
            )}

            {/* Modal Sort */}
            <Modal
              animationType="fade"
              transparent={true}
              visible={sortModalVisible}>
              <View
                // onPress={handleCloseSortModal}
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
                    <TouchableOpacity onPress={handleCloseSortModal}>
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
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          // const newArray = selectSort.map(i => {
                          //   if (i.id === item.id) {
                          //     if (i.active === true) {
                          //       return {...i, active: false};
                          //     } else {
                          //       return {...i, active: true};
                          //     }
                          //   }
                          //   return {...i, active: false};
                          // });
                          // console.log(newArray);

                          setTempSelectedSortId(
                            tempSelectedSortId === item.id ? '' : item.id,
                          );
                        }}
                        style={
                          tempSelectedSortId === item.id
                            ? {
                              borderColor: COLORS.primary,
                              borderWidth: 1,
                              borderRadius: 10,
                              margin: 5,
                              width: '45%',
                            }
                            : {
                              borderColor: '#c8c8c8',
                              borderWidth: 0.2,
                              borderRadius: 10,
                              margin: 5,
                              width: '45%'
                            }
                        }>
                        <Text
                          style={
                            tempSelectedSortId === item.id
                              ? {
                                width: '100%',
                                paddingVertical: 10,
                                textAlign: 'center',
                                color: COLORS.primary,

                                fontSize: 12,
                              }
                              : {
                                width: '100%',
                                paddingVertical: 10,
                                textAlign: 'center',
                                color: 'black',

                                fontSize: 12,
                              }
                          }>
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 16,
                      fontWeight: 700,
                    }}>
                    Chọn khung giờ
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      marginVertical: 10,
                    }}>
                    {timeFrameList &&
                      timeFrameList.map(item => (
                        <TouchableOpacity
                          key={item.id}
                          onPress={() =>
                            item.id === tempSelectedTimeFrameId
                              ? setTempSelectedTimeFrameId('')
                              : setTempSelectedTimeFrameId(item.id)
                          }
                          style={
                            item.id === tempSelectedTimeFrameId
                              ? {
                                borderColor: COLORS.primary,
                                borderWidth: 1,
                                borderRadius: 10,
                                margin: 5,
                                width:'45%'
                              }
                              : {
                                borderColor: '#c8c8c8',
                                borderWidth: 0.2,
                                borderRadius: 10,
                                margin: 5,
                                width:'45%'
                              }
                          }>
                          <Text
                            style={
                              item.id === tempSelectedTimeFrameId
                                ? {
                                  width: '100%',
                                  paddingVertical: 10,
                                  textAlign: 'center',
                                  color: COLORS.primary,

                                  fontSize: 12,
                                }
                                : {
                                  width: '100%',
                                  paddingVertical: 10,
                                  textAlign: 'center',
                                  color: 'black',

                                  fontSize: 12,
                                }
                            }>
                            {item.fromHour.slice(0, 5)} đến{' '}
                            {item.toHour.slice(0, 5)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 16,
                        fontWeight: 700,
                      }}>
                      Chọn ngày giao hàng
                    </Text>
                    <Switch
                      trackColor={{ false: 'grey', true: COLORS.primary }}
                      thumbColor={isEnableDateFilter ? '#f4f3f4' : '#f4f3f4'}
                      // ios_backgroundColor="#3e3e3e"
                      onValueChange={value => {
                        toggleSwitchFilterDate(value);
                      }}
                      value={isEnableDateFilter}
                    />
                  </View>
                  {isEnableDateFilter ? (
                    <View
                      style={{
                        flexWrap: 'wrap',
                        marginVertical: 5,
                        alignItems:'center'
                      }}>
                      <DatePicker
                        date={
                          tempSelectedDate === ''
                            ? new Date()
                            : tempSelectedDate
                        }
                        mode="date"
                        androidVariant="nativeAndroid"
                        onDateChange={setTempSelectedDate}
                      />
                    </View>
                  ) : (
                    <></>
                  )}

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
                      onPress={handleClearSortModal}>
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
                      onPress={handleApplyFilter}>
                      <Text style={styles.textStyle}>Áp dụng</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            {/* Modal confirm packaged */}
            <Modal
              animationType="fade"
              transparent={true}
              visible={editStatusPackagedModalVisible}
              onRequestClose={handlCloseEditStatusPackagedModal}>
              <View style={styles.centeredView}>
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
                      Xác nhận đóng gói
                    </Text>
                    <TouchableOpacity
                      onPress={handlCloseEditStatusPackagedModal}>
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

                  <Text>
                    Xác nhận đã đóng hoàn thành đóng gói cho nhóm đơn này ?
                  </Text>

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
                      onPress={handlCloseEditStatusPackagedModal}>
                      <Text
                        style={{
                          color: COLORS.primary,
                          fontWeight: 'bold',
                          textAlign: 'center',
                        }}>
                        Trở về
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
                      onPress={handleSubmitEditStatusPackaged}>
                      <Text style={styles.textStyle}>Xác nhận</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            {/* Modal response dialog */}
            <Modal
              animationType="fade"
              transparent={true}
              visible={openResponseDialog}
              onRequestClose={() => {
                setOpenResponseDialog(false);
              }}>
              <View style={styles.centeredView}>
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
                      {messageResult}
                    </Text>
                    {/* <TouchableOpacity
                      onPress={() => {
                        setOpenResponseDialog(false);
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
                    </TouchableOpacity> */}
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      marginTop: '5%',
                    }}>
                    <TouchableOpacity
                      style={{
                        width: '100%',
                        paddingHorizontal: 15,
                        paddingVertical: 10,
                        backgroundColor: COLORS.primary,
                        color: 'white',
                        borderRadius: 10,
                      }}
                      onPress={() => {
                        setOpenResponseDialog(false);
                      }}>
                      <Text style={styles.textStyle}>Đóng</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            {/* Modal Confirm Packaging */}
            <Modal
              animationType="fade"
              transparent={true}
              visible={
                confirmPackagingModalVisible
                // ||
                // editConsolidationAreaModalVisible
              }
              onRequestClose={handleCloseEditModal}>
              <View style={styles.centeredView}>
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
                      {isConfirmPackagingHaveArea
                        ? 'Xác nhận đang đóng gói'
                        : 'Chọn điểm tập kết'}
                    </Text>
                    <TouchableOpacity onPress={handleCloseEditModal}>
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
                  {!isConfirmPackagingHaveArea ? (
                    <>
                      <FlatList
                        style={{ maxHeight: 200 }}
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
                                style={{ width: 20, height: 20 }}
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
                          flexDirection: 'column',
                          justifyContent: 'center',
                          marginTop: '5%',
                          rowGap: 5,
                        }}>
                        <Text style={{ color: COLORS.red, fontSize: 11 }}>
                          * Điểm tập kết đã chọn sẽ không thể thay đổi sau khi
                          xác nhận
                        </Text>
                        <TouchableOpacity
                          style={{
                            width: '100%',
                            paddingHorizontal: 15,
                            paddingVertical: 10,
                            backgroundColor:
                              selectedConsolidationAreaId === ''
                                ? COLORS.light_green
                                : COLORS.primary,
                            color: 'white',
                            borderRadius: 10,
                          }}
                          disabled={selectedConsolidationAreaId === ''}
                          onPress={
                            // confirmPackagingModalVisible
                            //   ?
                            handleSubmitConfirmPackagingModal
                            // : handleEditAreaModal
                          }>
                          <Text style={styles.textStyle}>Xác nhận</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  ) : (
                    <>
                      <Text>
                        Nhóm đơn này đã có điểm tập kết là{' '}
                        <Text style={{ fontWeight: 'bold' }}>
                          {
                            consolidationAreaList?.find(
                              area => area.id === selectedConsolidationAreaId,
                            )?.address
                          }
                          .
                        </Text>{' '}
                        Xác nhận đang đóng gói cho nhóm đơn này ?
                      </Text>
                      <View
                        style={{
                          flexDirection: 'column',
                          justifyContent: 'center',
                          marginTop: '5%',
                          rowGap: 5,
                        }}>
                        <TouchableOpacity
                          style={{
                            width: '100%',
                            paddingHorizontal: 15,
                            paddingVertical: 10,
                            backgroundColor:
                              selectedConsolidationAreaId === ''
                                ? COLORS.light_green
                                : COLORS.primary,
                            color: 'white',
                            borderRadius: 10,
                          }}
                          disabled={selectedConsolidationAreaId === ''}
                          onPress={
                            // confirmPackagingModalVisible
                            //   ?
                            handleSubmitConfirmPackagingModal
                            // : handleEditAreaModal
                          }>
                          <Text style={styles.textStyle}>Xác nhận</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </View>
              </View>
            </Modal>
          </View>
        </View>
      </TouchableWithoutFeedback>
      {loading && <LoadingScreen />}
    </>
  );
};

export default OrderGroupForOrderStaff;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
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
    flexWrap: 'wrap', // This property makes items wrap inside the container
    justifyContent: 'flex-start', // Adjust as per your requirements
    alignItems: 'flex-start', // A
  },
  body: {
    flex: 11,
    // backgroundColor: 'pink',
    paddingHorizontal: 15,
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
