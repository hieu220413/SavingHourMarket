import React, {useState} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  Image,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import * as Progress from 'react-native-progress';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import {SelectList} from 'react-native-dropdown-select-list';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
export default function UploadScreen() {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [selected, setSelected] = useState('');
  //...

  const data = [
    {key: '1', value: 'Mobiles'},
    {key: '2', value: 'Appliances'},
    {key: '3', value: 'Cameras'},
    {key: '4', value: 'Computers'},
    {key: '5', value: 'Vegetables'},
    {key: '6', value: 'Diary Products'},
    {key: '7', value: 'Drinks'},
  ];

  const selectImage = limit => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
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
        console.log('sources', sources);
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

    launchCamera(options).then(response => {
      console.log(response);
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
      console.log(url);
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
    console.log(urls);
    setImages(urls);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={
          images.length == 3
            ? [styles.selectButton, {backgroundColor: 'grey'}]
            : styles.selectButton
        }
        onPress={() => selectImage(3 - images.length)}
        disabled={images.length == 3 ? true : false}>
        <Text style={styles.buttonText}>Pick an image</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={
          images.length == 3
            ? [styles.selectButton, {backgroundColor: 'grey'}]
            : styles.selectButton
        }
        onPress={handleCameraLaunch}
        disabled={images.length == 3 ? true : false}>
        <Text style={styles.buttonText}>Camera</Text>
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
                size={25}
                color="black"></Feather>
            </TouchableOpacity>
            <Image source={{uri: images[0]}} style={styles.imageBox} />
          </View>
        ) : (
          <TouchableOpacity style={styles.imageBox_null}>
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
                size={25}
                color="black"></Feather>
            </TouchableOpacity>
            <Image source={{uri: images[1]}} style={styles.imageBox} />
          </View>
        ) : (
          <TouchableOpacity style={styles.imageBox_null}>
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
                size={25}
                color="black"></Feather>
            </TouchableOpacity>
            <Image source={{uri: images[2]}} style={styles.imageBox} />
          </View>
        ) : (
          <TouchableOpacity style={styles.imageBox_null}>
            <Entypo name="image" size={28} color="black"></Entypo>
          </TouchableOpacity>
        )}

        {/* {images.length !== 0
          ? images.map((image, key) => (
              <Image key={key} source={{uri: image}} style={styles.imageBox} />
            ))
          : null} */}
      </View>
      {uploading ? (
        <View style={styles.progressBarContainer}>
          <Progress.Bar progress={transferred} width={300} />
        </View>
      ) : (
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() => uploadImages(images)}>
          <Text style={styles.buttonText}>Upload image</Text>
        </TouchableOpacity>
      )}
      <View style={{marginTop: 10, width: '80%'}}>
        <SelectList
          setSelected={val => setSelected(val)}
          search={false}
          data={data}
          // arrowicon={
          //   <FontAwesome name="chevron-down" size={12} color={'black'} />
          // }
          searchicon={<FontAwesome name="search" size={12} color={'black'} />}
        />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#bbded6',
  },
  selectButton: {
    borderRadius: 5,
    width: 150,
    height: 50,
    backgroundColor: '#8ac6d1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButton: {
    borderRadius: 5,
    width: 150,
    height: 50,
    backgroundColor: '#ffb6b9',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageContainer: {
    marginTop: 30,
    marginBottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarContainer: {
    marginTop: 20,
  },
  imageBox: {
    width: 100,
    height: 100,
    marginHorizontal: 5,
    zIndex: -1,
  },
  deleteButton: {
    marginBottom: -13,
    marginRight: -5,
  },
  imageBox_null: {
    width: 100,
    height: 100,
    marginHorizontal: 5,
    borderWidth: 1,
    borderStyle: 'dashed',
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
