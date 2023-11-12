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
import React, { useEffect, useState, useCallback } from 'react';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONTS } from '../../constants/theme';
import { icons } from '../../constants';
import { useFocusEffect } from '@react-navigation/native';
import { API } from '../../constants/api';
import { format } from 'date-fns';
import CartEmpty from '../../assets/image/search-empty.png';
import { SwipeListView } from 'react-native-swipe-list-view';
import SearchBar from '../../components/SearchBar';
import dayjs from 'dayjs';
import LoadingScreen from '../../components/LoadingScreen';

const Product = ({ navigation }) => {
  const [initializing, setInitializing] = useState(true);
  const [open, setOpen] = useState(false);
  const [productsPackaging, setProductsPackaging] = useState([]);
  const [pickupPoint, setPickupPoint] = useState(null);
  const [result, setResult] = useState([]);
  const [text, setText] = useState('');
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
      // console.log(currentUser);
    } else {
      // no sessions found.
      console.log('user is not logged in');
      await AsyncStorage.removeItem('userInfo');
      navigation.navigate('Login');
    }
  };

  const fetchData = async () => {
    if (auth().currentUser) {
      const tokenId = await auth().currentUser.getIdToken();
      if (tokenId) {
        setLoading(true);
        if (pickupPoint) {
          fetch(
            `${API.baseURL}/api/order/packageStaff/getProductsOrderAfterPackaging?pickupPointId=${pickupPoint?.id}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${tokenId}`,
              },
            },
          )
            .then(res => res.json())
            .then(respond => {
              console.log('order', respond);
              if (respond.error) {
                setLoading(false);
                return;
              }
              setProductsPackaging(respond);
              setLoading(false);
            })
            .catch(err => {
              console.log(err);
              setLoading(false);
            });
        } else {
          fetch(
            `${API.baseURL}/api/order/packageStaff/getProductsOrderAfterPackaging`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${tokenId}`,
              },
            },
          )
            .then(res => res.json())
            .then(respond => {
              console.log('order', respond, '1');
              if (respond.error) {
                setLoading(false);
                return;
              }
              setProductsPackaging(respond);
              setLoading(false);
            })
            .catch(err => {
              console.log(err);
              setLoading(false);
            });
        }
      }
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
      fetchData()
    }, []),
  );

  useEffect(async () => {
    setLoading(true);
    await fetch(
      `${API.baseURL}/api/order/packageStaff/getProductsOrderAfterPackaging?pickupPointId=${pickupPoint.id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenId}`,
        },
      },
    )
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          return;
        }
        console.log(data);
        // setProductsPackaging(data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }, [pickupPoint?.id]);

  const handleTypingSearch = (value) => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setProductName(value);
    }, 400);
  };

  const Item = ({ data }) => {
    return (
      <TouchableOpacity
        key={data.id}
        onPress={() => {
          navigation.navigate('ProductDetails', {
            product: data,
            pickupPointId: pickupPoint.id
          });
        }}>
        <View style={styles.itemContainer}>
          {/* Image Product */}
          <Image
            resizeMode="contain"
            source={{
              uri: data?.imageUrlImageList[0],
            }}
            style={styles.itemImage}
          />

          <View style={{ justifyContent: 'center', flex: 1, marginRight: 10}}>
            <Text
              numberOfLines={1}
              style={{
                fontFamily: FONTS.fontFamily,
                fontSize: 20,
                fontWeight: 700,
                maxWidth: '95%',
                color: 'black',
              }}>
              {data.name}
            </Text>
            <Text
              style={{
                fontFamily: FONTS.fontFamily,
                fontSize: 16,
                marginTop: 8,
                marginBottom: 10,
              }}>
              HSD:{' '}
              {dayjs(data?.expiredDate).format(
                'DD/MM/YYYY',
              )}
            </Text>

            <View style={{ flexDirection: 'row' }}>
              <Text
                style={{
                  maxWidth: '70%',
                  fontSize: 18,
                  lineHeight: 20,
                  color: COLORS.secondary,
                  fontWeight: 'bold',
                  fontFamily: FONTS.fontFamily,
                }}>
                {data?.boughtQuantity}{' '}
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  lineHeight: 20,
                  color: COLORS.secondary,
                  fontWeight: 600,
                  fontFamily: FONTS.fontFamily,
                }}>
                {data?.unit}
              </Text>
            </View>


            {/* Button buy */}
            {/* <TouchableOpacity onPress={() => handleAddToCart(data)}>
              <Text
                style={{
                  maxWidth: 150,
                  maxHeight: 40,
                  padding: 10,
                  backgroundColor: COLORS.primary,
                  borderRadius: 10,
                  textAlign: 'center',
                  color: '#ffffff',
                  fontFamily: FONTS.fontFamily,
                }}>
                Thêm vào giỏ hàng
              </Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </TouchableOpacity>
    );
  };


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
              <Text style={{ fontSize: 16 }}>Khu vực:</Text>
              <View style={styles.pickArea}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('SelectPickupPoint', {
                      setPickupPoint: setPickupPoint,
                      isFromProductPackagingRoute: true,
                    });
                  }}>
                  <View style={styles.pickAreaItem}>
                    <Image
                      resizeMode="contain"
                      style={{ width: 30, height: 20, tintColor: COLORS.primary }}
                      source={icons.location}
                    />

                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: 'Roboto',
                        color: 'black',
                      }}>
                      {pickupPoint
                        ? pickupPoint.address
                        : 'Chọn điểm giao hàng'}
                      {/* Chọn điểm giao hàng */}
                    </Text>
                  </View>
                </TouchableOpacity>
                {pickupPoint ? (
                  <TouchableOpacity
                    onPress={() => {
                      setPickupPoint(null);
                    }}>
                    <Image
                      resizeMode="contain"
                      style={{
                        width: 22,
                        height: 22,
                        tintColor: COLORS.primary,
                      }}
                      source={icons.clearText}
                    />
                  </TouchableOpacity>
                ) : (
                  <></>
                )}
              </View>
            </View>
            <View style={styles.logout}>
              <TouchableOpacity
                onPress={() => {
                  setOpen(!open);
                }}>
                <Image
                  resizeMode="contain"
                  style={{ width: 38, height: 38 }}
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
                  <Text style={{ color: 'red', fontWeight: 'bold' }}>
                    Đăng xuất
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          {/* Search */}
        </View>
        <View style={styles.body}>
          <ScrollView
            keyboardShouldPersistTaps="always"
            contentContainerStyle={{
              paddingBottom: 100,
            }}>
            {/* <View
            style={{
              flexDirection: 'row',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <SearchBar
                text={text}
                setText={setText}
                handleTypingSearch={handleTypingSearch}
                result={result}
              />
            </View>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'flex-end',
                flex: 1,
              }}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(true);
                }}>
                <Image
                  resizeMode="contain"
                  style={{
                    height: 35,
                    tintColor: COLORS.primary,
                    width: 35,
                    marginHorizontal: '1%',
                  }}
                  source={icons.filter}
                />
              </TouchableOpacity>
            </View>
          </View> */}
            {productsPackaging?.map((item, index) => (
              <Item data={item} key={index} />
            ))}
          </ScrollView>
        </View>
        {loading && <LoadingScreen />}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Product;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
  header: {
    flex: 2,
  },
  body: {
    flex: 20,
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
  itemContainer: {
    backgroundColor: '#F5F5F5',
    maxWidth: '90%',
    borderRadius: 20,
    marginHorizontal: '6%',
    marginBottom: 20,
    flexDirection: 'row',
  },
  itemImage: {
    width: 130,
    height: 130,
    borderRadius: 20,
    padding: 10,
    margin: 15,
  },
  itemText: {
    fontFamily: FONTS.fontFamily,
    fontSize: 20,
  },
});
