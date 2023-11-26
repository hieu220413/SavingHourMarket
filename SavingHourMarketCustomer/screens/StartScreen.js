import {Text, View, ActivityIndicator, Image} from 'react-native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, useEffect, useCallback} from 'react';
import {API} from '../constants/api';
import {COLORS} from '../constants/theme';
import {useFocusEffect} from '@react-navigation/native';
import database from '@react-native-firebase/database';

const StartScreen = ({navigation}) => {
  const [systemStatus, setSystemStatus] = useState(1);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);

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
  //       return;
  //     }

  //     navigation.navigate('Start');
  //   } else {
  //     //   navigation.navigate('Login');
  //     navigation.navigate('Start');
  //   }
  // };

  useFocusEffect(
    useCallback(() => {
      database().ref(`systemStatus`).off('value');
      database()
        .ref('systemStatus')
        .on('value', async snapshot => {
          console.log('System status: ', snapshot.val());
          if (snapshot.val() === 0) {
            setSystemStatus(snapshot.val());
            setLoading(false);
          } else {
            // setSystemStatus(snapshot.val());
            setLoading(false);
            navigation.reset({
              index: 0,
              routes: [{name: 'Start'}],
            });
          }
        });
    }, []),
  );

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
