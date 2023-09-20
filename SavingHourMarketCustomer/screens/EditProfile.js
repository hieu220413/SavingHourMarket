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

const EditProfile = ({navigation}) => {
  const [firstname, setFirstname] = useState('');
  const [lastnname, setLastname] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
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
        <ScrollView>
          <View
            style={{flexDirection: 'column', rowGap: 4, alignItems: 'center'}}>
            <TextInput
              style={{
                height: 40,
                width: '90%',
                backgroundColor: '#e5e5e5',
                margin: '3%',
                borderRadius: 20,
                padding: 10,
              }}
              onChangeText={setFirstname}
              value={firstname}
              placeholder="First Name"
              keyboardType="default"></TextInput>
            <TextInput
              style={{
                height: 40,
                margin: 12,
                width: '90%',
                backgroundColor: '#e5e5e5',
                borderRadius: 20,
                padding: 10,
              }}
              onChangeText={setLastname}
              value={lastnname}
              placeholder="Last Name"
              keyboardType="default"></TextInput>

            {/* {display ? <View>
            <Text>{phone}</Text>
            <Text>{lastnname}</Text>
        </View> : null} */}

            <View
              style={{
                backgroundColor: '#e5e5e5',
                height: 40,
                width: '90%',
                borderRadius: 20,
                margin: 12,
                paddingHorizontal: 8,
              }}>
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
            <TextInput
              style={{
                height: 40,
                margin: 12,
                width: '90%',
                backgroundColor: '#e5e5e5',
                borderRadius: 20,
                padding: 10,
              }}
              onChangeText={text => {
                setEmail(text);
              }}
              value={email}
              placeholder="Email"
              keyboardType="email-address"></TextInput>
            <TextInput
              style={{
                height: 40,
                margin: 12,
                width: '90%',
                backgroundColor: '#e5e5e5',
                borderRadius: 20,
                padding: 10,
              }}
              onChangeText={text => {
                setAddress(text);
              }}
              value={address}
              placeholder="Address"
              keyboardType="default"></TextInput>
            <TextInput
              style={{
                height: 40,
                margin: 12,
                width: '90%',
                backgroundColor: '#e5e5e5',
                borderRadius: 20,
                padding: 10,
              }}
              onChangeText={text => {
                setPhone(text);
              }}
              value={phone}
              placeholder="Phone"
              keyboardType="numeric"></TextInput>
            
          </View>
          
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditProfile;
