import {
  StyleSheet,
  Text,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Feedback = ({navigation}) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.action}>
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
            <Text style={styles.text_header}>Feedback</Text>
          </View>
          <View
            style={{
              marginVertical: '6%',
              paddingHorizontal: 20,
            }}>
            <Image
              style={{
                width: 40,
                height: 40,
                // alignSelf: 'center',
              }}
              source={require('../assets/image/profileImage.jpeg')}
            />
          </View>
        </View>
        <View style={styles.footer}></View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Feedback;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 1,
    backgroundColor: 'pink',
  },
  footer: {
    flex: 4.5,
  },
  text_header: {
    paddingLeft: 14,
    fontSize: 25,
    fontWeight: 'bold',
    color: 'black',
    fontFamily: 'Roboto',
  },
  action: {
    marginHorizontal: '5%',
    marginTop: '4%',
    flexDirection: 'row',
  },
});
