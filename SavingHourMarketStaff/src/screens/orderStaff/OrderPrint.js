/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import {
  View,
  Text,
  Dimensions,
  ActivityIndicator,
  Linking,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import {React, useCallback} from 'react';
import Pdf from 'react-native-pdf';
import {icons} from '../../constants';
import {COLORS} from '../../constants/theme';
import {checkSystemState} from '../../common/utils';
import {useFocusEffect} from '@react-navigation/native';

export default function App({navigation, route}) {
  // listen to system state
  useFocusEffect(
    useCallback(() => {
      checkSystemState(navigation);
    }, []),
  );
  console.log(route.params.uri);
  return (
    <View style={styles.container}>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          gap: 20,
          backgroundColor: '#ffffff',
          padding: 20,
          elevation: 4,
          marginBottom: 10,
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={icons.leftArrow}
            resizeMode="contain"
            style={{width: 35, height: 35, tintColor: COLORS.primary}}
          />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 25,
            textAlign: 'center',
            color: '#000000',
            fontWeight: 'bold',
            fontFamily: 'Roboto',
          }}>
          Bản In Đơn Hàng
        </Text>
      </View>
      <Pdf
        trustAllCerts={false}
        source={{
          uri: route.params.uri,
        }}
        page={1}
        scale={1.0}
        minScale={0.5}
        maxScale={3.0}
        renderActivityIndicator={() => (
          <ActivityIndicator color={COLORS.primary} size="large" />
        )}
        enablePaging={true}
        onLoadProgress={percentage => console.log(`Loading :${percentage}`)}
        onLoadComplete={() => console.log('Loading Complete')}
        onPageChanged={(page, totalPages) =>
          console.log(`${page}/${totalPages}`)
        }
        onError={error => console.log(error)}
        onPageSingleTap={page => alert(page)}
        onPressLink={link => Linking.openURL(link)}
        onScaleChanged={scale => console.log(scale)}
        // singlePage={true}
        spacing={10}
        // horizontal
        style={{flex: 1, width: Dimensions.get('window').width}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flex: 2.2,
    // backgroundColor: 'orange',
    paddingHorizontal: 20,
  },
  body: {
    flex: 11,
    // backgroundColor: 'pink',
    paddingHorizontal: 20,
  },
  areaAndLogout: {
    paddingTop: 10,
    flexDirection: 'row',
  },
  pickArea: {
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  area: {
    flex: 7,
    // backgroundColor: 'white',
  },
  logout: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginLeft: 10,
  },
  pickAreaItem: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    width: '85%',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22,
    backgroundColor: 'rgba(50,50,50,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
