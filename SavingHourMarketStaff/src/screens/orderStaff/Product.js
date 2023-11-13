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
  FlatList
} from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONTS } from '../../constants/theme';
import { icons } from '../../constants';
import { useFocusEffect } from '@react-navigation/native';
import { API } from '../../constants/api';
import { format } from 'date-fns';
import { SwipeListView } from 'react-native-swipe-list-view';
import SearchBar from '../../components/SearchBar';
import LoadingScreen from '../../components/LoadingScreen';
import CartEmpty from '../../assets/image/search-empty.png';

const Product = ({ navigation }) => {
  const [initializing, setInitializing] = useState(true);
  const [open, setOpen] = useState(false);
  const [productsPackaging, setProductsPackaging] = useState([]);
  const [pickupPoint, setPickupPoint] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const onAuthStateChange = async (userInfo) => {
    if (initializing) {
      setInitializing(false);
    }
    if (userInfo) {
      const userTokenId = await userInfo.getIdToken(true).catch((e) => {
        console.log(e);
        return null;
      });
      if (!userTokenId) {
        await AsyncStorage.removeItem('userInfo');
        navigation.navigate('Login');
        return;
      }
    } else {
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
        const url = pickupPoint
          ? `${API.baseURL}/api/order/packageStaff/getProductsOrderAfterPackaging?pickupPointId=${pickupPoint.id}`
          : `${API.baseURL}/api/order/packageStaff/getProductsOrderAfterPackaging`;

        try {
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${tokenId}`,
            },
          });

          const data = await response.json();
          console.log('order', data);

          if (!data.error) {
            setProductsPackaging(data);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      const subscriber = auth().onAuthStateChanged((userInfo) => {
        onAuthStateChange(userInfo);
      });

      return subscriber;
    }, [])
  );

  useFocusEffect(useCallback(() => {
    fetchData();
  }, [pickupPoint]));

  useEffect(() => {
    fetchData();
  }, [pickupPoint]);

  const handleTypingSearch = (value) => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setProductName(value);
    }, 400);
  };


  const Item = ({ item, index }) => {
    return (
      <TouchableOpacity
        key={index}
        style={{
          flexDirection: 'row',
          gap: 10,
          alignItems: 'center',
          backgroundColor: 'white',
          borderBottomColor: '#decbcb',
          borderBottomWidth: 0.5,
          paddingVertical: 20,
        }}>
        <View
          style={{
            flexDirection: 'column',
            gap: 10,
            flex: 7,
          }}>
          <View style={{
            flexDirection: 'row',
            gap: 10,
            alignItems: 'center',
            backgroundColor: 'white',
            borderBottomColor: '#decbcb',
            borderBottomWidth: 0.5,
            paddingVertical: 20,
          }}>
            <Image
              source={{
                uri: item.imageUrlImageList[0],
              }}
              style={{ width: 100, height: 100 }}
            />
            <View
              style={{
                flexDirection: 'column',
                gap: 10,
                flex: 7,
              }}><Text
                style={{
                  fontSize: 23,
                  color: 'black',
                  fontFamily: 'Roboto',
                  fontWeight: 'bold',
                }}>
                {item.name}
              </Text>

              <Text
                style={{
                  fontSize: 18,
                  color: 'black',
                  fontFamily: 'Roboto',
                  fontWeight: 'bold',
                }}>
                HSD:
                {format(
                  new Date(
                    item.expiredDate,
                  ),
                  'dd/MM/yyyy',
                )}
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  color: 'black',
                  fontFamily: 'Roboto',
                }}>
                Số lượng:{' '}
                {item.boughtQuantity}{' '}{item.unit}
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  color: 'black',
                  fontFamily: 'Roboto',
                }}>
                Điểm tập kết:{' '}
                {item.productConsolidationArea.address}
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  color: 'black',
                  fontFamily: 'Roboto',
                }}>
                Mã đơn hàng:{' '}
                {item.orderPackage.id}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  };


  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss;
        setOpen(false);
      }}
      accessible={true}>
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
          {Object.keys(productsPackaging).length === 0 ?
            <View style={{ alignItems: 'center', justifyContent: 'center', marginTop:12 }}>
              <Image
                style={{ width: '100%', height: '50%' }}
                resizeMode="contain"
                source={CartEmpty}
              />
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: 'Roboto',
                  // color: 'black',
                  fontWeight: 'bold',
                }}>
                Chưa có sản phẩm để thực hiện gom
              </Text>
            </View>
            :
            <FlatList
              data={Object.keys(productsPackaging)}
              keyExtractor={(item) => item.toString()}
              renderItem={({ item }) =>
                <>
                  <Text
                    style={{
                      fontSize: 18,
                      color: COLORS.primary,
                      fontFamily: 'Roboto',
                      backgroundColor: 'white',
                      alignSelf: 'flex-start',
                      marginTop: 10,
                      paddingVertical: 5,
                      paddingHorizontal: 15,
                      borderRadius: 15,
                      borderColor: COLORS.primary,
                      borderWidth: 1.5,
                      fontWeight: 700,
                    }}>
                    {productsPackaging[item][0].supermarket.name}
                  </Text>
                  <View style={{
                    flexDirection: 'row',
                    marginTop: 13,
                  }}>
                    <Image
                      resizeMode="contain"
                      style={{ width: 25, height: 25, marginTop: 10, }}
                      source={icons.location}
                    />
                    <Text
                      style={{
                        fontSize: 18,
                        color: 'black',
                        fontFamily: 'Roboto',
                        marginLeft: 7,
                        width: '90%'
                      }}>
                      Chi nhánh:{' '}
                      {productsPackaging[item][0].supermarketAddress.address}
                    </Text>
                  </View>
                  {productsPackaging[item].map((item, index) => (
                    <Item key={index} item={item} index={index} />
                  ))}
                </>
              }
              contentContainerStyle={{
                paddingBottom: 150,// Ensure that the FlatList takes up the full height
              }}
            />}

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
    flex: 1,
  },
  body: {
    flex: 8,
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
  }
});
