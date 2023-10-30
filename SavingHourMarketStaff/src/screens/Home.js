import {View, Text, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = ({navigation}) => {
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
        navigation.navigate('Login');

        return;
      }
    } else {
      // no sessions found.
      console.log('user is not logged in');
      navigation.navigate('Login');
    }
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(
      async userInfo => await onAuthStateChange(userInfo),
    );

    return subscriber;
  }, []);
  return (
    <View>
      <Text>Home</Text>
      <TouchableOpacity
        onPress={() => {
          auth()
            .signOut()
            .then(async () => {
              await AsyncStorage.removeItem('userInfo');
            })
            .catch(e => console.log(e));
        }}>
        <Text>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;
