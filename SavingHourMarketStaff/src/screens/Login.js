import {View, Text, Alert} from 'react-native';
import React, {useState, useEffect} from 'react';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API} from '../constants/api';

const Login = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [initializing, setInitializing] = useState(true);

  const onAuthStateChange = async userInfo => {
    // console.log(userInfo);
    if (initializing) {
      setInitializing(false);
    }
    if (userInfo) {
      console.log('a');
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
      const currentUser = await AsyncStorage.getItem('userInfo');
      if (currentUser) {
        navigation.navigate('Start');
      }
    } else {
      // no sessions found.
    }
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(
      async userInfo => await onAuthStateChange(userInfo),
    );

    return subscriber;
  }, []);

  const login = () => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(async () => {
        const tokenId = await auth().currentUser.getIdToken();
        fetch(`${API.baseURL}/api/staff/getInfo`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokenId}`,
          },
        })
          .then(res => res.json())
          .then(async respond => {
            // handle customer account
            if (respond.code === 403) {
              auth()
                .signOut()
                .then(async () => {
                  // Sign-out successful
                  Alert.alert('Tài khoản của bạn không có quyền truy cập');
                  await AsyncStorage.removeItem('userInfo');
                })
                .catch(error => {
                  // An error happened.
                });
              return;
            }
            // * *

            // handle orther role account
            if (
              !(
                respond.role === 'STAFF_ORD' ||
                respond.role === 'STAFF_DLV_1' ||
                respond.role === 'STAFF_DLV_0'
              )
            ) {
              auth()
                .signOut()
                .then(async () => {
                  // Sign-out successful.
                  Alert.alert('Tài khoản của bạn không có quyền truy cập');
                  await AsyncStorage.removeItem('userInfo');
                })
                .catch(error => {
                  // An error happened.
                });

              return;
            }
            // * *

            // login successfull
            await AsyncStorage.setItem('userInfo', JSON.stringify(respond));
            navigation.navigate('Start');
            // **
          })

          .catch(err => {
            console.log(err);
          });
      })
      .catch(error => {
        // handle wrong password or email
        Alert.alert('Wrong password or email');
        console.log(error);
      });
  };

  return (
    <View>
      <Text>Email</Text>
      <TextInput
        value={email}
        onChangeText={e => setEmail(e)}
        style={{borderColor: 'black', borderWidth: 1, padding: 15}}
      />
      <Text>Password</Text>
      <TextInput
        style={{
          borderColor: 'black',
          borderWidth: 1,
          padding: 15,
          marginTop: 10,
        }}
        secureTextEntry={true}
        value={password}
        onChangeText={e => setPassword(e)}
      />
      <TouchableOpacity
        onPress={login}
        style={{alignSelf: 'center', marginTop: 15}}>
        <Text>Đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;
