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
  Platform,
  Alert,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import * as ImagePicker from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import {useFocusEffect} from '@react-navigation/native';
import * as Progress from 'react-native-progress';
import Feather from 'react-native-vector-icons/Feather';
import {SelectList} from 'react-native-dropdown-select-list';
import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API} from '../constants/api';
import LoadingScreen from '../components/LoadingScreen';
import database from '@react-native-firebase/database';

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
              routes: [{name: 'Initial'}],
            });
          } else {
            // setSystemStatus(snapshot.val());
          }
        });
    }, []),
  );

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

  const showToast = () => {
    Toast.show({
      type: 'success',
      text1: 'Thành công',
      text2: 'Để lại đánh giá thành công 👋',
      visibilityTime: 1000,
    });
  };

  //--------------------IMAGE----------------------
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const selectImage = limit => {
    const options = {
      maxWidth: 2000,
      maxHeight: 2000,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      selectionLimit: limit,
    };
    ImagePicker.launchImageLibrary(options).then(response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        let sources = response.assets.map(asset => asset.uri);
        // const source = response.assets[0].uri;
        // console.log('sources', sources);
        setImages(images => [...images, ...sources]);
      }
    });
  };

  handleCameraLaunch = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    ImagePicker.launchCamera(options).then(response => {
      // console.log(response);
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.error) {
        console.log('Camera Error: ', response.error);
      } else {
        let sources = response.assets.map(asset => asset.uri);
        // const source = response.assets[0].uri;
        console.log('sources', sources);
        setImages(images => [...images, ...sources]);
      }
    });
  };

  const uploadImages = async images => {
    const imagePromises = Array.from(images, image => uploadImage(image));

    const imageRes = await Promise.all(imagePromises);
    console.log('imageRes', imageRes);
    return imageRes; // list of url like ["https://..", ...]
  };

  const uploadImage = async image => {
    const uri = image;
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
    setUploading(true);
    setTransferred(0);

    let url;

    const task = storage().ref(`feedbackImg/${filename}`).putFile(uploadUri);

    // set progress state
    task.on('state_changed', snapshot => {
      setTransferred(
        Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000,
      );
    });
    try {
      await task;
      url = await storage().ref(`feedbackImg/${filename}`).getDownloadURL();
      // console.log(url);
    } catch (e) {
      console.log(e);
    }
    setUploading(false);
    setImages([]);
    return url;
  };

  const deleteImage = imageUrl => {
    let urls = images;
    urls = urls.filter(url => url !== imageUrl);
    // console.log(urls);
    setImages(urls);
  };
  //--------------------END----------------------

  const [selected, setSelected] = useState('');
  const data = [
    {value: 'Ý kiến đóng góp'},
    {value: 'Câu hỏi'},
    {value: 'Khác ...'},
  ];
  const [message, setMessage] = useState('');
  const [initializing, setInitializing] = useState(true);
  const [tokenId, setTokenId] = useState(null);
  const [loading, setLoading] = useState(false);
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
          setLoading(false);
          return null;
        });
      if (!userTokenId) {
        // sessions end. (revoke refresh token like password change, disable account, ....)
        await AsyncStorage.removeItem('userInfo');
        setLoading(false);
        return;
      }
      const token = await auth().currentUser.getIdToken();
      setTokenId(token);
      setLoading(false);
      console.log('token', token);
      console.log('user is logged in');
      // console.log('userInfo', await AsyncStorage.getItem('userInfo'));
    } else {
      // no sessions found.
      setLoading(false);
      console.log('user is not logged in');
    }
  };

  useEffect(() => {
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
  }, []);

  //----------------SEND---------------------------
  const sendFeedback = async () => {
    let feedbackInfo = {};
    if (selected === '') {
      Alert.alert('Vui lòng chọn mục để đánh giá !!!');
      return;
    } else {
      let listImages;
      if (images.length != 0) {
        setLoading(true);
        listImages = await uploadImages(images);
        // console.log(listImages);
      } else {
        listImages = [];
      }
      let object;
      if (selected === 'Ý kiến đóng góp') {
        object = 'COMPLAIN';
      } else if (selected === 'Câu hỏi') {
        object = 'QUESTION';
      } else if (selected === 'Khác ...') {
        object = 'OTHER';
      }
      feedbackInfo = {
        rate: rating,
        message: message,
        imageUrls: listImages,
        object: object,
      };
      console.log('feedbackInfo', feedbackInfo);
      if (tokenId === null) {
        Alert.alert('Unauthorized');
        return;
      } else {
        setLoading(true);
        fetch(`${API.baseURL}/api/feedback/create`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokenId}`,
          },
          body: JSON.stringify(feedbackInfo),
        })
          .then(res => {
            return res.text();
          })
          .then(async respond => {
            console.log('respone', respond);
            showToast(respond);
            setLoading(false);
            navigation.navigate('List Feedback');
          })
          .catch(err => {
            console.log(err);
            setLoading(false);
          });
      }
    }
  };

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
              <Text style={styles.text_header}>Đánh giá</Text>
            </View>
            <View style={{justifyContent: 'center'}}>
              <TouchableOpacity
                onPress={() => {
                  console.log(selected);
                  sendFeedback();
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: '100',
                    color: '#56CD7C',
                    fontFamily: 'Roboto',
                  }}>
                  Gửi
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              marginVertical: '6%',
              paddingLeft: 14,
              flexDirection: 'row',
            }}>
            <Text
              style={{
                fontFamily: 'Roboto',
                fontSize: 20,
                color: 'black',
                marginRight: 10,
                paddingTop: 8,
                // backgroundColor: 'red',
              }}>
              Mục:
            </Text>
            <View
              style={{
                width: '80%',
                zIndex: 100,
              }}>
              <SelectList
                setSelected={val => setSelected(val)}
                search={false}
                data={data}
                placeholder="Chọn mục đánh giá"
                boxStyles={{backgroundColor: 'white'}}
                dropdownStyles={{backgroundColor: 'white'}}
                inputStyles={{color: 'black'}}
                dropdownTextStyles={{color: 'black'}}
              />
            </View>
          </View>
        </View>
        <View style={styles.footer}>
          <View style={styles.rating}>
            <Text style={styles.text_rating}>Rating: </Text>
            <View style={{flexDirection: 'row', paddingLeft: 14}}>{stars}</View>
          </View>
          <View style={{height: '55%'}}>
            <ScrollView style={styles.evaluation_box}>
              {/* <View style={[styles.row_evaluation, {borderBottomWidth: 0.5}]}>
                <Text style={styles.text_evaluation}>Tiêu đề:</Text>
                <TextInput
                  placeholder="nhập ..."
                  style={[
                    styles.input_evaluation,
                    {marginLeft: 3, marginTop: -12},
                  ]}></TextInput>
              </View> */}
              <View style={styles.row_evaluation}>
                <Text style={styles.text_evaluation}>Đánh giá:</Text>
                <TextInput
                  placeholder=" để lại đánh giá"
                  multiline={true}
                  value={message}
                  onChangeText={setMessage}
                  style={[
                    styles.input_evaluation,
                    {marginTop: -11},
                  ]}></TextInput>
              </View>
            </ScrollView>
          </View>
          <TouchableOpacity
            style={
              images.length == 3 ? [styles.addImage_disable] : styles.addImage
            }
            onPress={handleCameraLaunch}
            disabled={images.length == 3 ? true : false}>
            {/* {images.length == 3 ? } */}
            <Entypo
              name="camera"
              size={28}
              color={images.length == 3 ? '#909090' : '#56CD7C'}></Entypo>
            <Text
              style={
                images.length == 3
                  ? {
                      fontFamily: 'Roboto',
                      fontSize: 16,
                      color: '#909090',
                      marginLeft: 10,
                    }
                  : {
                      fontFamily: 'Roboto',
                      fontSize: 16,
                      color: '#56CD7C',
                      marginLeft: 10,
                    }
              }>
              Thêm hình ảnh
            </Text>
          </TouchableOpacity>
          <View style={styles.imageContainer}>
            {images[0] ? (
              <View style={{flexDirection: 'column', alignItems: 'flex-end'}}>
                <TouchableOpacity
                  onPress={() => {
                    deleteImage(images[0]);
                  }}>
                  <Feather
                    style={styles.deleteButton}
                    name="x"
                    size={20}
                    color="black"></Feather>
                </TouchableOpacity>
                <Image source={{uri: images[0]}} style={styles.imageBox} />
              </View>
            ) : (
              <TouchableOpacity
                style={styles.imageBox_null}
                onPress={() => selectImage(3 - images.length)}>
                <Entypo name="image" size={28} color="black"></Entypo>
              </TouchableOpacity>
            )}
            {images[1] ? (
              <View style={{flexDirection: 'column', alignItems: 'flex-end'}}>
                <TouchableOpacity
                  onPress={() => {
                    deleteImage(images[1]);
                  }}>
                  <Feather
                    style={styles.deleteButton}
                    name="x"
                    size={20}
                    color="black"></Feather>
                </TouchableOpacity>
                <Image source={{uri: images[1]}} style={styles.imageBox} />
              </View>
            ) : (
              <TouchableOpacity
                style={styles.imageBox_null}
                onPress={() => selectImage(3 - images.length)}>
                <Entypo name="image" size={28} color="black"></Entypo>
              </TouchableOpacity>
            )}
            {images[2] ? (
              <View style={{flexDirection: 'column', alignItems: 'flex-end'}}>
                <TouchableOpacity
                  onPress={() => {
                    deleteImage(images[2]);
                  }}>
                  <Feather
                    style={styles.deleteButton}
                    name="x"
                    size={20}
                    color="black"></Feather>
                </TouchableOpacity>
                <Image source={{uri: images[2]}} style={styles.imageBox} />
              </View>
            ) : (
              <TouchableOpacity
                style={styles.imageBox_null}
                onPress={() => selectImage(3 - images.length)}>
                <Entypo name="image" size={28} color="black"></Entypo>
              </TouchableOpacity>
            )}

            {/* {images.length !== 0
          ? images.map((image, key) => (
              <Image key={key} source={{uri: image}} style={styles.imageBox} />
            ))
          : null} */}
          </View>
        </View>
        {loading && <LoadingScreen />}
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
    // backgroundColor:'black',
    width: '80%',
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
  addImage_disable: {
    height: 40,
    width: '95%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#E5E5E5',
    alignSelf: 'center',
    marginTop: '5%',
  },
  imageContainer: {
    marginTop: '3%',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  imageBox: {
    width: 105,
    height: 105,
    marginHorizontal: '3%',
    zIndex: -1,
    marginTop: '0%',
  },
  deleteButton: {
    marginBottom: -17,
    marginRight: 0,
  },
  imageBox_null: {
    width: 105,
    height: 105,
    marginHorizontal: '3%',
    borderWidth: 1,
    borderStyle: 'dashed',
    // marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
