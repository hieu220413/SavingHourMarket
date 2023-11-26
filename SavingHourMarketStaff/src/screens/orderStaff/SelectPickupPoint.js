/* eslint-disable prettier/prettier */
import {
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  Keyboard,
  TouchableOpacity,
  Image,
} from 'react-native';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
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
import database from '@react-native-firebase/database';
import {checkSystemState} from '../../common/utils';

const SelectPickupPoint = ({navigation, route}) => {
  // listen to system state
  useFocusEffect(
    useCallback(() => {
      checkSystemState();
    }, []),
  );

  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [pickupPointList, setPickupPointList] = useState([]);

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
  //     //   console.log('currentUser', currentUser);
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

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        if (auth().currentUser) {
          const tokenId = await auth().currentUser.getIdToken();
          if (tokenId) {
            setLoading(true);

            fetch(`${API.baseURL}/api/staff/getInfo`, {
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
              .then(respond => {
                console.log(respond.pickupPoint);
                if (respond.error) {
                  setLoading(false);
                  return;
                }
                setPickupPointList(respond.pickupPoint);
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
    }, []),
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              if (
                route.params.isFromOrderGroupRoute &&
                route.params.isFromOrderGroupRoute === true
              ) {
                navigation.navigate('OrderGroupForOrderStaff', {
                  goBackFromPickupPoint: true,
                });
                return;
              }
              navigation.goBack();
            }}>
            <Image
              source={icons.leftArrow}
              resizeMode="contain"
              style={{width: 35, height: 35, tintColor: COLORS.primary}}
            />
          </TouchableOpacity>
          <Text
            style={{
              paddingLeft: 14,
              fontSize: 25,
              fontWeight: 'bold',
              color: 'black',
              fontFamily: 'Roboto',
            }}>
            Chọn điểm nhận hàng
          </Text>
        </View>
        <View style={styles.body}>
          <Text
            style={{
              fontSize: 20,
              color: 'black',
              fontFamily: 'Roboto',
              fontWeight: 'bold',
              paddingBottom: 20,
              borderBottomColor: '#decbcb',
              borderBottomWidth: 0.75,
              marginHorizontal: 10,
            }}>
            Các điểm giao hàng bạn phụ trách:
          </Text>
          <ScrollView
            style={{
              paddingHorizontal: 15,
            }}>
            {pickupPointList.map(item => (
              <TouchableOpacity
                key={item.id}
                onPress={async () => {
                  //   storedPickupPoint(item);
                  await AsyncStorage.setItem(
                    'pickupPoint',
                    JSON.stringify(item),
                  );
                  // route.params.setPickupPoint(item);
                  if (
                    route.params.isFromOrderGroupRoute &&
                    route.params.isFromOrderGroupRoute === true
                  ) {
                    console.log('is OrderGroupForOrderStaff');
                    navigation.navigate('OrderGroupForOrderStaff');
                    return;
                  }
                  if (
                    route.params.isFromProductPackagingRoute &&
                    route.params.isFromProductPackagingRoute === true
                  ) {
                    console.log('is Product');
                    navigation.navigate('Product');
                    return;
                  }

                  navigation.navigate('Home');
                }}
                style={{
                  paddingVertical: 15,
                  borderBottomColor: '#decbcb',
                  borderBottomWidth: 0.75,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 15,
                    flex: 1,
                  }}>
                  <Image
                    resizeMode="contain"
                    style={{width: 25, height: 25}}
                    source={icons.location}
                  />
                  <Text
                    style={{
                      fontSize: 17,
                      color: 'black',
                      fontFamily: 'Roboto',
                      width: '70%',
                    }}>
                    {item.address}
                  </Text>
                  <Text style={{fontSize: 14}}>{item.distance}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        {loading && <LoadingScreen />}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SelectPickupPoint;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 15,
    // backgroundColor: 'pink',
  },
  body: {
    flex: 11,
  },
});
