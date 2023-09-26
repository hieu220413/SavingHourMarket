/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Image, Text} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {icons} from '../constants';
import {COLORS} from '../constants/theme';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

const EditCustomerLocation = ({navigation}) => {
  return (
    <>
      <View
        style={{
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
            fontSize: 30,
            textAlign: 'center',
            color: '#000000',
            fontWeight: 'bold',
            fontFamily: 'Roboto',
          }}>
          Location
        </Text>
      </View>
      <View style={{backgroundColor: 'white', marginTop: 20}}>
        <GooglePlacesAutocomplete
          placeholder="Type a place"
          query={{
            key: 'AIzaSyAS9g-YaD4h7Yrp3A4Myf8GhxLJCdpLC4M',
            language: 'en',
          }}
          fetchDetails={true}
          onPress={(data, details = null) => console.log(data, details)}
          onFail={error => console.log(error)}
          onNotFound={() => console.log('no results')}
          GooglePlacesDetailsQuery={{
            fields: ['formatted_address', 'geometry'],
          }}
          debounce={500}
        />
      </View>
    </>
  );
};

export default EditCustomerLocation;
