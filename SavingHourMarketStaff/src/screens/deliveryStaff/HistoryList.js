/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
  FlatList,
  Dimensions,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import { Image } from 'react-native-animatable';
import { icons } from '../../constants';
import { COLORS, FONTS } from '../../constants/theme';
import { API } from '../../constants/api';
import { format } from 'date-fns';
import Empty from '../../assets/image/search-empty.png';
import LoadingScreen from '../../components/LoadingScreen';
import { useFocusEffect } from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';
import database from '@react-native-firebase/database';
import { checkSystemState } from '../../common/utils';

const HistoryList = ({ navigation }) => {
  // listen to system state
  useFocusEffect(
    useCallback(() => {
      checkSystemState(navigation);
    }, []),
  );

  const [initializing, setInitializing] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderGroupList, setOrderGroupList] = useState([
    {
      id: 'accf19db-5541-11ee-8a50-a85e45c41922',
      isExpand: true,
      deliverDate: '2023-09-19',
      timeFrame: {
        id: 'accf0876-5541-11ee-8a50-a85e45c41921',
        fromHour: '19:00:00',
        toHour: '20:30:00',
        status: 1,
        allowableDeliverMethod: 0,
      },
      pickupPoint: {
        id: 'accf105d-5541-11ee-8a50-a85e45c41921',
        address: '77C Trần Ngọc Diện, Thảo Điền, Thủ Đức, Hồ Chí Minh',
        status: 1,
        longitude: 106.73845902300008,
        latitude: 10.80274197700004,
      },
      deliverer: null,
      orderList: [
        {
          id: 'ec5de351-56dc-11ee-8a50-a85e45c41921',
          shippingFee: 0,
          totalPrice: 216000,
          receiverPhone: null,
          receiverName: null,
          longitude: null,
          latitude: null,
          totalDiscountPrice: 0,
          createdTime: '2023-11-18T08:00:00',
          deliveryDate: '2023-11-17',
          qrCodeUrl: 'qr code url here',
          status: 1,
          paymentMethod: 1,
          deliveryMethod: 0,
          addressDeliver: null,
          paymentStatus: 1,
          packager: {
            id: 'accf4d19-5541-11ee-8a50-a85e45c41921',
            fullName: 'Hong Quang',
            email: 'quangphse161539@fpt.edu.vn',
            avatarUrl:
              'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fdefault-avatar.jpg?alt=media',
            role: 'STAFF_ORD',
            status: 1,
            pickupPoint: [
              {
                id: 'accf0ac0-5541-11ee-8a50-a85e45c41921',
                address:
                  'Hẻm 662 Nguyễn Xiển, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh',
                status: 1,
                longitude: 106.83102962168277,
                latitude: 10.845020092805793,
              },
              {
                id: 'accf0d06-5541-11ee-8a50-a85e45c41921',
                address:
                  '432 Đ. Liên Phường, Phước Long B, Quận 9, Hồ Chí Minh',
                status: 1,
                longitude: 106.7891284,
                latitude: 10.8059505,
              },
            ],
          },
          deliverer: null,
          customer: {
            id: 'accef2db-5541-11ee-8a50-a85e45c41923',
            fullName: 'Luu Gia Vinh',
            email: 'luugiavinh0@gmail.com',
            phone: '0902828618',
            dateOfBirth: '2002-05-05',
            avatarUrl:
              'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fdefault-avatar.jpg?alt=media',
            address:
              '240 Phạm Văn Đồng, Hiệp Bình Chánh, Thủ Đức, Thành phố Hồ Chí Minh',
            gender: 0,
            status: 1,
          },
          timeFrame: null,
          pickupPoint: null,
          discountList: [],
          transaction: [],
          productConsolidationArea: null,
        },
      ],
      productConsolidationArea: null,
    },
    {
      id: 'accf19db-5541-11ee-8a50-a85e45c41925',
      isExpand: true,
      deliverDate: '2023-09-19',
      timeFrame: {
        id: 'accf0876-5541-11ee-8a50-a85e45c41921',
        fromHour: '19:00:00',
        toHour: '20:30:00',
        status: 1,
        allowableDeliverMethod: 0,
      },
      pickupPoint: {
        id: 'accf105d-5541-11ee-8a50-a85e45c41921',
        address: '77C Trần Ngọc Diện, Thảo Điền, Thủ Đức, Hồ Chí Minh',
        status: 1,
        longitude: 106.73845902300008,
        latitude: 10.80274197700004,
      },
      deliverer: null,
      orderList: [
        {
          id: 'ec5de351-56dc-11ee-8a50-a85e45c41921',
          shippingFee: 0,
          totalPrice: 216000,
          receiverPhone: null,
          receiverName: null,
          longitude: null,
          latitude: null,
          totalDiscountPrice: 0,
          createdTime: '2023-11-18T08:00:00',
          deliveryDate: '2023-11-17',
          qrCodeUrl: 'qr code url here',
          status: 1,
          paymentMethod: 1,
          deliveryMethod: 0,
          addressDeliver: null,
          paymentStatus: 1,
          packager: {
            id: 'accf4d19-5541-11ee-8a50-a85e45c41921',
            fullName: 'Hong Quang',
            email: 'quangphse161539@fpt.edu.vn',
            avatarUrl:
              'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fdefault-avatar.jpg?alt=media',
            role: 'STAFF_ORD',
            status: 1,
            pickupPoint: [
              {
                id: 'accf0ac0-5541-11ee-8a50-a85e45c41921',
                address:
                  'Hẻm 662 Nguyễn Xiển, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh',
                status: 1,
                longitude: 106.83102962168277,
                latitude: 10.845020092805793,
              },
              {
                id: 'accf0d06-5541-11ee-8a50-a85e45c41921',
                address:
                  '432 Đ. Liên Phường, Phước Long B, Quận 9, Hồ Chí Minh',
                status: 1,
                longitude: 106.7891284,
                latitude: 10.8059505,
              },
            ],
          },
          deliverer: null,
          customer: {
            id: 'accef2db-5541-11ee-8a50-a85e45c41921',
            fullName: 'Luu Gia Vinh',
            email: 'luugiavinh0@gmail.com',
            phone: '0902828618',
            dateOfBirth: '2002-05-05',
            avatarUrl:
              'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fdefault-avatar.jpg?alt=media',
            address:
              '240 Phạm Văn Đồng, Hiệp Bình Chánh, Thủ Đức, Thành phố Hồ Chí Minh',
            gender: 0,
            status: 1,
          },
          timeFrame: null,
          pickupPoint: null,
          discountList: [],
          transaction: [],
          productConsolidationArea: null,
        },
      ],
      productConsolidationArea: {
        id: 'ec5dfde4-56dc-11ee-8a50-a85e45c41921',
        address: '9 Nam Hòa, Phước Long A, Thủ Đức, Hồ Chí Minh',
        status: 1,
        longitude: 106.76009552300007,
        latitude: 10.821593957000061,
        pickupPointList: [
          {
            id: 'accf0e1e-5541-11ee-8a50-a85e45c41921',
            address: '857 Phạm Văn Đồng, Linh Tây, Thủ Đức, Hồ Chí Minh',
            status: 1,
            longitude: 106.75072682500007,
            latitude: 10.85273099400007,
          },
          {
            id: 'accf105d-5541-11ee-8a50-a85e45c41921',
            address: '77C Trần Ngọc Diện, Thảo Điền, Thủ Đức, Hồ Chí Minh',
            status: 1,
            longitude: 106.73845902300008,
            latitude: 10.80274197700004,
          },
        ],
      },
    },
    {
      id: 'accf19db-5541-11ee-8a50-a85e45c41921',
      isExpand: true,
      deliverDate: '2023-09-19',
      timeFrame: {
        id: 'accf0876-5541-11ee-8a50-a85e45c41921',
        fromHour: '19:00:00',
        toHour: '20:30:00',
        status: 1,
        allowableDeliverMethod: 0,
      },
      pickupPoint: {
        id: 'accf105d-5541-11ee-8a50-a85e45c41921',
        address: '77C Trần Ngọc Diện, Thảo Điền, Thủ Đức, Hồ Chí Minh',
        status: 1,
        longitude: 106.73845902300008,
        latitude: 10.80274197700004,
      },
      deliverer: null,
      orderList: [
        {
          id: 'ec5de351-56dc-11ee-8a50-a85e45c41921',
          shippingFee: 0,
          totalPrice: 216000,
          receiverPhone: null,
          receiverName: null,
          longitude: null,
          latitude: null,
          totalDiscountPrice: 0,
          createdTime: '2023-11-18T08:00:00',
          deliveryDate: '2023-11-17',
          qrCodeUrl: 'qr code url here',
          status: 1,
          paymentMethod: 1,
          deliveryMethod: 0,
          addressDeliver: null,
          paymentStatus: 1,
          packager: {
            id: 'accf4d19-5541-11ee-8a50-a85e45c41921',
            fullName: 'Hong Quang',
            email: 'quangphse161539@fpt.edu.vn',
            avatarUrl:
              'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fdefault-avatar.jpg?alt=media',
            role: 'STAFF_ORD',
            status: 1,
            pickupPoint: [
              {
                id: 'accf0ac0-5541-11ee-8a50-a85e45c41921',
                address:
                  'Hẻm 662 Nguyễn Xiển, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh',
                status: 1,
                longitude: 106.83102962168277,
                latitude: 10.845020092805793,
              },
              {
                id: 'accf0d06-5541-11ee-8a50-a85e45c41921',
                address:
                  '432 Đ. Liên Phường, Phước Long B, Quận 9, Hồ Chí Minh',
                status: 1,
                longitude: 106.7891284,
                latitude: 10.8059505,
              },
            ],
          },
          deliverer: null,
          customer: {
            id: 'accef2db-5541-11ee-8a50-a85e45c41921',
            fullName: 'Luu Gia Vinh',
            email: 'luugiavinh0@gmail.com',
            phone: '0902828618',
            dateOfBirth: '2002-05-05',
            avatarUrl:
              'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fdefault-avatar.jpg?alt=media',
            address:
              '240 Phạm Văn Đồng, Hiệp Bình Chánh, Thủ Đức, Thành phố Hồ Chí Minh',
            gender: 0,
            status: 1,
          },
          timeFrame: null,
          pickupPoint: null,
          discountList: [],
          transaction: [],
          productConsolidationArea: null,
        },
        {
          id: 'ec5de351-56dc-11ee-8a50-a85e45c41921',
          shippingFee: 0,
          totalPrice: 216000,
          receiverPhone: null,
          receiverName: null,
          longitude: null,
          latitude: null,
          totalDiscountPrice: 0,
          createdTime: '2023-11-18T08:00:00',
          deliveryDate: '2023-11-17',
          qrCodeUrl: 'qr code url here',
          status: 1,
          paymentMethod: 1,
          deliveryMethod: 0,
          addressDeliver: null,
          paymentStatus: 1,
          packager: {
            id: 'accf4d19-5541-11ee-8a50-a85e45c41921',
            fullName: 'Hong Quang',
            email: 'quangphse161539@fpt.edu.vn',
            avatarUrl:
              'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fdefault-avatar.jpg?alt=media',
            role: 'STAFF_ORD',
            status: 1,
            pickupPoint: [
              {
                id: 'accf0ac0-5541-11ee-8a50-a85e45c41921',
                address:
                  'Hẻm 662 Nguyễn Xiển, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh',
                status: 1,
                longitude: 106.83102962168277,
                latitude: 10.845020092805793,
              },
              {
                id: 'accf0d06-5541-11ee-8a50-a85e45c41921',
                address:
                  '432 Đ. Liên Phường, Phước Long B, Quận 9, Hồ Chí Minh',
                status: 1,
                longitude: 106.7891284,
                latitude: 10.8059505,
              },
            ],
          },
          deliverer: null,
          customer: {
            id: 'accef2db-5541-11ee-8a50-a85e45c41921',
            fullName: 'Luu Gia Vinh',
            email: 'luugiavinh0@gmail.com',
            phone: '0902828618',
            dateOfBirth: '2002-05-05',
            avatarUrl:
              'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fdefault-avatar.jpg?alt=media',
            address:
              '240 Phạm Văn Đồng, Hiệp Bình Chánh, Thủ Đức, Thành phố Hồ Chí Minh',
            gender: 0,
            status: 1,
          },
          timeFrame: null,
          pickupPoint: null,
          discountList: [],
          transaction: [],
          productConsolidationArea: null,
        },
      ],
      productConsolidationArea: {
        id: 'ec5dfde4-56dc-11ee-8a50-a85e45c41921',
        address: '9 Nam Hòa, Phước Long A, Thủ Đức, Hồ Chí Minh',
        status: 1,
        longitude: 106.76009552300007,
        latitude: 10.821593957000061,
        pickupPointList: [
          {
            id: 'accf0e1e-5541-11ee-8a50-a85e45c41921',
            address: '857 Phạm Văn Đồng, Linh Tây, Thủ Đức, Hồ Chí Minh',
            status: 1,
            longitude: 106.75072682500007,
            latitude: 10.85273099400007,
          },
          {
            id: 'accf105d-5541-11ee-8a50-a85e45c41921',
            address: '77C Trần Ngọc Diện, Thảo Điền, Thủ Đức, Hồ Chí Minh',
            status: 1,
            longitude: 106.73845902300008,
            latitude: 10.80274197700004,
          },
        ],
      },
    },
  ]);
  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const orderStatus = [
    { id: 0, display: 'Giao thành công', value: 'SUCCESS', active: true },
    { id: 1, display: 'Giao thất bại', value: 'FAIL', active: false },
  ];

  const deliveryOptions = [
    { id: 0, display: 'Điểm nhận hàng' },
    { id: 1, display: 'Giao tận nhà' },
    { id: 2, display: 'Đơn hàng lẻ' },
  ];

  const [currentOptions, setCurrentOptions] = useState({
    id: 0,
    display: 'Điểm nhận hàng',
  });

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

  const [selectItem, setSelectItem] = useState(orderStatus);
  const [selectSort, setSelectSort] = useState(sortOptions);
  //  filter pickup point
  const [selectedTimeFrameId, setSelectedTimeFrameId] = useState('');
  const [timeFrameList, setTimeFrameList] = useState([]);
  //  filter date
  const [selectedDate, setSelectedDate] = useState(null);

  const getUser = async () => {
    const currentUser = await AsyncStorage.getItem('userInfo');
    return currentUser ? JSON.parse(currentUser) : null;
  };
  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const userFromAS = await getUser();
          setUser(userFromAS);
        } catch (err) {
          console.log(err);
        }
      })();
      const fetchTimeFrame = async () => {
        if (auth().currentUser) {
          const tokenId = await auth().currentUser.getIdToken();
          if (tokenId) {
            setLoading(true);
            fetch(`${API.baseURL}/api/timeframe/getAllForStaff`, {
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
              .then(response => {
                setTimeFrameList(response);
                setLoading(false);
              })
              .catch(err => {
                console.log(err);
                setLoading(false);
              });
          }
        }
      }
      setSelectSort(sortOptions);
      setSelectItem(orderStatus);
      setSelectedDate(null);
      setSelectedTimeFrameId('');
      fetchOrders(currentOptions.id);
      fetchTimeFrame();
    }, []),
  );

  // const onAuthStateChange = async userInfo => {
  //     setLoading(true);
  //     if (initializing) {
  //         setInitializing(false);
  //     }
  //     if (userInfo) {
  //         // check if user sessions is still available. If yes => redirect to another screen
  //         const userTokenId = await userInfo
  //             .getIdToken(true)
  //             .then(token => token)
  //             .catch(async e => {
  //                 // console.log(e);
  //                 setLoading(false);
  //                 return null;
  //             });
  //         if (!userTokenId) {
  //             // sessions end. (revoke refresh token like password change, disable account, ....)
  //             await AsyncStorage.removeItem('userInfo');
  //             setLoading(false);
  //             // navigation.navigate('Login');
  //             navigation.reset({
  //                 index: 0,
  //                 routes: [{name: 'Login'}],
  //               });
  //             return;
  //         }
  //         setLoading(false);
  //     } else {
  //         // no sessions found.
  //         console.log('user is not logged in');
  //         await AsyncStorage.removeItem('userInfo');
  //         setLoading(false);
  //         // navigation.navigate('Login');
  //         navigation.reset({
  //             index: 0,
  //             routes: [{name: 'Login'}],
  //           });
  //     }
  // };

  // useEffect(() => {
  //     fetchOrders(currentOptions.id);
  //     const subscriber = auth().onAuthStateChanged(
  //         async userInfo => await onAuthStateChange(userInfo),
  //     );

  //     return subscriber;
  // }, []);

  const fetchOrders = async id => {
    const tokenId = await auth().currentUser.getIdToken();
    const userFromAS = await getUser();
    const filterStatus = selectItem.find(item => item.active === true);
    const sortItem = selectSort.find(item => item.active === true);
    const isHadSortItem = sortItem ? true : false;
    console.log('fs', filterStatus);
    console.log('sort', sortItem);
    // console.log(userFromAS.id);
    let currentDate = format(new Date(), 'yyyy-MM-dd');
    const deliverDate = selectedDate
      ? format(selectedDate, 'yyyy-MM-dd')
      : currentDate;
    if (tokenId) {
      setLoading(true);
      if (id === 0) {
        fetch(
          `${API.baseURL}/api/order/staff/getOrderGroup?delivererId=${userFromAS?.id
          }${selectedDate === null ? '' : `&deliverDate=${deliverDate}`
          }&status=${filterStatus?.value}&getOldOrderGroup=TRUE${sortItem?.id == 1 && isHadSortItem === true
            ? '&deliverDateSortType=ASC'
            : ''
          }${sortItem?.id == 2 && isHadSortItem === true
            ? '&deliverDateSortType=DESC'
            : ''
          }${selectedTimeFrameId ? `&timeFrameId=${selectedTimeFrameId}` : ''}`,
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
            console.log('1', respond);
            if (respond.error) {
              return;
            }

            setOrderGroupList(respond.orderGroups);
            setLoading(false);
          })
          .catch(err => {
            console.log(err);
          });
      } else if (id === 1) {
        fetch(
          `${API.baseURL}/api/order/staff/getOrderBatch?delivererId=${userFromAS?.id
          }${selectedDate === null ? '' : `&deliveryDate=${deliverDate}`
          }&status=${filterStatus?.value}&getOldOrderBatch=TRUE${sortItem?.id == 1 && isHadSortItem === true
            ? '&deliverDateSortType=ASC'
            : ''
          }${sortItem?.id == 2 && isHadSortItem === true
            ? '&deliverDateSortType=DESC'
            : ''
          }${selectedTimeFrameId ? `&timeFrameId=${selectedTimeFrameId}` : ''}`,
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
            console.log('1');
            console.log(respond);
            if (respond.error) {
              return;
            }

            setOrderGroupList(respond);
            setLoading(false);
          })
          .catch(err => {
            console.log(err);
            setLoading(false);
          });
      } else if (id === 2) {
        fetch(
          `${API.baseURL
          }/api/order/staff/getOrders?isGrouped=false&isBatched=false&getOldOrder=true&delivererId=${userFromAS?.id
          }&orderStatus=${filterStatus?.value}${selectedDate === null ? '' : `&deliveryDate=${deliverDate}`
          }${sortItem?.id == 1 && isHadSortItem === true
            ? '&deliveryDateSortType=ASC'
            : ''
          }${sortItem?.id == 2 && isHadSortItem === true
            ? '&deliveryDateSortType=DESC'
            : ''
          }${selectedTimeFrameId ? `&timeFrameId=${selectedTimeFrameId}` : ''}`,
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
            console.log('2');
            console.log(respond);
            setOrders(respond);
            setLoading(false);
          })
          .catch(err => {
            console.log(err);
            setLoading(false);
          });
      }
    }
  };

  const handleApplyFilter = async () => {
    setModalVisible(!modalVisible);
    fetchOrders(currentOptions.id);
  };

  const handleClear = async () => {
    setModalVisible(!modalVisible);
    setSelectSort(sortOptions);
    setSelectItem(orderStatus);
    setSelectedTimeFrameId('');
    setSelectedDate(null);
    console.log('clear filter');
    const tokenId = await auth().currentUser.getIdToken();
    const userFromAS = await getUser();
    const filterStatus = selectItem.find(item => item.active === true);
    console.log('fs', filterStatus);
    if (tokenId) {
      setLoading(true);
      if (currentOptions.id === 0) {
        fetch(
          `${API.baseURL}/api/order/staff/getOrderGroup?delivererId=${userFromAS?.id}&status=SUCCESS&getOldOrderGroup=TRUE`,
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
            console.log('1', respond);
            if (respond.error) {
              return;
            }

            setOrderGroupList(respond.orderGroups);
            setLoading(false);
          })
          .catch(err => {
            console.log(err);
          });
      } else if (currentOptions.id === 1) {
        fetch(
          `${API.baseURL}/api/order/staff/getOrderBatch?delivererId=${userFromAS?.id}&status=SUCCESS&getOldOrderBatch=TRUE`,
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
            console.log('1');
            console.log(respond);
            if (respond.error) {
              return;
            }

            setOrderGroupList(respond);
            setLoading(false);
          })
          .catch(err => {
            console.log(err);
            setLoading(false);
          });
      } else if (currentOptions.id === 2) {
        fetch(
          `${API.baseURL}/api/order/staff/getOrders?isGrouped=false&isBatched=false&getOldOrder=true&delivererId=${userFromAS?.id}&orderStatus=SUCCESS`,
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
            console.log('2');
            console.log(respond);
            setOrders(respond);
            setLoading(false);
          })
          .catch(err => {
            console.log(err);
            setLoading(false);
          });
      }
    }
  };
  const OrderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('OrderDetails', {
            id: item.id,
            picked: currentOptions.id,
          });
        }}
        style={{
          position: 'relative',
          margin: 10,
          backgroundColor: 'white',
          borderRadius: 10,
          padding: 20,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
        }}>
        <Text
          style={
            item?.status === 4
              ? {
                position: 'absolute',
                top: '10%',
                right: '5%',
                backgroundColor: COLORS.light_green,
                color: COLORS.primary,
                padding: 10,
                borderRadius: 10,
              }
              : {
                position: 'absolute',
                top: '10%',
                right: '5%',
                backgroundColor: '#FBD9D3',
                color: COLORS.red,
                padding: 10,
                borderRadius: 10,
              }
          }>
          {item?.status === 3 && 'Đang giao '}
          {item?.status === 4 && 'Giao thành công'}
          {item?.status === 5 && 'Giao thất bại'}
        </Text>
        <Text
          style={{
            fontSize: Dimensions.get('window').width * 0.04,
            fontFamily: FONTS.fontFamily,
            color: 'black',
            fontWeight: 'bold',
            paddingBottom: 5,
            maxWidth: '80%',
          }}>
          {item?.code}
        </Text>

        <Text
          style={{
            fontSize: Dimensions.get('window').width * 0.045,
            fontFamily: FONTS.fontFamily,
            color: 'black',
            paddingBottom: 5,
          }}>
          Tên: {item?.customer.fullName}
        </Text>

        <Text
          style={{
            fontSize: 16,
            fontFamily: FONTS.fontFamily,
            color: 'black',
            paddingBottom: 5,
          }}>
          SĐT: {item?.customer.phone}
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontFamily: FONTS.fontFamily,
            color: 'black',
            paddingBottom: 5,
          }}>
          Thời gian:{' '}
          {item?.timeFrame
            ? `${item?.timeFrame?.fromHour.slice(
              0,
              5,
            )} đến ${item?.timeFrame?.toHour.slice(0, 5)}`
            : ''}
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontFamily: FONTS.fontFamily,
            color: 'black',
            paddingBottom: 5,
          }}>
          Ngày giao: {format(new Date(item?.deliveryDate), 'dd/MM/yyyy')}
        </Text>

        <Text
          style={{
            fontSize: 16,
            fontFamily: FONTS.fontFamily,
            color: 'black',
            paddingBottom: 5,
          }}>
          Địa chỉ:{' '}
          {item?.addressDeliver ? item?.addressDeliver : 'Pickup point Quận 9'}
        </Text>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 10,
          }}>
          <View
            style={{ flex: 1, height: 1.5, backgroundColor: COLORS.primary }}
          />
          <View>
            <Text
              style={{
                width: 100,
                textAlign: 'center',
                color: COLORS.primary,
                fontWeight: 'bold',
                fontSize: 16,
                fontFamily: FONTS.fontFamily,
              }}>
              {item.paymentMethod === 0 ? 'COD' : 'VN Pay'}
            </Text>
          </View>
          <View
            style={{ flex: 1, height: 1.5, backgroundColor: COLORS.primary }}
          />
        </View>

        <Text>
          <View style={{ flexDirection: 'row' }}>
            <Text
              style={{
                fontSize: 18,
                lineHeight: 30,
                color: COLORS.secondary,
                fontWeight: 700,
                fontFamily: FONTS.fontFamily,
                paddingRight: 5,
              }}>
              Tổng giá tiền:
            </Text>

            <Text
              style={{
                maxWidth: '70%',
                fontSize: 18,
                lineHeight: 30,
                color: COLORS.secondary,
                fontWeight: 700,
                fontFamily: FONTS.fontFamily,
              }}>
              {item.totalPrice.toLocaleString('vi-VN', {
                currency: 'VND',
              })}
            </Text>
            <Text
              style={{
                fontSize: 12,
                lineHeight: 18,
                color: COLORS.secondary,
                fontWeight: 700,
                fontFamily: FONTS.fontFamily,
              }}>
              ₫
            </Text>
          </View>
        </Text>
      </TouchableOpacity>
    );
  };

  const ModalItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          const newArray = selectItem.map(i => {
            if (i.id === item.id) {
              return { ...i, active: true };
            } else {
              return { ...i, active: false };
            }
          });
          setSelectItem(newArray);
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
                width: Dimensions.get('window').width * 0.32,
                paddingHorizontal: '5%',
                paddingVertical: 10,
                textAlign: 'center',
                color: COLORS.primary,
                fontFamily: FONTS.fontFamily,
                fontSize: Dimensions.get('window').width * 0.03,
              }
              : {
                width: Dimensions.get('window').width * 0.32,
                paddingHorizontal: '5%',
                paddingVertical: 10,
                textAlign: 'center',
                color: 'black',
                fontFamily: FONTS.fontFamily,
                fontSize: Dimensions.get('window').width * 0.03,
              }
          }>
          {item.display}
        </Text>
      </TouchableOpacity>
    );
  };

  const ModalSortItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          const newArray = selectSort.map(i => {
            if (i.id === item.id) {
              if (i.active === true) {
                return { ...i, active: false };
              } else {
                return { ...i, active: true };
              }
            }
            return { ...i, active: false };
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

  const TimeFrameItem = ({ item }) => {
    return (
      <TouchableOpacity
        key={item.id}
        onPress={() =>
          item.id === selectedTimeFrameId
            ? setSelectedTimeFrameId('')
            : setSelectedTimeFrameId(item.id)
        }
        style={
          item.id === selectedTimeFrameId
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
              width: '45%',
            }
        }>
        <Text
          style={
            item.id === selectedTimeFrameId
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
          {item.fromHour.slice(0, 5)} đến {item.toHour.slice(0, 5)}
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.areaAndLogout}>
              <View style={styles.area}>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: FONTS.fontFamily,
                    color: COLORS.primary,
                    fontWeight: 'bold',
                  }}>
                  Lịch sử đơn đã giao
                </Text>
              </View>
              <View style={styles.logout}>
                <TouchableOpacity
                  onPress={() => {
                    setOpen(!open);
                  }}>
                  <Image
                    resizeMode="contain"
                    style={{ width: 38, height: 38 }}
                    source={
                      user?.avatarUrl
                        ? { uri: user?.avatarUrl }
                        : icons.userCircle
                    }
                  />
                </TouchableOpacity>
                {open && (
                  <TouchableOpacity
                    style={{
                      position: 'absolute',
                      bottom: -40,
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
                    <Text style={{ color: 'red', fontWeight: 'bold' }}>
                      Đăng xuất
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View style={{ flexDirection: 'row' }}>
              {/*  */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {deliveryOptions.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setCurrentOptions(item);
                      fetchOrders(item.id);
                    }}>
                    <View
                      style={[
                        {
                          paddingHorizontal: '1.5%',
                          paddingVertical: '2%'
                        },
                        currentOptions.display === item.display && {
                          borderBottomColor: COLORS.primary,
                          borderBottomWidth: 2,
                        },
                      ]}>
                      <Text
                        style={{
                          fontFamily: 'Roboto',
                          fontSize: Dimensions.get('window').width * 0.045,
                          color:
                            currentOptions.display === item.display
                              ? COLORS.primary
                              : 'black',
                          fontWeight:
                            currentOptions.display === item.display
                              ? 'bold'
                              : 400,
                        }}>
                        {item.display}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              {/* Filter */}
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(true);
                }}>
                <Image
                  resizeMode="contain"
                  style={{
                    tintColor: COLORS.primary,
                    marginLeft: '1%',
                    height: Dimensions.get('window').width * 0.08,
                    width: Dimensions.get('window').width * 0.08,
                    paddingHorizontal: '1%',
                    paddingVertical: '2%'
                  }}
                  source={icons.filter}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.body}>
            <Text
              style={{
                fontFamily: FONTS.fontFamily,
                color: 'grey',
                fontWeight: 'bold',
                fontSize: Dimensions.get('window').width * 0.048,
                marginLeft: 10,
                paddingBottom: 20,
              }}>
              Số lượng đã giao:{' '}
              {currentOptions.id === 0 || currentOptions.id === 1
                ? orderGroupList.length + ' nhóm đơn'
                : orders.length + ' đơn'}
            </Text>
            <Text
              style={{
                fontFamily: FONTS.fontFamily,
                color: 'black',
                fontSize: Dimensions.get('window').width * 0.05,
                marginLeft: 10,
                paddingBottom: 20,
              }}>
              Danh sách các đơn hàng đã giao
            </Text>
            {currentOptions.id === 0 || currentOptions.id === 1 ? (
              <>
                {/* Grouping & Batching Order  */}
                {orderGroupList.length === 0 ? (
                  <View
                    style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Image
                      style={{ width: '100%', height: '50%' }}
                      resizeMode="contain"
                      source={Empty}
                    />
                    <Text
                      style={{
                        fontSize: Dimensions.get('window').width * 0.05,
                        fontFamily: 'Roboto',
                        fontWeight: 'bold',
                      }}>
                      Không có đơn hàng nào
                    </Text>
                    <Text
                      style={{
                        fontSize: Dimensions.get('window').width * 0.05,
                        fontFamily: 'Roboto',
                        fontWeight: 'bold',
                      }}>
                      Hãy chọn lại ngày/giờ giao
                    </Text>
                  </View>
                ) : (
                  <>
                    <View
                      style={{
                        marginTop: 10,
                        marginBottom: 150,
                        paddingHorizontal: 15,
                      }}>
                      <FlatList
                        data={orderGroupList.filter(group => {
                          if (
                            currentOptions.id === 0 ||
                            currentOptions.id === 1
                          ) {
                            return (
                              group.orderList.find(
                                order =>
                                  order.status === 4 || order.status === 5,
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
                              <TouchableOpacity
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
                                <View
                                  style={{
                                    backgroundColor: COLORS.secondary,
                                    marginBottom: 5,
                                    alignItems: 'center',
                                    borderRadius: 5,
                                    padding: 10,
                                    flexDirection: 'row',
                                  }}>
                                  <Image
                                    resizeMode="contain"
                                    style={{
                                      width: Dimensions.get('window').width * 0.1,
                                      height: 20,
                                      tintColor: 'white',
                                    }}
                                    source={
                                      data.item.isExpand
                                        ? icons.plus
                                        : icons.minus
                                    }
                                  />

                                  <View
                                    style={{
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      paddingHorizontal: data.item.isExpand ? 0 : 5,
                                      flexGrow: 1,
                                      flexShrink: 1,
                                      justifyContent: data.item.isExpand ? 'center' : 'flex-start'
                                    }}>
                                    {data.item.isExpand ? (
                                      <Text
                                        style={{
                                          fontSize: Dimensions.get('window').width * 0.048,
                                          fontWeight: 'bold',
                                          fontFamily: 'Roboto',
                                          color: 'white',
                                        }}>
                                        {data.item.timeFrame.fromHour.slice(0, 5) +
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
                                        }}>
                                        <Text
                                          style={{
                                            fontSize: Dimensions.get('window').width * 0.045,
                                            fontWeight: 'bold',
                                            fontFamily: 'Roboto',
                                            color: 'white',
                                          }}>
                                          Khung giờ:{' '}
                                          {data.item.timeFrame.fromHour.slice(0, 5) +
                                            '-' +
                                            data.item.timeFrame.toHour.slice(0, 5)}
                                        </Text>
                                        <Text
                                          style={{
                                            fontSize: Dimensions.get('window').width * 0.045,
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
                                        {data.item.pickupPoint && (
                                          <Text
                                            style={{
                                              fontSize: Dimensions.get('window').width * 0.045,
                                              fontWeight: 'bold',
                                              fontFamily: 'Roboto',
                                              color: 'white',
                                            }}
                                            numberOfLines={2}>
                                            Điểm giao:
                                            {' ' + data.item.pickupPoint.address}
                                          </Text>
                                        )}
                                        {data.item.productConsolidationArea && (
                                          <Text
                                            style={{
                                              fontSize: Dimensions.get('window').width * 0.045,
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
                                </View>
                              </TouchableOpacity>
                              {/* order list in group */}
                              {data.item.isExpand &&
                                data.item.orderList != null &&
                                data.item.orderList.length > 0 &&
                                data.item.orderList.map((item, index) => (
                                  <TouchableOpacity
                                    key={index}
                                    onPress={() => {
                                      navigation.navigate('OrderDetails', {
                                        id: item.id,
                                        picked: currentOptions.id,
                                      });
                                    }}
                                    style={{
                                      position: 'relative',
                                      margin: 10,
                                      backgroundColor: 'white',
                                      borderRadius: 10,
                                      padding: 20,
                                      shadowColor: '#000',
                                      shadowOffset: {
                                        width: 0,
                                        height: 2,
                                      },
                                      shadowOpacity: 0.25,
                                      shadowRadius: 4,
                                      elevation: 5,
                                    }}>
                                    <Text
                                      style={
                                        item?.status === 4
                                          ? {
                                            position: 'absolute',
                                            top: '10%',
                                            right: '5%',
                                            backgroundColor:
                                              COLORS.light_green,
                                            color: COLORS.primary,
                                            padding: 10,
                                            borderRadius: 10,
                                            fontSize: Dimensions.get('window').width * 0.035,
                                          }
                                          : {
                                            position: 'absolute',
                                            top: '10%',
                                            right: '5%',
                                            backgroundColor: '#FBD9D3',
                                            color: COLORS.red,
                                            padding: 10,
                                            borderRadius: 10,
                                            fontSize: Dimensions.get('window').width * 0.035,
                                          }
                                      }>
                                      {item?.status === 2 && 'Đóng gói'}
                                      {item?.status === 3 && 'Đang giao'}
                                      {item?.status === 4 && 'Giao thành công'}
                                      {item?.status === 5 && 'Giao thất bại'}
                                    </Text>
                                    <Text
                                      style={{
                                        fontSize: Dimensions.get('window').width * 0.04,
                                        fontFamily: FONTS.fontFamily,
                                        color: 'black',
                                        fontWeight: 'bold',
                                        paddingBottom: 5,
                                        maxWidth: '80%',
                                      }}>
                                      {item?.code}
                                    </Text>

                                    <Text
                                      style={{
                                        fontSize: Dimensions.get('window').width * 0.045,
                                        fontFamily: FONTS.fontFamily,
                                        color: 'black',
                                        paddingBottom: 5,
                                      }}>
                                      Tên: {item?.customer.fullName}
                                    </Text>

                                    <Text
                                      style={{
                                        fontSize: Dimensions.get('window').width * 0.045,
                                        fontFamily: FONTS.fontFamily,
                                        color: 'black',
                                        paddingBottom: 5,
                                      }}>
                                      SĐT: {item?.customer.phone}
                                    </Text>
                                    <Text
                                      style={{
                                        fontSize: Dimensions.get('window').width * 0.045,
                                        fontFamily: FONTS.fontFamily,
                                        color: 'black',
                                        paddingBottom: 5,
                                      }}>
                                      Thời gian:{' '}
                                      {item?.timeFrame
                                        ? `${item?.timeFrame?.fromHour.slice(
                                          0,
                                          5,
                                        )} đến ${item?.timeFrame?.toHour.slice(
                                          0,
                                          5,
                                        )}`
                                        : ''}
                                    </Text>
                                    <Text
                                      style={{
                                        fontSize: Dimensions.get('window').width * 0.045,
                                        fontFamily: FONTS.fontFamily,
                                        color: 'black',
                                        paddingBottom: 5,
                                      }}>
                                      Ngày giao:{' '}
                                      {format(
                                        new Date(item?.deliveryDate),
                                        'dd/MM/yyyy',
                                      )}
                                    </Text>
                                    <Text
                                      style={{
                                        fontSize: Dimensions.get('window').width * 0.045,
                                        fontFamily: FONTS.fontFamily,
                                        color: 'black',
                                        paddingBottom: 5,
                                      }}>
                                      Địa chỉ:{' '}
                                      {item?.addressDeliver
                                        ? item?.addressDeliver
                                        : 'Pickup point Quận 9'}
                                    </Text>

                                    <View
                                      style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        paddingVertical: 10,
                                      }}>
                                      <View
                                        style={{
                                          flex: 1,
                                          height: 1.5,
                                          backgroundColor: COLORS.primary,
                                        }}
                                      />
                                      <View>
                                        <Text
                                          style={{
                                            width: 100,
                                            textAlign: 'center',
                                            color: COLORS.primary,
                                            fontWeight: 'bold',
                                            fontSize: Dimensions.get('window').width * 0.045,
                                            fontFamily: FONTS.fontFamily,
                                          }}>
                                          {item.paymentMethod === 0
                                            ? 'COD'
                                            : 'VN Pay'}
                                        </Text>
                                      </View>
                                      <View
                                        style={{
                                          flex: 1,
                                          height: 1.5,
                                          backgroundColor: COLORS.primary,
                                        }}
                                      />
                                    </View>

                                    <Text>
                                      <View style={{ flexDirection: 'row' }}>
                                        <Text
                                          style={{
                                            fontSize: Dimensions.get('window').width * 0.048,
                                            lineHeight: 30,
                                            color: COLORS.secondary,
                                            fontWeight: 700,
                                            fontFamily: FONTS.fontFamily,
                                            paddingRight: 5,
                                          }}>
                                          Tổng giá tiền:
                                        </Text>

                                        <Text
                                          style={{
                                            maxWidth: '70%',
                                            fontSize: Dimensions.get('window').width * 0.048,
                                            lineHeight: 30,
                                            color: COLORS.secondary,
                                            fontWeight: 700,
                                            fontFamily: FONTS.fontFamily,
                                          }}>
                                          {item.totalPrice.toLocaleString(
                                            'vi-VN',
                                            {
                                              currency: 'VND',
                                            },
                                          )}
                                        </Text>
                                        <Text
                                          style={{
                                            fontSize: Dimensions.get('window').width * 0.03,
                                            lineHeight: 18,
                                            color: COLORS.secondary,
                                            fontWeight: 700,
                                            fontFamily: FONTS.fontFamily,
                                          }}>
                                          ₫
                                        </Text>
                                      </View>
                                    </Text>
                                  </TouchableOpacity>
                                ))}
                            </View>
                            {/* *********************** */}
                          </View>
                        )}
                      />
                    </View>
                  </>
                )}
              </>
            ) : (
              <>
                {/* No Groupign No Batching */}
                {orders.length === 0 ? (
                  <View
                    style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Image
                      style={{ width: '100%', height: '50%' }}
                      resizeMode="contain"
                      source={Empty}
                    />
                    <Text
                      style={{
                        fontSize: Dimensions.get('window').width * 0.05,
                        fontFamily: 'Roboto',
                        fontWeight: 'bold',
                      }}>
                      Không có đơn hàng nào
                    </Text>
                    <Text
                      style={{
                        fontSize: Dimensions.get('window').width * 0.05,
                        fontFamily: 'Roboto',
                        fontWeight: 'bold',
                      }}>
                      Hãy chọn lại ngày giao
                    </Text>
                  </View>
                ) : (
                  <ScrollView
                    contentContainerStyle={{
                      paddingBottom: 100,
                    }}>
                    {orders.map((item, index) => (
                      <OrderItem item={item} key={index} />
                    ))}
                  </ScrollView>
                )}
              </>
            )}
          </View>
          {/* Modal filter */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}>
            <View
              style={styles.centeredView}
            >
              <View style={styles.modalView}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      color: 'black',
                      fontFamily: FONTS.fontFamily,
                      fontSize: Dimensions.get('window').width * 0.05,
                      fontWeight: 700,
                      textAlign: 'center',
                      paddingBottom: '2%',
                    }}>
                    Bộ lọc tìm kiếm
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(!modalVisible);
                    }}>
                    <Image
                      resizeMode="contain"
                      style={{
                        width: Dimensions.get('window').width * 0.08,
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
                    fontFamily: FONTS.fontFamily,
                    fontSize: Dimensions.get('window').width * 0.045,
                    fontWeight: 700,
                  }}>
                  Lọc theo trạng thái đơn hàng
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginVertical: 10,
                  }}>
                  {selectItem.map((item, index) => (
                    <ModalItem item={item} key={index} />
                  ))}
                </View>

                <>
                  <View
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                  >
                    <Text
                      style={{
                        color: 'black',
                        fontSize: Dimensions.get('window').width * 0.045,
                        fontWeight: 700,
                      }}>
                      Chọn khung giờ
                    </Text>
                    <Text
                      style={{
                        fontSize: Dimensions.get('window').width * 0.03,
                        marginLeft: '2%',
                      }}>
                      {/* (Kéo xuống để hiện thị thêm) */}
                    </Text>
                  </View>
                  <ScrollView>
                    <View
                      style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        marginVertical: '1%',
                        maxHeight: Dimensions.get('window').height * 0.3,
                      }}>
                      {timeFrameList.map((item, index) => (
                        <TimeFrameItem item={item} key={index} />
                      ))}
                    </View>
                  </ScrollView>
                </>

                <Text
                  style={{
                    color: 'black',
                    fontSize: Dimensions.get('window').width * 0.045,
                    fontWeight: 700,
                  }}>
                  Chọn ngày giao hàng
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'center'
                  }}>
                  <DatePicker
                    date={selectedDate === null ? new Date() : selectedDate}
                    mode="date"
                    androidVariant="nativeAndroid"
                    onDateChange={setSelectedDate}
                  />
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
                      paddingHorizontal: '2%',
                      paddingVertical: 10,
                      backgroundColor: 'white',
                      borderRadius: 10,
                      borderColor: COLORS.primary,
                      borderWidth: 0.5,
                      marginRight: '2%',
                    }}
                    onPress={() => {
                      setModalVisible(!modalVisible);
                      handleClear();
                    }}>
                    <Text
                      style={{
                        color: COLORS.primary,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        fontSize: Dimensions.get('window').width * 0.045,
                      }}>
                      Thiết lập lại
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      width: '50%',
                      paddingHorizontal: '2%',
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
        </View>
      </TouchableWithoutFeedback>
      {loading && <LoadingScreen />}
    </>
  );
};

export default HistoryList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flex: 1.5,
    paddingHorizontal: 20,
  },
  body: {
    flex: 9,
    paddingTop: 20,
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
    width: '80%',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
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
    fontSize: Dimensions.get('window').width * 0.045,
  },
});
