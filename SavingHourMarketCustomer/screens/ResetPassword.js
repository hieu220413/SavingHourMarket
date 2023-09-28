import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  ImageBackground,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {COLORS} from '../constants/theme';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';

const ResetPassword = ({navigation}) => {
  const [password, setPassword] = useState('');
  const [password_confirm, setPassword_confirm] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [password_confirmError, setPassword_confirmError] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [secureTextEntry_confirm, setSecureTextEntry_confirm] = useState(true);

  const passwordValidation = () => {
    if (password.length < 8) {
      setPasswordError('Password must be more than 8 characters!');
    } else {
      setPasswordError('');
    }
  };
  const ConfirmPasswordValidation = () => {
    if (password_confirm.length < 8) {
      setPassword_confirmError(
        'Confirm password must be more than 8 characters!',
      );
    } else {
      setPassword_confirmError('');
    }
  };
  const ClickSecureTextEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };
  const ClickSecureTextEntry_confirm = () => {
    setSecureTextEntry_confirm(!secureTextEntry_confirm);
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Animatable.View animation="fadeInLeftBig" style={styles.header}>
          <ImageBackground
            source={require('../assets/image/forgotpassword.png')}
            resizeMode="contain"
            style={{flex: 1, justifyContent: 'center'}}></ImageBackground>
        </Animatable.View>
        <Animatable.View animation="fadeInRightBig" style={styles.footer}>
          <Text style={styles.text_footer}>Reset Password</Text>
          <Text style={[styles.text_footer, {fontSize: 18, fontWeight: '700'}]}>
            Please enter your new password
          </Text>
          <Text style={styles.password_text}>Password</Text>
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
                ClickSecureTextEntry();
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
                marginBottom: '-2%',
              }}>
              <Text style={{color: 'red'}}>{passwordError}</Text>
            </View>
          )}
          <Text style={[styles.password_text, {marginTop: '0%'}]}>
            Confirm Password
          </Text>
          <View style={styles.action}>
            <Feather name="lock" color={COLORS.primary} size={20} />
            {secureTextEntry_confirm ? (
              <TextInput
                placeholder="Confirm password ..."
                style={styles.textInput}
                secureTextEntry={true}
                onBlur={() => {
                  ConfirmPasswordValidation();
                }}
                value={password_confirm}
                onChangeText={text => setPassword_confirm(text)}
              />
            ) : (
              <TextInput
                placeholder="Confirm password ..."
                style={styles.textInput}
                secureTextEntry={false}
                onBlur={() => {
                  ConfirmPasswordValidation();
                }}
                value={password_confirm}
                onChangeText={text => setPassword_confirm(text)}
              />
            )}
            <TouchableOpacity
              onPress={() => {
                ClickSecureTextEntry_confirm();
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
                marginBottom: '-4%',
              }}>
              <Text style={{color: 'red'}}>{password_confirmError}</Text>
            </View>
          )}
          <View style={styles.button}>
            <TouchableOpacity
              style={{width: '100%'}}
              onPress={() => {
                console.log('Reset');
              }}>
              <LinearGradient
                colors={['#66CC66', '#66CC99']}
                style={styles.send}>
                <Text style={[styles.textSign, {color: 'white'}]}>Reset</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <Text
            onPress={() => {
              navigation.goBack();
            }}
            style={{
              fontSize: 16,
              fontFamily: 'Roboto',
              paddingTop: '2%',
              alignSelf: 'center',
            }}>
            Back
          </Text>
        </Animatable.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 2,
  },
  footer: {
    flex: 3,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    // paddingVertical: '4%',
  },
  text_footer: {
    color: 'black',
    fontSize: 23,
    alignSelf: 'center',
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    paddingTop: '2%',
  },
  action: {
    flexDirection: 'row',
    marginTop: '2%',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 2,
    paddingLeft: 5,
  },
  password_text: {
    color: COLORS.primary,
    fontSize: 18,
    fontFamily: 'Roboto',
    paddingTop: '4%',
    paddingLeft: 5,
  },
  textInput: {
    flex: 1,
    paddingLeft: 10,
    color: COLORS.primary,
  },
  button: {
    alignItems: 'center',
    marginTop: '10%',
  },
  send: {
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
});
