/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Keyboard,
  Dimensions,
} from 'react-native';
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { icons } from '../constants';
import { COLORS, FONTS } from '../constants/theme';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import LoadingScreen from '../components/LoadingScreen';
import { useFocusEffect } from '@react-navigation/native';
import { API } from '../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal, {
  ModalFooter,
  ModalButton,
  ScaleAnimation,
} from 'react-native-modals';
import database from '@react-native-firebase/database';

const ChangePickupPoint = ({ navigation, route }) => {
  const [pickupPointSuggestionList, setPickupPointSuggestionList] = useState(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState(route.params.pickupPoint.address);
  const [data, setData] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [locationPicked, setLocationPicked] = useState({
    address: route.params.pickupPoint.address,
    long: route.params.pickupPoint.longitude,
    lat: route.params.pickupPoint.latitude,
  });
  const [otherPickupPointList, setOtherPickupPointList] = useState([]);
  const [openValidateDialog, setOpenValidateDialog] = useState(false);
  const [validateMessage, setValidateMessage] = useState('');

  const typingTimeoutRef = useRef(null);

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
              routes: [{ name: 'Initial' }],
            });
          } else {
            // setSystemStatus(snapshot.val());
          }
        });
    }, []),
  );

  const handleTypingSearch = value => {
    setText(value);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setSearchValue(value);
    }, 400);
  };

  const handleClearText = () => {
    setText('');
    handleTypingSearch('');
  };

  const storedPickupPoint = async item => {
    AsyncStorage.removeItem('PickupPoint');
    try {
      await AsyncStorage.setItem('PickupPoint', JSON.stringify(item));
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      // get suggest pickup point
      setLoading(true);
      fetch(
        `${API.baseURL}/api/pickupPoint/getWithSortAndSuggestion?latitude=${locationPicked?.lat}&longitude=${locationPicked?.long}`,
      )
        .then(res => res.json())
        .then(response => {
          setPickupPointSuggestionList(
            response.sortedPickupPointSuggestionList,
          );
          setOtherPickupPointList(response.otherSortedPickupPointList);
          setLoading(false);
        })
        .catch(err => {
          console.log(err);
          setLoading(false);
        });
    }, [locationPicked]),
  );

  useEffect(() => {
    fetch(
      `https://rsapi.goong.io/Place/AutoComplete?api_key=${API.GoongAPIKey}&input=${searchValue}`,
    )
      .then(res => res.json())
      .then(respond => {
        if (respond.predictions) {
          setData(respond.predictions);
        } else {
          setData([]);
        }
      })
      .catch(err => console.log(err));
  }, [searchValue]);

  const selectLocation = item => {
    Keyboard.dismiss();
    setIsFocused(false);
    setLoading(true);
    fetch(
      `https://rsapi.goong.io/Place/Detail?place_id=${item.place_id}&api_key=${API.GoongAPIKey}`,
    )
      .then(res => res.json())
      .then(respond => {
        const picked = {
          address: item.description,
          long: respond.result.geometry.location.lng,
          lat: respond.result.geometry.location.lat,
        };

        if (
          picked.address.includes('Ho Chi Minh') ||
          picked.address.includes('Hồ Chí Minh') ||
          picked.address.includes('HCM')
        ) {
          setText(item.description);
          setSearchValue(item.description);
          setLocationPicked(picked);
          setLoading(false);
        } else {
          setValidateMessage('Chúng tôi chỉ giao hàng trong khu vực TP.HCM');
          setOpenValidateDialog(true);
          setLoading(false);
          return;
        }
      })
      .catch(err => console.log(err));
  };
  const Item = ({ item }) => {
    return (
      <View
        style={{
          borderColor: '#decbcb',
          borderBottomWidth: 0.74,
          paddingVertical: '2%',
        }}>
        <TouchableOpacity onPress={() => selectLocation(item)}>
          <Text
            numberOfLines={1}
            style={{
              color: 'black',
              fontFamily: FONTS.fontFamily,
              fontSize: Dimensions.get('window').width * 0.04,
              lineHeight: Dimensions.get('window').height * 0.06,
            }}>
            {item.description}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      <View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: '2%',
          }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={icons.leftArrow}
              resizeMode="contain"
              style={{ width: Dimensions.get('window').width * 0.1, height: 35, tintColor: COLORS.primary }}
            />
          </TouchableOpacity>
          {/* Search Bar */}
          <View style={style.container}>
            <View style={style.wrapperSearch}>
              <Image
                resizeMode="center"
                style={style.icon}
                source={icons.search}
              />
            </View>
            <TextInput
              style={style.input}
              placeholder="Bạn cần tìm gì ?"
              value={text}
              onChangeText={data => {
                setText(data);
                handleTypingSearch(data);
              }}
              onFocus={() => {
                setIsFocused(true);
              }}
            />
            <View style={style.clear}>
              <TouchableOpacity onPress={handleClearText}>
                <Image
                  resizeMode="center"
                  style={style.icon}
                  source={icons.clearText}></Image>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {isFocused && (
          <View
            style={{
              backgroundColor: 'white',
              borderBottomColor: '#decbcb',
              borderBottomWidth: 0.75,
              height: '100%',
              paddingHorizontal: '2%',
            }}>
            {data.map((item, i) => (
              <Item key={i} item={item} />
            ))}
          </View>
        )}

        {/* Suggest Pickup point */}
        <Text
          style={{
            fontSize: Dimensions.get('window').width * 0.055,
            color: 'black',
            fontFamily: 'Roboto',
            fontWeight: 'bold',
            paddingBottom: 20,
            borderBottomColor: '#decbcb',
            borderBottomWidth: 0.75,
            marginHorizontal: '2%',
            marginVertical: '5%',
          }}>
          Điểm giao hàng gần bạn nhất
        </Text>
        <ScrollView
          style={{
            paddingHorizontal: '2%',
          }}>
          {pickupPointSuggestionList.map((item, index) => (
            <View key={index}>
              {item.distanceInValue !== 0 && (
                <>
                  <TouchableOpacity
                    key={item.id}
                    onPress={async () => {
                      try {
                        storedPickupPoint(item);
                        route.params.setPickupPoint(item);
                        navigation.navigate('Start');
                      } catch (e) {
                        console.log(e);
                      }
                    }}
                    style={{
                      paddingVertical: '4%',
                      borderBottomColor: '#decbcb',
                      borderBottomWidth: 0.75,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 12,
                        flex: 1,
                      }}>
                      <Image
                        resizeMode="contain"
                        style={{ width: Dimensions.get('window').width * 0.06, height: 25 }}
                        source={icons.location}
                      />
                      <Text
                        style={{
                          fontSize: Dimensions.get('window').width * 0.04,
                          color: 'black',
                          fontFamily: 'Roboto',
                          width: '70%',
                        }}>
                        {item.address}
                      </Text>
                      <Text style={{ fontSize: Dimensions.get('window').width * 0.035 }}>{item.distance}</Text>
                    </View>
                  </TouchableOpacity>
                </>
              )}
            </View>
          ))}
        </ScrollView>
        {/* ******* */}
        <Text
          style={{
            fontSize: Dimensions.get('window').width * 0.055,
            color: 'black',
            fontFamily: 'Roboto',
            fontWeight: 'bold',
            paddingBottom: 20,
            marginTop: 20,
            borderBottomColor: '#decbcb',
            borderBottomWidth: 0.75,
            marginHorizontal: '2%',
          }}>
          Khác
        </Text>
        {/* Order pickup point */}
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: '2%',
          }}>
          {otherPickupPointList.map(item => (
            <TouchableOpacity
              key={item.id}
              onPress={async () => {
                try {
                  storedPickupPoint(item);
                  route.params.setPickupPoint(item);
                  navigation.navigate('Start');
                } catch (e) {
                  console.log(e);
                }
              }}
              style={{
                paddingVertical: '2%',
                borderBottomColor: '#decbcb',
                borderBottomWidth: 0.75,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  flex: 1,
                }}>
                <Image
                  resizeMode="contain"
                  style={{ width: Dimensions.get('window').width * 0.06, height: 25 }}
                  source={icons.location}
                />
                <Text
                  style={{
                    fontSize: Dimensions.get('window').width * 0.04,
                    color: 'black',
                    fontFamily: 'Roboto',
                    width: '70%',
                  }}>
                  {item.address}
                </Text>
                <Text style={{ fontSize: Dimensions.get('window').width * 0.035 }}>{item.distance}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <Modal
        width={0.8}
        visible={openValidateDialog}
        onTouchOutside={() => {
          setOpenValidateDialog(false);
        }}
        dialogAnimation={
          new ScaleAnimation({
            initialValue: 0, // optional
            useNativeDriver: true, // optional
          })
        }
        footer={
          <ModalFooter>
            <ModalButton
              textStyle={{ color: 'red' }}
              text="Đóng"
              onPress={() => {
                setOpenValidateDialog(false);
              }}
            />
          </ModalFooter>
        }>
        <View
          style={{ padding: 20, alignItems: 'center', justifyContent: 'center' }}>
          <Text
            style={{
              fontSize: 20,
              fontFamily: 'Roboto',
              color: 'black',
              textAlign: 'center',
            }}>
            {validateMessage}
          </Text>
        </View>
      </Modal>
      {loading && <LoadingScreen />}
    </>
  );
};

export default ChangePickupPoint;

const style = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    width: '80%',
    height: 45,
    borderRadius: 40,
    paddingLeft: 10,
    marginTop: 10,
    marginLeft: 20,
    marginBottom: 10,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  input: {
    fontFamily: FONTS.fontFamily,
    fontSize: Dimensions.get('window').width * 0.04,
    flex: 1,
  },
  wrapperSearch: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    flex: 0.2,
  },
  icon: {
    width: Dimensions.get('window').width * 0.1,
    height: 20,
  },
  clear: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
});
