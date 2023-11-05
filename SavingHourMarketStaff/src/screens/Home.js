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
} from 'react-native';
import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {COLORS} from '../constants/theme';
import {icons} from '../constants';

const SearchBar = () => {
  return (
    <View
      style={{
        backgroundColor: '#f5f5f5',
        width: '100%',
        height: 45,
        borderRadius: 40,
        paddingLeft: 10,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          height: 40,
          flexWrap: 'wrap',
          paddingLeft: 5,
        }}>
        <Image
          resizeMode="contain"
          style={{
            width: 20,
            height: 20,
          }}
          source={icons.search}
        />
        <TextInput
          style={{
            fontSize: 16,
            paddingLeft: 20,
          }}
          placeholder="Tìm kiếm đơn hàng"></TextInput>
      </View>
    </View>
  );
};

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
        await AsyncStorage.removeItem('userInfo');
        navigation.navigate('Login');
        return;
      }
    } else {
      // no sessions found.
      console.log('user is not logged in');
      await AsyncStorage.removeItem('userInfo');
      navigation.navigate('Login');
    }
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(
      async userInfo => await onAuthStateChange(userInfo),
    );

    return subscriber;
  }, []);

  const orderStatus = [
    {display: 'Chờ xác nhận', value: 'PROCESSING'},
    {display: 'Đóng gói', value: 'PACKAGING'},
    {display: 'Giao hàng', value: 'DELIVERING'},
    {display: 'Đã giao', value: 'SUCCESS'},
    {display: 'Đơn thất bại', value: 'FAIL'},
    {display: 'Đã hủy', value: 'CANCEL'},
  ];

  const [currentStatus, setCurrentStatus] = useState({
    display: 'Chờ xác nhận',
    value: 'PROCESSING',
  });
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.areaAndLogout}>
            <View style={styles.area}>
              <Text style={{fontSize: 16}}>Khu vực:</Text>
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
              <TouchableOpacity>
                <Image
                  resizeMode="contain"
                  style={{width: 38, height: 38}}
                  source={icons.userCircle}
                />
              </TouchableOpacity>
            </View>
          </View>
          {/* Search */}
          {/* <SearchBar /> */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {orderStatus.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setCurrentStatus(item);
                }}>
                <View
                  style={[
                    {
                      paddingTop: 15,
                      paddingHorizontal: 15,
                      paddingBottom: 15,
                    },
                    currentStatus.display === item.display && {
                      borderBottomColor: COLORS.primary,
                      borderBottomWidth: 2,
                    },
                  ]}>
                  <Text
                    style={{
                      fontFamily: 'Roboto',
                      fontSize: 16,
                      color:
                        currentStatus.display === item.display
                          ? COLORS.primary
                          : 'black',
                      fontWeight:
                        currentStatus.display === item.display ? 'bold' : 400,
                    }}>
                    {item.display}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View style={styles.body}></View>
      </View>
      {/* <TouchableOpacity
        onPress={() => {
          auth()
            .signOut()
            .then(async () => {
              await AsyncStorage.removeItem('userInfo');
            })
            .catch(e => console.log(e));
        }}>
        <Text>Đăng xuất</Text>
      </TouchableOpacity> */}
    </TouchableWithoutFeedback>
  );
};

export default Home;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flex: 2,
    // backgroundColor: 'pink',
    paddingHorizontal: 20,
  },
  body: {
    flex: 6,
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
