/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useState} from 'react';
import {View, Image, Text} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {icons} from '../constants';
import {COLORS, FONTS} from '../constants/theme';
import {useFocusEffect} from '@react-navigation/native';
import {API} from '../constants/api';
import Modal, {
  ModalFooter,
  ModalButton,
  ScaleAnimation,
} from 'react-native-modals';
import {format} from 'date-fns';
import Empty from '../assets/image/search-empty.png';
import LoadingScreen from '../components/LoadingScreen';
import database from '@react-native-firebase/database';

const SelectVoucher = ({navigation, route}) => {
  const {
    voucherList,
    setVoucherList,
    categoryId,
    categoryName,
    totalPriceByCategory,
  } = route.params;

  const [resultVoucherList, setResultVoucherList] = useState([]);

  const [openValidateDialog, setOpenValidateDialog] = useState(false);

  const [validateMessage, setValidateMessage] = useState('');

  const [loading, setLoading] = useState(false);

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

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetch(
        `${API.baseURL}/api/discount/getDiscountsForCustomer?fromPercentage=0&toPercentage=100&page=0&limit=5&productCategoryId=${categoryId}&expiredSortType=DESC`,
      )
        .then(res => res.json())
        .then(response => {
          setResultVoucherList(response);
          setLoading(false);
        })
        .catch(err => {
          console.log(err);
          setLoading(false);
        });
    }, []),
  );

  const handleSelect = item => {
    if (item.spentAmountRequired > totalPriceByCategory) {
      setValidateMessage('Chưa đạt giá trị đơn hàng tối thiểu');
      setOpenValidateDialog(true);
      return;
    }
    const voucher = {
      ...item,
      categoryId: categoryId,
    };

    const voucherCategoryExisted = voucherList.some(
      item => item.categoryId === categoryId,
    );

    if (voucherCategoryExisted) {
      let newVoucherList = voucherList.filter(
        item => item.categoryId !== categoryId,
      );
      setVoucherList([...newVoucherList, voucher]);
    } else {
      setVoucherList([...voucherList, voucher]);
    }
    navigation.navigate('Payment');
  };
  return (
    <View style={{backgroundColor: 'white', height: '100%'}}>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          gap: 20,
          marginBottom: 20,
          backgroundColor: '#ffffff',
          padding: 20,
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
          Chọn mã giãm giá
        </Text>
      </View>

      {/* Voucher item */}
      <ScrollView>
        {resultVoucherList.length == 0 ? (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 40,
            }}>
            <Image
              style={{width: 350, height: 350}}
              resizeMode="contain"
              source={Empty}
            />
            <Text
              style={{
                fontSize: 20,
                fontFamily: 'Roboto',
                // color: 'black',
                fontWeight: 'bold',
                textAlign: 'center',
              }}>
              Không có voucher phù hợp
            </Text>
          </View>
        ) : (
          resultVoucherList.map(item => (
            // <View key={item.id}>
            //   <View
            //     style={{
            //       backgroundColor: 'white',
            //       alignItems: 'center',
            //       flexDirection: 'row',
            //       marginVertical: '2%',
            //       paddingHorizontal: 10,
            //       paddingVertical: 20,
            //       justifyContent: 'space-between',
            //     }}>
            //     <View
            //       style={{flex: 4, alignItems: 'start', gap: 5, marginLeft: 10}}>
            //       <Text
            //         style={{
            //           fontSize: 23,
            //           color: 'black',
            //           fontFamily: 'Roboto',
            //           fontWeight: 'bold',
            //         }}>
            //         {item.name}
            //       </Text>
            //       <Text
            //         style={{
            //           fontSize: 18,
            //           color: 'black',
            //           fontFamily: 'Roboto',
            //           backgroundColor: '#7ae19c',
            //           alignSelf: 'flex-start',
            //           paddingVertical: 5,
            //           paddingHorizontal: 10,
            //           borderRadius: 5,
            //         }}>
            //         -{item.percentage}%
            //       </Text>
            //       <Text
            //         style={{
            //           fontSize: 18,
            //           color: 'black',
            //           fontFamily: 'Roboto',
            //         }}>
            //         Áp dụng cho: {categoryName}
            //       </Text>
            //       <Text
            //         style={{
            //           fontSize: 18,
            //           color: 'black',
            //           fontFamily: 'Roboto',
            //         }}>
            //         Đơn tối thiểu:{' '}
            //         {item.spentAmountRequired.toLocaleString('vi-VN', {
            //           style: 'currency',
            //           currency: 'VND',
            //         })}
            //       </Text>
            //       <Text
            //         style={{
            //           fontSize: 16,
            //           fontFamily: 'Roboto',
            //           fontWeight: 'bold',
            //         }}>
            //         HSD: {format(Date.parse(item.expiredDate), 'dd/MM/yyyy')}
            //       </Text>
            //     </View>
            //     <TouchableOpacity
            //       onPress={() => {
            //         handleSelect(item);
            //       }}
            //       style={{
            //         alignItems: 'center',
            //         justifyContent: 'center',
            //         backgroundColor: COLORS.secondary,
            //         borderRadius: 5,
            //         padding: 15,
            //       }}>
            //       <Text
            //         style={{
            //           fontSize: 18,
            //           fontFamily: 'Roboto',
            //           color: 'black',
            //         }}>
            //         Chọn
            //       </Text>
            //     </TouchableOpacity>
            //   </View>
            // </View>
            <View
              key={item.id}
              style={{
                backgroundColor: '#F5F5F5',
                maxWidth: '90%',
                borderRadius: 20,
                marginHorizontal: '5%',
                marginBottom: 20,
                flexDirection: 'row',
              }}>
              {/* Image Product */}
              <Image
                resizeMode="contain"
                source={{
                  uri: item.imageUrl,
                }}
                style={{
                  width: 130,
                  height: 130,
                  borderRadius: 20,
                  padding: 10,
                  margin: 15,
                }}
              />

              <View
                style={{justifyContent: 'center', flex: 1, marginRight: 10}}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: FONTS.fontFamily,
                    fontSize: 18,
                    fontWeight: 700,
                    maxWidth: '95%',
                    color: 'black',
                  }}>
                  {item.name}
                </Text>

                <Text
                  style={{
                    fontFamily: FONTS.fontFamily,
                    fontSize: 18,
                    color: 'black',
                  }}>
                  Đơn tối thiểu:{' '}
                  {item.spentAmountRequired.toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  })}
                </Text>
                <Text
                  style={{
                    fontFamily: FONTS.fontFamily,
                    fontSize: 18,
                    marginBottom: 10,
                  }}>
                  HSD: {format(new Date(item.expiredDate), 'dd/MM/yyyy')}
                </Text>
                {/* Button use */}
                {item.spentAmountRequired > totalPriceByCategory ? (
                  <TouchableOpacity disabled={true}>
                    <Text
                      style={{
                        maxWidth: 120,
                        maxHeight: 38,
                        padding: 10,
                        backgroundColor: '#cccccc',
                        borderRadius: 10,
                        textAlign: 'center',
                        color: '#666666',
                      }}>
                      Áp dụng
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => handleSelect(item)}>
                    <Text
                      style={{
                        maxWidth: 120,
                        maxHeight: 38,
                        padding: 10,
                        backgroundColor: COLORS.primary,
                        borderRadius: 10,
                        textAlign: 'center',
                        color: '#ffffff',
                      }}>
                      Áp dụng
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <Modal
        width={0.8}
        visible={openValidateDialog}
        onTouchOutside={() => {
          setOpenValidateDialog(false);
        }}
        dialogAnimation={
          new ScaleAnimation({
            initialValue: 0, // optional
            useNativeDriver: true, // optional
          })
        }
        footer={
          <ModalFooter>
            <ModalButton
              textStyle={{color: 'red'}}
              text="Đóng"
              onPress={() => {
                setOpenValidateDialog(false);
              }}
            />
          </ModalFooter>
        }>
        <View
          style={{padding: 20, alignItems: 'center', justifyContent: 'center'}}>
          <Text
            style={{
              fontSize: 20,
              fontFamily: 'Roboto',
              color: 'black',
              textAlign: 'center',
            }}>
            {validateMessage}
          </Text>
        </View>
      </Modal>
      {/* ******************** */}
      {loading && <LoadingScreen />}
    </View>
  );
};

export default SelectVoucher;
