import React, {useCallback, useState, useEffect} from 'react';
import {View, TouchableOpacity, Image, Text, StyleSheet} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {icons} from '../../constants';
import {COLORS} from '../../constants/theme';
import {useFocusEffect} from '@react-navigation/native';
import {API} from '../../constants/api';
import LoadingScreen from '../../components/LoadingScreen';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OrderListForReport = ({navigation, route}) => {
  const {type, mode, date} = route.params;
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);

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
      //   console.log('currentUser', currentUser);
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
      const fetchData = async () => {
        if (auth().currentUser) {
          const tokenId = await auth().currentUser.getIdToken();
          if (tokenId) {
            setLoading(true);
            fetch(
              `${API.baseURL}/api/productConsolidationArea/getAllForStaff`,
              {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${tokenId}`,
                },
              },
            )
              .then(res => res.json())
              .then(response => {
                setProductConsolidationAreaList(response);
                setLoading(false);
              })
              .catch(err => {
                console.log(err);
                setLoading(false);
              });
          }
        }
      };
    //   fetchData();
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
            {type === 'success' && 'Đơn thành công'}
            {type === 'delivering' && 'Đơn đang giao'}
            {type === 'fail' && 'Đơn trả hàng'}
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
            {type === 'success' && 'Đơn giao thành công'}
            {type === 'delivering' && 'Đơn đang giao'}
            {type === 'fail' && 'Đơn trả hàng'}
          </Text>
          <Text>{date}</Text>
        </View>
      </ScrollView>
      {loading && <LoadingScreen />}
    </>
  );
};

export default OrderListForReport;

const styles = StyleSheet.create({});
