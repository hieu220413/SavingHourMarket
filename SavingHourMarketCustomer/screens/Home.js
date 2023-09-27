/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect, useState} from 'react';
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
import {COLORS, FONTS} from '../constants/theme';
import {icons} from '../constants';
import {LocalNotification} from '../src/services/LocalPushController';

const Home = ({navigation}) => {
  const [percent, setPercent] = useState();

  const [cateList, setCateList] = useState();

  const data = [
    {
      id: 1,
      name: 'Meat',
      price: 500,
      price_original: 1000,
      quantity: 5,
      expired_date: '30/09/2023',
      image_url:
        'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freepik.com%2Ficons%2Fmeat&psig=AOvVaw3YdQ5XfFZ6uO5exMKI8IUQ&ust=1695304446762000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCMC23ayruYEDFQAAAAAdAAAAABAS',
    },

    {
      id: 2,
      name: 'Beef',
      price: 1000,
      price_original: 2000,
      quantity: 5,
      expired_date: '30/09/2023',
      image_url:
        'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freepik.com%2Ficons%2Fmeat&psig=AOvVaw3YdQ5XfFZ6uO5exMKI8IUQ&ust=1695304446762000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCMC23ayruYEDFQAAAAAdAAAAABAS',
    },
  ];

  useEffect(() => {
    data.map((item, index) => {
      setPercent((item.price / item.price_original) * 100);
    });
  });

  const handleBuy = () => {
    LocalNotification();
  };

  const Item = ({data}) => (
    <View style={styles.itemContainer}>
      {/* Image Product */}
      <TouchableOpacity onPress={console.log('navigate to')}>
        <Image
          resizeMode="contain"
          source={{
            uri: data.image_url,
          }}
          style={styles.itemImage}
        />
      </TouchableOpacity>

      <View style={{paddingTop: 10}}>
        <TouchableOpacity onPress={console.log('navigate to details')}>
          <Text
            style={{
              fontFamily: FONTS.fontFamily,
              fontSize: 20,
              fontWeight: 700,
              maxWidth: '90%',
              color: 'black',
            }}>
            {data.name}
          </Text>
        </TouchableOpacity>

        <View style={{flexDirection: 'row'}}>
          <Text
            style={{
              fontSize: 20,
              lineHeight: 30,
              color: COLORS.red,
              fontWeight: 600,
            }}>
            {data.price}
          </Text>
          <Text
            style={{
              fontSize: 15,
              lineHeight: 18,
              color: COLORS.red,
              fontWeight: 600,
            }}>
            ₫
          </Text>
        </View>

        <View style={{flexDirection: 'row'}}>
          <Text
            style={{
              fontSize: 20,
              lineHeight: 30,
              textDecorationLine: 'line-through',
              textDecorationStyle: 'solid',
            }}>
            {data.price_original}
          </Text>
          <Text style={{fontSize: 15, lineHeight: 18}}>₫</Text>
          <Text style={{fontSize: 16, lineHeight: 30, paddingLeft: 5}}>
            ( - {percent}%)
          </Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text
            style={{
              fontFamily: FONTS.fontFamily,
              fontSize: 16,
              color: '#ED8A19',
            }}>
            5
          </Text>
          <Image
            resizeMode="center"
            source={icons.star}
            style={{
              width: 15,
              height: 15,
              marginLeft: 5,
            }}
          />
        </View>

        <TouchableOpacity title={'Local Push Notification'} onPress={handleBuy}>
          <Text
            style={{
              maxWidth: 100,
              padding: 5,
              backgroundColor: COLORS.primary,
              borderRadius: 10,
              textAlign: 'center',
              color: '#ffffff',
            }}>
            Mua
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Search */}
      <View style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
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
        keyboardShouldPersistTaps
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
            color: COLORS.red,
            fontWeight: 700,
            marginTop: 10,
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
            marginTop: 10,
            marginBottom: 10,
          }}>
          Danh sách sản phẩm
        </Text>
        {data.map(item => (
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
    marginLeft: 10,
    marginBottom: 10,
    flexDirection: 'row',
  },
  itemImage: {
    width: 140,
    height: 140,
    borderRadius: 20,
    backgroundColor: 'blue',
    padding: 5,
    margin: 10,
  },
  itemText: {
    fontFamily: FONTS.fontFamily,
    fontSize: 20,
  },
});

export default Home;
