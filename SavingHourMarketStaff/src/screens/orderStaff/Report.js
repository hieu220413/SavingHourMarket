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
import {BarChart, LineChart, PieChart} from 'react-native-gifted-charts';

const Report = ({navigation}) => {
  const barData = [
    {
      value: 40,
      label: 'Jan',
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: {color: 'gray'},
      frontColor: '#177AD5',
    },
    {value: 20, frontColor: '#ED6665'},
    {
      value: 50,
      label: 'Feb',
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: {color: 'gray'},
      frontColor: '#177AD5',
    },
    {value: 40, frontColor: '#ED6665'},
    {
      value: 75,
      label: 'Mar',
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: {color: 'gray'},
      frontColor: '#177AD5',
    },
    {value: 25, frontColor: '#ED6665'},
    {
      value: 30,
      label: 'Apr',
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: {color: 'gray'},
      frontColor: '#177AD5',
    },
    {value: 20, frontColor: '#ED6665'},
    {
      value: 60,
      label: 'May',
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: {color: 'gray'},
      frontColor: '#177AD5',
    },
    {value: 40, frontColor: '#ED6665'},
    {
      value: 65,
      label: 'Jun',
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: {color: 'gray'},
      frontColor: '#177AD5',
    },
    {value: 30, frontColor: '#ED6665'},
  ];

  const [initializing, setInitializing] = useState(true);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(
    format(Date.parse(new Date().toString()), 'yyyy-MM-dd'),
  );
  const [loading, setLoading] = useState(false);
  const [dayReport, setDayReport] = useState(null);
  const [data, setData] = useState([
    {value: 0, label: 'Jan', month: 1},
    {value: 0, label: 'Feb', month: 2},
    {value: 0, label: 'Mar', month: 3},
    {value: 0, label: 'Apr', month: 4},
    {value: 0, label: 'May', month: 5},
    {value: 0, label: 'Jun', month: 6},
    {value: 0, label: 'Jul', month: 7},
    {value: 0, label: 'Aug', month: 8},
    {value: 0, label: 'Sep', month: 9},
    {value: 0, label: 'Oct', month: 10},
    {value: 0, label: 'Nov', month: 11},
    {value: 0, label: 'Dec', month: 12},
  ]);
  const [yearReport, setYearReport] = useState(null);

  const renderTitle = () => {
    return (
      <View style={{marginVertical: 30}}>
        <Text
          style={{
            color: 'black',
            fontSize: 18,
            fontWeight: 'bold',
            textAlign: 'center',
          }}>
          BÁO CÁO TỪNG NĂM
        </Text>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: 24,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
      // console.log(currentUser);
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
      const fetchDay = async () => {
        if (auth().currentUser) {
          const tokenId = await auth().currentUser.getIdToken();
          if (tokenId) {
            setLoading(true);

            fetch(
              `${API.baseURL}/api/order/packageStaff/getReportOrders?mode=DATE&startDate=${date}&endDate=${date}`,
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
                // console.log(respond.ordersReportByDay);
                if (respond.ordersReportByDay.length !== 0) {
                  setDayReport(respond.ordersReportByDay[0]);
                } else {
                  setDayReport(null);
                }
                setLoading(false);
              })
              .catch(err => {
                console.log(err);
                setLoading(false);
              });
          }
        }
      };

      const fetchMonth = async () => {
        if (auth().currentUser) {
          const tokenId = await auth().currentUser.getIdToken();
          if (tokenId) {
            setLoading(true);
            const resetData = [
              {value: 0, label: 'Jan', month: 1},
              {value: 0, label: 'Feb', month: 2},
              {value: 0, label: 'Mar', month: 3},
              {value: 0, label: 'Apr', month: 4},
              {value: 0, label: 'May', month: 5},
              {value: 0, label: 'Jun', month: 6},
              {value: 0, label: 'Jul', month: 7},
              {value: 0, label: 'Aug', month: 8},
              {value: 0, label: 'Sep', month: 9},
              {value: 0, label: 'Oct', month: 10},
              {value: 0, label: 'Nov', month: 11},
              {value: 0, label: 'Dec', month: 12},
            ];
            fetch(
              `${
                API.baseURL
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
              .then(res => res.json())
              .then(respond => {
                // console.log(respond.ordersReportByMonth);
                const year = date.slice(0, 4);
                const keyToAccess = year; // Change this to "2024" to access the 2024 array
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
                setLoading(false);
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
            fetch(`${API.baseURL}/api/order/packageStaff/getReportOrders?mode=YEAR`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${tokenId}`,
              },
            })
              .then(res => res.json())
              .then(respond => {
                const respondArr = respond.ordersReportByYear;
                console.log(respondArr);
                let newData = [];
                respondArr.map(item => {
                  const obj1 = {
                    value: item.successCount,
                    label: item.year,
                    spacing: 2,
                    labelWidth: 30,
                    labelTextStyle: {color: 'gray'},
                    frontColor: '#177AD5',
                  };
                  const obj2 = {
                    value: item.cancelCount + item.failCount,
                    frontColor: '#ED6665',
                  };

                  newData.push(obj1, obj2);
                });
                console.log(newData);
                setYearReport(newData);
                setLoading(false);
              })
              .catch(err => {
                console.log(err);
                setLoading(false);
              });
          }
        }
      };
      fetchYear();
      fetchMonth();
      fetchDay();
    }, [date]),
  );

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss;
        setOpen(false);
      }}
      accessible={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.pagenameAndLogout}>
            <View style={styles.pageName}>
              <Text style={{fontSize: 25, color: 'black', fontWeight: 'bold'}}>
                Thống kê
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
                  source={icons.userCircle}
                />
              </TouchableOpacity>
              {open && (
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
          <CalendarProvider
            style={{width: '100%'}}
            date={date}
            onDateChanged={e => {
              console.log(e);
              setDate(e);
            }}
            // onMonthChange={onMonthChange}
            // todayBottomMargin={16}
          >
            <ExpandableCalendar
              testID="expandableCalendar"
              allowShadow={false}
              disablePan={true}
              hideKnob={true}
            />
          </CalendarProvider>
        </View>
        <View style={styles.footer}>
          <ScrollView style={{marginBottom: 80, paddingTop: 10}}>
            <View style={styles.wrap_container}>
              <View style={styles.wrap}>
                <View style={{flex: 1}}>
                  <Text style={styles.texts}>Tổng số đơn hàng trong ngày:</Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={styles.numbers}>
                    {dayReport
                      ? dayReport.cancelCount +
                        dayReport.deliveringCount +
                        dayReport.failCount +
                        dayReport.packagedCount +
                        dayReport.packagingCount +
                        dayReport.successCount
                      : '0'}
                  </Text>
                </View>
              </View>

              <View style={styles.wrap}>
                <View style={{flex: 1}}>
                  <Text style={styles.texts}>Số đơn hàng giao thành công:</Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={styles.numbers}>
                    {dayReport ? dayReport.successCount : '0'}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{paddingTop: 10}}>
              <View
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingBottom:30
                }}>
                <Text
                  style={{fontSize: 18, fontWeight: 'bold', color: 'black'}}>
                  SỐ ĐƠN HÀNG ĐÃ GIAO
                </Text>
              </View>
              <BarChart
                disablePress={true}
                data={data}
                spacing={10}
                barWidth={20}
                frontColor="red"
                isAnimated
                showYAxisIndices
                // hideRules
                showFractionalValue
              />
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
                  yAxisTextStyle={{color: 'gray'}}
                  noOfSections={3}
                />
              </View>
            </View>
          </ScrollView>
        </View>
        {loading && <LoadingScreen />}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Report;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flex: 0.9,
    // backgroundColor: 'orange',
    paddingHorizontal: 20,
  },
  body: {
    flex: 2.2,
    zIndex: 50,
  },
  footer: {
    flex: 8,
    // paddingHorizontal: 20,
    // backgroundColor: 'red',
  },
  wrap_container: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 10,
    alignContent: 'center',
    gap: 10,
    justifyContent: 'center',
    // backgroundColor: 'pink',
  },
  wrap: {
    width: 190,
    height: 130,
    backgroundColor: 'rgb(240,240,240)',
    borderRadius: 10,
    padding: 10,
    display: 'flex',
  },
  numbers: {
    fontSize: 40,
    color: 'black',
    fontWeight: 'bold',
  },
  texts: {
    fontSize: 18,
    color: 'black',
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
