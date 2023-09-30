/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { icons } from '../constants';
import { COLORS, FONTS } from '../constants/theme';
import Categories from '../components/Categories';
import dayjs from 'dayjs';

const Discount = ({ navigation }) => {
  const [discounts, setDiscounts] = useState([]);

  useEffect(() => {
    fetch('http://saving-hour-market.ap-southeast-2.elasticbeanstalk.com/api/discount/getDiscountsForCustomer?fromPercentage=0&toPercentage=100&page=0&expiredSortType=DESC')
      .then((res) => res.json())
      .then((data) => {
        setDiscounts(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleBuy = () => {
    console.log('buy');
  }

  const Item = ({ data }) => (
    <TouchableOpacity onPress={() => {
      navigation.navigate('ProductDetails');
    }}>
      <View style={styles.itemContainer}>
        {/* Image Product */}
        <Image
          resizeMode="contain"
          source={{
            uri: data.imageUrl,
          }}
          style={styles.itemImage}
        />

        <View style={{ justifyContent: 'center', flex: 1, marginRight: 10 }}>
          <Text
            numberOfLines={1}
            style={{
              fontFamily: FONTS.fontFamily,
              fontSize: 18,
              fontWeight: 700,
              maxWidth: '95%',
              color: 'black',
            }}>
            {data.name}
          </Text>

          <Text
            style={{
              fontFamily: FONTS.fontFamily,
              fontSize: 18,
              marginBottom: 10,
            }}>
            HSD: {dayjs(data.expiredDate).format('DD/MM/YYYY')}
          </Text>
          {/* Button use */}
          <TouchableOpacity onPress={() => navigation.navigate('DiscountForCategories')}>
            <Text
              style={{
                padding: 10,
                backgroundColor: COLORS.primary,
                borderRadius: 10,
                textAlign: 'center',
                color: '#ffffff',
              }}>
              Dùng ngay
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
  return (
    <View
      style={{
        backgroundColor: '#fff'
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginVertical: 15,
          marginHorizontal: 15,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={icons.leftArrow}
            resizeMode="contain"
            style={{ width: 35, height: 35, tintColor: COLORS.primary }}
          />
        </TouchableOpacity>
        <Text
          style={{
            textAlign: 'center',
            color: 'black',
            fontSize: 24,
            fontFamily: FONTS.fontFamily,
          }}
        >Mã giảm giá</Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Cart');
          }}>
          <Image
            resizeMode="contain"
            style={{
              height: 40,
              tintColor: COLORS.primary,
              width: 35,
            }}
            source={icons.cart}
          />
        </TouchableOpacity>
      </View>

      <ScrollView>
        {/* Filter by Cate */}
        <Categories />
        {/* List voucher */}
        {/* <Voucher navigation={navigation} /> */}
        {discounts.map(item => (
          <Item data={item} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  itemContainer: {
    backgroundColor: '#F5F5F5',
    maxWidth: '90%',
    borderRadius: 20,
    marginHorizontal: '5%',
    marginBottom: 20,
    flexDirection: 'row',
  },
  itemImage: {
    width: 130,
    height: 130,
    borderRadius: 20,
    padding: 10,
    margin: 15,
  },
  itemText: {
    fontFamily: FONTS.fontFamily,
    fontSize: 20,
  },
});

export default Discount;
