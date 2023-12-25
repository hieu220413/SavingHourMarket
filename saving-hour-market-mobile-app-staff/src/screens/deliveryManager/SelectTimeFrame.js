/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */

import React, {useCallback, useState} from 'react';
import {View, TouchableOpacity, Image, Text} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {icons} from '../../constants';
import {COLORS} from '../../constants/theme';
import {useFocusEffect} from '@react-navigation/native';
import {API} from '../../constants/api';
import LoadingScreen from '../../components/LoadingScreen';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {checkSystemState} from '../../common/utils';

const SelectTimeFrame = ({navigation, route}) => {
  // listen to system state
  useFocusEffect(
    useCallback(() => {
      checkSystemState(navigation);
    }, []),
  );

  const [initializing, setInitializing] = useState(true);
  const [tokenId, setTokenId] = useState(null);
  const [timeFrameList, setTimeFrameList] = useState([]);
  const [loading, setLoading] = useState(false);

  // const onAuthStateChange = async userInfo => {
  //   setLoading(true);
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
  //       setLoading(false);
  //       return;
  //     }

  //     const token = await auth().currentUser.getIdToken();
  //     setTokenId(token);
  //     setLoading(false);
  //   } else {
  //     // no sessions found.
  //     console.log('user is not logged in');
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   // auth().currentUser.reload()
  //   const subscriber = auth().onAuthStateChanged(
  //     async userInfo => await onAuthStateChange(userInfo),
  //   );
  //   return subscriber;
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
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
      };
      fetchData();
    }, []),
  );
  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            flexDirection: 'row',
            gap: 20,
            marginBottom: '7%',
            backgroundColor: '#ffffff',
            padding: '4%',
            elevation: 4,
          }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={icons.leftArrow}
              resizeMode="contain"
              style={{width: 30, height: 30, tintColor: COLORS.primary}}
            />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 24,
              textAlign: 'center',
              color: '#000000',
              fontWeight: 'bold',
              fontFamily: 'Roboto',
            }}>
            Chọn khung giờ
          </Text>
        </View>
        <View style={{backgroundColor: 'white', padding: '5%'}}>
          <Text
            style={{
              fontSize: 20,
              color: 'black',
              fontFamily: 'Roboto',
              fontWeight: 'bold',
              marginBottom: '5%',
            }}>
            Khung giờ
          </Text>
          {/* Time Frames */}
          {timeFrameList.map(item => (
            <TouchableOpacity
              key={item.id}
              onPress={() => {
                route.params.setTimeFrame(item);
                navigation.navigate('OrderListForManager');
              }}
              style={{
                paddingVertical: '5%',
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
                <Text
                  style={{
                    fontSize: 16,
                    color: 'black',
                    fontFamily: 'Roboto',
                  }}>
                  {item.fromHour.slice(0, 5)} đến {item.toHour.slice(0, 5)}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    color: 'black',
                    fontFamily: 'Roboto',
                  }}>
                  {item.dayOfWeek === 0 && 'Mỗi ngày'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      {loading && <LoadingScreen />}
    </>
  );
};

export default SelectTimeFrame;
