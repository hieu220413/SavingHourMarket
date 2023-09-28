import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ImageBackground,
} from 'react-native';
import React from 'react';
import {COLORS} from '../constants/theme';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      check_textInputChange: false,
      password: '',
      passwordError: '',
      secureTextEntry: true,
      email: '',
      emailError: '',
    };
  }
  // textInputChange(value) {
  //   if (value.length !== 0) {
  //     this.setState({
  //       check_textInputChange: true,
  //     });
  //   } else {
  //     this.setState({
  //       check_textInputChange: false,
  //     });
  //   }
  // }
  emailValidator() {
    if (this.state.email == '') {
      this.setState({
        emailError: 'Email field cannot be empty',
        check_textInputChange: false,
      });
    } else if (!this.isValidEmail(this.state.email)) {
      this.setState({
        emailError: 'Invalid email !',
        check_textInputChange: false,
      });
    } else {
      this.setState({
        emailError: '',
        check_textInputChange: true,
      });
    }
  }
  passwordValidation() {
    if (this.state.password === '') {
      this.setState({
        passwordError: 'Enter your password!',
      });
    } else {
      this.setState({
        passwordError: '',
      });
    }
  }
  isValidEmail(email) {
    const regex = /^([A-Za-z0-9_\-\.])+@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    return regex.test(email);
  }
  secureTextEntry() {
    this.setState({
      secureTextEntry: !this.state.secureTextEntry,
    });
  }
  render() {
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
              <Text style={styles.text_footer}>E-MAIL</Text>
              <View style={styles.action}>
                <FontAwesome name="user-o" color={COLORS.primary} size={20} />
                <TextInput
                  placeholder="Your email ..."
                  keyboardType="email-address"
                  style={styles.textInput}
                  onBlur={() => {
                    this.emailValidator();
                  }}
                  onChangeText={text => this.setState({email: text})}
                />
                {this.state.check_textInputChange ? (
                  <Animatable.View animation="bounceInRight">
                    <Feather
                      name="check-circle"
                      color={COLORS.primary}
                      size={20}
                    />
                  </Animatable.View>
                ) : null}
              </View>
              {this.state.emailError && (
                <View
                  style={{width: '85%', marginTop: '1%', marginBottom: '-4%'}}>
                  <Text style={{color: 'red'}}>{this.state.emailError}</Text>
                </View>
              )}
              <Text style={[styles.text_footer, {marginTop: 35}]}>
                Password
              </Text>
              <View style={styles.action}>
                <Feather name="lock" color={COLORS.primary} size={20} />
                {this.state.secureTextEntry ? (
                  <TextInput
                    placeholder="Your password ..."
                    onBlur={() => {
                      this.passwordValidation();
                    }}
                    style={styles.textInput}
                    secureTextEntry={true}
                    value={this.state.password}
                    onChangeText={text => this.setState({password: text})}
                  />
                ) : (
                  <TextInput
                    placeholder="Your password ..."
                    onBlur={() => {
                      this.passwordValidation();
                    }}
                    style={styles.textInput}
                    secureTextEntry={false}
                    value={this.state.password}
                    onChangeText={text => this.setState({password: text})}
                  />
                )}
                <TouchableOpacity
                  onPress={() => {
                    this.secureTextEntry();
                  }}>
                  {this.state.secureTextEntry ? (
                    <Feather name="eye-off" color="grey" size={20} />
                  ) : (
                    <Feather name="eye" color="grey" size={20} />
                  )}
                </TouchableOpacity>
              </View>
              {this.state.passwordError && (
                <View
                  style={{width: '85%', marginTop: '1%', marginBottom: '-4%'}}>
                  <Text style={{color: 'red'}}>{this.state.passwordError}</Text>
                </View>
              )}
              <Text
                onPress={() => {
                  this.props.navigation.navigate('Forgot password');
                }}
                style={{color: COLORS.secondary, marginTop: 15}}>
                Forgot password?
              </Text>
              <View style={styles.button}>
                <GoogleSigninButton
                  style={[styles.login, {width:'50%'}]}
                  size={GoogleSigninButton.Size.Wide}
                  color={GoogleSigninButton.Color.Light}
                  // onPress={this._signIn}
                  // disabled={this.state.isSigninInProgress}
                />
                <TouchableOpacity
                  style={{width: '100%', marginTop: 15}}
                  onPress={() => {
                    console.log('sign in');
                  }}>
                  <LinearGradient
                    colors={['#66CC66', '#66CC99']}
                    style={styles.login}>
                    <Text style={[styles.textSign, {color: 'white'}]}>
                      Sign In
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.login,
                    {borderColor: '#66CC66', borderWidth: 1, marginTop: 15},
                  ]}
                  onPress={() => {
                    this.props.navigation.navigate('Sign Up');
                  }}>
                  <Text style={[styles.textSign, {color: '#66CC66'}]}>
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>
            </Animatable.View>
          </ImageBackground>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

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
    paddingVertical: '4%',
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
    marginTop: '3%',
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
    marginTop: '10%',
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
});
