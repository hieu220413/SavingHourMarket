/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState, useCallback} from 'react';
import {View, Image, Text, TouchableOpacity, Keyboard} from 'react-native';
import {icons} from '../constants';
import {COLORS, FONTS} from '../constants/theme';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {API} from '../constants/api';
import Modal, {
  ModalFooter,
  ModalButton,
  ScaleAnimation,
} from 'react-native-modals';
import {TextInput} from 'react-native-gesture-handler';
import LoadingScreen from '../components/LoadingScreen';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import {useFocusEffect} from '@react-navigation/native';

const EditCustomerLocation = ({navigation, route}) => {
  const {setCustomerLocation, customerLocation, pickupPoint} = route.params;
  const [locationPicked, setLocationPicked] = useState(customerLocation);
  const [openValidateDialog, setOpenValidateDialog] = useState(false);
  const [validateMessage, setValidateMessage] = useState('');
  const [text, setText] = useState(customerLocation.address);
  const [searchValue, setSearchValue] = useState(customerLocation.address);
  const [data, setData] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shippingDetail, setShippingDetail] = useState(null);
  const [isFetchShipDetail, setIsFetchShipDetail] = useState(false);
  const [shippingCostPolicy, setShippingCostPolicy] = useState({
    initialShippingFee: 10000,
    minKmDistanceForExtraShippingFee: 2,
    extraShippingFeePerKilometer: 1000,
  });

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

  useEffect(() => {
    const fetchShipDetail = async () => {
      setLoading(true);
      setIsFetchShipDetail(true);
      const tokenId = await auth().currentUser.getIdToken();
      fetch(
        `${API.baseURL}/api/order/getShippingFeeDetail?latitude=${locationPicked.lat}&longitude=${locationPicked.long}&pickupPointId=${pickupPoint.id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokenId}`,
          },
        },
      )
        .then(respond => respond.json())
        .then(res => {
          setShippingDetail(res);
          setIsFetchShipDetail(false);
          setLoading(false);
        })
        .catch(err => {
          console.log(err);
        });
      fetch(`${API.baseURL}/api/configuration/getConfiguration`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenId}`,
        },
      })
        .then(res => res.json())
        .then(respond => {
          console.log(respond);
          if (respond?.code === 404 || respond.status === 500) {
            setLoading(false);
            return;
          }
          setShippingCostPolicy({
            initialShippingFee: respond.initialShippingFee,
            minKmDistanceForExtraShippingFee:
              respond.minKmDistanceForExtraShippingFee,
            extraShippingFeePerKilometer: respond.extraShippingFeePerKilometer,
          });
          setLoading(false);
        })
        .catch(err => console.log(err));
    };
    fetchShipDetail();
  }, [locationPicked]);

  const selectLocation = item => {
    Keyboard.dismiss();
    setIsFocused(false);
    setLoading(true);
    fetch(
      `https://rsapi.goong.io/Place/Detail?place_id=${item.place_id}&api_key=${API.GoongAPIKey}`,
    )
      .then(res => res.json())
      .then(async respond => {
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
          setCustomerLocation(picked);
          setLocationPicked(picked);

          // navigation.navigate('Payment');
        } else {
          setValidateMessage('Chúng tôi chỉ giao hàng trong khu vực TP.HCM');
          setOpenValidateDialog(true);
          setLoading(false);
          return;
        }
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

  const typingTimeoutRef = useRef(null);

  const onChange = text => {
    setText(text);
    setIsFetchShipDetail(true);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setSearchValue(text);
    }, 400);
  };

  return (
    <>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',

          backgroundColor: '#ffffff',
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 10,
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
            fontSize: 20,
            textAlign: 'center',
            color: '#000000',
            fontWeight: 'bold',
            fontFamily: 'Roboto',
          }}>
          Nhập địa chỉ
        </Text>
        <View></View>
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

        {isFocused && data.length !== 0 && (
          <View
            style={{
              backgroundColor: 'white',

              height: '100%',
              paddingHorizontal: 15,
            }}>
            {data.map((item, i) => (
              <Item key={i} item={item} />
            ))}
          </View>
        )}
      </View>
      {shippingDetail && !isFetchShipDetail && (
        <View style={{backgroundColor: 'white', padding: 20, marginTop: 20}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              marginBottom: 10,
            }}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: 'Roboto',
                color: 'black',
                fontWeight: 'bold',
              }}>
              Chi tiết giao hàng
            </Text>
          </View>

          <View
            style={{
              // flexDirection: 'row',
              alignItems: 'start',
              gap: 5,
              paddingTop: 10,
              paddingBottom: 10,
              borderTopColor: '#decbcb',
              borderTopWidth: 0.75,
            }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'Roboto',
                color: 'black',
                fontWeight: 'bold',
              }}>
              Điểm giao hàng đã chọn :
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'Roboto',
                color: 'black',
                // fontWeight: 'bold',
              }}>
              {pickupPoint.address}
            </Text>
          </View>
          <View
            style={{
              // flexDirection: 'row',
              alignItems: 'start',
              gap: 5,
              paddingTop: 10,
              paddingBottom: 10,
              borderTopColor: '#decbcb',
              borderTopWidth: 0.75,
            }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'Roboto',
                color: 'black',
                fontWeight: 'bold',
              }}>
              Địa chỉ của bạn :
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'Roboto',
                color: 'black',
                // fontWeight: 'bold',
              }}>
              {locationPicked.address}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 15,
              paddingTop: 10,
              borderTopColor: '#decbcb',
              borderTopWidth: 0.75,
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'Roboto',
                color: 'black',
                fontWeight: 'bold',
              }}>
              Khoảng cách :
            </Text>
            <Text style={{fontSize: 18, fontFamily: 'Roboto', color: 'black'}}>
              {shippingDetail.closestPickupPoint.distance}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 15,
              paddingVertical: 5,
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'Roboto',
                color: 'black',
                fontWeight: 'bold',
              }}>
              Phí giao hàng:
            </Text>
            <Text style={{fontSize: 18, fontFamily: 'Roboto', color: 'black'}}>
              {shippingDetail.shippingFee.toLocaleString('vi-VN', {
                style: 'currency',
                currency: 'VND',
              })}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 15,
              justifyContent: 'center',
              paddingTop: 10,
              borderTopColor: '#decbcb',
              borderTopWidth: 0.75,
              marginTop: 5,
            }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Roboto',
                color: 'black',
                textAlign: 'center',
              }}>
              Phí giao hàng tính bằng khoảng cách từ địa chỉ của bạn đến địa
              điểm giao hàng đã chọn: dưới{' '}
              {shippingCostPolicy.minKmDistanceForExtraShippingFee}
              km là{' '}
              {shippingCostPolicy.initialShippingFee.toLocaleString('vi-VN', {
                style: 'currency',
                currency: 'VND',
              })}
              , trên {shippingCostPolicy.minKmDistanceForExtraShippingFee}
              km sẽ cộng{' '}
              {shippingCostPolicy.extraShippingFeePerKilometer.toLocaleString(
                'vi-VN',
                {
                  style: 'currency',
                  currency: 'VND',
                },
              )}
              /1km
            </Text>
          </View>
        </View>
      )}

      {shippingDetail && !isFetchShipDetail && (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'white',
            borderTopColor: 'transparent',
            height: 70,
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',

            marginTop: 20,
            elevation: 10,
          }}>
          <View style={{width: '95%'}}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Payment')}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: COLORS.primary,
                paddingVertical: 10,
                width: '100%',
                borderRadius: 30,
              }}>
              <Text
                style={{
                  fontSize: 18,
                  color: 'white',
                  fontFamily: 'Roboto',
                  fontWeight: 'bold',
                }}>
                Chấp nhận
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

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
              textStyle={{color: 'red'}}
              text="Đóng"
              onPress={() => {
                setOpenValidateDialog(false);
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
            {validateMessage}
          </Text>
        </View>
      </Modal>
      {loading && <LoadingScreen />}
    </>
  );
};

export default EditCustomerLocation;
