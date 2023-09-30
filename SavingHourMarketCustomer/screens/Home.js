/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import SearchBar from '../components/SearchBar';
import Categories from '../components/Categories';
import DiscountRow from '../components/DiscountRow';
import { COLORS, FONTS } from '../constants/theme';
import { icons } from '../constants';
import dayjs from 'dayjs';

const Home = ({ navigation }) => {
  const [cateList, setCateList] = useState();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://saving-hour-market.ap-southeast-2.elasticbeanstalk.com/api/product/getProductsForCustomer?page=0&quantitySortType=DESC&expiredSortType=DESC')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleBuy = () => {
    console.log('Buy');
  };

  const Item = ({ data }) => (
    <TouchableOpacity onPress={() => {
      navigation.navigate('ProductDetails', {
        product: data,
      });
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

          <View style={{ flexDirection: 'row' }}>
            <Text
              style={{
                maxWidth: '70%',
                fontSize: 18,
                lineHeight: 30,
                color: COLORS.secondary,
                fontWeight: 600,
              }}>
              {data.price.toLocaleString("vi-VN", {
                currency: "VND",
              })}
            </Text>
            <Text
              style={{
                fontSize: 12,
                lineHeight: 18,
                color: COLORS.secondary,
                fontWeight: 600,
              }}>
              ₫
            </Text>
          </View>

          <Text
            style={{
              fontFamily: FONTS.fontFamily,
              fontSize: 18,
              marginBottom: 10,
            }}>
            HSD: {dayjs(data.expiredDate).format('DD/MM/YYYY')}
          </Text>
          {/* Button buy */}
          <TouchableOpacity onPress={handleBuy}>
            <Text
              style={{
                padding: 10,
                backgroundColor: COLORS.primary,
                borderRadius: 10,
                textAlign: 'center',
                color: '#ffffff',
              }}>
              Thêm vào giỏ hàng
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Search */}
      <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
        <SearchBar />
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

      {/* Body */}
      <ScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{
          paddingBottom: 100,
        }}>
        {/* Categories */}
        <Categories />
        {/* Sale, Discount */}
        <Text
          style={{
            fontFamily: FONTS.fontFamily,
            fontSize: 22,
            marginLeft: 20,
            color: 'black',
            fontWeight: 700,
            marginTop: '5%',
            marginBottom: 10,
          }}>
          Khuyến Mãi Cực Sốc
        </Text>
        <DiscountRow />
        {/* List Product */}
        <Text
          style={{
            fontFamily: FONTS.fontFamily,
            fontSize: 22,
            color: COLORS.secondary,
            fontWeight: 700,
            marginLeft: 20,
            marginTop: '5%',
            marginBottom: 10,
          }}>
          Danh sách sản phẩm
        </Text>
        {products.map(item => (
          <Item data={item} />
        ))}
      </ScrollView>
    </SafeAreaView>
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

export default Home;
