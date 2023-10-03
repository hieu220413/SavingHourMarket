/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, Image, Text} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {icons} from '../constants';
import {COLORS} from '../constants/theme';
import QrCode from '../assets/image/test-qrcode.png';

const OrderDetail = ({navigation}) => {
  return (
    <>
      <View>
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
            Chi tiết đơn hàng
          </Text>
        </View>
        <ScrollView>
          <View style={{padding: 20, backgroundColor: '#23ba9c'}}>
            <Text style={{color: 'white', fontSize: 18, fontFamily: 'Roboto'}}>
              Đơn hàng đang chờ xác nhận
            </Text>
          </View>
          {/* pickup location */}
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              gap: 10,
              borderBottomColor: '#decbcb',
              borderBottomWidth: 0.75,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
              <Image
                style={{width: 20, height: 20}}
                resizeMode="contain"
                source={icons.location}
              />
              <Text style={{fontSize: 20, color: 'black', fontWeight: 'bold'}}>
                Thông tin giao hàng
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
              <View style={{width: 20}} />
              <View style={{gap: 5}}>
                <View style={{gap: 3}}>
                  {/* <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                Điểm giao hàng:
              </Text> */}
                  <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                    121 Trần Văn Dư, P.13, Q.Tân Bình
                  </Text>
                </View>
                <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                  Khung giờ: 07:00 đến 09:00
                </Text>
                <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                  Ngày giao hàng: 28-09-2023
                </Text>
              </View>
            </View>
          </View>
          {/* ******************* */}

          {/* Customer information */}
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              gap: 10,
              marginBottom: 20,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
              <Image
                style={{width: 20, height: 20}}
                resizeMode="contain"
                source={icons.phone}
              />
              <Text style={{fontSize: 20, color: 'black', fontWeight: 'bold'}}>
                Thông tin liên lạc
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
              <View style={{width: 20}} />
              <View style={{gap: 5}}>
                <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                  Hà Anh Tú
                </Text>
                <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                  0898449505
                </Text>
              </View>
            </View>
          </View>
          {/* *********************** */}

          {/* Order Item */}
          <View
            style={{
              backgroundColor: 'white',
              paddingBottom: 10,
              marginBottom: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                gap: 10,
                alignItems: 'center',
                backgroundColor: 'white',
                borderBottomColor: '#decbcb',
                borderBottomWidth: 0.5,
                padding: 20,
              }}>
              <Image
                source={{
                  uri: 'https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2022/11/23/a-va-dai-thao-duong-co-an-duoc-chuoi-16691977534161220101928.jpg',
                }}
                style={{flex: 4, width: '100%', height: '95%'}}
              />
              <View
                style={{
                  flexDirection: 'column',
                  gap: 10,
                  flex: 7,
                }}>
                <Text
                  style={{
                    fontSize: 23,
                    color: 'black',
                    fontFamily: 'Roboto',
                    fontWeight: 'bold',
                  }}>
                  Chuối to chín vàng
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    color: 'black',
                    fontFamily: 'Roboto',
                    backgroundColor: '#7ae19c',
                    alignSelf: 'flex-start',
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    borderRadius: 5,
                  }}>
                  Trái cây
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      fontSize: 20,

                      fontFamily: 'Roboto',
                    }}>
                    96.000 VNĐ
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: 'Roboto',
                    }}>
                    x2
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                paddingHorizontal: 20,
                paddingVertical: 10,
                marginTop: 20,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: 'Roboto',
                  color: 'black',
                }}>
                Tổng cộng (2 sản phẩm):
              </Text>
              <Text
                style={{
                  fontSize: 20,
                  color: 'red',
                  fontFamily: 'Roboto',
                  fontWeight: 'bold',
                }}>
                192.000 VNĐ
              </Text>
            </View>
          </View>
          {/* ********************* */}

          {/* Detail information */}
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              marginTop: 20,
              marginBottom: 20,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                marginBottom: 20,
              }}>
              <Text
                style={{
                  fontSize: 22,
                  fontFamily: 'Roboto',
                  color: 'black',
                  fontWeight: 'bold',
                }}>
                Thanh toán
              </Text>
            </View>

            {/* <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 15,
                paddingTop: 20,
                borderTopColor: '#decbcb',
                borderTopWidth: 0.75,
                justifyContent: 'space-between',
              }}>
              <Text
                style={{fontSize: 20, fontFamily: 'Roboto', color: 'black'}}>
                Mã đơn hàng:
              </Text>
              <Text style={{fontSize: 20, fontFamily: 'Roboto', width: '60%'}}>
                3f720006-64e6-4701-9b7f-dc45aea76570
              </Text>
            </View> */}

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 15,
                paddingTop: 20,
                borderTopColor: '#decbcb',
                borderTopWidth: 0.75,
                justifyContent: 'space-between',
              }}>
              <Text
                style={{fontSize: 20, fontFamily: 'Roboto', color: 'black'}}>
                Trạng thái
              </Text>
              <Text style={{fontSize: 20, fontFamily: 'Roboto'}}>
                Chưa thanh toán
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 15,
                paddingTop: 20,

                justifyContent: 'space-between',
              }}>
              <Text
                style={{fontSize: 20, fontFamily: 'Roboto', color: 'black'}}>
                Phương thức
              </Text>
              <Text style={{fontSize: 20, fontFamily: 'Roboto'}}>COD</Text>
            </View>
          </View>

          {/* ******************* */}

          {/* Price information */}
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                marginBottom: 20,
              }}>
              <Text
                style={{
                  fontSize: 22,
                  fontFamily: 'Roboto',
                  color: 'black',
                  fontWeight: 'bold',
                }}>
                Giá tiền
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 15,
                paddingTop: 20,
                justifyContent: 'space-between',
                borderTopColor: '#decbcb',
                borderTopWidth: 0.75,
              }}>
              <Text
                style={{fontSize: 20, fontFamily: 'Roboto', color: 'black'}}>
                Tổng tiền sản phẩm:
              </Text>
              <Text style={{fontSize: 20, fontFamily: 'Roboto'}}>
                633.700 VNĐ
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 15,
                paddingVertical: 15,
                justifyContent: 'space-between',
              }}>
              <Text
                style={{fontSize: 20, fontFamily: 'Roboto', color: 'black'}}>
                Phí giao hàng:
              </Text>
              <Text style={{fontSize: 20, fontFamily: 'Roboto'}}>0 VNĐ</Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 15,
                justifyContent: 'space-between',
              }}>
              <Text
                style={{fontSize: 20, fontFamily: 'Roboto', color: 'black'}}>
                Tổng cộng:
              </Text>
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: 'Roboto',
                  color: 'red',
                  fontWeight: 'bold',
                }}>
                633.700 VNĐ
              </Text>
            </View>
          </View>
          {/* ******************** */}

          {/* QR code */}
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              marginTop: 20,
              marginBottom: 180,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              resizeMode="contain"
              style={{width: '100%', height: 300}}
              source={QrCode}
            />
          </View>
        </ScrollView>
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'white',
          borderTopColor: 'transparent',
          height: 70,
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',

          marginTop: 20,
          elevation: 10,
        }}>
        <View style={{width: '95%'}}>
          <TouchableOpacity
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#23ba9c',
              paddingVertical: 10,
              width: '100%',
              borderRadius: 5,
            }}>
            <Text
              style={{
                fontSize: 18,
                color: 'white',
                fontFamily: 'Roboto',
                fontWeight: 'bold',
              }}>
              Hủy đơn hàng
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default OrderDetail;
