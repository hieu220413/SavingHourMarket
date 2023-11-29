import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
  Dimensions
} from 'react-native';
import React, { useState, useCallback } from 'react';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../../constants/theme';
import { useFocusEffect } from '@react-navigation/native';
import { API } from '../../constants/api';
import { format } from 'date-fns';
import LoadingScreen from '../../components/LoadingScreen';
import { BarChart } from 'react-native-gifted-charts';
import database from '@react-native-firebase/database';
import { checkSystemState } from '../../common/utils';

const Report = ({ navigation }) => {
  // listen to system state
  useFocusEffect(
    useCallback(() => {
      checkSystemState(navigation);
    }, []),
  );

  const [currentUser, setCurrentUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [pickupPoint, setPickupPoint] = useState(null);
  const [numberOfProcessing, setNumberOfProcessing] = useState(0);
  const [numberOfPackageing, setNumberOfPackaging] = useState(0);
  const [numberOfPackaged, setNumberOfPackaged] = useState(0);
  const [numberOfCancel, setNumberOfCancel] = useState(0);
  const [numberOfDelivering, setNumberOfDelivering] = useState(0);
  const [numberOfSuccess, setNumberOfSuccess] = useState(0);
  const [numberOfFail, setNumberOfFail] = useState(0);
  const [numberTotal, setNumberTotal] = useState(0);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(
    format(Date.parse(new Date().toString()), 'yyyy-MM-dd'),
  );
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([
    { value: 0, label: 'Jan', month: 1 },
    { value: 0, label: 'Feb', month: 2 },
    { value: 0, label: 'Mar', month: 3 },
    { value: 0, label: 'Apr', month: 4 },
    { value: 0, label: 'May', month: 5 },
    { value: 0, label: 'Jun', month: 6 },
    { value: 0, label: 'Jul', month: 7 },
    { value: 0, label: 'Aug', month: 8 },
    { value: 0, label: 'Sep', month: 9 },
    { value: 0, label: 'Oct', month: 10 },
    { value: 0, label: 'Nov', month: 11 },
    { value: 0, label: 'Dec', month: 12 },
  ]);
  const [yearReport, setYearReport] = useState(null);
  const ChartWith = Dimensions.get('window').width * 0.25 ;
  const countTotalOrder = async () => {
    setLoading(true);
    const tokenId = await auth().currentUser.getIdToken();
    if (tokenId) {
      let numberOfProcessing = 0;
      let numberOfPackageing = 0;
      let numberOfPackaged = 0;
      let numberOfCancel = 0;
      let numberOfDelivering = 0;
      let numberOfSuccess = 0;
      let numberOfFail = 0;
      let numberTotal = 0;
      await fetch(
        `${API.baseURL
        }/api/order/packageStaff/getOrders?deliveryMethod=DOOR_TO_DOOR&${pickupPoint && pickupPoint.id ? `pickupPointId=${pickupPoint.id}` : ''
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
          // console.log('order', respond);
          if (respond.error) {
            console.log(err);
            setLoading(false);
            return;
          }
          const statusCounts = {};

          respond.forEach(order => {
            const status = order.status;
            if (statusCounts[status]) {
              statusCounts[status]++;
            } else {
              statusCounts[status] = 1;
            }
          });
          Object.keys(statusCounts).map(orderStatus => {
            if (orderStatus == '0') {
              console.log('Processing', statusCounts[orderStatus]);
              numberOfProcessing =
                numberOfProcessing + statusCounts[orderStatus];
            }
            if (orderStatus == '1') {
              console.log('Packaging', statusCounts[orderStatus]);
              numberOfPackageing =
                numberOfPackageing + statusCounts[orderStatus];
            }
            if (orderStatus == '2') {
              console.log('Packaged', statusCounts[orderStatus]);
              numberOfPackaged = numberOfPackaged + statusCounts[orderStatus];
            }
            if (orderStatus == '3') {
              console.log('Delivering', statusCounts[orderStatus]);
              numberOfDelivering =
                numberOfDelivering + statusCounts[orderStatus];
            }
            if (orderStatus == '4') {
              console.log('Success', statusCounts[orderStatus]);
              numberOfSuccess = numberOfSuccess + statusCounts[orderStatus];
            }
            if (orderStatus == '5') {
              console.log('Fail', statusCounts[orderStatus]);
              numberOfFail = numberOfFail + statusCounts[orderStatus];
            }
            if (orderStatus == '6') {
              console.log('Cancel', statusCounts[orderStatus]);
              numberOfCancel = numberOfCancel + statusCounts[orderStatus];
            }
            numberTotal = numberTotal + statusCounts[orderStatus];
          });
        })
        .catch(err => {
          setLoading(false);
          console.log(err);
        });

      await fetch(
        `${API.baseURL
        }/api/order/packageStaff/getOrders?deliveryMethod=PICKUP_POINT&${pickupPoint && pickupPoint.id ? `pickupPointId=${pickupPoint.id}` : ''
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
          // console.log('order', respond);
          if (respond.error) {
            setLoading(false);
            console.log(err);
            return;
          }
          const statusCounts = {};
          respond.forEach(order => {
            const status = order.status;
            if (statusCounts[status]) {
              statusCounts[status]++;
            } else {
              statusCounts[status] = 1;
            }
          });
          Object.keys(statusCounts).map(orderStatus => {
            if (orderStatus == '0') {
              console.log('Processing GR', statusCounts[orderStatus]);
              numberOfProcessing =
                numberOfProcessing + statusCounts[orderStatus];
            }
            if (orderStatus == '1') {
              console.log('Packaging Gr', statusCounts[orderStatus]);
              numberOfPackageing =
                numberOfPackageing + statusCounts[orderStatus];
            }
            if (orderStatus == '2') {
              console.log('Packaged Gr', statusCounts[orderStatus]);
              numberOfPackaged = numberOfPackaged + statusCounts[orderStatus];
            }
            if (orderStatus == '3') {
              console.log('Delivering Gr', statusCounts[orderStatus]);
              numberOfDelivering =
                numberOfDelivering + statusCounts[orderStatus];
            }
            if (orderStatus == '4') {
              console.log('Success Gr', statusCounts[orderStatus]);
              numberOfSuccess = numberOfSuccess + statusCounts[orderStatus];
            }
            if (orderStatus == '5') {
              console.log('Fail Gr', statusCounts[orderStatus]);
              numberOfFail = numberOfFail + statusCounts[orderStatus];
            }
            if (orderStatus == '6') {
              console.log('Cancel Gr', statusCounts[orderStatus]);
              numberOfCancel = numberOfCancel + statusCounts[orderStatus];
            }
            numberTotal = numberTotal + statusCounts[orderStatus];
          });
        })
        .catch(err => {
          setLoading(false);
          console.log(err);
        });

      setNumberOfProcessing(numberOfProcessing);
      setNumberOfPackaging(numberOfPackageing);
      setNumberOfPackaged(numberOfPackaged);
      setNumberOfDelivering(numberOfDelivering);
      setNumberOfSuccess(numberOfSuccess);
      setNumberOfFail(numberOfFail);
      setNumberOfCancel(numberOfCancel);
      setNumberTotal(numberTotal);
      setLoading(false);
    }
  };

  const fetchMonth = async () => {
    if (auth().currentUser) {
      const tokenId = await auth().currentUser.getIdToken();
      if (tokenId) {
        setLoading(true);
        const resetData = [
          { value: 0, label: 'Jan', month: 1 },
          { value: 0, label: 'Feb', month: 2 },
          { value: 0, label: 'Mar', month: 3 },
          { value: 0, label: 'Apr', month: 4 },
          { value: 0, label: 'May', month: 5 },
          { value: 0, label: 'Jun', month: 6 },
          { value: 0, label: 'Jul', month: 7 },
          { value: 0, label: 'Aug', month: 8 },
          { value: 0, label: 'Sep', month: 9 },
          { value: 0, label: 'Oct', month: 10 },
          { value: 0, label: 'Nov', month: 11 },
          { value: 0, label: 'Dec', month: 12 },
        ];
        fetch(
          `${API.baseURL
          }/api/order/packageStaff/getReportOrders?mode=MONTH&year=${date.slice(
            0,
            4,
          )}`,
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
            // console.log(respond.ordersReportByMonth);
            const year = date.slice(0, 4);
            const keyToAccess = year;
            // console.log(typeof(keyToAccess));
            const arrayForKey = respond.ordersReportByMonth[keyToAccess];
            // console.log(arrayForKey);
            let newData = [...resetData];
            arrayForKey.map((item, i) => {
              const index = resetData.findIndex(
                sub => sub.month === item.month,
              );

              newData[index] = {
                ...newData[index],
                value: item.successCount,
              };
            });
            setData(newData);
          })
          .catch(err => {
            console.log(err);
            setLoading(false);
          });
      }
    }
  };

  const fetchYear = async () => {
    if (auth().currentUser) {
      const tokenId = await auth().currentUser.getIdToken();
      if (tokenId) {
        setLoading(true);
        fetch(
          `${API.baseURL}/api/order/packageStaff/getReportOrders?mode=YEAR`,
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
            const respondArr = respond.ordersReportByYear;
            // console.log(respondArr);
            let newData = [];
            respondArr.map(item => {
              const obj1 = {
                value: item.successCount,
                label: item.year,
                spacing: 2,
                labelWidth: 30,
                labelTextStyle: { color: 'gray' },
                frontColor: '#177AD5',
              };
              const obj2 = {
                value: item.cancelCount + item.failCount,
                frontColor: '#ED6665',
              };

              newData.push(obj1, obj2);
            });
            // console.log(newData);
            setYearReport(newData);
          })
          .catch(err => {
            console.log(err);
            setLoading(false);
          });
      }
    }
  };

  const renderTitle = () => {
    return (
      <View style={{ marginVertical: 10 }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: 15,
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                height: 12,
                width: 12,
                borderRadius: 6,
                backgroundColor: '#177AD5',
                marginRight: 8,
              }}
            />
            <Text
              style={{
                height: 16,
                color: 'grey',
              }}>
              Đơn thành công
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                height: 12,
                width: 12,
                borderRadius: 6,
                backgroundColor: '#ED6665',
                marginRight: 8,
              }}
            />
            <Text
              style={{
                height: 16,
                color: 'grey',
              }}>
              Đơn thất bại
            </Text>
          </View>
        </View>
      </View>
    );
  };

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
  //         routes: [{ name: 'Login' }],
  //       });
  //       return;
  //     }

  //   } else {
  //     // no sessions found.
  //     console.log('user is not logged in');
  //     await AsyncStorage.removeItem('userInfo');
  //     // navigation.navigate('Login');
  //     navigation.reset({
  //       index: 0,
  //       routes: [{ name: 'Login' }],
  //     });
  //   }
  // };

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
          // trick useEffect to trigger
          setPickupPoint({
            id: null,
          });
        }
      };
      initPickupPoint();
    }, []),
  );

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
      fetchYear();
      fetchMonth();
      countTotalOrder();
    }, [date]),
  );

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss;
        setOpen(false);
      }}
      accessible={false}>
      <>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 80 }}>
          <ImageBackground
            source={require('../../assets/image/backgroundStaff.jpeg')}
            style={styles.container}>
            <View style={styles.header}>
              <View style={styles.areaAndLogout}>
                <View>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: '600',
                      color: 'black',
                      marginTop: 10,
                    }}>
                    Xin chào! {currentUser?.fullName},
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontStyle: 'italic',
                      color: 'black',
                      marginBottom: 10,
                      maxWidth: '93%'
                    }}>
                    Hãy đóng gói những đơn hàng thật kĩ càng nhé!
                  </Text>
                </View>
                <View style={styles.logout}>
                  <TouchableOpacity
                    onPress={() => {
                      setOpen(!open);
                    }}>
                    <Image
                      resizeMode="contain"
                      style={{ width: 50, height: 50, borderRadius: 75 }}
                      source={{
                        uri: currentUser?.avatarUrl,
                      }}
                    />
                  </TouchableOpacity>
                  {open && (
                    <TouchableOpacity
                      style={{
                        position: 'absolute',
                        bottom: '-17%',
                        right: '-12%',
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
            </View>

            <View style={styles.body}>
              <View
                style={{
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                }}>
                <View
                  style={{
                    paddingTop: 10,
                    paddingBottom: 20,
                    marginTop: 10,
                  }}>
                  <View style={styles.wrapTotal}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 20, color: 'black' }}>
                        Tổng số đơn hàng: {numberTotal}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.wrap_container}>
                    <View style={styles.wrapProcessing}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.texts}>Đơn chờ xác nhận:</Text>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text style={styles.numbers}>{numberOfProcessing}</Text>
                      </View>
                    </View>
                    <View style={styles.wrapPackaging}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.texts}>Đơn đang đóng gói:</Text>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text style={styles.numbers}>{numberOfPackageing}</Text>
                      </View>
                    </View>
                    <View style={styles.wrapPackaged}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.texts}>Đơn đã đóng gói:</Text>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text style={styles.numbers}>{numberOfPackaged}</Text>
                      </View>
                    </View>
                    <View style={styles.wrapDelivering}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.texts}>Đơn đang giao:</Text>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text style={styles.numbers}>{numberOfDelivering}</Text>
                      </View>
                    </View>
                    <View style={styles.wrapSuccess}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.texts}>Đơn đã giao:</Text>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text style={styles.numbers}>{numberOfSuccess}</Text>
                      </View>
                    </View>
                    <View style={styles.wrapCancel}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.texts}>Đơn đã huỷ:</Text>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text style={styles.numbers}>{numberOfCancel}</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    backgroundColor: 'white',
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 2,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 5,
                  }}>
                  <View
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingBottom: 20,
                      paddingTop: 20,
                    }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: 'black',
                      }}>
                      SỐ ĐƠN HÀNG ĐÃ GIAO
                    </Text>
                  </View>
                  <View
                    style={{
                      paddingVertical: 30,
                      marginHorizontal: 15,
                      marginBottom: 20,
                      borderRadius: 20,
                      backgroundColor: 'white',
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 4,
                      elevation: 3,

                    }}>
                    <BarChart
                      width={Dimensions.get('window').width * 0.8}
                      height={200}
                      disablePress={true}
                      data={data}
                      spacing={5}
                      barWidth={Dimensions.get('window').width * 0.0545}
                      frontColor={COLORS.tabIcon}
                      isAnimated
                      showYAxisIndices
                      hideRules
                      hideOrigin
                      showFractionalValue
                    />
                  </View>
                  <View
                    style={{
                      paddingTop: 10,
                      borderRadius: 20,
                      backgroundColor: 'white',
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 4,
                      elevation: 3,
                      marginHorizontal: 15,
                      marginBottom: 20,
                    }}>
                    <View
                      style={{
                        paddingBottom: 40,
                        borderRadius: 10,
                      }}>
                      {renderTitle()}
                      <BarChart
                        data={yearReport}
                        barWidth={8}
                        spacing={24}
                        roundedTop
                        roundedBottom
                        hideRules
                        disablePress={true}
                        xAxisThickness={0}
                        yAxisThickness={0}
                        yAxisTextStyle={{ color: 'gray' }}
                        noOfSections={3}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </ImageBackground>
        </ScrollView>
        {loading && <LoadingScreen />}
      </>
    </TouchableWithoutFeedback>
  );
};

