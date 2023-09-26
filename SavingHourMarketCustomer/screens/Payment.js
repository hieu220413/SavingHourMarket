/* eslint-disable prettier/prettier */
/* eslint-disable no-shadow */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */

import React, {useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {icons} from '../constants';
import {COLORS} from '../constants/theme';
import CheckBox from 'react-native-check-box';
import DatePicker from 'react-native-date-picker';
import {format} from 'date-fns';

const Payment = ({navigation}) => {
  const [customerLocationIsChecked, setCustomerLocationIsChecked] =
    useState(false);
  const [pickUpPointIsChecked, setpickUpPointIsChecked] = useState(true);
  const [date, setDate] = useState(null);
  const [open, setOpen] = useState(false);
  return (
    <>
      <ScrollView>
        <View style={{marginBottom: 120}}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              flexDirection: 'row',
              gap: 20,
              marginBottom: 30,
              backgroundColor: '#ffffff',
              padding: 20,
              elevation: 4,
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
                fontSize: 30,
                textAlign: 'center',
                color: '#000000',
                fontWeight: 'bold',
                fontFamily: 'Roboto',
              }}>
              Payment
            </Text>
          </View>
          {/* OrderItem */}
          <View
            style={{
              backgroundColor: 'white',
              paddingBottom: 10,
              marginBottom: 20,
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
                  Fruit
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
                    x6
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
                Total price (6 item):
              </Text>
              <Text
                style={{
                  fontSize: 20,
                  color: 'red',
                  fontFamily: 'Roboto',
                  fontWeight: 'bold',
                }}>
                633.700 VNĐ
              </Text>
            </View>
          </View>

          {/* Select deliver location */}
          <View style={{backgroundColor: 'white', padding: 20, marginTop: 10}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                marginBottom: 20,
              }}>
              {/* <Image
                resizeMode="contain"
                style={{width: 25, height: 25}}
                source={icons.location}
              /> */}
              <Text
                style={{
                  fontSize: 22,
                  fontFamily: 'Roboto',
                  color: 'black',
                  fontWeight: 'bold',
                }}>
                Destination Point
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 15,
                paddingVertical: 15,
                borderTopColor: '#decbcb',
                borderTopWidth: 0.75,
              }}>
              <CheckBox
                disabled={pickUpPointIsChecked}
                uncheckedCheckBoxColor="#000000"
                checkedCheckBoxColor={COLORS.primary}
                onClick={() => {
                  setpickUpPointIsChecked(!pickUpPointIsChecked);
                  setCustomerLocationIsChecked(!customerLocationIsChecked);
                }}
                isChecked={pickUpPointIsChecked}
              />
              <Text
                style={{fontSize: 20, fontFamily: 'Roboto', color: 'black'}}>
                Pickup Point
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 15,
                paddingVertical: 15,
              }}>
              <CheckBox
                uncheckedCheckBoxColor="#000000"
                checkedCheckBoxColor={COLORS.primary}
                onClick={() => {
                  setCustomerLocationIsChecked(!customerLocationIsChecked);
                  setpickUpPointIsChecked(!pickUpPointIsChecked);
                }}
                isChecked={customerLocationIsChecked}
                disabled={customerLocationIsChecked}
              />
              <Text
                style={{fontSize: 20, fontFamily: 'Roboto', color: 'black'}}>
                Customer Location
              </Text>
            </View>
          </View>

          {/* Manage PickupPoint / TimeFrame/ Date */}
          {pickUpPointIsChecked && (
            <View style={{backgroundColor: 'white', marginTop: 20}}>
              {/* Manage Pickup Point */}
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Select pickup point');
                }}>
                <View
                  style={{
                    padding: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 10,
                      alignItems: 'center',
                      flex: 9,
                    }}>
                    <Image
                      resizeMode="contain"
                      style={{width: 25, height: 25}}
                      source={icons.location}
                    />
                    <Text
                      style={{
                        fontSize: 20,
                        fontFamily: 'Roboto',
                        color: 'black',
                      }}>
                      Select pickup point
                    </Text>
                  </View>

                  <Image
                    resizeMode="contain"
                    style={{
                      width: 25,
                      height: 25,
                      flex: 1,
                    }}
                    source={icons.rightArrow}
                  />
                </View>
              </TouchableOpacity>
              {/* Manage Date */}
              <TouchableOpacity onPress={() => setOpen(true)}>
                <View
                  style={{
                    padding: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTopColor: '#decbcb',
                    borderTopWidth: 0.75,
                    borderBottomColor: '#decbcb',
                    borderBottomWidth: 0.75,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 10,
                      alignItems: 'center',
                      flex: 9,
                    }}>
                    <Image
                      resizeMode="contain"
                      style={{width: 25, height: 25}}
                      source={icons.calendar}
                    />
                    <Text
                      style={{
                        fontSize: 20,
                        fontFamily: 'Roboto',
                        color: 'black',
                      }}>
                      {date ? format(date, 'dd-MM-yyyy') : 'Select date'}
                    </Text>
                  </View>

                  {/* <Image
                  resizeMode="contain"
                  style={{
                    width: 25,
                    height: 25,
                    flex: 1
                  }}
                  source={icons.rightArrow}
                /> */}
                </View>
              </TouchableOpacity>
              <DatePicker
                modal
                mode="date"
                open={open}
                date={date ? date : new Date()}
                onConfirm={date => {
                  setOpen(false);
                  setDate(date);
                }}
                onCancel={() => {
                  setOpen(false);
                }}
              />
              {/* Manage time frame */}
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Select time frame');
                }}>
                <View
                  style={{
                    padding: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 10,
                      alignItems: 'center',
                      flex: 9,
                    }}>
                    <Image
                      resizeMode="contain"
                      style={{width: 25, height: 25}}
                      source={icons.time}
                    />
                    <Text
                      style={{
                        fontSize: 20,
                        fontFamily: 'Roboto',
                        color: 'black',
                      }}>
                      Select time frame
                    </Text>
                  </View>

                  <Image
                    resizeMode="contain"
                    style={{
                      width: 25,
                      height: 25,
                      flex: 1,
                    }}
                    source={icons.rightArrow}
                  />
                </View>
              </TouchableOpacity>
            </View>
          )}

          {customerLocationIsChecked && (
            <View style={{backgroundColor: 'white', marginTop: 20}}>
              {/* Manage customer location */}
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Select customer location');
                }}>
                <View
                  style={{
                    padding: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <View style={{flex: 9}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        gap: 10,
                        alignItems: 'center',
                      }}>
                      <Image
                        style={{
                          width: 25,
                          height: 25,
                        }}
                        source={icons.location}
                      />
                      <Text
                        style={{
                          fontSize: 20,
                          fontFamily: 'Roboto',
                          color: 'black',
                        }}>
                        Current location
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        gap: 10,
                        alignItems: 'center',
                        marginTop: 10,
                      }}>
                      <View style={{width: 25}}></View>
                      <View>
                        <Text
                          style={{
                            fontSize: 18,
                            fontFamily: 'Roboto',
                            color: 'black',
                          }}>
                          Số 121, Trần Văn Dư
                        </Text>
                        <Text
                          style={{
                            fontSize: 18,
                            fontFamily: 'Roboto',
                            color: 'black',
                          }}>
                          Phường 13, Quận Tân Bình, TP.HCM
                        </Text>
                      </View>
                    </View>
                  </View>

                  <Image
                    resizeMode="contain"
                    style={{
                      width: 25,
                      height: 25,
                      flex: 1,
                    }}
                    source={icons.rightArrow}
                  />
                </View>
              </TouchableOpacity>
              {/* Manage Date */}
              <TouchableOpacity onPress={() => setOpen(true)}>
                <View
                  style={{
                    padding: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTopColor: '#decbcb',
                    borderTopWidth: 0.75,
                    borderBottomColor: '#decbcb',
                    borderBottomWidth: 0.75,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 10,
                      alignItems: 'center',
                      flex: 9,
                    }}>
                    <Image
                      style={{width: 25, height: 25}}
                      source={icons.calendar}
                    />
                    <Text
                      style={{
                        fontSize: 20,
                        fontFamily: 'Roboto',
                        color: 'black',
                      }}>
                      {date ? format(date, 'dd-MM-yyyy') : 'Select date'}
                    </Text>
                  </View>

                  {/* <Image
    resizeMode="contain"
    style={{
      width: 25,
      height: 25,
      flex: 1
    }}
    source={icons.rightArrow}
  /> */}
                </View>
              </TouchableOpacity>
              <DatePicker
                modal
                mode="date"
                open={open}
                date={date ? date : new Date()}
                onConfirm={date => {
                  setOpen(false);
                  setDate(date);
                }}
                onCancel={() => {
                  setOpen(false);
                }}
              />
            </View>
          )}

          {/* Manage voucher/payment method */}
          <View style={{backgroundColor: 'white', marginTop: 20}}>
            {/* manage payment method */}
            <TouchableOpacity
              onPress={() => navigation.navigate('Select payment method')}>
              <View
                style={{
                  padding: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottomColor: '#decbcb',
                  borderBottomWidth: 0.75,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 10,
                    alignItems: 'center',
                    flex: 9,
                  }}>
                  <Image
                    resizeMode="contain"
                    style={{width: 25, height: 25}}
                    source={icons.cash}
                  />
                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: 'Roboto',
                      color: 'black',
                    }}>
                    Select payment method
                  </Text>
                </View>

                <Image
                  resizeMode="contain"
                  style={{
                    width: 25,
                    height: 25,
                    flex: 1,
                  }}
                  source={icons.rightArrow}
                />
              </View>
            </TouchableOpacity>

            {/* manage voucher */}
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Select voucher');
              }}>
              <View
                style={{
                  padding: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 10,
                    alignItems: 'center',
                    flex: 9,
                  }}>
                  <Image
                    resizeMode="contain"
                    style={{width: 25, height: 25}}
                    source={icons.discount}
                  />
                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: 'Roboto',
                      color: 'black',
                    }}>
                    Select voucher
                  </Text>
                </View>

                <Image
                  resizeMode="contain"
                  style={{
                    width: 25,
                    height: 25,
                    flex: 1,
                  }}
                  source={icons.rightArrow}
                />
              </View>
            </TouchableOpacity>
          </View>
          {/* Payment Detail */}
          <View style={{backgroundColor: 'white', padding: 20, marginTop: 20}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                marginBottom: 20,
              }}>
              {/* <Image
                resizeMode="contain"
                style={{width: 25, height: 25}}
                source={icons.location}
              /> */}
              <Text
                style={{
                  fontSize: 22,
                  fontFamily: 'Roboto',
                  color: 'black',
                  fontWeight: 'bold',
                }}>
                Payment detail
              </Text>
            </View>

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
                Total product price:
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
                Shipping Cost:
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
                Total product price:
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
        </View>
      </ScrollView>

      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'white',
          borderTopColor: 'transparent',
          height: 80,
          width: '100%',
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: 20,
          elevation: 8,
        }}>
        <View></View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{fontSize: 18, color: 'black', fontFamily: 'Roboto'}}>
            Total:{' '}
          </Text>
          <Text
            style={{
              fontSize: 18,
              color: 'red',
              fontFamily: 'Roboto',
              fontWeight: 'bold',
            }}>
            633.700 VNĐ
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Payment');
          }}
          style={{
            height: '100%',
            width: '30%',
            backgroundColor: COLORS.primary,
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: 20,
              fontFamily: 'Roboto',
              fontWeight: 'bold',
            }}>
            Order
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default Payment;
