import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  View,
  FlatList,
  ScrollView,
  Animated,
  Easing,
  Image,
  Alert,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {COLORS} from '../constants/theme';
import {useFocusEffect} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API} from '../constants/api';
import LoadingScreen from '../components/LoadingScreen';

class Star extends React.Component {
  render() {
    return (
      <FontAwesome
        name={this.props.filled === true ? 'star' : 'star-o'}
        color="rgb(255,194,26)"
        size={18}
        style={{marginHorizontal: 2}}></FontAwesome>
    );
  }
}

const DATA = [
  {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    rate: 4,
    message: 'hang chat luong',
    responseMessage: 'xin cam on dong gop cua ban',
    status: 'PROCESSING',
    imageUrls: [
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        url: 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/feedbackImg%2Frn_image_picker_lib_temp_699ee8dc-d963-4b06-8c7b-4d7f90da667c.jpg?alt=media&token=433411d3-13cc-480f-9e68-b7a5f5cdc4bc&_gl=1*fpw4rq*_ga*MTkwMjQyMjkzNi4xNjg4OTk1NTgy*_ga_CW55HF8NVT*MTY5Njc3MzU4NC40MS4xLjE2OTY3NzM3NDQuNjAuMC4w',
      },
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        url: 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/feedbackImg%2Frn_image_picker_lib_temp_a6633ecf-3227-4edf-afe3-8765283223d2.png?alt=media&token=feb83ffa-0ad5-49ac-9aa0-9ef742e6c271&_gl=1*oc662t*_ga*MTkwMjQyMjkzNi4xNjg4OTk1NTgy*_ga_CW55HF8NVT*MTY5Njc3MzU4NC40MS4xLjE2OTY3NzM3NjAuNDQuMC4w',
      },
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        url: 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/feedbackImg%2Frn_image_picker_lib_temp_7795d9da-58c2-4a8f-bc1a-c328f7f11b65.jpg?alt=media&token=7c35e3eb-28f4-44f2-adc6-4b9813ee8379&_gl=1*m31zsp*_ga*MTkwMjQyMjkzNi4xNjg4OTk1NTgy*_ga_CW55HF8NVT*MTY5Njc3MzU4NC40MS4xLjE2OTY3NzM3NzkuMjUuMC4w',
      },
    ],
    object: 'OTHER ...',
    customer: {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      fullName: 'Quang',
      email: 'quang@gmail.com',
      phone: '0765058179',
      dateOfBirth: '2002-07-03',
      avatarUrl:
        'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/feedbackImg%2Frn_image_picker_lib_temp_080dc77c-1aff-490d-8fab-639343a98c5f.jpg?alt=media&token=0264f1b3-f815-4ab3-be21-149ff7847fda&_gl=1*kz30h5*_ga*MTkwMjQyMjkzNi4xNjg4OTk1NTgy*_ga_CW55HF8NVT*MTY5Njc1MjYxOC40MC4xLjE2OTY3NTI3MTkuNjAuMC4w',
      address: 'string',
      gender: 0,
      status: 0,
    },
  },
  {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    rate: 5,
    message: 'tuyeet voi',
    responseMessage:
      'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.',
    status: 'PROCESSING',
    imageUrls: [
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        url: 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/feedbackImg%2Frn_image_picker_lib_temp_2c841555-ceb8-41d1-b793-911720d7396b.jpg?alt=media&token=162e9ce1-a032-4465-9064-0701c4e8e1cd&_gl=1*t4jqxm*_ga*MTkwMjQyMjkzNi4xNjg4OTk1NTgy*_ga_CW55HF8NVT*MTY5Njc3MzU4NC40MS4xLjE2OTY3NzM1ODYuNTguMC4w',
      },
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        url: 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/feedbackImg%2Frn_image_picker_lib_temp_2c841555-ceb8-41d1-b793-911720d7396b.jpg?alt=media&token=162e9ce1-a032-4465-9064-0701c4e8e1cd&_gl=1*t4jqxm*_ga*MTkwMjQyMjkzNi4xNjg4OTk1NTgy*_ga_CW55HF8NVT*MTY5Njc3MzU4NC40MS4xLjE2OTY3NzM1ODYuNTguMC4w',
      },
    ],
    object: 'ORDER',
    customer: {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      fullName: 'Hieu',
      email: 'hieu@gmail.com',
      phone: '0123456789',
      dateOfBirth: '2002-01-10',
      avatarUrl:
        'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/feedbackImg%2Frn_image_picker_lib_temp_076488fc-5876-442a-a216-ff1f684cef17.jpg?alt=media&token=e4a230b5-fa8f-4a00-a7a0-c296867f4ef6&_gl=1*1bb6mc5*_ga*MTkwMjQyMjkzNi4xNjg4OTk1NTgy*_ga_CW55HF8NVT*MTY5Njc1MjYxOC40MC4xLjE2OTY3NTQyODguNTAuMC4w',
      address: 'string',
      gender: 0,
      status: 0,
    },
  },
  {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    rate: 3,
    message: 'tuyeet voi',
    responseMessage:
      'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.',
    status: 'PROCESSING',
    imageUrls: [],
    object: 'ORDER',
    customer: {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      fullName: 'Hieu',
      email: 'hieu@gmail.com',
      phone: '0123456789',
      dateOfBirth: '2002-01-10',
      avatarUrl:
        'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/feedbackImg%2Frn_image_picker_lib_temp_076488fc-5876-442a-a216-ff1f684cef17.jpg?alt=media&token=e4a230b5-fa8f-4a00-a7a0-c296867f4ef6&_gl=1*1bb6mc5*_ga*MTkwMjQyMjkzNi4xNjg4OTk1NTgy*_ga_CW55HF8NVT*MTY5Njc1MjYxOC40MC4xLjE2OTY3NTQyODguNTAuMC4w',
      address: 'string',
      gender: 0,
      status: 0,
    },
  },
];

