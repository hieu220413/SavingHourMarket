/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useState} from 'react';
import {View, Image, Text} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {icons} from '../constants';
import {COLORS} from '../constants/theme';
import {useFocusEffect} from '@react-navigation/native';
import {API} from '../constants/api';
import Modal, {
  ModalFooter,
  ModalButton,
  ScaleAnimation,
} from 'react-native-modals';
import {format} from 'date-fns';
import Empty from '../assets/image/search-empty.png';

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

  useFocusEffect(
    useCallback(() => {
      fetch(
        `${API.baseURL}/api/discount/getDiscountsForCustomer?fromPercentage=0&toPercentage=100&page=0&limit=5&productCategoryId=${categoryId}&expiredSortType=DESC`,
      )
        .then(res => res.json())
        .then(response => {
          setResultVoucherList(response);
        })
        .catch(err => console.log(err));
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
    <ScrollView>
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
          Select voucher
        </Text>
      </View>

      {/* Voucher item */}
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
          <View key={item.id}>
            <View
              style={{
                backgroundColor: 'white',
                alignItems: 'center',
                flexDirection: 'row',
                marginVertical: '2%',
                paddingHorizontal: 10,
                paddingVertical: 20,
                justifyContent: 'space-between',
              }}>
              <View
                style={{flex: 4, alignItems: 'start', gap: 5, marginLeft: 10}}>
                <Text
                  style={{
                    fontSize: 23,
                    color: 'black',
                    fontFamily: 'Roboto',
                    fontWeight: 'bold',
                  }}>
                  {item.name}
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
                  -{item.percentage}%
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    color: 'black',
                    fontFamily: 'Roboto',
                  }}>
                  Áp dụng cho: {categoryName}
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    color: 'black',
                    fontFamily: 'Roboto',
                  }}>
                  Đơn tối thiểu:{' '}
                  {item.spentAmountRequired.toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  })}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'Roboto',
                    fontWeight: 'bold',
                  }}>
                  HSD: {format(Date.parse(item.expiredDate), 'dd/MM/yyyy')}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  handleSelect(item);
                }}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: COLORS.secondary,
                  borderRadius: 5,
                  padding: 15,
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: 'Roboto',
                    color: 'black',
                  }}>
                  Chọn
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}

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
    </ScrollView>
  );
};

export default SelectVoucher;
