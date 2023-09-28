import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {COLORS} from '../constants/theme';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import OtpInput from '../components/OtpInput';

const CodeReset = ({navigation}) => {
  const [code, setCode] = useState('');
  const [pinReady, setPinReady] = useState(false);
  const MAX_CODE_LENGTH = 4;
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
          <Text style={styles.text_footer}>Verification code</Text>
          <Text style={[styles.text_footer, {fontSize: 14, fontWeight: '100'}]}>
            We send to the email{' '}
            <Text
              style={{fontSize: 14, fontWeight: '800', fontFamily: 'Roboto'}}>
              hongquang7302@gmail.com
            </Text>
          </Text>
          <OtpInput
            setPinReady={setPinReady}
            code={code}
            setCode={setCode}
            maxLength={MAX_CODE_LENGTH}
          />
          <View style={styles.button}>
            {pinReady ? (
              <TouchableOpacity
                style={{width: '100%'}}
                onPress={() => {
                    navigation.navigate('Reset password');
                }}>
                <LinearGradient
                  colors={['#66CC66', '#66CC99']}
                  style={styles.send}>
                  <Text style={[styles.textSign, {color: 'white'}]}>
                    Verify
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <View
                style={[styles.send, {borderColor: '#E5E5E5', borderWidth: 2}]}>
                <Text style={[styles.textSign, {color: '#E5E5E5'}]}>
                  Verify
                </Text>
              </View>
            )}
          </View>
          <Text
            onPress={() => {
              navigation.navigate('Forgot password');
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

export default CodeReset;

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
    paddingTop: '4%',
  },
  action: {
    flexDirection: 'row',
    marginTop: '3%',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 2,
    paddingLeft: 5,
  },
  email_text: {
    color: COLORS.primary,
    fontSize: 18,
    fontFamily: 'Roboto',
    paddingTop: '7%',
    paddingLeft: 5,
  },
  textInput: {
    flex: 1,
    paddingLeft: 10,
    color: COLORS.primary,
  },
  button: {
    alignItems: 'center',
    marginTop: '25%',
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
