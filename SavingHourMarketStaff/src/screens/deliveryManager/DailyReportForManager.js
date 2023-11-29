import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {COLORS} from '../../constants/theme';
import {icons} from '../../constants';
import {useFocusEffect} from '@react-navigation/native';
import {API} from '../../constants/api';
import {format} from 'date-fns';
import {
  ExpandableCalendar,
  AgendaList,
  CalendarProvider,
  WeekCalendar,
} from 'react-native-calendars';
import LoadingScreen from '../../components/LoadingScreen';
import database from '@react-native-firebase/database';
import {checkSystemState} from '../../common/utils';

const DailyReportForManager = ({navigation}) => {
  // listen to system state
  useFocusEffect(
    useCallback(() => {
      checkSystemState(navigation);
    }, []),
  );

  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [date, setDate] = useState(
    format(Date.parse(new Date().toString()), 'yyyy-MM-dd'),
  );
  const [deliverReportList, setDeliverReportList] = useState(null);
  const [successDeliveredOrder, setSuccessDeliveredOrder] = useState(null);
  const [deliveringOrder, setDeliveringOrder] = useState(null);
  const [failDeliveredOrder, setFailDeliveredOrder] = useState(null);
  const [waitingForAssignOrder, setWaitingForAssignOrder] = useState(null);

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
  //     //   console.log('currentUser', JSON.parse(currentUser).id);
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
      const fetchData = async () => {
        const currentUser = await AsyncStorage.getItem('userInfo');
        if (auth().currentUser) {
          const tokenId = await auth().currentUser.getIdToken();
          if (tokenId) {
            setLoading(true);
            fetch(
              `${
                API.baseURL
              }/api/order/deliveryManager/getDailyReport?deliverManagerId=${
                JSON.parse(currentUser).id
              }&reportDate=${date}`,
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
                console.log('report', respond);
                setDeliverReportList(respond.deliverReportList);
                setSuccessDeliveredOrder(respond.successDeliveredOrder);
                setDeliveringOrder(respond.deliveringOrder);
                setFailDeliveredOrder(respond.failDeliveredOrder);
                setWaitingForAssignOrder(respond.waitingForAssignOrder);
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
    }, [date]),
  );

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
                style={{width: 35, height: 35, tintColor: 'white'}}
              />
            </TouchableOpacity>
            <View style={styles.pageName}>
              <Text style={{fontSize: 25, color: 'white', fontWeight: 'bold'}}>
                Báo cáo chi tiết
              </Text>
            </View>
          </View>
          <View
            style={{
              paddingTop: 10,
              paddingBottom: 20,
              borderRadius: 20,
              backgroundColor: 'white',
              shadowColor: '#000',
              shadowOffset: {
                width: 4,
                height: 4,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
              marginHorizontal: 5,
              marginBottom: 20,
              marginTop: 10,
              height: 280,
            }}>
            <CalendarProvider
              style={{paddingHorizontal: 5}}
              // disabledOpacity={10}
              date={date}
              onDateChanged={newDate => setDate(newDate)}>
              <ExpandableCalendar
                style={{paddingHorizontal: 5}}
                testID="expandableCalendar"
                allowShadow={false}
                disablePan={true}
                hideKnob={true}
              />
            </CalendarProvider>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignContent: 'center',
                gap: 10,
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('OrderListForReport', {
                    type: 'success',
                    mode: 2,
                    date: date,
                  });
                }}
                style={{
                  width: 100,
                  height: 108,
                  backgroundColor: COLORS.light_green,
                  borderRadius: 10,
                  padding: 10,
                  display: 'flex',
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  elevation: 5,
                }}>
                <View style={{flex: 1}}>
                  <Text style={{fontSize: 14, color: 'black'}}>
                    Đơn giao thành công:
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{fontSize: 40, color: 'black', fontWeight: 'bold'}}>
                    {successDeliveredOrder}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('OrderListForReport', {
                    type: 'delivering',
                    mode: 2,
                    date: date,
                  });
                }}
                style={{
                  width: 100,
                  height: 108,
                  backgroundColor: '#b6d8eb',
                  borderRadius: 10,
                  padding: 10,
                  display: 'flex',
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  elevation: 7,
                }}>
                <View style={{flex: 1}}>
                  <Text style={{fontSize: 14, color: 'black'}}>
                    Đơn đang giao:
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{fontSize: 40, color: 'black', fontWeight: 'bold'}}>
                    {deliveringOrder}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('OrderListForReport', {
                    type: 'fail',
                    mode: 2,
                    date: date,
                  });
                }}
                style={{
                  width: 100,
                  height: 108,
                  backgroundColor: '#e8bfbe',
                  borderRadius: 10,
                  padding: 10,
                  display: 'flex',
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  elevation: 7,
                }}>
                <View style={{flex: 1}}>
                  <Text style={{fontSize: 14, color: 'black'}}>
                    Đơn trả hàng:
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{fontSize: 40, color: 'black', fontWeight: 'bold'}}>
                    {failDeliveredOrder}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.body}>
          <Text
            style={{
              fontSize: 19,
              fontWeight: 'bold',
              color: 'black',
              marginBottom: 20,
              marginTop: 220,
            }}>
            Danh sách nhân viên giao hàng
          </Text>
          {deliverReportList?.length === 0 ? (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Image
                style={{width: '100%', height: '40%'}}
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
                Không có nhân viên giao hàng nào
              </Text>
            </View>
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{paddingBottom: 0}}>
              {deliverReportList?.map((item, index) => (
                <View
                  key={index}
                  style={{
                    marginBottom: 20,
                    backgroundColor: 'rgb(240,240,240)',
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
                    margin: 4,
                  }}>
                  <View style={{borderBottomWidth: 0.4, paddingBottom: 10}}>
                    <Text
                      style={{fontSize: 18, fontWeight: '500', color: 'black'}}>
                      Nhân viên: {item.staff.fullName}
                    </Text>
                  </View>
                  <View
                    style={{
                      position: 'absolute',
                      right: 10,
                      top: 5,
                    }}>
                    <Image
                      style={{
                        width: 35,
                        height: 35,
                        borderRadius: 40,
                      }}
                      resizeMode="contain"
                      source={{
                        uri: `${item?.staff.avatarUrl}`,
                      }}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: 'column',
                      paddingTop: 10,
                      gap: 7,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        gap: 7,
                        alignItems: 'center',
                      }}>
                      <Text style={{fontSize: 16, fontWeight: '500'}}>
                        Đơn đã giao thành công :{' '}
                      </Text>
                      <Text style={{fontSize: 16, fontWeight: '500'}}>
                        {item.successDeliveredOrder}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        gap: 7,
                        alignItems: 'center',
                      }}>
                      <Text style={{fontSize: 16, fontWeight: '500'}}>
                        Đơn đang giao :{' '}
                      </Text>
                      <Text style={{fontSize: 16, fontWeight: '500'}}>
                        {item.deliveringOrder}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        gap: 7,
                        alignItems: 'center',
                      }}>
                      <Text style={{fontSize: 16, fontWeight: '500'}}>
                        Đơn giao thất bại :{' '}
                      </Text>
                      <Text style={{fontSize: 16, fontWeight: '500'}}>
                        {item.failDeliveredOrder}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
        {loading && <LoadingScreen />}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default DailyReportForManager;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 20,
  },
  body: {
    flex: 4,
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