const Item = ({data}) => {
  const [rating, setRating] = useState(data?.rate);
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

  for (let x = 1; x <= 5; x++) {
    stars.push(
      <Animated.View key={x} style={x <= rating ? animationStyle : ''}>
        <Star filled={x <= rating ? true : false} />
      </Animated.View>,
    );
  }

  return (
    <View
      style={{
        padding: 10,
        borderBottomWidth: 10,
        borderBottomColor: '#f4f4f4',
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
        <Image
          source={{uri: `${data?.customer?.avatarUrl}`}}
          style={{
            width: 30,
            height: 30,
            // alignSelf: 'center',
            borderRadius: 100,
          }}></Image>
        <Text style={{fontSize: 18, color: 'black', fontFamily: 'Roboto'}}>
          {data?.customer?.fullName}
        </Text>
      </View>
      <View
        style={{marginLeft: 40, flexDirection: 'column', gap: 6, marginTop: 3}}>
        <View style={{flexDirection: 'row', marginLeft: -3}}>{stars}</View>
        <Text>Mục : {data?.object}</Text>
        <Text style={{fontFamily: 'Roboto', fontSize: 18, color: 'black'}}>
          {data?.message}
        </Text>
        <View style={{flexDirection: 'row', gap: 10}}>
          {data?.imageUrls.length !== 0
            ? data?.imageUrls.map((image, key) => (
                <Image
                  key={key}
                  source={{uri: image.url}}
                  style={{
                    width: 105,
                    height: 105,
                    marginTop: '0%',
                  }}
                />
              ))
            : null}
        </View>
        <View
          style={{backgroundColor: '#F4F4F4', padding: 10, marginVertical: 5}}>
          <Text style={{fontFamily: 'Roboto', fontSize: 18, color: 'black'}}>
            Phản hồi của người bán:
          </Text>
          <Text style={{fontFamily: 'Roboto', fontSize: 16, marginTop: 3}}>
            {data?.responseMessage}
          </Text>
        </View>
      </View>
    </View>
  );
};

const FeedbackList = ({navigation}) => {
  const [FeedbackList, setFeedbackList] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [tokenId, setTokenId] = useState(null);
  //authen check
  const onAuthStateChange = async userInfo => {
    // console.log(userInfo);
    setLoading(true);
    if (initializing) {
      setInitializing(false);
    }
    if (userInfo) {
      // check if user sessions is still available. If yes => redirect to another screen
      const userTokenId = await userInfo
        .getIdToken(true)
        .then(token => token)
        .catch(async e => {
          console.log(e);
          return null;
        });
      if (!userTokenId) {
        // sessions end. (revoke refresh token like password change, disable account, ....)
        await AsyncStorage.removeItem('userInfo');
        setLoading(false);
        return;
      }
      setLoading(false);
      console.log('user is logged in');
      console.log('userInfo', await AsyncStorage.getItem('userInfo'));
    } else {
      // no sessions found.
      setLoading(false);
      console.log('user is not logged in');
    }
  };

  useFocusEffect(
    useCallback(() => {
      // auth().currentUser.reload()
      const subscriber = auth().onAuthStateChanged(
        async userInfo => await onAuthStateChange(userInfo),
      );
      GoogleSignin.configure({
        webClientId:
          '857253936194-dmrh0nls647fpqbuou6mte9c7e4o6e6h.apps.googleusercontent.com',
      });
      return subscriber;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const token = await auth().currentUser?.getIdToken();
        setTokenId(token);
        if (token === null) {
          Alert.alert('Unauthorized');
          return;
        } else {
          setLoading(true);
          fetch(
            `${API.baseURL}/api/feedback/getFeedbackForCustomer?page=0&size=100`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            },
          )
            .then(res => res.json())
            .then(data => {
              if (data.code == 404) {
                setFeedbackList([]);
                return;
              }
              setLoading(false);
              console.log(data);
              setFeedbackList(data);
            })
            .catch(err => {
              console.log(err);
              setLoading(false);
            });
        }
      };
      fetchData();
    }, []),
  );
  return (
    // <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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
            <Text style={styles.text_header}>Đánh giá của tôi</Text>
          </View>
          <View style={{justifyContent: 'center'}}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Feedback');
                //   console.log(FeedbackList.length);
                console.log(tokenId);
              }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: '100',
                  color: '#56CD7C',
                  fontFamily: 'Roboto',
                }}>
                Tạo
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.footer}>
        {FeedbackList ? (
          <ScrollView>
            {FeedbackList?.map((item, index) => (
              <Item data={item} key={index} />
            ))}
            <View
              style={{
                backgroundColor: '#f4f4f4',
                alignItems: 'center',
                borderBottomWidth: 10,
                borderBottomColor: '#f4f4f4',
              }}>
              <Text
                style={{
                  color: COLORS.primary,
                  fontFamily: 'Roboto',
                  fontSize: 14,
                }}>
                Không còn đánh giá nào
              </Text>
            </View>
          </ScrollView>
        ) : null}
      </View>
      {loading && <LoadingScreen />}
    </View>
    // </TouchableWithoutFeedback>
  );
};

export default FeedbackList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flex: 1,
  },
  footer: {
    flex: 10,
    borderTopWidth: 10,
    borderTopColor: '#f4f4f4',
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
});
