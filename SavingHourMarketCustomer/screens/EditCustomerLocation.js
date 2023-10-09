/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
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

const EditCustomerLocation = ({navigation, route}) => {
  const {setCustomerLocation, customerLocation} = route.params;
  const [locationPicked, setLocationPicked] = useState(customerLocation);
  const [openValidateDialog, setOpenValidateDialog] = useState(false);
  const [validateMessage, setValidateMessage] = useState('');
  const [text, setText] = useState(customerLocation.address);
  const [searchValue, setSearchValue] = useState(customerLocation.address);
  const [data, setData] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  const selectLocation = item => {
    setText(item.description);
    setSearchValue(item.description);
    Keyboard.dismiss();
    setIsFocused(false);

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

        setLocationPicked(picked);
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
    setLocationPicked(null);
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
          Địa chỉ
        </Text>
        <TouchableOpacity
          onPress={() => {
            if (!locationPicked) {
              setValidateMessage('Địa chỉ không hợp lệ');
              setOpenValidateDialog(true);
              return;
            }

            if (
              locationPicked.address.includes('Ho Chi Minh') ||
              locationPicked.address.includes('Hồ Chí Minh') ||
              locationPicked.address.includes('HCM')
            ) {
              setCustomerLocation(locationPicked);
              navigation.navigate('Payment');
            } else {
              setValidateMessage(
                'Chúng tôi chỉ giao hàng trong khu vực TP.HCM',
              );
              setOpenValidateDialog(true);
              return;
            }
          }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'Roboto',
              fontWeight: 'bold',
              color: COLORS.primary,
            }}>
            Cập nhật
          </Text>
        </TouchableOpacity>
      </View>
      <Text
        style={{
          fontSize: 16,
          fontWeight: 'bold',
          marginLeft: 10,
        }}>
        Địa chỉ
      </Text>
      <View style={{marginTop: 8, height: '100%', position: 'relative'}}>
        <TextInput
          numberOfLines={1}
          style={{
            backgroundColor: 'white',
            paddingLeft: 10,
            paddingRight: 30,
            paddingHorizontal: 15,
            color: 'black',
            fontFamily: FONTS.fontFamily,
            fontSize: 16,
            lineHeight: 40,
            height: 60,
          }}
          value={text}
          onChangeText={data => onChange(data)}
          onFocus={() => {
            setIsFocused(true);
          }}
        />
        <TouchableOpacity
          onPress={() => {
            setText('');
            setSearchValue('');
            setLocationPicked(null);
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
            style={{width: 20, height: 20}}
          />
        </TouchableOpacity>

        {isFocused && data.length !== 0 && (
          <View
            style={{
              backgroundColor: 'white',
              marginTop: 10,
              height: '100%',
              paddingHorizontal: 15,
            }}>
            {data.map(item => (
              <Item item={item} />
            ))}
          </View>
        )}

        {/* <GooglePlacesAutocomplete
          ref={ref => {
            if (shouldSetDefaultValue) {
              ref?.setAddressText(customerLocation.address);
            }
            if (clear) {
              ref?.setAddressText('');
              setTextHasChanged(true);
            }
          }}
          placeholder="Nhập địa chỉ mới"
          autoFocus={false}
          returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
          listViewDisplayed="auto" // true/false/undefined
          fetchDetails={true}
          renderDescription={row => row.description} // custom description render
          onPress={(data, details = null) => {
            const location = {
              address: details.formatted_address,
              long: details.geometry.location.lng,
              lat: details.geometry.location.lat,
            };
            console.log(location);
            setLocationPicked(location);
          }}
          query={{
            // available options: https://developers.google.com/places/web-service/autocomplete
            key: API.GoogleMapAPIKey,
            language: 'vn', // language of the results
            components: 'country:vn',
          }}
          styles={{
            textInputContainer: {
              width: '100%',
              // borderBottomColor: 'black',
              height: 50,
            },
            textInput: {
              fontSize: 16,
              fontFamily: 'Roboto',
              color: 'black',
              padding: 20,
              height: 60,
              paddingRight: 40,
            },
            description: {
              fontWeight: 'bold',
              color: 'black',
              fontFamily: 'Roboto',
              fontSize: 16,
            },
            predefinedPlacesDescription: {
              color: '#1faadb',
            },
          }}
          enablePoweredByContainer={false}
          renderRightButton={() => (
            <TouchableOpacity
              onPress={() => {
                setClear(true);
                setTimeout(() => setClear(false), 300);
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
                style={{width: 20, height: 20}}
              />
            </TouchableOpacity>
          )}
          // currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
          // currentLocationLabel="Current location"
          onFail={error => console.log(error)}
          onNotFound={() => console.log('no results')}
          nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
          filterReverseGeocodingByTypes={['locality']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
          debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
        /> */}
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
