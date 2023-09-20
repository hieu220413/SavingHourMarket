import React from 'react';
import {Text, View, SafeAreaView, Image, Touchable, Switch} from 'react-native';
import Header from '../shared/Header';
import {COLORS} from '../constants/theme';
import {icons} from '../constants';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';

const Profile = ({navigation}) => {
  const options = [
    {icon: 'user', display: 'Edit Profile'},
    {icon: 'payment', display: 'Payment Method'},
    {icon: 'security', display: 'Security'},
  ];
  return (
    <SafeAreaView
      style={{
        flexDirection: 'column',
        backgroundColor: 'white',
        height: '100%',
      }}>
      {/* <Header /> */}

      <View style={{marginHorizontal: '6%', marginTop: '3%'}}>
        <Text
          style={{
            fontSize: 25,
            fontWeight: 'bold',
            color: 'black',
            fontFamily: 'Roboto',
          }}>
          Profile
        </Text>
      </View>
      {/* Profile */}
      <View
        style={{
          paddingHorizontal: '6%',
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: '5%',
          marginTop: '5%',
        }}>
        <Image
          style={{
            width: 90,
            height: 90,
            // alignSelf: 'center',
            borderRadius: 100,
          }}
          source={require('../assets/image/profileImage.jpeg')}
        />
        <View style={{flexDirection: 'column', paddingLeft: '7%'}}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 23,
              textAlign: 'left',
              paddingBottom: '3%',
              fontFamily: 'Roboto',
            }}>
            Quang Pham
          </Text>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 13,
              textAlign: 'left',
              fontFamily: 'Roboto',
            }}>
            +0765058179
          </Text>
        </View>
        <TouchableOpacity
          style={{
            marginLeft: 20,
            flexDirection: 'row',
            backgroundColor: '#f8f8f8',
            borderRadius: 50,
          }}
          onPress={() => {
            navigation.navigate('Edit Profile');
          }}>
          <Image
            source={icons.edit}
            resizeMode="contain"
            style={{
              width: 30,
              height: 20,
              margin: '4%',
              justifyContent: 'center',
              tintColor: 'black',
            }}></Image>
          <Text
            style={{
              alignSelf: 'center',
              fontWeight: 'bold',
              fontSize: 16,
              fontFamily: 'Roboto',
            }}>
            Edit
          </Text>
        </TouchableOpacity>
      </View>

      {/* Options */}
      <View
        style={{
          marginTop: '8%',
          flexDirection: 'column',
          rowGap: 18,
          marginHorizontal: '4%',
        }}>
        {/* Line */}
        <View
          style={{
            borderBottomColor: 'black',
            borderBottomWidth: 0.5,
            width: '93%',
            alignSelf: 'center',
          }}
        />
        {/* Options 1 */}

        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: '3%',
            justifyContent: 'space-between',
          }}
          activeOpacity={0.8}
          onPress={() => {
            navigation.navigate('Edit Profile');
          }}>
          <View
            style={{flexDirection: 'row', columnGap: 15, alignItems: 'center'}}>
            <AntDesign name="user" size={30} color="black"></AntDesign>
            <Text
              style={{
                fontFamily: 'Roboto',
                fontSize: 16,
                fontWeight: '700',
                color: 'black',
              }}>
              Edit Profile
            </Text>
          </View>
          <View>
            <AntDesign name="right" size={20} color="black"></AntDesign>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: '3%',
            justifyContent: 'space-between',
          }}
          activeOpacity={0.8}>
          <View
            style={{flexDirection: 'row', columnGap: 15, alignItems: 'center'}}>
            <MaterialIcons
              name="payment"
              size={30}
              color="black"></MaterialIcons>
            <Text
              style={{
                fontFamily: 'Roboto',
                fontSize: 16,
                fontWeight: '700',
                color: 'black',
              }}>
              Payment Method
            </Text>
          </View>
          <AntDesign name="right" size={20} color="black"></AntDesign>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: '3%',
            justifyContent: 'space-between',
          }}
          activeOpacity={0.8}>
          <View
            style={{flexDirection: 'row', columnGap: 15, alignItems: 'center'}}>
            <MaterialIcons
              name="security"
              size={30}
              color="black"></MaterialIcons>
            <Text
              style={{
                fontFamily: 'Roboto',
                fontSize: 16,
                fontWeight: '700',
                color: 'black',
              }}>
              Security
            </Text>
          </View>
          <AntDesign name="right" size={20} color="black"></AntDesign>
        </TouchableOpacity>
        {/* Line */}
        <View
          style={{
            borderBottomColor: 'black',
            borderBottomWidth: 0.5,
            width: '93%',
            alignSelf: 'center',
          }}
        />
        {/* Options 2 */}
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: '3%',
            justifyContent: 'space-between',
          }}
          activeOpacity={0.8}>
          <View
            style={{flexDirection: 'row', columnGap: 15, alignItems: 'center'}}>
            <MaterialIcons
              name="notifications-none"
              size={30}
              color="black"></MaterialIcons>
            <Text
              style={{
                fontFamily: 'Roboto',
                fontSize: 16,
                fontWeight: '700',
                color: 'black',
              }}>
              Notification
            </Text>
          </View>
          <AntDesign name="right" size={20} color="black"></AntDesign>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: '3%',
            justifyContent: 'space-between',
          }}
          activeOpacity={0.8}>
          <View
            style={{flexDirection: 'row', columnGap: 15, alignItems: 'center'}}>
            <Feather name="map-pin" size={30} color="black"></Feather>
            <Text
              style={{
                fontFamily: 'Roboto',
                fontSize: 16,
                fontWeight: '700',
                color: 'black',
              }}>
              Address
            </Text>
          </View>
          <AntDesign name="right" size={20} color="black"></AntDesign>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: '3%',
            justifyContent: 'space-between',
          }}
          activeOpacity={0.8}>
          <View
            style={{flexDirection: 'row', columnGap: 15, alignItems: 'center'}}>
            <AntDesign
              name="questioncircleo"
              size={30}
              color="black"></AntDesign>
            <Text
              style={{
                fontFamily: 'Roboto',
                fontSize: 16,
                fontWeight: '700',
                color: 'black',
              }}>
              Help
            </Text>
          </View>
          <AntDesign name="right" size={20} color="black"></AntDesign>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: '3%',
            justifyContent: 'space-between',
          }}
          activeOpacity={0.8}>
          <View
            style={{flexDirection: 'row', columnGap: 15, alignItems: 'center'}}>
            <AntDesign name="logout" size={30} color="red"></AntDesign>
            <Text
              style={{
                fontFamily: 'Roboto',
                fontSize: 16,
                fontWeight: '700',
                color: 'red',
              }}>
              Log out
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
