import React, {useState, useEffect, useCallback} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  Image,
  Touchable,
  Alert,
  Switch,
} from 'react-native';
// import {Switch} from 'react-native-switch';
import Header from '../shared/Header';
import {COLORS} from '../constants/theme';
import {icons} from '../constants';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingScreen from '../components/LoadingScreen';
import messaging from '@react-native-firebase/messaging';
import Modal, {
  ModalFooter,
  ModalButton,
  SlideAnimation,
  ScaleAnimation,
} from 'react-native-modals';
import database from '@react-native-firebase/database';

const Profile = ({navigation}) => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEnable, setIsEnable] = useState(true);
  const [openAuthModal, setOpenAuthModal] = useState(false);
  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          setLoading(true);
          const isEnabled = await AsyncStorage.getItem('isEnable');
          setIsEnable(isEnabled ? JSON.parse(isEnabled) : true);
          setLoading(false);
        } catch (err) {
          console.log(err);
          setLoading(false);
        }
      })();
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          setLoading(true);
          const info = await AsyncStorage.getItem('userInfo');
          setUser(JSON.parse(info));
          setLoading(false);
        } catch (err) {
          console.log(err);
          setLoading(false);
        }
      })();
    }, []),
  );
  const toggleSwitch = async value => {
    if (value) {
      console.log('hello');
      messaging()
        .subscribeToTopic(user ? user.id : '.')
        .then(() => console.log('Subscribed to topic!'));
      await AsyncStorage.setItem('isEnable', JSON.stringify(value));
    } else {
      messaging()
        .unsubscribeFromTopic(user ? user.id : '.')
        .then(() => console.log('Unsubscribed fom the topic!'));
      await AsyncStorage.setItem('isEnable', JSON.stringify(value));
    }
    setIsEnable(value);
  };
  //authen check
  const onAuthStateChange = async userInfo => {
    // console.log(userInfo);
    setLoading(true);
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
          setLoading(false);
          return null;
        });
      if (!userTokenId) {
        // sessions end. (revoke refresh token like password change, disable account, ....)

        setLoading(false);
        return;
      }
      console.log('user is logged in');
      const info = await AsyncStorage.getItem('userInfo');
      console.log('info: ' + info);
      setUser(JSON.parse(info));
      // console.log('Username: ' + user?.fullName);
      setLoading(false);
    } else {
      // no sessions found.
      await AsyncStorage.removeItem('userInfo');
      await AsyncStorage.removeItem('CartList');
      console.log('user is not logged in');
      setLoading(false);
      // console.log(user);
    }
  };

  useFocusEffect(
    useCallback(() => {
      // auth().currentUser.reload()
      const subscriber = auth().onAuthStateChanged(
        async userInfo => await onAuthStateChange(userInfo),
      );
      GoogleSignin.configure({
        webClientId:
          '857253936194-dmrh0nls647fpqbuou6mte9c7e4o6e6h.apps.googleusercontent.com',
      });
      return subscriber;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  // system status check
  useFocusEffect(
    useCallback(() => {
      database().ref(`systemStatus`).off('value');
      database()
        .ref('systemStatus')
        .on('value', async snapshot => {
          if (snapshot.val() === 0) {
            navigation.reset({
              index: 0,
              routes: [{name: 'Initial'}],
            });
          } else {
            // setSystemStatus(snapshot.val());
          }
        });
    }, []),
  );

  const logout = async () => {
    messaging()
      .unsubscribeFromTopic(user ? user.id : '.')
      .then(() => console.log('Unsubscribed fom the topic!'));

    await GoogleSignin.signOut().catch(e => console.log(e));
    await AsyncStorage.clear();
    auth()
      .signOut()
      .then(() => setUser(null), console.log('Signed out successfully!'))
      .catch(e => console.log(e));
  };
  // let userInfo;
  // try {
  //   userInfo = JSON.parse(user);
  // } catch (error) {
  //   console.log(error);
  // }

  return (
    <SafeAreaView
      style={{
        flexDirection: 'column',
        backgroundColor: 'white',
        height: '100%',
      }}>
      {/* <Header /> */}

      <View style={{marginHorizontal: '6%', marginTop: '3%'}}>
        <Text
          style={{
            fontSize: 25,
            fontWeight: 'bold',
            color: 'black',
            fontFamily: 'Roboto',
          }}>
          Tôi
        </Text>
      </View>
      {/* Profile */}
      <View
        style={{
          paddingHorizontal: '6%',
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: '5%',
          marginTop: '5%',
        }}>
        {user ? (
          <Image
            style={{
              width: 90,
              height: 90,
              // alignSelf: 'center',
              borderRadius: 100,
            }}
            source={{uri: `${user?.avatarUrl}`}}
          />
        ) : (
          <Image
            style={{
              width: 90,
              height: 90,
              // alignSelf: 'center',
              borderRadius: 100,
            }}
            source={require('../assets/image/avatarDefault.png')}
          />
        )}

        <View style={{flexDirection: 'column', paddingLeft: '7%'}}>
          {user ? (
            <>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 23,
                  textAlign: 'left',
                  paddingBottom: '3%',
                  fontFamily: 'Roboto',
                }}>
                {user?.fullName}
              </Text>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 13,
                  textAlign: 'left',
                  fontFamily: 'Roboto',
                }}>
                {user?.email}
              </Text>
            </>
          ) : (
            <>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 23,
                  textAlign: 'left',
                  paddingBottom: '3%',
                  fontFamily: 'Roboto',
                }}>
                User
              </Text>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 13,
                  textAlign: 'left',
                  fontFamily: 'Roboto',
                }}>
                Email ...
              </Text>
            </>
          )}
        </View>
        {/* <TouchableOpacity
          style={{
            marginLeft: 20,
            flexDirection: 'row',
            backgroundColor: '#f8f8f8',
            borderRadius: 50,
          }}
          onPress={() => {
            navigation.navigate('Edit Profile');
          }}>
          <Image
            source={icons.edit}
            resizeMode="contain"
            style={{
              width: 30,
              height: 20,
              margin: '4%',
              justifyContent: 'center',
              tintColor: 'black',
            }}></Image>
          <Text
            style={{
              alignSelf: 'center',
              fontWeight: 'bold',
              fontSize: 16,
              fontFamily: 'Roboto',
            }}>
            Edit
          </Text>
        </TouchableOpacity> */}
      </View>

      {/* Options */}
      <View
        style={{
          marginTop: '8%',
          flexDirection: 'column',
          rowGap: 18,
          marginHorizontal: '4%',
        }}>
        {/* Line */}
        <View
          style={{
            borderBottomColor: 'black',
            borderBottomWidth: 1,
            width: '93%',
            alignSelf: 'center',
          }}
        />
        {/* Options 1 */}

        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: '3%',
            justifyContent: 'space-between',
          }}
          activeOpacity={0.8}
          onPress={() => {
            if (user == null) {
              setOpenAuthModal(true);
              return;
            } else {
              navigation.navigate('Edit Profile', {user});
            }
          }}>
          <View
            style={{
              flexDirection: 'row',
              columnGap: 15,
              alignItems: 'center',
            }}>
            <AntDesign name="user" size={30} color="black"></AntDesign>
            <Text
              style={{
                fontFamily: 'Roboto',
                fontSize: 16,
                fontWeight: '700',
                color: 'black',
              }}>
              Thông tin cá nhân
            </Text>
          </View>
          <View>
            <AntDesign name="right" size={20} color="black"></AntDesign>
          </View>
        </TouchableOpacity>

        {/* <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: '3%',
            justifyContent: 'space-between',
          }}
          activeOpacity={0.8}>
          <View
            style={{flexDirection: 'row', columnGap: 15, alignItems: 'center'}}>
            <MaterialIcons
              name="payment"
              size={30}
              color="black"></MaterialIcons>
            <Text
              style={{
                fontFamily: 'Roboto',
                fontSize: 16,
                fontWeight: '700',
                color: 'black',
              }}>
              Payment Method
            </Text>
          </View>
          <AntDesign name="right" size={20} color="black"></AntDesign>
        </TouchableOpacity> */}
        {/* <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: '3%',
            justifyContent: 'space-between',
          }}
          activeOpacity={0.8}>
          <View
            style={{flexDirection: 'row', columnGap: 15, alignItems: 'center'}}>
            <MaterialIcons
              name="security"
              size={30}
              color="black"></MaterialIcons>
            <Text
              style={{
                fontFamily: 'Roboto',
                fontSize: 16,
                fontWeight: '700',
                color: 'black',
              }}>
              Security
            </Text>
          </View>
          <AntDesign name="right" size={20} color="black"></AntDesign>
        </TouchableOpacity> */}
        {/* Line */}
        {/* <View
          style={{
            borderBottomColor: 'black',
            borderBottomWidth: 1,
            width: '93%',
            alignSelf: 'center',
          }}
        /> */}
        {/* Options 2 */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: '3%',
            justifyContent: 'space-between',
          }}
          activeOpacity={0.8}>
          <View
            style={{flexDirection: 'row', columnGap: 15, alignItems: 'center'}}>
            <MaterialIcons
              name="notifications-none"
              size={30}
              color="black"></MaterialIcons>
            <Text
              style={{
                fontFamily: 'Roboto',
                fontSize: 16,
                fontWeight: '700',
                color: 'black',
              }}>
              Thông báo
            </Text>
          </View>
          <Switch
            disabled={user ? false : true}
            trackColor={{false: 'grey', true: 'tomato'}}
            thumbColor={isEnable ? '#f4f3f4' : '#f4f3f4'}
            // ios_backgroundColor="#3e3e3e"
            onValueChange={value => {
              toggleSwitch(value);
            }}
            value={user ? isEnable : false}
          />
        </View>
        {/* <TouchableOpacity
          onPress={() => {
            navigation.navigate('Upload');
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: '3%',
            justifyContent: 'space-between',
          }}
          activeOpacity={0.8}>
          <View
            style={{flexDirection: 'row', columnGap: 15, alignItems: 'center'}}>
            <Feather name="map-pin" size={30} color="black"></Feather>
            <Text
              style={{
                fontFamily: 'Roboto',
                fontSize: 16,
                fontWeight: '700',
                color: 'black',
              }}>
              Address
            </Text>
          </View>
          <AntDesign name="right" size={20} color="black"></AntDesign>
        </TouchableOpacity> */}

        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: '3%',
            justifyContent: 'space-between',
          }}
          onPress={() => {
            if (user == null) {
              setOpenAuthModal(true);
              return;
            } else {
              navigation.navigate('List Feedback');
            }
          }}
          activeOpacity={0.8}>
          <View
            style={{flexDirection: 'row', columnGap: 15, alignItems: 'center'}}>
            <AntDesign
              name="questioncircleo"
              size={30}
              color="black"></AntDesign>
            <Text
              style={{
                fontFamily: 'Roboto',
                fontSize: 16,
                fontWeight: '700',
                color: 'black',
              }}>
              Đánh giá
            </Text>
          </View>
          <AntDesign name="right" size={20} color="black"></AntDesign>
        </TouchableOpacity>
        {/*  */}
        {user ? (
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: '3%',
              justifyContent: 'space-between',
            }}
            activeOpacity={0.8}
            onPress={() => {
              // navigation.navigate('Login');
              logout();
            }}>
            <View
              style={{
                flexDirection: 'row',
                columnGap: 15,
                alignItems: 'center',
              }}>
              <AntDesign name="logout" size={30} color="red"></AntDesign>
              <Text
                style={{
                  fontFamily: 'Roboto',
                  fontSize: 16,
                  fontWeight: '700',
                  color: 'red',
                }}>
                Đăng xuất
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: '3%',
              justifyContent: 'space-between',
            }}
            activeOpacity={0.8}
            onPress={async () => {
              navigation.navigate('Login');
            }}>
            <View
              style={{
                flexDirection: 'row',
                columnGap: 15,
                alignItems: 'center',
              }}>
              <AntDesign name="login" size={30} color="black"></AntDesign>
              <Text
                style={{
                  fontFamily: 'Roboto',
                  fontSize: 16,
                  fontWeight: '700',
                  color: 'black',
                }}>
                Đăng nhập
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
      {/* auth modal */}
      <Modal
        width={0.8}
        visible={openAuthModal}
        dialogAnimation={
          new ScaleAnimation({
            initialValue: 0, // optional
            useNativeDriver: true, // optional
          })
        }
        footer={
          <ModalFooter>
            <ModalButton
              text="Ở lại trang"
              onPress={() => {
                setOpenAuthModal(false);
              }}
            />
            <ModalButton
              text="Đăng nhập"
              onPress={async () => {
                try {
                  await AsyncStorage.clear();
                  navigation.navigate('Login');
                  setOpenAuthModal(false);
                } catch (error) {
                  console.log(error);
                }
              }}
            />
          </ModalFooter>
        }>
        <View
          style={{padding: 20, alignItems: 'center', justifyContent: 'center'}}>
          <Text
            style={{
              fontSize: 20,
              fontFamily: 'Roboto',
              color: 'black',
              textAlign: 'center',
            }}>
            Vui lòng đăng nhập để thực hiện thao tác này
          </Text>
        </View>
      </Modal>
      {loading && <LoadingScreen />}
    </SafeAreaView>
  );
};

export default Profile;