export default Report;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  header: {
    flex: 0.5,
    paddingHorizontal: '4%',
    marginTop: "5%",
  },
  body: {
    flex: 10,
    zIndex: 50,
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
    paddingHorizontal: 20,
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

  wrap_container: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'center',
    gap: 10,
    justifyContent: 'center',
    marginTop: 10
    // backgroundColor: 'pink',
  },
  wrapTotal: {
    width: 250,
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    opacity: 0.9,
    borderRadius: 20,
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
  },
  wrapProcessing: {
    width: '24%',
    height: '47%',
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
  },
  wrapPackaging: {
    width: '24%',
    height: '47%',
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
  },
  wrapPackaged: {
    width: '24%',
    height: '47%',
    backgroundColor: '#8ec0ef',
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
  },
  wrapCancel: {
    width: '24%',
    height: '47%',
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
  },
  wrapDelivering: {
    width: '24%',
    height: '47%',
    backgroundColor: 'white',
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
    elevation: 6,
  },
  wrapSuccess: {
    width: '24%',
    height: '47%',
    backgroundColor: '#bee8c8',
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
  },
  numbers: {
    fontSize: 40,
    color: 'black',
    fontWeight: 'bold',
  },
  texts: {
    fontSize: 14,
    color: 'black',
  },
  pagenameAndLogout: {
    paddingTop: 18,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
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
    paddingHorizontal: 15,
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
