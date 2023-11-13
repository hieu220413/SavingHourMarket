import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  Image,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {icons} from '../../constants';
import {COLORS} from '../../constants/theme';
import QrCode from '../../assets/image/test-qrcode.png';
import {API} from '../../constants/api';
import {useFocusEffect} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {format} from 'date-fns';
import Toast from 'react-native-toast-message';
import LoadingScreen from '../../components/LoadingScreen';
import {SwipeListView} from 'react-native-swipe-list-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CartEmpty from '../../assets/image/search-empty.png';

const BatchList = ({navigation, route}) => {
  const {date, timeFrame, productConsolidationArea, quantity} = route.params;
  const [initializing, setInitializing] = useState(true);
  const [tokenId, setTokenId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [batchList, setBatchList] = useState([]);
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const onAuthStateChange = async userInfo => {
    setLoading(true);
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
        setLoading(false);
        return;
      }

      const token = await auth().currentUser.getIdToken();
      setTokenId(token);
      setLoading(false);
    } else {
      // no sessions found.
      console.log('user is not logged in');
      setLoading(false);
    }
  };

  useEffect(() => {
    // auth().currentUser.reload()
    const subscriber = auth().onAuthStateChanged(
      async userInfo => await onAuthStateChange(userInfo),
    );
    return subscriber;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        if (auth().currentUser) {
          const tokenId = await auth().currentUser.getIdToken();
          if (tokenId) {
            setLoading(true);
            fetch(
              `${API.baseURL}/api/order/deliveryManager/batchingForStaff?deliverDate=${date}&timeFrameId=${timeFrame.id}&productConsolidationAreaId=${productConsolidationArea.id}&batchQuantity=${quantity}`,
              {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${tokenId}`,
                },
              },
            )
              .then(res => res.json())
              .then(response => {
                console.log(response[0]);
                setBatchList(response);
                setLoading(false);
              })
              .catch(err => {
                console.log(err);
                setLoading(false);
              });
          }
        }
      };
      fetchData();
    }, []),
  );

  const handleCreate = async () => {
    const tokenId = await auth().currentUser.getIdToken();
    let submitBatches = [];
    batchList.map(item => {
      let orderIdList = [];
      item.orderList.map(item => {
        orderIdList.push(item.id);
      });
      const ob = {
        deliverDate: item.deliverDate,
        timeFrameId: item.timeFrame.id,
        orderIdList: orderIdList,
      };
      submitBatches.push(ob);
    });
    console.log(submitBatches);
    setLoading(true);
    fetch(`${API.baseURL}/api/order/deliveryManager/createBatches`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenId}`,
      },
      body: JSON.stringify(submitBatches),
    })
      .then(res => {
        return res.json();
      })
      .then(async respond => {
        console.log(respond);
        setLoading(false);
        navigation.navigate('OrderBatch');
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
        return null;
      });
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss;
        // setOpen(false);
        // setShowLogout(false);
      }}
      accessible={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.pagenameAndLogout}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={icons.leftArrow}
                resizeMode="contain"
                style={{width: 35, height: 35, tintColor: COLORS.primary}}
              />
            </TouchableOpacity>
            <View style={styles.pageName}>
              <Text style={{fontSize: 25, color: 'black', fontWeight: 'bold'}}>
                Tạo nhóm đơn hàng
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.body}>
          {batchList.length === 0 ? (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Image
                style={{width: '100%', height: '50%'}}
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
                Không có nhóm đơn hàng nào được tạo với thông tin bạn nhập
              </Text>
            </View>
          ) : (
            <>
              <ScrollView contentContainerStyle={{marginTop: 10}}>
                <View style={{marginBottom: 80}}>
                  <View style={{marginBottom: 10}}>
                    <Text
                      style={{fontSize: 20, fontWeight: '500', color: 'black'}}>
                      Danh sách nhóm đơn hàng :
                    </Text>
                  </View>
                  {batchList.map((item, index) => (
                    <View
                      key={index}
                      style={{
                        backgroundColor: 'rgb(240,240,240)',
                        marginBottom: 20,
                        borderRadius: 10,
                      }}>
                      {/* Order detail */}
                      <Pressable
                        onPress={() => {
                          console.log(item.id);
                          // navigation.navigate('OrderDetailForManager', {
                          //   id: item.id,
                          //   orderSuccess: false,
                          // });
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: 20,
                          }}>
                          <View style={{flexDirection: 'column', gap: 8}}>
                            <Text
                              style={{
                                fontSize: 20,
                                fontWeight: 'bold',
                                fontFamily: 'Roboto',
                                color: COLORS.primary,
                              }}>
                              Nhóm đơn hàng {index + 1} :
                            </Text>
                            <Text
                              style={{
                                fontSize: 17,
                                fontWeight: 'bold',
                                fontFamily: 'Roboto',
                                color: 'black',
                              }}>
                              Ngày giao :{' '}
                              {format(
                                Date.parse(item?.deliverDate),
                                'dd/MM/yyyy',
                              )}
                            </Text>
                            <Text
                              style={{
                                fontSize: 17,
                                fontWeight: 'bold',
                                fontFamily: 'Roboto',
                                color: 'black',
                              }}>
                              Giờ giao hàng : {item?.timeFrame?.fromHour} đến{' '}
                              {item?.timeFrame?.toHour}
                            </Text>
                            <Text
                              style={{
                                fontSize: 17,
                                fontWeight: 'bold',
                                fontFamily: 'Roboto',
                                color: 'black',
                              }}>
                              Số lượng đơn : {item?.orderList.length}
                            </Text>
                          </View>
                        </View>
                      </Pressable>
                    </View>
                  ))}
                </View>
              </ScrollView>
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  backgroundColor: 'white',
                  borderTopColor: 'transparent',
                  height: 70,
                  width: windowWidth,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 20,
                  paddingHorizontal: 25,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Batching');
                  }}
                  style={{
                    height: '60%',
                    width: 170,
                    backgroundColor: 'red',
                    textAlign: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 40,
                    borderRadius: 30,
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 20,
                      fontFamily: 'Roboto',
                      fontWeight: 'bold',
                    }}>
                    Huỷ
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    handleCreate();
                  }}
                  style={{
                    height: '60%',
                    width: 170,
                    backgroundColor: COLORS.primary,
                    textAlign: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 40,
                    borderRadius: 30,
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 20,
                      fontFamily: 'Roboto',
                      fontWeight: 'bold',
                    }}>
                    Xác nhận
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
        {loading && <LoadingScreen />}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default BatchList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flex: 1,
    // backgroundColor: 'orange',
    paddingHorizontal: 20,
  },
  body: {
    flex: 10,
    // backgroundColor: 'pink',
    paddingHorizontal: 20,
  },
  pagenameAndLogout: {
    paddingTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  pageName: {
    flex: 7,
    // backgroundColor: 'white',
  },
});
