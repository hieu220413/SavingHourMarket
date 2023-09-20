import {
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  Platform,
  Button,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {ScrollView} from 'react-native-gesture-handler';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DateTimePicker from '@react-native-community/datetimepicker';
import FlatButton from '../shared/button';

const EditProfile = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [dateOfBirthError, setDateOfBirthError] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [display, setDisplay] = useState(false);
  const toggleDatepicker = () => {
    setShowPicker(!showPicker);
  };
  const onChange = ({type}, selectedDate) => {
    if (type == 'set') {
      const currentDate = selectedDate;
      setDate(currentDate);
      if (Platform.OS === 'android') {
        toggleDatepicker();
        setDateOfBirth(formatDate(currentDate));
      }
    } else {
      toggleDatepicker();
    }
  };
  const formatDate = rawDate => {
    let date = new Date(rawDate);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    return `${day}/${month}/${year}`;
  };
  const isValidEmail = email => {
    const regex = /^([A-Za-z0-9_\-\.])+@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    return regex.test(email);
  };
  const isValidForm = () => {
    setUsernameError('');
    setDateOfBirthError('');
    setEmailError('');
    setAddressError('');
    setPhoneError('');
    if (username.trim().length == 0) {
      return setUsernameError('Username can not be empty !');
    }
    if (username.trim().length < 3) {
      return setUsernameError('Invalid username');
    }
    if (dateOfBirth.trim().length == 0) {
      return setDateOfBirthError('Date of birth can not be empty !');
    }
    if (email.trim().length == 0) {
      return setEmailError('Email can not be empty !');
    }
    if (!isValidEmail(email)) {
      return setEmailError('Invalid email !');
    }
    if (address.trim().length == 0) {
      return setAddressError('Address can not be empty !');
    }
    if (phone.trim().length == 0) {
      return setPhoneError('Phone can not be empty !');
    }
    return true;
  };
  const submitForm = () => {
    if (isValidForm()) {
      const userInfo = {username, dateOfBirth, email, address, phone};
      console.log(userInfo);
    }
  };
  return (
    <SafeAreaView style={{backgroundColor: 'white', height: '100%'}}>
      <View
        style={{marginHorizontal: '5%', marginTop: '4%', flexDirection: 'row'}}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Ionicons
            style={{top: '10%'}}
            name="arrow-back-sharp"
            size={28}
            color="black"></Ionicons>
        </TouchableOpacity>
        <Text
          style={{
            paddingLeft: 14,
            fontSize: 25,
            fontWeight: 'bold',
            color: 'black',
            fontFamily: 'Roboto',
          }}>
          Edit Profile
        </Text>
      </View>
      <View
        style={{
          marginVertical: '4%',
          paddingHorizontal: 20,
        }}>
        <Image
          style={{
            width: 120,
            height: 120,
            alignSelf: 'center',
            borderRadius: 100,
          }}
          source={require('../assets/image/profileImage.jpeg')}
        />
      </View>
      {/* Form */}
      <KeyboardAvoidingView
        enabled
        style={{flex: 1, marginBottom: 10}}
        behavior={Platform.OS === 'ios' ? 'padding' : null}>
        <ScrollView
          style={{flexDirection: 'column'}}
          contentContainerStyle={{
            justifyContent: 'space-between',
            flexGrow: 1,
          }}>
          <View
            style={{
              flexDirection: 'column',
              rowGap: 2,
              alignItems: 'center',
            }}>
            <TextInput
              style={[
                {
                  height: 40,
                  width: '90%',
                  backgroundColor: '#e5e5e5',
                  margin: 12,
                  borderRadius: 20,
                  padding: 10,
                },
                usernameError ? {borderColor: 'red', borderWidth: 1} : {},
              ]}
              onChangeText={setUsername}
              value={username}
              placeholder="User Name"
              keyboardType="default"></TextInput>
            {usernameError && (
              <View style={{width: '85%', marginTop: '-4%'}}>
                <Text style={{color: 'red'}}>{usernameError}</Text>
              </View>
            )}
            <View
              style={[
                {
                  backgroundColor: '#e5e5e5',
                  height: 40,
                  width: '90%',
                  borderRadius: 20,
                  margin: 12,
                  paddingHorizontal: 8,
                },
                dateOfBirthError ? {borderColor: 'red', borderWidth: 1} : {},
              ]}>
              {showPicker && (
                <DateTimePicker
                  mode="date"
                  display="spinner"
                  value={date}
                  onChange={onChange}
                  maximumDate={new Date()}
                />
              )}
              <Pressable
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={toggleDatepicker}>
                <TextInput
                  style={{flex: 1, color: 'black'}}
                  onChangeText={setDateOfBirth}
                  value={dateOfBirth}
                  underlineColorAndroid="transparent"
                  placeholder="Date of birth"
                  keyboardType="default"
                  editable={false}></TextInput>
                <AntDesign name="calendar" size={25} color="black"></AntDesign>
              </Pressable>
            </View>
            {dateOfBirthError && (
              <View style={{width: '85%', marginTop: '-4%'}}>
                <Text style={{color: 'red'}}>{dateOfBirthError}</Text>
              </View>
            )}
            <TextInput
              style={[
                {
                  height: 40,
                  margin: 12,
                  width: '90%',
                  backgroundColor: '#e5e5e5',
                  borderRadius: 20,
                  padding: 10,
                },
                emailError ? {borderColor: 'red', borderWidth: 1} : {},
              ]}
              onChangeText={text => {
                setEmail(text);
              }}
              value={email}
              placeholder="Email"
              keyboardType="email-address"></TextInput>
            {emailError && (
              <View style={{width: '85%', marginTop: '-4%'}}>
                <Text style={{color: 'red'}}>{emailError}</Text>
              </View>
            )}
            <TextInput
              style={[
                {
                  height: 40,
                  margin: 12,
                  width: '90%',
                  backgroundColor: '#e5e5e5',
                  borderRadius: 20,
                  padding: 10,
                },
                addressError ? {borderColor: 'red', borderWidth: 1} : {},
              ]}
              onChangeText={text => {
                setAddress(text);
              }}
              value={address}
              placeholder="Address"
              keyboardType="default"></TextInput>
            {addressError && (
              <View style={{width: '85%', marginTop: '-4%'}}>
                <Text style={{color: 'red'}}>{addressError}</Text>
              </View>
            )}
            <TextInput
              style={[
                {
                  height: 40,
                  margin: 12,
                  width: '90%',
                  backgroundColor: '#e5e5e5',
                  borderRadius: 20,
                  padding: 10,
                },
                phoneError ? {borderColor: 'red', borderWidth: 1} : {},
              ]}
              onChangeText={text => {
                setPhone(text);
              }}
              value={phone}
              placeholder="Phone"
              keyboardType="numeric"></TextInput>
            {phoneError && (
              <View style={{width: '85%', marginTop: '-4%'}}>
                <Text style={{color: 'red'}}>{phoneError}</Text>
              </View>
            )}
          </View>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: '4%',
            }}>
            <View style={{width: '90%'}}>
              <FlatButton text="Update" onPress={submitForm} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditProfile;
