import {Text, View, ActivityIndicator, Image} from 'react-native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, useEffect} from 'react';
import {API} from '../constants/api';
import {COLORS} from '../constants/theme';

const StartScreen = ({navigation}) => {
  const [systemStatus, setSystemStatus] = useState(1);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);

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
        return;
      }

      navigation.navigate('Start');
    } else {
      //   navigation.navigate('Login');
      navigation.navigate('Start');
    }
  };

  useEffect(() => {
    setLoading(true);
    fetch(`${API.baseURL}/api/configuration/getConfiguration`)
      .then(res => res.json())
      .then(data => {
        // console.log("san pham", data.productList[0].supermarket);
        console.log(data);
        if (data.systemStatus == 0) {
          setSystemStatus(data.systemStatus);
        } else {
          const subscriber = auth().onAuthStateChanged(
            async userInfo => await onAuthStateChange(userInfo),
          );
          return subscriber;
        }
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
      }}>
      <Image
        resizeMode="contain"
        style={{
          width: '70%',
          height: '30%',
          backgroundColor: 'white',
          position: 'absolute',
          top: '30%',
        }}
        source={require('../assets/image/logo.png')}
      />
      {loading && (
        <ActivityIndicator
          style={{
            position: 'absolute',
            bottom: '35%',
          }}
          color={COLORS.primary}
          size="large"
        />
      )}
      {systemStatus === 0 && (
        <Text
          style={{
            position: 'absolute',
            bottom: '35%',
            color: COLORS.red,
          }}>
          Hệ thống đang được bảo trì!
        </Text>
      )}
    </View>
  );
};

export default StartScreen;
