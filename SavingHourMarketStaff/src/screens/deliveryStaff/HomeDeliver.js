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
import React, {useCallback, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import {Image} from 'react-native-animatable';
import {icons} from '../../constants';
import {COLORS, FONTS} from '../../constants/theme';
import {API} from '../../constants/api';
import {format} from 'date-fns';
import Empty from '../../assets/image/search-empty.png';
import LoadingScreen from '../../components/LoadingScreen';
import {useFocusEffect} from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';
import database from '@react-native-firebase/database';
import {checkSystemState} from '../../common/utils';

const HomeDeliver = ({navigation}) => {
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
    {id: 0, display: 'Đóng gói', value: 'PACKAGED', active: false},
    {id: 1, display: 'Đang giao', value: 'DELIVERING', active: false},
    {id: 2, display: 'Đã giao', value: 'SUCCESS', active: false},
    {id: 3, display: 'Đơn thất bại', value: 'FAIL', active: false},
  ];

  const deliveryOptions = [
    {id: 0, display: 'Giao hàng tại điểm nhận'},
    {id: 1, display: 'Giao hàng tận nhà'},
    {id: 2, display: 'Đơn hàng lẻ'},
  ];

  const [currentOptions, setCurrentOptions] = useState({
    id: 0,
    display: 'Giao hàng tại điểm nhận',
  });

  const [selectItem, setSelectItem] = useState(orderStatus);
  //  filter pickup point
  const [selectedTimeFrameId, setSelectedTimeFrameId] = useState('');
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
      console.log(currentOptions.id);
      setSelectedDate(null);
      fetchOrders(currentOptions.id);
    }, []),
  );

  // const onAuthStateChange = async userInfo => {
  //   setLoading(true);
  //   if (initializing) {
  //     setInitializing(false);
  //   }
  //   if (userInfo) {
  //     // check if user sessions is still available. If yes => redirect to another screen
  //     const userTokenId = await userInfo
  //       .getIdToken(true)
  //       .then(token => token)
  //       .catch(async e => {
  //         // console.log(e);
  //         setLoading(false);
  //         return null;
  //       });
  //     if (!userTokenId) {
  //       // sessions end. (revoke refresh token like password change, disable account, ....)
  //       await AsyncStorage.removeItem('userInfo');
  //       setLoading(false);
  //       // navigation.navigate('Login');
  //       navigation.reset({
  //         index: 0,
  //         routes: [{name: 'Login'}],
  //       });
  //       return;
  //     }
  //     setLoading(false);
  //   } else {
  //     // no sessions found.
  //     console.log('user is not logged in');
  //     await AsyncStorage.removeItem('userInfo');
  //     setLoading(false);
  //     // navigation.navigate('Login');
  //     navigation.reset({
  //       index: 0,
  //       routes: [{name: 'Login'}],
  //     });
  //   }
  // };

  // useEffect(() => {
  //   fetchOrders(currentOptions.id);
  //   const subscriber = auth().onAuthStateChanged(
  //     async userInfo => await onAuthStateChange(userInfo),
  //   );

  //   return subscriber;
  // }, []);

  const fetchOrders = async id => {
    const tokenId = await auth().currentUser.getIdToken();
    const userFromAS = await getUser();
    let currentDate = format(new Date(), 'yyyy-MM-dd');
    const deliverDate = selectedDate
      ? format(selectedDate, 'yyyy-MM-dd')
      : currentDate;
    if (tokenId) {
      setLoading(true);
      if (id === 0) {
        fetch(
          `${API.baseURL}/api/order/staff/getOrderGroup?delivererId=${
            userFromAS?.id
          }${
            selectedDate === null ? '' : `&deliverDate=${deliverDate}`
          }&status=DELIVERING`,
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
            console.log('0', respond);
            setOrderGroupList(respond.orderGroups);
            setLoading(false);
          })
          .catch(err => {
            console.log(err);
          });
      } else if (id === 1) {
        fetch(
          `${API.baseURL}/api/order/staff/getOrderBatch?status=DELIVERING${
            selectedDate === null ? '' : `&deliveryDate=${deliverDate}`
          }&delivererId=${userFromAS?.id}`,
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
            setOrderGroupList(respond);
            setLoading(false);
          })
          .catch(err => {
            console.log(err);
            setLoading(false);
          });
      } else if (id === 2) {
        fetch(
          `${
            API.baseURL
          }/api/order/staff/getOrders?isGrouped=false&isBatched=false&delivererId=${
            userFromAS?.id
          }&orderStatus=DELIVERING${
            selectedDate === null ? '' : `&deliveryDate=${deliverDate}`
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
            console.log('3', respond);
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
    console.log('clear filter');
    const tokenId = await auth().currentUser.getIdToken();
    const userFromAS = await getUser();
    if (tokenId) {
      setLoading(true);
      if (currentOptions.id === 0) {
        fetch(
          `${API.baseURL}/api/order/staff/getOrderGroup?delivererId=${userFromAS?.id}&status=DELIVERING`,
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
            console.log(
              `${API.baseURL}/api/order/staff/getOrderGroup?delivererId=${userFromAS?.id}&status=DELIVERING`,
            );
            console.log('0', respond);
            setOrderGroupList(respond.orderGroups);
            setLoading(false);
          })
          .catch(err => {
            console.log(err);
          });
      } else if (currentOptions.id === 1) {
        fetch(
          `${API.baseURL}/api/order/staff/getOrderBatch?status=DELIVERING&delivererId=${userFromAS?.id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${tokenId}`,
            },
          },
        )
          .then(async res => {
            console.log(res);
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
            setOrderGroupList(respond);
            setLoading(false);
          })
          .catch(err => {
            console.log(err);
            setLoading(false);
          });
      } else if (currentOptions.id === 2) {
        fetch(
          `${API.baseURL}/api/order/staff/getOrders?isGrouped=false&isBatched=false&delivererId=${userFromAS?.id}&orderStatus=DELIVERING`,
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
            console.log('3', respond);
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

  const OrderItem = ({item}) => {
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
          style={{
            position: 'absolute',
            top: '10%',
            right: '5%',
            backgroundColor: COLORS.light_green,
            color: COLORS.primary,
            padding: 10,
            borderRadius: 10,
          }}>
          {item?.status === 3 && 'Đang giao '}
          {item?.status === 4 && 'Đã Giao'}
          {item?.status === 5 && 'Giao thất bại'}
        </Text>
        <Text
          style={{
            fontSize: 18,
            fontFamily: FONTS.fontFamily,
            color: 'black',
            fontWeight: 'bold',
            paddingBottom: 5,
            maxWidth: '80%',
          }}>
          {item?.customer.fullName}
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
            style={{flex: 1, height: 1.5, backgroundColor: COLORS.primary}}
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
            style={{flex: 1, height: 1.5, backgroundColor: COLORS.primary}}
          />
        </View>

        <Text>
          <View style={{flexDirection: 'row'}}>
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

  const ModalItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          const newArray = selectItem.map(i => {
            if (i.id === item.id) {
              if (i.active === true) {
                return {...i, active: false};
              } else {
                return {...i, active: true};
              }
            }
            return {...i, active: false};
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
                  width: 150,
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  textAlign: 'center',
                  color: COLORS.primary,
                  fontFamily: FONTS.fontFamily,
                  fontSize: 12,
                }
              : {
                  width: 150,
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  textAlign: 'center',
                  color: 'black',
                  fontFamily: FONTS.fontFamily,
                  fontSize: 12,
                }
          }>
          {item.display}
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
                  Xin Chào, {user?.fullName}
                </Text>
              </View>
              <View style={styles.logout}>
                <TouchableOpacity
                  onPress={() => {
                    setOpen(!open);
                  }}>
                  <Image
                    resizeMode="contain"
                    style={{width: 38, height: 38}}
                    source={
                      user?.avatarUrl
                        ? {uri: user?.avatarUrl}
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
                    <Text style={{color: 'red', fontWeight: 'bold'}}>
                      Đăng xuất
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View style={{flexDirection: 'row'}}>
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
                          paddingTop: 15,
                          paddingHorizontal: 8,
                          paddingBottom: 15,
                        },
                        currentOptions.display === item.display && {
                          borderBottomColor: COLORS.primary,
                          borderBottomWidth: 2,
                        },
                      ]}>
                      <Text
                        style={{
                          fontFamily: 'Roboto',
                          fontSize: 16,
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
                    height: 45,
                    tintColor: COLORS.primary,
                    width: 30,
                    marginLeft: '1%',
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
                fontSize: 18,
                marginLeft: 10,
                paddingBottom: 20,
              }}>
              Số lượng đơn hàng cần giao:{' '}
              {currentOptions.id === 0 || currentOptions.id === 1
                ? orderGroupList.length + ' nhóm đơn'
                : orders.length + ' đơn'}
            </Text>
            <Text
              style={{
                fontFamily: FONTS.fontFamily,
                color: 'black',
                fontSize: 20,
                marginLeft: 10,
                paddingBottom: 20,
              }}>
              Danh sách các đơn hàng
            </Text>
            {currentOptions.id === 0 || currentOptions.id === 1 ? (
              <>
                {/* Grouping & Batching Order  */}
                {orderGroupList.length === 0 ? (
                  <View
                    style={{alignItems: 'center', justifyContent: 'center'}}>
                    <Image
                      style={{width: '100%', height: '50%'}}
                      resizeMode="contain"
                      source={Empty}
                    />
                    <Text
                      style={{
                        fontSize: 20,
                        fontFamily: 'Roboto',
                        fontWeight: 'bold',
                      }}>
                      Không có đơn hàng nào
                    </Text>
                    <Text
                      style={{
                        fontSize: 20,
                        fontFamily: 'Roboto',
                        fontWeight: 'bold',
                      }}>
                      Hãy chọn lại ngày giao
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
                                order => order.status === 3,
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
                                      width: 20,
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
                                        {data.item.timeFrame.fromHour +
                                          '-' +
                                          data.item.timeFrame.toHour +
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
                                            fontSize: 18,
                                            fontWeight: 'bold',
                                            fontFamily: 'Roboto',
                                            color: 'white',
                                          }}>
                                          Khung giờ:{' '}
                                          {data.item.timeFrame.fromHour +
                                            '-' +
                                            data.item.timeFrame.toHour}
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
                                      style={{
                                        position: 'absolute',
                                        top: '10%',
                                        right: '5%',
                                        backgroundColor: COLORS.light_green,
                                        color: COLORS.primary,
                                        padding: 10,
                                        borderRadius: 10,
                                      }}>
                                      {item?.status === 2 && 'Đóng gói'}
                                      {item?.status === 3 && 'Đang giao'}
                                      {item?.status === 4 && 'Đã Giao'}
                                      {item?.status === 5 && 'Giao thất bại'}
                                    </Text>
                                    <Text
                                      style={{
                                        fontSize: 18,
                                        fontFamily: FONTS.fontFamily,
                                        color: 'black',
                                        fontWeight: 'bold',
                                        paddingBottom: 5,
                                        maxWidth: '80%',
                                      }}>
                                      {item?.customer.fullName}
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
                                          )} đến ${item?.timeFrame?.toHour.slice(
                                            0,
                                            5,
                                          )}`
                                        : ''}
                                    </Text>
                                    <Text
                                      style={{
                                        fontSize: 16,
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
                                        fontSize: 16,
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
                                            fontSize: 16,
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
                                      <View style={{flexDirection: 'row'}}>
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
                                          {item.totalPrice.toLocaleString(
                                            'vi-VN',
                                            {
                                              currency: 'VND',
                                            },
                                          )}
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
                    style={{alignItems: 'center', justifyContent: 'center'}}>
                    <Image
                      style={{width: '100%', height: '50%'}}
                      resizeMode="contain"
                      source={Empty}
                    />
                    <Text
                      style={{
                        fontSize: 20,
                        fontFamily: 'Roboto',
                        fontWeight: 'bold',
                      }}>
                      Không có đơn hàng nào
                    </Text>
                    <Text
                      style={{
                        fontSize: 20,
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
            <TouchableOpacity
              onPress={() => setModalVisible(!modalVisible)}
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
                      fontFamily: FONTS.fontFamily,
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
                {/* <Text
                                    style={{
                                        color: 'black',
                                        fontFamily: FONTS.fontFamily,
                                        fontSize: 16,
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
                                </View> */}
                <Text
                  style={{
                    color: 'black',
                    fontSize: 16,
                    fontWeight: 700,
                  }}>
                  Chọn ngày giao hàng
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginVertical: 10,
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
                      paddingHorizontal: 15,
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
            </TouchableOpacity>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
      {loading && <LoadingScreen />}
    </>
  );
};

export default HomeDeliver;

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
  },
});
