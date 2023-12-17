/* eslint-disable prettier/prettier */
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  Image,
  FlatList,
  Modal,
  Pressable,
} from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../../constants/theme';
import { icons } from '../../constants';
import { useFocusEffect } from '@react-navigation/native';
import { API } from '../../constants/api';
import { format } from 'date-fns';
import LoadingScreen from '../../components/LoadingScreen';
import CartEmpty from '../../assets/image/search-empty.png';
import { useRef } from 'react';
import { checkSystemState } from '../../common/utils';
import CheckBox from 'react-native-check-box';
import {
  RoundedCheckbox,
  PureRoundedCheckbox,
} from "react-native-rounded-checkbox";
const Product = ({ navigation }) => {
  // listen to system state
  useFocusEffect(
    useCallback(() => {
      checkSystemState(navigation);
    }, []),
  );

  const [initializing, setInitializing] = useState(true);
  const [open, setOpen] = useState(false);
  const [productsPackaging, setProductsPackaging] = useState([]);
  const [pickupPoint, setPickupPoint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [supermarkets, setSupermarkets] = useState([]);
  const [tempSupermarketFilterName, setTempSupermarketFilterName] =
    useState('');
  const [supermarketFilterName, setSupermarketFilterName] = useState('');

  // const onAuthStateChange = async userInfo => {
  //   if (initializing) {
  //     setInitializing(false);
  //   }
  //   if (userInfo) {
  //     const userTokenId = await userInfo.getIdToken(true).catch(e => {
  //       console.log(e);
  //       return null;
  //     });
  //     if (!userTokenId) {
  //       await AsyncStorage.removeItem('userInfo');
  //       // navigation.navigate('Login');
  //       navigation.reset({
  //         index: 0,
  //         routes: [{name: 'Login'}],
  //       });
  //       return;
  //     }
  //     const currentUser = await AsyncStorage.getItem('userInfo');
  //     // console.log(JSON.parse(currentUser));
  //     setCurrentUser(JSON.parse(currentUser));
  //   } else {
  //     console.log('user is not logged in');
  //     await AsyncStorage.removeItem('userInfo');
  //     // navigation.navigate('Login');
  //     navigation.reset({
  //       index: 0,
  //       routes: [{name: 'Login'}],
  //     });
  //   }
  // };

  const fetchData = async () => {
    if (auth().currentUser) {
      const tokenId = await auth().currentUser.getIdToken();
      if (tokenId) {
        setLoading(true);
        const url =
          pickupPoint && pickupPoint.id
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

          if (response.status === 403 || response.status === 401) {
            const tokenIdCheck = await auth()
              .currentUser.getIdToken(true)
              .catch(async err => {
                await AsyncStorage.setItem('isDisableAccount', '1');
                return null;
              });
            if (!tokenIdCheck) {
              throw new Error();
            }
          }

          const data = await response.json();

          const groupedBySupermarket = {};
          Object.keys(data).forEach(supermarketId => {
            const itemsForSupermarket = data[supermarketId];
            itemsForSupermarket.forEach(item => {
              const supermarketName = item.supermarket.name;
              const supermarketAddress = item.supermarketAddress.address;

              // Check if the supermarket name exists in the grouped data
              if (!groupedBySupermarket[supermarketName]) {
                groupedBySupermarket[supermarketName] = {};
              }

              // Check if the supermarket address exists in the grouped data
              if (!groupedBySupermarket[supermarketName][supermarketAddress]) {
                groupedBySupermarket[supermarketName][supermarketAddress] = [];
              }

              // Push the item into the respective supermarket's address group
              groupedBySupermarket[supermarketName][supermarketAddress].push(
                item,
              );
            });
          });
          setSupermarkets(Object.keys(groupedBySupermarket));
          if (!data.error) {
            if (supermarketFilterName) {
              const filteredByKeys = {};
              Object.keys(groupedBySupermarket).forEach(key => {
                if (key === supermarketFilterName) {
                  filteredByKeys[key] = groupedBySupermarket[key];
                }
              });
              setProductsPackaging(filteredByKeys);
            } else {
              console.log(groupedBySupermarket);
              setProductsPackaging(groupedBySupermarket);
            }
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    }
  };

  // useFocusEffect(
  //   useCallback(() => {
  //     const subscriber = auth().onAuthStateChanged(userInfo => {
  //       onAuthStateChange(userInfo);
  //     });

  //     return subscriber;
  //   }, []),
  // );

  // init pickup point

  useFocusEffect(
    useCallback(() => {
      const initPickupPoint = async () => {
        // console.log('pick up point :', pickupPoint)
        const pickupPointStorage = await AsyncStorage.getItem('pickupPoint')
          .then(result => JSON.parse(result))
          .catch(error => {
            console.log(error);
            return null;
          });
        if (pickupPointStorage) {
          setPickupPoint(pickupPointStorage);
        } else {
          // trick useEffect to trigger
          setPickupPoint({
            id: null,
          });
        }
      };
      initPickupPoint();
    }, []),
  );

  const handleApplySort = () => {
    setModalVisible(!modalVisible);
    setLoading(true);
    setSupermarketFilterName(tempSupermarketFilterName);
  };

  const handleClear = () => {
    setModalVisible(!modalVisible);
    setSupermarketFilterName('');
    setTempSupermarketFilterName('');
  };

  // fetch data after handle apply filter
  const isMountingRef = useRef(false);

  useEffect(() => {
    isMountingRef.current = true;
  }, []);

  useEffect(() => {
    const data = async () => {
      // console.log(pickupPoint);
      if (!isMountingRef.current) {
        await fetchData();
      } else {
        isMountingRef.current = false;
      }
    };
    data();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickupPoint, setPickupPoint, supermarketFilterName]);

  //get Current User Info
  useFocusEffect(
    useCallback(() => {
      const getCurrentUser = async () => {
        const currentUser = await AsyncStorage.getItem('userInfo');
        // console.log(JSON.parse(currentUser));
        setCurrentUser(JSON.parse(currentUser));
      };
      getCurrentUser();
    }, []),
  );

  const [isCollectedStatus, setIsCollectedStatus] = useState({});

  useEffect(() => {
    const fetchIsCollectedStatus = async () => {
      const storedStatus = await AsyncStorage.getItem('isCollectedProduct');
      if (storedStatus) {
        setIsCollectedStatus(JSON.parse(storedStatus));
      } else {
        setIsCollectedStatus(initialIsCollectedStatus(productsPackaging));
      }
    };

    fetchIsCollectedStatus();
  }, [productsPackaging]);

  const initialIsCollectedStatus = (data) => {
    const status = {};
    Object.keys(data).forEach((supermarket) => {
      Object.keys(data[supermarket]).forEach((address) => {
        data[supermarket][address].forEach((item) => {
          status[JSON.stringify(item.orderPackage.code + item.name.replace(/\s/g, "") + item.expiredDate + address.replace(/\s/g, "") + 'isCollected')] = false;
        });
      });
    });
    return status;
  };

  const handleCheckBoxClick = async (key) => {
    const updatedStatus = { ...isCollectedStatus, [key]: !isCollectedStatus[key] };
    await AsyncStorage.setItem('isCollectedProduct', JSON.stringify(updatedStatus));
    setIsCollectedStatus(updatedStatus);
  };

  const Item = ({ item, index, address }) => {
    const key = JSON.stringify(item.orderPackage.code + item.name.replace(/\s/g, "") + item.expiredDate + address.replace(/\s/g, "") + 'isCollected');

    return (
      <View style={{ flexDirection: 'row',gap:3 }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('OrderDetail', {
              id: item.orderPackage.id,
              orderSuccess: false,
            });
          }}
          key={index}
          style={{
            flex: 9,
            flexDirection: 'row',
            gap: 10,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            paddingVertical: '3%',
            borderRadius: 20,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.25,
            shadowRadius: 20,
            elevation: 6,
            marginHorizontal: 5,
            marginVertical: 12,
          }}>
          <View
            style={{
              flexDirection: 'column',
              flex: 7,
            }}>
            <View
              style={{
                flexDirection: 'row',
                gap: 10,
                alignItems: 'center',
                backgroundColor: 'white',
                maxWidth: '95%',
                marginHorizontal: '5%'
              }}>
              <Text
                style={{
                  fontSize: 18,
                  color: 'black',
                  fontFamily: 'Roboto',
                  fontWeight: 'bold',
                  flex: 8
                }}>
                {item.name}
              </Text>
              <Image
                source={{
                  uri: item.imageUrlImageList[0],
                }}
                style={{ width: 90, height: 90, flex: 3 }}
              />
            </View>
            <View
              style={{
                flexDirection: 'column',
                gap: 10,
                flex: 7,
                marginHorizontal: '5%'
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: 'black',
                  fontFamily: 'Roboto',
                  fontWeight: 'bold',
                }}>
                HSD:
                {format(new Date(item.expiredDate), 'dd/MM/yyyy')}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: 'black',
                  fontFamily: 'Roboto',
                }}>
                Số lượng: {item.boughtQuantity} {item.unit}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: 'black',
                  fontFamily: 'Roboto',
                }}>
                Điểm tập kết: {item.productConsolidationArea.address}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: 'black',
                  fontFamily: 'Roboto',
                }}>
                Mã đơn hàng:
                {item.orderPackage.code}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <RoundedCheckbox
          key={key}
          uncheckedColor="white"
          checkedColor="grey"
          outerStyle={{ alignSelf: 'center'}}
          onPress={() => handleCheckBoxClick(key)}
          isChecked={isCollectedStatus[key]}
        >
          {isCollectedStatus[key] && (<Image
            resizeMode="contain"
            style={{ width: '90%', height: '90%' }}
            source={icons.checked}
          />)}
          {!isCollectedStatus[key] && (<Image
            resizeMode="contain"
            style={{ width: '90%', height: '90%', tintColor: 'black' }}
            source={icons.unchecked}
          />)}

        </RoundedCheckbox>
      </View>

    );
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
                        maxWidth: 270,
                      }}
                      numberOfLines={1}>
                      {pickupPoint && pickupPoint.id
                        ? pickupPoint.address
                        : 'Chọn điểm giao hàng'}
                      {/* Chọn điểm giao hàng */}
                    </Text>
                  </View>
                </TouchableOpacity>
                {pickupPoint && pickupPoint.id ? (
                  <TouchableOpacity
                    onPress={async () => {
                      setPickupPoint(null);
                      await AsyncStorage.removeItem('pickupPoint');
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
                  source={{
                    uri: currentUser?.avatarUrl,
                  }}
                />
              </TouchableOpacity>
              {open && (
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    bottom: -30,
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
          <View
            style={{
              flexDirection: 'row',
              marginBottom: 10,
            }}>
            <Text
              style={{
                flex: 5,
                fontSize: 16,
                fontFamily: 'Roboto',
                backgroundColor: 'white',
                alignSelf: 'flex-start',
                marginTop: '2%',
                paddingVertical: 5,
                borderRadius: 15,
                paddingHorizontal: 15,
                borderColor: COLORS.primary,
                fontWeight: 700,
                shadowColor: '#000',
                shadowOffset: {
                  width: 2,
                  height: 1,
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
              }}
              numberOfLines={1}>
              Danh sách các sản phẩm cần lấy
            </Text>
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
          </View>
          {/* Search */}
        </View>

        <View style={styles.body}>
          {Object.keys(productsPackaging).length === 0 ? (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 12,
              }}>
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
          ) : (
            <FlatList
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              data={Object.keys(productsPackaging)} // Replace 'yourData' with your actual data object
              keyExtractor={item => item.toString()}
              renderItem={({ item: supermarketName }) => (
                <>
                  <Text
                    style={{
                      fontSize: 16,
                      color: COLORS.primary,
                      fontFamily: 'Roboto',
                      backgroundColor: 'white',
                      alignSelf: 'flex-start',
                      marginTop: 15,
                      paddingVertical: 5,
                      paddingHorizontal: 15,
                      borderRadius: 15,
                      borderColor: COLORS.primary,
                      borderWidth: 1.5,
                      fontWeight: 700,
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 2,
                        height: 1,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 4,
                      elevation: 5,
                    }}>
                    Siêu thị: {supermarketName}
                  </Text>

                  {Object.keys(productsPackaging[supermarketName]).map(
                    (address, index) => (
                      <View key={index}>
                        <View
                          style={{
                            flexDirection: 'row',
                            marginTop: 13,
                          }}>
                          <Image
                            resizeMode="contain"
                            style={{ width: 25, height: 25, marginTop: 10 }}
                            source={icons.location}
                          />
                          <Text
                            style={{
                              fontSize: 16,
                              color: 'black',
                              fontFamily: 'Roboto',
                              marginLeft: 7,
                              width: '90%',
                            }}>
                            Chi nhánh: {address}
                          </Text>
                        </View>
                        {productsPackaging[supermarketName][address].map(
                          (item, idx) => (
                            <Item key={idx} item={item} index={idx} address={address} />
                          ),
                        )}
                      </View>
                    ),
                  )}
                  <View style={{ borderBottomWidth: 0.2, borderColor: 'grey' }} />
                </>
              )}
              contentContainerStyle={{
                paddingBottom: 150, // Ensure that the FlatList takes up the full height
              }}
            />
          )}
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <Pressable
            onPress={() => setModalVisible(false)}
            style={styles.centeredView}>
            <View style={styles.modalView}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 20,
                    fontWeight: 700,
                    textAlign: 'center',
                    paddingBottom: 20,
                  }}>
                  Bộ lọc tìm kiếm
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}>
                  <Image
                    resizeMode="contain"
                    style={{
                      width: 20,
                      height: 20,
                      tintColor: 'grey',
                    }}
                    source={icons.close}
                  />
                </TouchableOpacity>
              </View>
              <Text
                style={{
                  color: 'black',
                  fontSize: 16,
                  fontWeight: 700,
                }}>
                Chọn siêu thị
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  marginVertical: 10,
                }}>
                {supermarkets &&
                  supermarkets.map(item => (
                    <TouchableOpacity
                      key={item}
                      onPress={() =>
                        item === supermarketFilterName
                          ? setTempSupermarketFilterName('')
                          : setTempSupermarketFilterName(item)
                      }
                      style={
                        item === tempSupermarketFilterName
                          ? {
                            borderColor: COLORS.primary,
                            borderWidth: 1,
                            borderRadius: 10,
                            margin: 5,
                            width: '45%',
                          }
                          : {
                            borderColor: '#c8c8c8',
                            borderWidth: 0.2,
                            borderRadius: 10,
                            margin: 5,
                            width: '45%',
                          }
                      }>
                      <Text
                        style={
                          item === tempSupermarketFilterName
                            ? {
                              width: '100%',
                              paddingVertical: 10,
                              textAlign: 'center',
                              color: COLORS.primary,

                              fontSize: 12,
                            }
                            : {
                              width: '100%',
                              paddingVertical: 10,
                              textAlign: 'center',
                              color: 'black',
                              fontSize: 12,
                            }
                        }>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginTop: '5%',
                }}>
                <TouchableOpacity
                  style={{
                    width: '50%',
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                    backgroundColor: 'white',
                    borderRadius: 10,
                    borderColor: COLORS.primary,
                    borderWidth: 0.5,
                    marginRight: '2%',
                  }}
                  onPress={handleClear}>
                  <Text
                    style={{
                      color: COLORS.primary,
                      fontWeight: 'bold',
                      textAlign: 'center',
                    }}>
                    Thiết lập lại
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    width: '50%',
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                    backgroundColor: COLORS.primary,
                    color: 'white',
                    borderRadius: 10,
                  }}
                  onPress={handleApplySort}>
                  <Text style={styles.textStyle}>Áp dụng</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </Modal>
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
  },
  header: {
    flexWrap: 'wrap', // This property makes items wrap inside the container
    justifyContent: 'flex-start', // Adjust as per your requirements
    alignItems: 'flex-start', // A
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    paddingHorizontal: 20,
  },
  body: {
    flex: 8,
    paddingLeft: 15,
    paddingRight:5,
    marginTop: 5,
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
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: '15%',
    backgroundColor: 'rgba(50,50,50,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
