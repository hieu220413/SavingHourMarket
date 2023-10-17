/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */

import React, {useCallback, useState} from 'react';
import {View, Image, Text} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {icons} from '../constants';
import {COLORS} from '../constants/theme';
import {useFocusEffect} from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import GetLocation from 'react-native-get-location';
import {API} from '../constants/api';
import LoadingScreen from '../components/LoadingScreen';

const SelectPickupPoint = ({navigation, route}) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [pickupPointSuggestionList, setPickupPointSuggestionList] = useState(
    [],
  );
  const [otherPickupPointList, setOtherPickupPointList] = useState([]);
  const [loading, setLoading] = useState(false);

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
      const longitude = 106.644295;
      const latitude = 10.8022319;

      // get suggest pickup point
      setLoading(true);
      fetch(
        `${API.baseURL}/api/pickupPoint/getWithSortAndSuggestion?latitude=${latitude}&longitude=${longitude}`,
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

      // Xài đỡ cái này
      // setLoading(true);
      // fetch(`${API.baseURL}/api/pickupPoint/getAll`)
      //   .then(res => res.json())
      //   .then(response => {
      //     setOtherPickupPointList(response);
      //     setLoading(false);
      //   })
      //   .catch(err => {
      //     console.log(err);
      //     setLoading(false);
      //   });
      // ****************
    }, []),
  );

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
        <View style={{backgroundColor: 'white', padding: 20}}>
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
