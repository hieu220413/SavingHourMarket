import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';
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

const Product = ({navigation}) => {
  const [initializing, setInitializing] = useState(true);
  const [open, setOpen] = useState(false);

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
      // console.log(currentUser);
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

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss;
        setOpen(false);
      }}
      accessible={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.areaAndLogout}>
            <View style={styles.area}>
              <Text style={{fontSize: 16}}>Siêu thị:</Text>
              <TouchableOpacity>
                <View style={styles.pickArea}>
                  <View style={styles.pickAreaItem}>
                    <Image
                      resizeMode="contain"
                      style={{width: 20, height: 20, tintColor: COLORS.primary}}
                      source={icons.location}
                    />
                    <Text
                      style={{
                        fontSize: 18,
                        fontFamily: 'Roboto',
                        color: 'black',
                      }}>
                      {/* {pickupPoint
                        ? pickupPoint.address
                        : 'Chọn điểm nhận hàng'} */}
                      Chọn điểm nhận hàng
                    </Text>
                  </View>
                  <Image
                    resizeMode="contain"
                    style={{
                      width: 22,
                      height: 22,
                      tintColor: COLORS.primary,
                    }}
                    source={icons.rightArrow}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.logout}>
              <TouchableOpacity
                onPress={() => {
                  setOpen(!open);
                }}>
                <Image
                  resizeMode="contain"
                  style={{width: 38, height: 38}}
                  source={icons.userCircle}
                />
              </TouchableOpacity>
              {open && (
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    bottom: -30,
                    left: -12,
                    zIndex: 100,
                    width: 75,
                    height: 35,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 10,
                    backgroundColor: 'rgb(240,240,240)',
                  }}
                  onPress={() => {
                    auth()
                      .signOut()
                      .then(async () => {
                        await AsyncStorage.removeItem('userInfo');
                      })
                      .catch(e => console.log(e));
                  }}>
                  <Text style={{color: 'red', fontWeight: 'bold'}}>
                    Đăng xuất
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
        <View style={styles.body}></View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Product;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flex: 2,
    // backgroundColor: 'orange',
    paddingHorizontal: 20,
  },
  body: {
    flex: 8,
    // backgroundColor: 'pink',
    paddingHorizontal: 20,
  },
  areaAndLogout: {
    paddingTop: 10,
    flexDirection: 'row',
  },
  pickArea: {
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  area: {
    flex: 7,
    // backgroundColor: 'white',
  },
  logout: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginLeft: 10,
  },
  pickAreaItem: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    width: '80%',
  },
});
