/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import React, {useState, useEffect, useCallback} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
} from 'react-native';
import {icons} from '../constants';
import {COLORS, FONTS} from '../constants/theme';
import Categories from '../components/Categories';
import dayjs from 'dayjs';
import {API} from '../constants/api';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Empty from '../assets/image/search-empty.png';
import LoadingScreen from '../components/LoadingScreen';
import Modal, {
  ModalFooter,
  ModalButton,
  SlideAnimation,
  ScaleAnimation,
} from 'react-native-modals';
import Toast from 'react-native-toast-message';
import {ScrollView} from 'react-native-gesture-handler';

const Discount = ({navigation}) => {
  const [discounts, setDiscounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentCate, setCurrentCate] = useState('');
  const [cartList, setCartList] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [pickupPoint, setPickupPoint] = useState({
    id: 'accf0ac0-5541-11ee-8a50-a85e45c41921',
    address: 'Hẻm 662 Nguyễn Xiển, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh',
    status: 1,
    longitude: 106.83102962168277,
    latitude: 10.845020092805793,
  });

  const showToast = () => {
    Toast.show({
      type: 'success',
      text1: 'Thành công',
      text2: 'Thêm sản phẩm vào giỏ hàng thành công 👋',
      visibilityTime: 1000,
    });
  };

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          setLoading(true);
          const cartList = await AsyncStorage.getItem('CartList');
          setCartList(cartList ? JSON.parse(cartList) : []);
          setLoading(false);
        } catch (err) {
          console.log(err);
          setLoading(false);
        }
      })();
      // Get pickup point from AS
      (async () => {
        try {
          const value = await AsyncStorage.getItem('PickupPoint');
          setPickupPoint(value ? JSON.parse(value) : pickupPoint);
        } catch (err) {
          console.log(err);
        }
      })();
    }, []),
  );

  useEffect(() => {
    setLoading(true);
    fetch(
      `${API.baseURL}/api/product/getAllCategory?pickupPointId=${pickupPoint.id}`,
    )
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        setCurrentCate(data[0].id);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    if (currentCate) {
      fetch(
        `${API.baseURL}/api/discount/getDiscountsForCustomer?fromPercentage=0&toPercentage=100&productCategoryId=${currentCate}&page=0&limit=9999&expiredSortType=ASC`,
      )
        .then(res => res.json())
        .then(data => {
          setDiscounts(data);
          setLoading(false);
        })
        .catch(err => {
          console.log(err);
          setLoading(false);
        });

      fetch(
        `${API.baseURL}/api/product/getProductsForCustomer?productCategoryId=${currentCate}&pickupPointId=${pickupPoint.id}&page=0&limit=9999&quantitySortType=DESC&expiredSortType=ASC`,
      )
        .then(res => res.json())
        .then(data => {
          setProducts(data);
          setLoading(false);
        })
        .catch(err => {
          console.log(err);
          setLoading(false);
        });
    }
  }, [currentCate, pickupPoint.id]);

  const Item = ({data}) => (
    <View style={styles.itemContainer}>
      {/* Image Product */}
      <Image
        resizeMode="contain"
        source={{
          uri: data?.imageUrl,
        }}
        style={styles.itemImage}
      />

      <View style={{justifyContent: 'center', flex: 1, marginRight: 10}}>
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
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('DiscountForCategories', {
              discount: data,
              products: products,
            })
          }>
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
            Dùng ngay
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  return (
    <>
      <View
        style={{
          paddingHorizontal: 15,
          paddingTop: 15,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 30,
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
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginVertical: 15,
              marginHorizontal: 15,
              fontFamily: FONTS.fontFamily,
              fontSize: 24,
              color: 'black',
              fontWeight: 'bold',
            }}>
            Mã giảm giá
          </Text>
          <TouchableOpacity
            onPress={async () => {
              const user = await AsyncStorage.getItem('userInfo');
              if (!user) {
                setOpenAuthModal(true);
                return;
              }
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
            {cartList.length !== 0 && (
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  right: -10,
                  backgroundColor: COLORS.primary,
                  borderRadius: 50,
                  width: 20,
                  height: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{fontSize: 12, color: 'white', fontFamily: 'Roboto'}}>
                  {cartList.length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        {/* Filter by Cate */}
        <View
          style={{
            marginBottom: 20,
          }}>
          <Categories
            categories={categories}
            currentCate={currentCate}
            setCurrentCate={setCurrentCate}
          />
        </View>
        {/* List voucher */}
        {discounts.length === 0 ? (
          <View style={{alignItems: 'center'}}>
            <Image
              style={{width: '100%', height: '65%'}}
              resizeMode="contain"
              source={Empty}
            />
            <Text
              style={{
                font: FONTS.fontFamily,
                fontSize: 20,
              }}>
              Đã hết mã giảm giá cho loại mặt hàng này
            </Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={{
              paddingBottom: 240,
            }}>
            {discounts.map((item, index) => {
              return <Item data={item} key={index} />;
            })}
          </ScrollView>
        )}
        {/* auth modal */}
        <Modal
          width={0.8}
          visible={openAuthModal}
          dialogAnimation={
            new ScaleAnimation({
              initialValue: 0, // optional
              useNativeDriver: true, // optional
            })
          }
          footer={
            <ModalFooter>
              <ModalButton
                text="Ở lại trang"
                onPress={() => {
                  setOpenAuthModal(false);
                }}
              />
              <ModalButton
                text="Đăng nhập"
                textStyle={{color: COLORS.primary}}
                onPress={async () => {
                  try {
                    await AsyncStorage.removeItem('userInfo');
                    await AsyncStorage.removeItem('CartList');
                    navigation.navigate('Login');
                    setOpenAuthModal(false);
                  } catch (error) {
                    console.log(error);
                  }
                }}
              />
            </ModalFooter>
          }>
          <View
            style={{
              padding: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: 'Roboto',
                color: 'black',
                textAlign: 'center',
              }}>
              Vui lòng đăng nhập để thực hiện thao tác này
            </Text>
          </View>
        </Modal>
      </View>
      {loading && <LoadingScreen />}
    </>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: '#ffffff',
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
