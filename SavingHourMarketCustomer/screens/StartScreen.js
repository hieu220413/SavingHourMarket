/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import { Text, View, ActivityIndicator, Image } from 'react-native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect, useCallback } from 'react';
import { API } from '../constants/api';
import { COLORS } from '../constants/theme';
import { useFocusEffect } from '@react-navigation/native';
import database from '@react-native-firebase/database';
import Geolocation from '@react-native-community/geolocation';

const StartScreen = ({ navigation }) => {
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
            Geolocation.getCurrentPosition(
              position => {
                const currentLongitude = position.coords.longitude;
                const currentLatitude = position.coords.latitude;
                // get nearest pick up point by current lat,long
                fetch(
                  `${API.baseURL}/api/pickupPoint/getWithSortAndSuggestion?latitude=${currentLatitude}&longitude=${currentLongitude}`,
                )
                  .then(res => res.json())
                  .then(response => {
                    // setPickupPoint(response.sortedPickupPointSuggestionList[0]);
                    setLoading(false);
                    navigation.reset({
                      index: 0,
                      routes: [{ name: 'Start' }],
                    });
                    setLoading(false);
                  })
                  .catch(err => {
                    console.log(err);
                    setLoading(false);
                  }
                  );
              },
              error => {
                console.log(error.message);
              },
              {
                enableHighAccuracy: true,
              },
            );
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
            bottom: '30%',
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
