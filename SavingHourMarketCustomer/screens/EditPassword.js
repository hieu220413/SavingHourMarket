/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import {
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  Platform,
  Button,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FlatButton from '../shared/button';
import { useFocusEffect } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '../constants/api';
import LoadingScreen from '../components/LoadingScreen';
import database, { firebase } from '@react-native-firebase/database';
import { ScrollView } from 'react-native-gesture-handler';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
import Toast from 'react-native-toast-message';

const EditPassword = ({ navigation, route }) => {
  const user = route.params.user;
  const [email, setEmail] = useState(user ? user.email : '');
  const [oldPassword, setOldPassword] = useState('');
  const [oldPasswordError, setOldPasswordError] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [confirmNewPasswordError, setConfirmNewPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

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

  const showToastSuccess = message => {
    Toast.show({
      type: 'success',
      text1: 'Thành công',
      text2: message,
      visibilityTime: 2000,
    });
  };

  const isValidNewPassword = password => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d].{8,}$/;
    return regex.test(password);
  };

  const oldlPasswordValidation = () => {
    if (oldPassword.length === 0) {
      setOldPasswordError('Vui lòng không để trống');
    } else {
      setOldPasswordError('');
    }
  };

  const newPasswordValidation = () => {
    if (!isValidNewPassword(newPassword)) {
      setNewPasswordError('Ít nhất 8 ký tự, 1 chữ số, 1 chữ hoa và chữ thường');
    } else {
      setNewPasswordError('');
    }
  };

  const isValidForm = () => {
    if (!isValidNewPassword(newPassword) || oldPassword.length === 0) {
      // Alert.alert('fail');
      return false;
    }
    if (confirmNewPassword !== newPassword) {
      setConfirmNewPasswordError('Mật khẩu không khớp!');
      return false;
    } else {
      setConfirmNewPasswordError('');
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!isValidForm()) {
      return;
    }
    const currentUser = firebase.auth().currentUser;
    if (currentUser) {
      setLoading(true);
      const credential = firebase.auth.EmailAuthProvider.credential(
        email,
        oldPassword,
      );
      currentUser
        .reauthenticateWithCredential(credential)
        .then(data => {
          // User re-authenticated.
          currentUser
            .updatePassword(newPassword)
            .then(() => {
              setLoading(false)
              showToastSuccess("Thay đổi mật khẩu thành công")
              navigation.navigate('Profile');
              //Password successfully updated
            })
            .catch(error => {
              setLoading(false)
              Alert.alert("Xảy ra lỗi ngoài sự cố")
              console.log(error);
            });
        })
        .catch(error => {
          console.log(error);
          setLoading(false)
          if (error.message.includes("auth/wrong-password")) {
            Alert.alert("Sai mật khẩu hiện tại")
          } else {
            Alert.alert("Xảy ra lỗi ngoài sự cố")
          }
          //An error happened.
          //Failed to reauthenticate user
        });
    }

    // .then(res => {
    //   return res.json();
    // })
    // .then(respond => {
    //   console.log(respond);
    //   if (respond.code == 403 || respond.code == 422) {
    //     Alert.alert('This email has already been registered');
    //     return null;
    //   } else {
    //     Alert.alert('Sign up successful');
    //     navigation.navigate('Login');
    //   }
    // })
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={{ backgroundColor: 'white', height: '100%' }}>
        <View
          style={{
            marginHorizontal: '5%',
            marginTop: '4%',
            marginBottom: '4%',
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <Ionicons
              style={{ top: '10%' }}
              name="arrow-back-sharp"
              size={28}
              color="black"
            />
          </TouchableOpacity>
          <Text
            style={{
              paddingLeft: 14,
              fontSize: 25,
              fontWeight: 'bold',
              color: 'black',
              fontFamily: 'Roboto',
            }}>
            Thay đổi mật khẩu
          </Text>
        </View>
        {/* Form */}
        <KeyboardAvoidingView
          enabled
          style={{ flex: 1, marginBottom: 10 }}
          behavior={Platform.OS === 'ios' ? 'padding' : null}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ flexDirection: 'column' }}
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
                ]}
                onChangeText={text => {
                  setOldPassword(text);
                }}
                placeholder="Mật khẩu cũ"
                secureTextEntry={true}
                onBlur={() => {
                  oldlPasswordValidation();
                }}
                value={oldPassword}
                keyboardType="default"
              />
              {oldPasswordError && (
                <View style={{ width: '85%', marginTop: '-3%' }}>
                  <Text style={{ color: 'red' }}>{oldPasswordError}</Text>
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
                  // emailError ? {borderColor: 'red', borderWidth: 1} : {},
                ]}
                onChangeText={text => {
                  setNewPassword(text);
                }}
                value={newPassword}
                onBlur={() => {
                  newPasswordValidation();
                }}
                secureTextEntry={true}
                placeholder="Mật khẩu mới"
              />
              {newPasswordError && (
                <View style={{ width: '85%', marginTop: '-3%' }}>
                  <Text style={{ color: 'red' }}>{newPasswordError}</Text>
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
                ]}
                onChangeText={text => {
                  setConfirmNewPassword(text);
                }}
                value={confirmNewPassword}
                placeholder="Nhập lại mật khẩu mới"
                onBlur={() => {
                  newPasswordValidation();
                }}
                secureTextEntry={true}
              />
              {confirmNewPasswordError && (
                <View style={{ width: '85%', marginTop: '-3%' }}>
                  <Text style={{ color: 'red' }}>{confirmNewPasswordError}</Text>
                </View>
              )}
            </View>
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'center',
                marginBottom: '4%',
              }}>
              <View style={{ width: '90%' }}>
                <FlatButton text="Cập nhật" onPress={handleSubmit} />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        {loading && <LoadingScreen />}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default EditPassword;
