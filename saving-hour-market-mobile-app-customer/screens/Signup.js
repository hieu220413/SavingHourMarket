import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useEffect, useRef, useState, useCallback} from 'react';
import {COLORS} from '../constants/theme';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import auth from '@react-native-firebase/auth';
import {useFocusEffect} from '@react-navigation/native';
import {API} from '../constants/api';
import database from '@react-native-firebase/database';
import Toast from 'react-native-toast-message';

const Signup = ({navigation}) => {
  const [password, setPassword] = useState('');
  const [password_confirm, setPassword_confirm] = useState('');
  const [password_confirmError, setPassword_confirmError] = useState('');
  const [email, setEmail] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [secureTextEntry_confirm, setSecureTextEntry_confirm] = useState(true);
  const [check_textInputChange, setCheck_textInputChange] = useState(false);

  const showToast = message => {
    Toast.show({
      type: 'unsuccess',
      text1: 'Thất bại',
      text2: message,
      visibilityTime: 2000,
    });
  };

  const showToastSuccess = message => {
    Toast.show({
      type: 'success',
      text1: 'Thành công',
      text2: message,
      visibilityTime: 2000,
    });
  };

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

  const emailValidator = () => {
    if (email == '') {
      setEmailError('Email không thể rỗng');
      setCheck_textInputChange(false);
    } else if (!isValidEmail(email)) {
      setEmailError('Email không hợp lệ !');
      setCheck_textInputChange(false);
    } else {
      setEmailError('');
      setCheck_textInputChange(true);
    }
  };

  const passwordValidation = () => {
    if (!isValidPassword(password)) {
      setPasswordError('Ít nhất 8 ký tự, 1 chữ số, 1 chữ hoa và chữ thường');
    } else {
      setPasswordError('');
    }
  };
  // const ConfirmPasswordValidation = () => {
  //   if (password_confirm.length < 8) {
  //     setPassword_confirmError(
  //       'Confirm password must be more than 8 characters!',
  //     );
  //   } else {
  //     setPassword_confirmError('');
  //   }
  // };

  const isValidPassword = password => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d].{8,}$/;
    return regex.test(password);
  };

  const isValidEmail = email => {
    const regex = /^([A-Za-z0-9_\-\.])+@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    return regex.test(email);
  };

  const isValidForm = () => {
    if (!isValidEmail(email) || !isValidPassword(password)) {
      // Alert.alert('fail');
      return;
    }
    if (password_confirm !== password) {
      setPassword_confirmError('Mật khẩu không khớp!');
      return;
    } else {
      setPassword_confirmError('');
    }
    return true;
  };

  const isSecureTextEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const isSecureTextEntry_confirm = () => {
    setSecureTextEntry_confirm(!secureTextEntry_confirm);
  };

  const handleSubmit = async () => {
    let submitInfo = {};
    if (!isValidForm()) {
      return;
    }
    const valid = isValidForm();
    if (valid == true) {
      submitInfo = {
        email: email,
        password: password,
      };
    }
    const registerWithEmailPasswordRequest = await fetch(
      `${API.baseURL}/api/customer/registerWithEmailPassword`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitInfo),
      },
    ).catch(err => {
      console.log(err);
      return null;
    });
    console.log(registerWithEmailPasswordRequest.status);
    // Handle register internal error
    if (!registerWithEmailPasswordRequest) {
      showToast('Lỗi mạng');
      return;
    }
    if (registerWithEmailPasswordRequest.status === 422) {
      console.log(await registerWithEmailPasswordRequest.json())
      showToast('Sai định dạng hoặc email đã được sử dụng');
      return null;
    }
    if (registerWithEmailPasswordRequest.status === 403) {
      const response = await registerWithEmailPasswordRequest.json();
      if (response.message && response.message === 'EMAIL_ALREADY_EXISTS') {
        showToast('Tài khoản đã được đăng ký');
      }
    }
    // Handle register success
    if (registerWithEmailPasswordRequest.status === 200) {
      const customToken = await registerWithEmailPasswordRequest.text();
      const user = await auth()
        .signInWithCustomToken(customToken)
        .catch(e => {
          console.log(e);
          return null;
        });
      console.log(user);
      if (!user) {
        showToast('Email không tồn tại');
        navigation.navigate('Login');
      }
      if (user) {
        // handle sender email verification
        console.log(user.user);
        await user.user
          .sendEmailVerification()
          .then(async result => {
            console.log('send mail sucesss');
            await auth()
              .signOut()
              .catch(e => console.log(e));
            showToastSuccess(
              'Đăng ký thành công. Mã xác nhận đã được gửi vào email của bạn',
            );
            navigation.navigate('Login');
          })
          .catch(async e => {
            console.log(e);
            showToast('Không thể gửi mã xác nhận đến email của bạn');
            await auth()
              .signOut()
              .catch(e => console.log(e));
          });
      }
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
      <View style={styles.container}>
        <ImageBackground
          source={require('../assets/image/background.jpeg')}
          resizeMode="repeat"
          style={{flex: 1, justifyContent: 'center'}}>
          <Animatable.View animation="fadeInLeft" style={styles.header}>
            <Text style={styles.text_header}>Welcome to </Text>
            <Text style={[styles.text_header, {paddingLeft: 30}]}>
              <FontAwesome name="shopping-basket" color="white" size={30} />{' '}
              Saving Hour Market!
            </Text>
          </Animatable.View>
          <Animatable.View animation="fadeInUpBig" style={styles.footer}>
            <KeyboardAvoidingView
              enabled
              style={{flex: 1}}
              behavior={Platform.OS === 'ios' ? 'padding' : null}>
              <ScrollView>
                <Text style={styles.text_footer}>E-MAIL</Text>
                <View style={styles.action}>
                  <FontAwesome name="user-o" color={COLORS.primary} size={20} />
                  <TextInput
                    onBlur={() => {
                      emailValidator();
                    }}
                    placeholder="Your email ..."
                    style={styles.textInput}
                    keyboardType="email-address"
                    value={email}
                    onChangeText={text => setEmail(text)}
                  />
                  {check_textInputChange ? (
                    <Animatable.View animation="bounceIn">
                      <Feather
                        name="check-circle"
                        color={COLORS.primary}
                        size={20}
                      />
                    </Animatable.View>
                  ) : null}
                </View>
                {emailError && (
                  <View
                    style={{
                      width: '85%',
                      marginTop: '1%',
                      marginBottom: '-4%',
                    }}>
                    <Text style={{color: 'red'}}>{emailError}</Text>
                  </View>
                )}
                <Text style={[styles.text_footer, {marginTop: '8%'}]}>
                  Password
                </Text>
                <View style={styles.action}>
                  <Feather name="lock" color={COLORS.primary} size={20} />
                  {secureTextEntry ? (
                    <TextInput
                      placeholder="Your password ..."
                      onBlur={() => {
                        passwordValidation();
                      }}
                      style={styles.textInput}
                      secureTextEntry={true}
                      value={password}
                      onChangeText={text => setPassword(text)}
                    />
                  ) : (
                    <TextInput
                      placeholder="Your password ..."
                      style={styles.textInput}
                      onBlur={() => {
                        passwordValidation();
                      }}
                      secureTextEntry={false}
                      value={password}
                      onChangeText={text => setPassword(text)}
                    />
                  )}
                  <TouchableOpacity
                    onPress={() => {
                      isSecureTextEntry();
                    }}>
                    {secureTextEntry ? (
                      <Feather name="eye-off" color="grey" size={20} />
                    ) : (
                      <Feather name="eye" color="grey" size={20} />
                    )}
                  </TouchableOpacity>
                </View>
                {passwordError && (
                  <View
                    style={{
                      width: '85%',
                      marginTop: '1%',
                      marginBottom: '-4%',
                    }}>
                    <Text style={{color: 'red'}}>{passwordError}</Text>
                  </View>
                )}
                <Text style={[styles.text_footer, {marginTop: '8%'}]}>
                  Confirm Password
                </Text>
                <View style={styles.action}>
                  <Feather name="lock" color={COLORS.primary} size={20} />
                  {secureTextEntry_confirm ? (
                    <TextInput
                      placeholder="Confirm password ..."
                      style={styles.textInput}
                      secureTextEntry={true}
                      // onBlur={() => {
                      //   ConfirmPasswordValidation();
                      // }}
                      value={password_confirm}
                      onChangeText={text => setPassword_confirm(text)}
                    />
                  ) : (
                    <TextInput
                      placeholder="Confirm password ..."
                      style={styles.textInput}
                      secureTextEntry={false}
                      // onBlur={() => {
                      //   ConfirmPasswordValidation();
                      // }}
                      value={password_confirm}
                      onChangeText={text => setPassword_confirm(text)}
                    />
                  )}
                  <TouchableOpacity
                    onPress={() => {
                      isSecureTextEntry_confirm();
                    }}>
                    {secureTextEntry_confirm ? (
                      <Feather name="eye-off" color="grey" size={20} />
                    ) : (
                      <Feather name="eye" color="grey" size={20} />
                    )}
                  </TouchableOpacity>
                </View>
                {password_confirmError && (
                  <View
                    style={{
                      width: '90%',
                      marginTop: '1%',
                      marginBottom: '-4%',
                    }}>
                    <Text style={{color: 'red'}}>{password_confirmError}</Text>
                  </View>
                )}
                <View style={styles.textPrivate}>
                  <Text style={styles.color_textPrivate}>
                    Bằng cách đăng ký, bạn đồng ý với 
                  </Text>
                  <Text
                    style={[styles.color_textPrivate, {fontWeight: 'bold'}]}>
                    {' '}
                    Điều khoản Dịch vụ
                  </Text>
                  <Text style={styles.color_textPrivate}> và </Text>
                  <Text
                    style={[styles.color_textPrivate, {fontWeight: 'bold'}]}>
                    Chính sách Riêng tư 
                  </Text>
                  <Text style={styles.color_textPrivate}> </Text>
                  <Text style={styles.color_textPrivate}>
                    của chúng tôi
                  </Text>
                </View>
                <View style={styles.button}>
                  <TouchableOpacity
                    style={{width: '100%'}}
                    onPress={() => {
                      handleSubmit();
                    }}>
                    <LinearGradient
                      colors={['#66CC66', '#66CC99']}
                      style={styles.login}>
                      <Text style={[styles.textSign, {color: 'white'}]}>
                        Đăng ký
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </Animatable.View>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: '6%',
  },
  footer: {
    flex: 3,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: '3%',
  },
  text_header: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 30,
    fontFamily: 'Roboto',
  },
  text_footer: {
    color: COLORS.primary,
    fontSize: 18,
    fontFamily: 'Roboto',
  },
  action: {
    flexDirection: 'row',
    marginTop: '2%',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 2,
  },
  textInput: {
    flex: 1,
    paddingLeft: 10,
    color: COLORS.primary,
  },
  button: {
    alignItems: 'center',
    marginTop: '8%',
  },
  login: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
  textPrivate: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: '4%',
  },
  color_textPrivate: {
    fontSize: 15,
    fontFamily: 'Roboto',
    color: 'gray',
  },
});
