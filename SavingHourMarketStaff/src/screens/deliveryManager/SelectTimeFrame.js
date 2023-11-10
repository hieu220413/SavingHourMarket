/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */

import React, {useCallback, useState, useEffect} from 'react';
import {View, TouchableOpacity, Image, Text} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {icons} from '../../constants';
import {COLORS} from '../../constants/theme';
import {useFocusEffect} from '@react-navigation/native';
import {API} from '../../constants/api';
import LoadingScreen from '../../components/LoadingScreen';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SelectTimeFrame = ({navigation, route}) => {
  const [initializing, setInitializing] = useState(true);
  const [tokenId, setTokenId] = useState(null);
  const [timeFrameList, setTimeFrameList] = useState([]);
  const [loading, setLoading] = useState(false);

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

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        if (auth().currentUser) {
          const tokenId = await auth().currentUser.getIdToken();
          if (tokenId) {
            setLoading(true);
            fetch(`${API.baseURL}/api/timeframe/getForHomeDelivery`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${tokenId}`,
              },
            })
              .then(res => res.json())
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
      <ScrollView>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            flexDirection: 'row',
            gap: 20,
            marginBottom: 30,
            backgroundColor: '#ffffff',
            padding: 20,
            elevation: 4,
          }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={icons.leftArrow}
              resizeMode="contain"
              style={{width: 35, height: 35, tintColor: COLORS.primary}}
            />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 25,
              textAlign: 'center',
              color: '#000000',
              fontWeight: 'bold',
              fontFamily: 'Roboto',
            }}>
            Chọn khung giờ
          </Text>
        </View>
        <View style={{backgroundColor: 'white', padding: 20}}>
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
          {/* Time Frames */}
          {timeFrameList.map(item => (
            <TouchableOpacity
              key={item.id}
              onPress={() => {
                route.params.setTimeFrame(item);
                navigation.navigate('Batching');
              }}
              style={{
                paddingVertical: 15,
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
                    fontSize: 17,
                    color: 'black',
                    fontFamily: 'Roboto',
                  }}>
                  {item.fromHour.slice(0, 5)} đến {item.toHour.slice(0, 5)}
                </Text>
                <Text
                  style={{
                    fontSize: 17,
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
