/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import { View, Text, Image, Dimensions, StyleSheet, Modal as NotiModal, Modal as AlertModal, TouchableOpacity } from 'react-native';
import React, { useCallback, useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { icons } from '../../constants';
import { COLORS, FONTS } from '../../constants/theme';
import { useFocusEffect } from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';
import { format } from 'date-fns';
import { API } from '../../constants/api';
import LoadingScreen from '../../components/LoadingScreen';
import dayjs from 'dayjs';
import Modal, {
  ModalButton,
  ModalFooter,
  ScaleAnimation,
} from 'react-native-modals';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import { checkSystemState } from '../../common/utils';

const EditDeliveryDate = ({ navigation, route }) => {
  // listen to system state
  useFocusEffect(
    useCallback(() => {
      checkSystemState(navigation);
    }, []),
  );

  const [timeFrameList, setTimeFrameList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState('');
  const [open, setOpen] = useState(false);
  const [timeFrame, setTimeFrame] = useState(null);
  const [date, setDate] = useState(null);
  const [orderItems, setOrderItems] = useState(route.params.orderItems);
  const [initializing, setInitializing] = useState(true);
  const orderId = route.params.orderId;
  const expDateList = route.params.expDateList;

  const [modalVisibleEditDate, setModalVisibleEditDate] = useState(false);
  const [textEditDate, setTextEditDate] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  // console.log('modalVisibleEditDate', modalVisibleEditDate);
  // console.log('modalVisible', modalVisible);

  // Check valid
  const [minDate, setMinDate] = useState(new Date());
  const [maxDate, setMaxDate] = useState(new Date());
  const [cannotChangeDate, setCannotChangeDate] = useState(false);
  const [validateMessage, setValidateMessage] = useState('');
  const [openValidateDialog, setOpenValidateDialog] = useState(false);

  const dayDiffFromToday = expDate => {
    return Math.ceil((expDate - new Date()) / (1000 * 3600 * 24));
  };

  const getDateAfterToday = numberOfDays => {
    const today = new Date();
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + numberOfDays);
    return nextDate;
  };

  const getMaxDate = expDate => {
    const maxDate = new Date(expDate);
    maxDate.setDate(expDate.getDate() - 1);
    return maxDate;
  };

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
  //                 console.log(e);
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
  //         const token = await auth().currentUser.getIdToken();
  //         setTokenId(token);
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
  //     const subscriber = auth().onAuthStateChanged(
  //         async userInfo => await onAuthStateChange(userInfo),
  //     );
  //     return subscriber;
  // }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      const fetchTimeFrame = () => {
        if (route.params.picked === 0) {
          fetch(`${API.baseURL}/api/timeframe/getForPickupPoint`)
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
        } else {
          fetch(`${API.baseURL}/api/timeframe/getForHomeDelivery`)
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
      };

      const minExpDateOrderItems = new Date(
        Math.min(...expDateList.map(item => Date.parse(item))),
      );
      if (dayDiffFromToday(minExpDateOrderItems) > 3) {
        setMinDate(getDateAfterToday(2));
        setMaxDate(getMaxDate(minExpDateOrderItems));
      }
      if (
        dayDiffFromToday(minExpDateOrderItems) === 1 ||
        dayDiffFromToday(minExpDateOrderItems) === 2
      ) {
        setMinDate(getDateAfterToday(1));
        setMaxDate(getDateAfterToday(1));
        setDate(getDateAfterToday(1));
        setCannotChangeDate(true);
      }
      if (dayDiffFromToday(minExpDateOrderItems) === 3) {
        setMinDate(getDateAfterToday(2));
        setMaxDate(getDateAfterToday(2));
        setDate(getDateAfterToday(2));
        setCannotChangeDate(true);
      }
      fetchTimeFrame();
    }, [expDateList, route.params.picked]),
  );

  const handleEdit = async () => {
    if (!date) {
      setValidateMessage('Vui lòng chọn ngày giao hàng');
      setOpenValidateDialog(true);
      return;
    }

    // if (!timeFrame) {
    //     setValidateMessage('Vui lòng chọn khung giờ');
    //     setOpenValidateDialog(true);
    //     return false;
    // }
    setLoading(true);
    const tokenId = await auth().currentUser.getIdToken();
    fetch(
      `${API.baseURL
      }/api/order/deliveryStaff/editDeliverDate/${orderId}?deliverDate=${format(
        date,
        'yyyy-MM-dd',
      )}`,
      {
        method: 'PUT',
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
      .then(data => {
        setLoading(false);
        setModalVisibleEditDate(true);
        setTextEditDate(data?.productConsolidationArea?.address);
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <>
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
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={icons.leftArrow}
            resizeMode="contain"
            style={{ width: Dimensions.get('window').width * 0.1, height: 35, tintColor: COLORS.primary }}
          />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: Dimensions.get('window').width * 0.05,
            textAlign: 'center',
            color: '#000000',
            fontWeight: 'bold',
            fontFamily: 'Roboto',
          }}>
          Chỉnh sửa ngày giao hàng
        </Text>
      </View>
      <ScrollView>
        {/* Manage Date */}
        <TouchableOpacity
          onPress={() => {
            if (cannotChangeDate) {
              setValidateMessage(
                'Một trong số sản phẩm của bạn sắp hết hạn, chỉ có thể giao vào ngày này !',
              );
              setOpenValidateDialog(true);
              return;
            }
            setOpen(true);
          }}>
          <View
            style={{
              paddingHorizontal: 20,
              paddingVertical: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTopColor: '#decbcb',
              borderTopWidth: 0.75,
              borderBottomWidth: 0.75,
              borderBottomColor: '#decbcb',
              backgroundColor: 'white',
              marginBottom: 20,
            }}>
            <View
              style={{
                flexDirection: 'row',
                gap: 10,
                alignItems: 'center',
                flex: 9,
              }}>
              <Image
                resizeMode="contain"
                style={{ width: Dimensions.get('window').width * 0.08, height: 25 }}
                source={icons.calendar}
              />
              <Text
                style={{
                  fontSize: Dimensions.get('window').width * 0.05,
                  fontFamily: 'Roboto',
                  color: 'black',
                }}>
                {date ? format(date, 'dd-MM-yyyy') : 'Chọn ngày giao'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <DatePicker
          modal
          mode="date"
          open={open}
          date={date ? date : new Date()}
          onDateChange={setDate}
          onConfirm={date => {
            const getDate = new Date();
            let day = getDate.getDate();
            let month = getDate.getMonth() + 1;
            let year = getDate.getFullYear();
            let currentDate = `${year}-${month}-${day}`;

            if (
              dayjs(currentDate).format('YYYY/MM/DD') >
              dayjs(date).format('YYYY/MM/DD')
            ) {
              setValidateMessage(
                'Không thể chọn ngày giao trước ngày hôm nay',
              );
              setOpenValidateDialog(true);
              return;
            }
            if (
              dayjs(currentDate).format('YYYY/MM/DD') ==
              dayjs(date).format('YYYY/MM/DD')
            ) {
              setValidateMessage(
                'Không thể chọn ngày giao là ngày hôm nay',
              );
              setOpenValidateDialog(true);
              return;
            }

            // if (date.getTime() < minDate.getTime()) {
            //   setOpen(false);
            //   setValidateMessage(
            //     'Đơn hàng luôn được giao sau 2 ngày kể từ ngày đặt hàng',
            //   );
            //   setOpenValidateDialog(true);
            //   return;
            // }
            if (date.getTime() > maxDate.getTime()) {
              setOpen(false);
              setValidateMessage(
                `Đơn hàng phải giao trước HSD của sản phẩm có HSD gần nhất 1 ngày (HSD ${dayjs(maxDate).format('DD/MM/YYYY')}) `,
              );
              setOpenValidateDialog(true);
              return;
            }
            console.log('date', date);
            setOpen(false);
            setDate(date);
            route.params.setDate(date);
          }}
          onCancel={() => {
            setOpen(false);
          }}
        />
        {/* Time Frame */}
        {/* <View style={{ backgroundColor: 'white', padding: 20 }}>
                        <Text
                            style={{
                                fontSize: 20,
                                color: 'black',
                                fontFamily: 'Roboto',
                                fontWeight: 'bold',
                                marginBottom: 20,
                            }}>
                            Khung giờ
                        </Text>
                        {timeFrameList.map(item => (
                            <TouchableOpacity
                                key={item.id}
                                onPress={() => {
                                    setSelectedTimeFrame(item.id);
                                    setTimeFrame(item);
                                    if (route.params.picked === 0) {
                                        route.params.setTimeFrame(item);
                                    } else {
                                        route.params.setCustomerTimeFrame(item);
                                    }
                                }}
                                style={
                                    item.id === selectedTimeFrame ?
                                        {
                                            paddingVertical: 15,
                                            borderTopColor: '#decbcb',
                                            borderTopWidth: 0.75,
                                            backgroundColor: COLORS.primary,
                                        }
                                        : {
                                            paddingVertical: 15,
                                            borderTopColor: '#decbcb',
                                            borderTopWidth: 0.75,
                                        }
                                }>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: 15,
                                        flex: 1,
                                        justifyContent: 'space-between',
                                        paddingHorizontal: 10,
                                    }}>
                                    <Text
                                        style={
                                            item.id === selectedTimeFrame ?
                                                {
                                                    fontSize: 17,
                                                    color: 'white',
                                                    fontFamily: 'Roboto',
                                                }
                                                : {
                                                    fontSize: 17,
                                                    color: 'black',
                                                    fontFamily: 'Roboto',
                                                }}>
                                        {item.fromHour.slice(0, 5)} đến {item.toHour.slice(0, 5)}
                                    </Text>
                                    <Text
                                        style={
                                            item.id === selectedTimeFrame ?
                                                {
                                                    fontSize: 17,
                                                    color: 'white',
                                                    fontFamily: 'Roboto',
                                                }
                                                : {
                                                    fontSize: 17,
                                                    color: 'black',
                                                    fontFamily: 'Roboto',
                                                }}>
                                        {item.dayOfWeek === 0 && 'Mỗi ngày'}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View> */}
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
              textStyle={{ color: 'red' }}
              text="Đóng"
              onPress={() => {
                setOpenValidateDialog(false);
                setOpen(false);
              }}
            />
          </ModalFooter>
        }>
        <View
          style={{ padding: 20, alignItems: 'center', justifyContent: 'center' }}>
          <Text
            style={{
              fontSize: Dimensions.get('window').width * 0.06,
              fontFamily: 'Roboto',
              color: 'black',
              textAlign: 'center',
            }}>
            {validateMessage}
          </Text>
        </View>
      </Modal>
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
        <View style={{ width: '95%' }}>
          <TouchableOpacity
            onPress={() => {
              handleEdit();
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
                fontSize: Dimensions.get('window').width * 0.048,
                color: 'white',
                fontFamily: 'Roboto',
                fontWeight: 'bold',
              }}>
              Chỉnh sửa
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Alert Modal */}
      <NotiModal
        animationType="fade"
        transparent={true}
        visible={modalVisibleEditDate}
        onRequestClose={() => {
          setModalVisibleEditDate(false);
        }}>
        <View
          style={styles.centeredView}>
          <View style={styles.modalView}>
            <View
              style={{
                // flexDirection: 'row',
                // justifyContent: 'space-between',
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
                Thông báo: Ngày giao đã thay đổi
              </Text>
              <Text
                style={{
                  color: 'black',
                  fontFamily: FONTS.fontFamily,
                  fontSize: 18,
                  paddingBottom: 20,
                }}>
                Mang hàng về tại điểm tập kết:
              </Text>
              <View
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
                <Image
                  resizeMode="contain"
                  style={{ width: Dimensions.get('window').width * 0.1, height: 20, tintColor: COLORS.primary }}
                  source={icons.location}
                />
                <Text
                  style={{
                    color: 'black',
                    fontFamily: FONTS.fontFamily,
                    fontSize: 18,
                    maxWidth: '90%'
                  }}>
                  {textEditDate}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: '5%',
              }}>
              <TouchableOpacity
                style={{
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  backgroundColor: COLORS.primary,
                  borderRadius: 10,
                }}
                onPress={() => {
                  setModalVisible(true);
                }}>
                <Text style={styles.textStyle}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </NotiModal>
      {/* Modal confirm */}
      <AlertModal
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

            <Text
              style={{
                color: 'black',
                fontFamily: FONTS.fontFamily,
                fontSize: 20,
                fontWeight: 700,
                textAlign: 'center',
                paddingBottom: 20,
              }}>
              Bạn đã ghi nhớ điểm tập kết chưa ?
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
                  borderColor: COLORS.red,
                  borderWidth: 0.5,
                  marginRight: '2%',
                }}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}>
                <Text
                  style={{
                    color: COLORS.red,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  Chưa
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  width: '50%',
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  backgroundColor: COLORS.primary,
                  borderRadius: 10,
                }}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  setModalVisibleEditDate(!modalVisibleEditDate);
                  navigation.navigate('OrderDetails', {
                    id: route.params.orderId,
                    picked: route.params.picked,
                  });
                }}>
                <Text style={styles.textStyle}>Rồi</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </AlertModal>

      {loading && <LoadingScreen />}
    </>
  );
};

export default EditDeliveryDate;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
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
