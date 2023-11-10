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

const Batching = ({navigation}) => {
  const [initializing, setInitializing] = useState(true);
  const [tokenId, setTokenId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [date, setDate] = useState(null);
  const [timeFrame, setTimeFrame] = useState(null);

  const onAuthStateChange = async userInfo => {
    setLoading(true);
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
        setLoading(false);
        return;
      }

      const token = await auth().currentUser.getIdToken();
      setTokenId(token);
      setLoading(false);
    } else {
      // no sessions found.
      console.log('user is not logged in');
      setLoading(false);
    }
  };

  useEffect(() => {
    // auth().currentUser.reload()
    const subscriber = auth().onAuthStateChanged(
      async userInfo => await onAuthStateChange(userInfo),
    );
    return subscriber;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss;
        setShowLogout(false);
      }}
      accessible={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.pagenameAndLogout}>
            <View style={styles.pageName}>
              <Text style={{fontSize: 25, color: 'black', fontWeight: 'bold'}}>
                Gom đơn giao tận nhà
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
                  source={icons.userCircle}
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
        </View>
        <View style={styles.body}>
          <View>
            <Text style={{fontSize: 20, fontWeight: '500', color: 'black'}}>
              Tạo nhóm đơn hàng :
            </Text>
            <View
              style={{
                backgroundColor: 'rgb(240,240,240)',
                marginBottom: 20,
                borderRadius: 10,
                marginTop: 10,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 20,
                }}>
                <View style={{flexDirection: 'column', gap: 8}}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      fontFamily: 'Roboto',
                      color: COLORS.primary,
                    }}>
                    Thông tin
                  </Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text
                      style={{
                        fontSize: 17,
                        fontWeight: 'bold',
                        fontFamily: 'Roboto',
                        color: 'black',
                        paddingRight: 10,
                      }}>
                      Ngày giao :
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setOpen(true);
                      }}>
                      <View
                        style={{
                          backgroundColor: '#f5f5f5',
                          // width: '100%',
                          height: 45,
                          borderRadius: 40,
                          paddingHorizontal: 10,
                          // marginTop: 10,
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <View
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 40,
                            flexWrap: 'wrap',
                            // paddingLeft: 5,
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
                              paddingLeft: 10,
                              color: 'black',
                            }}>
                            {date
                              ? format(date, 'dd/MM/yyyy')
                              : 'Chọn ngày giao'}
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
                        setOpen(false);
                        setDate(date);
                      }}
                      onCancel={() => {
                        setDate(null);
                        setOpen(false);
                      }}
                    />
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text
                      style={{
                        fontSize: 17,
                        fontWeight: 'bold',
                        fontFamily: 'Roboto',
                        color: 'black',
                        paddingRight: 10,
                      }}>
                      Khung giờ :
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('SelectTimeFrame', {
                          setTimeFrame,
                        });
                      }}>
                      <View
                        style={{
                          backgroundColor: '#f5f5f5',
                          // width: '100%',
                          height: 45,
                          borderRadius: 40,
                          paddingHorizontal: 10,
                          // marginTop: 10,
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <View
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 40,
                            flexWrap: 'wrap',
                            // paddingLeft: 5,
                          }}>
                          <Image
                            resizeMode="contain"
                            style={{
                              width: 20,
                              height: 20,
                            }}
                            source={icons.time}
                          />
                          <Text
                            style={{
                              fontSize: 16,
                              paddingLeft: 10,
                              color: 'black',
                            }}>
                            {timeFrame
                              ? `${timeFrame?.fromHour.slice(
                                  0,
                                  5,
                                )} đến ${timeFrame?.toHour.slice(0, 5)}`
                              : 'Chọn khung giờ'}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text
                      style={{
                        fontSize: 17,
                        fontWeight: 'bold',
                        fontFamily: 'Roboto',
                        color: 'black',
                        paddingRight: 10,
                      }}>
                      Điểm gom hàng :
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('SelectProductConsolidationArea', {
                          setTimeFrame,
                        });
                      }}>
                      <View
                        style={{
                          backgroundColor: '#f5f5f5',
                          // width: '100%',
                          height: 45,
                          borderRadius: 40,
                          paddingHorizontal: 10,
                          // marginTop: 10,
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <View
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 40,
                            flexWrap: 'wrap',
                            // paddingLeft: 5,
                          }}>
                          <Image
                            resizeMode="contain"
                            style={{
                              width: 20,
                              height: 20,
                            }}
                            source={icons.time}
                          />
                          <Text
                            style={{
                              fontSize: 16,
                              paddingLeft: 10,
                              color: 'black',
                            }}>
                            {timeFrame
                              ? `${timeFrame?.fromHour.slice(
                                  0,
                                  5,
                                )} đến ${timeFrame?.toHour.slice(0, 5)}`
                              : 'Chọn khung giờ'}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
        {loading && <LoadingScreen />}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Batching;

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
    flex: 9,
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
});
