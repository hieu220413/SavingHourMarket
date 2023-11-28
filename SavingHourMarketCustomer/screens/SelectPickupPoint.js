/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, Image, Text, TouchableOpacity, Keyboard} from 'react-native';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import {icons} from '../constants';
import {COLORS, FONTS} from '../constants/theme';
import {useFocusEffect} from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import GetLocation from 'react-native-get-location';
import {API} from '../constants/api';
import LoadingScreen from '../components/LoadingScreen';
import database from '@react-native-firebase/database';

const SelectPickupPoint = ({navigation, route}) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [pickupPointSuggestionList, setPickupPointSuggestionList] = useState(
    [],
  );
  const [otherPickupPointList, setOtherPickupPointList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState(
    'Đại học FPT Thành phố Hồ Chí Minh, Lô E2A-7, Khu Công nghệ Cao, Đường D1, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh',
  );
  const [data, setData] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [locationPicked, setLocationPicked] = useState({
    address:
      'Đại học FPT Thành phố Hồ Chí Minh, Lô E2A-7, Khu Công nghệ Cao, Đường D1, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh',
    long: 106.80963049400003,
    lat: 10.841264169000063,
  });

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

  useFocusEffect(
    useCallback(() => {
      // Geolocation.getCurrentPosition(
      //   position => {
      //     console.log(position.coords.longitude);
      //     console.log(position.coords.latitude);
      //     const currentLongtitude = position.coords.longitude;
      //     const currentLatitude = position.coords.latitude;
      //     // console.log(currentLongtitude);
      //     // console.log(currentLatitude);
      //     // reverse geolocation
      //     // fetch(
      //     //   `https://maps.googleapis.com/maps/api/geocode/json?latlng=21.028280,105.853882&country=vn&key=AIzaSyA9ZGqIsMJKMcpqjgGZXKW2QBNMmgXCX2g`,
      //     // )
      //     //   .then(res => res.json())
      //     //   .then(response => {
      //     //     console.log(response.results[0]?.formatted_address);
      //     //     console.log(response);
      //     //   })
      //     //   .catch(err => console.log(err));
      //     //  ***********************************
      //     // get pickuppoint
      //     // fetch(
      //     //   `http://saving-hour-market.ap-southeast-2.elasticbeanstalk.com/api/pickupPoint/getWithSortAndSuggestion?latitude=${currentLatitude}&longitude=${currentLongtitude}`,
      //     // )
      //     //   .then(res => res.json())
      //     //   .then(response => {
      //     //     console.log(response);
      //     //   })
      //     //   .catch(err => console.log(err));
      //     // *********************
      //   },
      //   error => {
      //     console.log(error.message);
      //   },
      //   {
      //     enableHighAccuracy: true,
      //   },
      // );

      // get suggest pickup point
      setLoading(true);
      fetch(
        `${API.baseURL}/api/pickupPoint/getWithSortAndSuggestion?latitude=${locationPicked?.lat}&longitude=${locationPicked?.long}`,
      )
        .then(res => res.json())
        .then(response => {
          console.log(response);
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
      // *************************
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
        setText(item.description);
        setSearchValue(item.description);
        setLocationPicked(picked);
        setLoading(false);
      })
      .catch(err => console.log(err));
  };

  const Item = ({item}) => {
    return (
      <View
        style={{
          borderColor: '#decbcb',
          borderBottomWidth: 0.74,

          paddingVertical: 15,
        }}>
        <TouchableOpacity onPress={() => selectLocation(item)}>
          <Text
            numberOfLines={1}
            style={{
              color: 'black',
              fontFamily: FONTS.fontFamily,
              fontSize: 16,
              lineHeight: 40,
            }}>
            {item.description}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const typingTimeoutRef = useRef(null);

  const onChange = text => {
    setText(text);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setSearchValue(text);
    }, 400);
  };

  return (
    <>
      <ScrollView>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            flexDirection: 'row',
            gap: 20,
            marginBottom: 30,
            backgroundColor: '#ffffff',
            padding: 20,
            elevation: 4,
          }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={icons.leftArrow}
              resizeMode="contain"
              style={{width: 35, height: 35, tintColor: COLORS.primary}}
            />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 25,
              textAlign: 'center',
              color: '#000000',
              fontWeight: 'bold',
              fontFamily: 'Roboto',
            }}>
            Chọn điểm giao hàng
          </Text>
        </View>
        <View
          style={{
            // height: '100%',
            position: 'relative',
          }}>
          <Image
            style={{
              width: 25,
              height: 30,
              position: 'absolute',
              top: 15,
              left: 20,
              zIndex: 99,
              tintColor: '#ad9b9b',
            }}
            source={icons.searchIcon}
          />
          <TextInput
            numberOfLines={1}
            style={{
              backgroundColor: 'white',
              paddingLeft: 10,
              paddingRight: 40,
              paddingHorizontal: 15,
              color: 'black',
              fontFamily: FONTS.fontFamily,
              fontSize: text ? 18 : 21,
              lineHeight: 40,
              height: 60,
              paddingLeft: 60,
            }}
            value={text}
            onChangeText={data => onChange(data)}
            placeholder="Địa điểm hiện tại của bạn ở đâu"
            onFocus={() => {
              setIsFocused(true);
            }}
          />
          <TouchableOpacity
            onPress={() => {
              setText('');
              setSearchValue('');
              setIsFocused(true);
            }}
            style={{
              position: 'absolute',
              top: 20,
              right: 10,
              zIndex: 999,
            }}>
            <Image
              resizeMode="contain"
              source={icons.cross}
              style={{width: 20, height: 20, tintColor: '#ad9b9b'}}
            />
          </TouchableOpacity>

          {isFocused && (
            <View
              style={{
                backgroundColor: 'white',
                borderBottomColor: '#decbcb',
                borderBottomWidth: 0.75,
                height: '100%',
                paddingHorizontal: 15,
              }}>
              {data.map((item, i) => (
                <Item key={i} item={item} />
              ))}
            </View>
          )}
        </View>
        <View style={{backgroundColor: 'white', padding: 20, marginTop: 20}}>
          <Text
            style={{
              fontSize: 20,
              color: 'black',
              fontFamily: 'Roboto',
              fontWeight: 'bold',
              paddingBottom: 20,
              borderBottomColor: '#decbcb',
              borderBottomWidth: 0.75,
            }}>
            Điểm giao hàng gần nhất
          </Text>
          {/* Suggest Pickup point */}
          {pickupPointSuggestionList.map(item => (
            <TouchableOpacity
              key={item.id}
              onPress={() => {
                route.params.setPickupPoint(item);
                navigation.navigate('Payment');
              }}
              style={{
                paddingVertical: 15,

                borderBottomColor: '#decbcb',
                borderBottomWidth: 0.75,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 15,
                  flex: 1,
                }}>
                <Image
                  resizeMode="contain"
                  style={{width: 25, height: 25}}
                  source={icons.location}
                />
                <Text
                  style={{
                    fontSize: 17,
                    color: 'black',
                    fontFamily: 'Roboto',
                    width: '70%',
                  }}>
                  {item.address}
                </Text>
                <Text style={{fontSize: 14}}>{item.distance}</Text>
              </View>
            </TouchableOpacity>
          ))}

          {/* ******* */}
          <Text
            style={{
              fontSize: 20,
              color: 'black',
              fontFamily: 'Roboto',
              fontWeight: 'bold',
              paddingBottom: 20,
              marginTop: 20,
              borderBottomColor: '#decbcb',
              borderBottomWidth: 0.75,
            }}>
            Khác
          </Text>
          {/* Order pickup point */}
          {otherPickupPointList.map(item => (
            <TouchableOpacity
              key={item.id}
              onPress={() => {
                route.params.setPickupPoint(item);
                navigation.navigate('Payment');
              }}
              style={{
                paddingVertical: 15,

                borderBottomColor: '#decbcb',
                borderBottomWidth: 0.75,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 15,
                  flex: 1,
                }}>
                <Image
                  resizeMode="contain"
                  style={{width: 25, height: 25}}
                  source={icons.location}
                />
                <Text
                  style={{
                    fontSize: 17,
                    color: 'black',
                    fontFamily: 'Roboto',
                    width: '70%',
                  }}>
                  {item.address}
                </Text>
                <Text style={{fontSize: 14}}>{item.distance}</Text>
              </View>
            </TouchableOpacity>
          ))}

          {/* *************************** */}
        </View>
      </ScrollView>
      {loading && <LoadingScreen />}
    </>
  );
};

export default SelectPickupPoint;
