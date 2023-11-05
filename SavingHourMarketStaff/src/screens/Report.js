import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {COLORS} from '../constants/theme';
import {icons} from '../constants';
import {useFocusEffect} from '@react-navigation/native';
import {API} from '../constants/api';
import {format} from 'date-fns';
import LoadingScreen from '../components/LoadingScreen';
import {
  ExpandableCalendar,
  AgendaList,
  CalendarProvider,
  WeekCalendar,
} from 'react-native-calendars';

const Report = () => {
  const [initializing, setInitializing] = useState(true);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(
    format(Date.parse(new Date().toString()), 'yyyy-MM-dd'),
  );

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
            <ExpandableCalendar allowShadow={false} />
          </CalendarProvider>
        </View>
        <View style={styles.footer}>
          <View style={styles.wrap_container}>
            <View style={styles.wrap}>
              <View style={{flex: 1}}>
                <Text style={styles.texts}>Tổng đơn hàng trong ngày:</Text>
              </View>
              <View
                style={{
                  flex: 2,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={styles.numbers}>80</Text>
              </View>
            </View>
            <View style={styles.wrap}>
              <View style={{flex: 1}}>
                <Text style={styles.texts}>Tổng đơn hàng trong tháng:</Text>
              </View>
              <View
                style={{
                  flex: 2,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={styles.numbers}>80</Text>
              </View>
            </View>
            <View style={styles.wrap}>
              <View style={{flex: 1}}>
                <Text style={styles.texts}>Số đơn hàng chưa đóng gói:</Text>
              </View>
              <View
                style={{
                  flex: 2,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={styles.numbers}>80</Text>
              </View>
            </View>
            <View style={styles.wrap}>
              <View style={{flex: 1}}>
                <Text style={styles.texts}>Tổng đơn hàng:</Text>
              </View>
              <View
                style={{
                  flex: 2,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={styles.numbers}>80</Text>
              </View>
            </View>
          </View>
        </View>
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
    flex: 1,
    // backgroundColor: 'orange',
    paddingHorizontal: 20,
  },
  body: {
    flex: 1.9,
    zIndex: 50,
  },
  footer: {
    flex: 6.2,
    paddingHorizontal: 20,
    // backgroundColor: 'pink',
  },
  wrap_container: {
    display: 'flex',
    flexWrap: 'wrap',
    height: '100%',
    paddingVertical: 10,
    alignContent: 'center',
    gap: 10,
  },
  wrap: {
    width: '47%',
    height: '40%',
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
