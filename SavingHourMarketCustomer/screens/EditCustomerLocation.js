/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View, Image, Text, TouchableOpacity} from 'react-native';
import {icons} from '../constants';
import {COLORS} from '../constants/theme';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {API} from '../constants/api';
import Modal, {
  ModalFooter,
  ModalButton,
  ScaleAnimation,
} from 'react-native-modals';

const EditCustomerLocation = ({navigation, route}) => {
  const {setCustomerLocation, customerLocation} = route.params;
  const [locationPicked, setLocationPicked] = useState(null);
  const [clear, setClear] = useState(false);
  const [openValidateDialog, setOpenValidateDialog] = useState(false);
  const [textHasChanged, setTextHasChanged] = useState(false);
  const [validateMessage, setValidateMessage] = useState('');

  const [shouldSetDefaultValue, setShouldSetDefaultValue] = useState(true);
  useEffect(() => {
    const cleanUp = setTimeout(() => {
      setShouldSetDefaultValue(false);
    }, 1000);
    // return () => cleanUp();
  }, []);

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
              if (textHasChanged) {
                setValidateMessage('Địa chỉ không hợp lệ');
                setOpenValidateDialog(true);
                return;
              }
            }

            if (
              !locationPicked.address.includes('Ho Chi Minh') ||
              !locationPicked.address.includes('HCM')
            ) {
              setValidateMessage(
                'Chúng tôi chỉ giao hàng trong khu vực TP.HCM',
              );
              setOpenValidateDialog(true);
              return;
            }
            setCustomerLocation(
              locationPicked ? locationPicked : customerLocation,
            );
            navigation.navigate('Payment');
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
      <View style={{marginTop: 8, height: '100%'}}>
        <GooglePlacesAutocomplete
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
            setLocationPicked(location);
          }}
          textInputProps={{
            onChangeText: value => {
              setTextHasChanged(true);
            },
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
        />
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
    </>
  );
};

export default EditCustomerLocation;
