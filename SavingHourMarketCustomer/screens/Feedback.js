import {
  StyleSheet,
  Text,
  View,
  Keyboard,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
  KeyboardAvoidingView,
  ScrollView,
  Button,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';

const numStar = 5;

class Star extends React.Component {
  render() {
    return (
      <FontAwesome
        name={this.props.filled === true ? 'star' : 'star-o'}
        color="rgb(255,194,26)"
        size={32}
        style={{marginHorizontal: 6}}></FontAwesome>
    );
  }
}

const Feedback = ({navigation}) => {
  //-----------------RATING---------------------
  const [rating, setRating] = useState(5);
  const [animation, setAnimation] = useState(new Animated.Value(1));

  const rate = star => {
    setRating(star);
  };

  const animate = () => {
    Animated.timing(animation, {
      toValue: 2,
      duration: 400,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => {
      animation.setValue(1);
    });
  };

  let stars = [];

  const animateScale = animation.interpolate({
    inputRange: [1, 1.5, 2],
    outputRange: [1, 1.4, 1],
  });

  const animateOpacity = animation.interpolate({
    inputRange: [1, 1.2, 2],
    outputRange: [1, 0.5, 1],
  });

  const animateWooble = animation.interpolate({
    inputRange: [1, 1.25, 1.75, 2],
    outputRange: ['0deg', '-3deg', '3deg', '0deg'],
  });

  const animationStyle = {
    transform: [{scale: animateScale}, {rotate: animateWooble}],
    opacity: animateOpacity,
  };

  for (let x = 1; x <= numStar; x++) {
    stars.push(
      <TouchableWithoutFeedback
        key={x}
        onPress={() => {
          rate(x);
          animate();
        }}>
        <Animated.View style={x <= rating ? animationStyle : ''}>
          <Star filled={x <= rating ? true : false} />
        </Animated.View>
      </TouchableWithoutFeedback>,
    );
  }
  //--------------------END----------------------

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.action}>
            <View style={{flexDirection: 'row'}}>
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
            <View style={{justifyContent: 'center'}}>
              <TouchableOpacity
                onPress={() => {
                  console.log('send');
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: '100',
                    color: '#56CD7C',
                    fontFamily: 'Roboto',
                  }}>
                  Send
                </Text>
              </TouchableOpacity>
            </View>
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
              source={require('../assets/image/background.jpeg')}
            />
          </View>
        </View>
        <View style={styles.footer}>
          <View style={styles.rating}>
            <Text style={styles.text_rating}>Rating: </Text>
            <View style={{flexDirection: 'row', paddingLeft: 14}}>{stars}</View>
          </View>
          <View style={{height: '60%'}}>
            <ScrollView style={styles.evaluation_box}>
              <View style={[styles.row_evaluation, {borderBottomWidth: 0.5}]}>
                <Text style={styles.text_evaluation}>Tiêu đề:</Text>
                <TextInput
                  placeholder="nhập ..."
                  style={[
                    styles.input_evaluation,
                    {marginLeft: 3, marginTop: -12},
                  ]}></TextInput>
              </View>
              <View style={styles.row_evaluation}>
                <Text style={styles.text_evaluation}>Đánh giá:</Text>
                <TextInput
                  placeholder="để lại đánh giá"
                  multiline={true}
                  style={[
                    styles.input_evaluation,
                    {marginTop: -11},
                  ]}></TextInput>
              </View>
            </ScrollView>
          </View>
          <TouchableOpacity style={styles.addImage}>
            <Entypo name="camera" size={28} color="#56CD7C"></Entypo>
            <Text
              style={{
                fontFamily: 'Roboto',
                fontSize: 16,
                color: '#56CD7C',
                marginLeft: 10,
              }}>
              Thêm hình ảnh
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Feedback;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flex: 1,
    paddingBottom: '3%',
  },
  footer: {
    flex: 4.5,
    // backgroundColor: 'red',
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
    justifyContent: 'space-between',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 14,
  },
  text_rating: {
    fontFamily: 'Roboto',
    fontSize: 20,
    color: 'black',
  },
  evaluation_box: {
    backgroundColor: 'rgb(245,245,245)',
    width: '95%',
    alignSelf: 'center',
    marginTop: '5%',
    borderWidth: 0.5,
    paddingHorizontal: 8,
  },
  row_evaluation: {
    flexDirection: 'row',
    marginTop: 9,
  },

  input_evaluation: {
    fontSize: 18,
    fontFamily: 'Roboto',
    color: 'black',
  },
  text_evaluation: {
    fontSize: 18,
    fontFamily: 'Roboto',
    color: 'black',
    fontWeight: 'bold',
  },
  addImage: {
    height: 40,
    width: '95%',
    borderColor: '#56CD7C',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    flexDirection: 'row',
    backgroundColor: '#F5FEFF',
    alignSelf: 'center',
    marginTop: '5%',
  },
});
