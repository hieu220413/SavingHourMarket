/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';
import React, { useCallback, useState } from 'react';
import { icons } from '../constants';
import { COLORS, FONTS } from '../constants/theme';
import dayjs from 'dayjs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { API } from '../constants/api';
import LoadingScreen from '../components/LoadingScreen';
import Toast from 'react-native-toast-message';
import Empty from '../assets/image/search-empty.png';
import database from '@react-native-firebase/database';

const ProductsBySubCategories = ({ navigation, route }) => {
  const subCategoryId = route.params.subCategory.id;
  const [products, setProducts] = useState([]);
  const [cartList, setCartList] = useState([]);
  const [loading, setLoading] = useState(false);
  const sortOptions = [
    {
      id: 1,
      name: 'HSD gần nhất',
      active: false,
    },
    {
      id: 2,
      name: 'HSD xa nhất',
      active: false,
    },
    {
      id: 3,
      name: 'Giá tiền tăng dần',
      active: false,
    },
    {
      id: 4,
      name: 'Giá tiền giảm dần',
      active: false,
    },
  ];
  const [selectSort, setSelectSort] = useState(sortOptions);
  const [modalVisible, setModalVisible] = useState(false);

  const [pickupPoint, setPickupPoint] = useState({
    id: 'accf0ac0-5541-11ee-8a50-a85e45c41921',
    address: 'Hẻm 662 Nguyễn Xiển, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh',
    status: 1,
    longitude: 106.83102962168277,
    latitude: 10.845020092805793,
  });

  // system status check
  useFocusEffect(
    useCallback(() => {
      database().ref(`systemStatus`).off('value');
      database()
        .ref('systemStatus')
        .on('value', async snapshot => {
          if (snapshot.val() === 0) {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Initial' }],
            });
          } else {
            // setSystemStatus(snapshot.val());
          }
        });
    }, []),
  );

  const showToast = () => {
    Toast.show({
      type: 'success',
      text1: 'Thành công',
      text2: 'Thêm sản phẩm vào giỏ hàng thành công 👋',
      visibilityTime: 500,
    });
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      // Get pickup point from AS
      (async () => {
        try {
          const value = await AsyncStorage.getItem('PickupPoint');
          setPickupPoint(JSON.parse(value));
          fetch(
            `${API.baseURL
            }/api/product/getProductsForCustomer?productSubCategoryId=${subCategoryId}&pickupPointId=${JSON.parse(value).id
            }&page=0&limit=9999`,
          )
            .then(res => res.json())
            .then(data => {
              setProducts(data.productList);
              setLoading(false);
            })
            .catch(err => {
              console.log(err);
              setLoading(false);
            });
        } catch (err) {
          console.log(err);
          setLoading(false);
        }
      })();

      (async () => {
        try {
          const value = await AsyncStorage.getItem('PickupPoint');
          const cartList = await AsyncStorage.getItem(
            'CartList' + JSON.parse(value).id,
          );
          setCartList(cartList ? JSON.parse(cartList) : []);
          setLoading(false);
        } catch (err) {
          console.log(err);
          setLoading(false);
        }
      })();
    }, [subCategoryId]),
  );

  const handleAddToCart = async data => {
    try {
      const value = await AsyncStorage.getItem('PickupPoint');
      const jsonValue = await AsyncStorage.getItem(
        'CartList' + JSON.parse(value).id,
      );
      let newCartList = jsonValue ? JSON.parse(jsonValue) : [];
      const itemExisted = newCartList.some(item => item.id === data.id);
      if (itemExisted) {
        const index = newCartList.findIndex(item => item.id === data.id);
        newCartList[index].cartQuantity = newCartList[index].cartQuantity + 1;
        setCartList(newCartList);
        await AsyncStorage.setItem(
          'CartList' + JSON.parse(value).id,
          JSON.stringify(newCartList),
        );
        showToast();
        return;
      }

      const cartData = { ...data, isChecked: false, cartQuantity: 1 };
      newCartList = [...newCartList, cartData];
      setCartList(newCartList);
      await AsyncStorage.setItem(
        'CartList' + JSON.parse(value).id,
        JSON.stringify(newCartList),
      );
      showToast();
    } catch (error) {
      console.log(error);
    }
  };

  const sortProduct = item => {
    const sortItem = item.find(item => item.active === true);
    setLoading(true);
    if (sortItem) {
      fetch(
        `${API.baseURL
        }/api/product/getProductsForCustomer?productSubCategoryId=${subCategoryId}&pickupPointId=${pickupPoint.id
        }&page=0&limit=10${sortItem?.id == 1 ? '&expiredSortType=ASC' : ''}${sortItem?.id == 2 ? '&expiredSortType=DESC' : ''
        }${sortItem?.id == 3 ? '&priceSort=ASC' : ''}${sortItem?.id == 4 ? '&priceSort=DESC' : ''
        }`,
      )
        .then(res => res.json())
        .then(data => {
          setProducts(data.productList);
          setLoading(false);
        })
        .catch(err => {
          console.log(err);
          setLoading(false);
        });
    } else {
      fetch(
        `${API.baseURL}/api/product/getProductsForCustomer?productSubCategoryId=${subCategoryId}&pickupPointId=${pickupPoint.id}&page=0&limit=10`,
      )
        .then(res => res.json())
        .then(data => {
          setProducts(data.productList);
          setLoading(false);
        })
        .catch(err => {
          console.log(err);
          setLoading(false);
        });
    }
  };

  const handleApplyFilter = () => {
    setModalVisible(!modalVisible);
    setLoading(true);
    sortProduct(selectSort);
  };

  const handleClear = () => {
    setModalVisible(!modalVisible);
    setLoading(true);
    fetch(
      `${API.baseURL}/api/product/getProductsForCustomer?page=0&limit=10&pickupPointId=${pickupPoint.id}`,
    )
      .then(res => res.json())
      .then(data => {
        setProducts(data.productList);
        setSelectSort(sortOptions);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  };

  const Item = ({ data }) => {
    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity
          key={data.id}
          onPress={() => {
            navigation.navigate('ProductDetails', {
              product: data,
              pickupPointId: pickupPoint.id,
            });
          }}
          style={{
            flexDirection: 'row',
          }}
        >
          {/* Image Product */}
          <Image
            resizeMode="contain"
            source={{
              uri: data?.imageUrlImageList[0].imageUrl,
            }}
            style={styles.itemImage}
          />

          <View
            style={{
              justifyContent: 'center',
              flex: 1,
              marginRight: 10,
              marginTop: 5,
            }}>
            <Text
              numberOfLines={1}
              style={{
                fontFamily: FONTS.fontFamily,
                fontSize: Dimensions.get('window').width * 0.05,
                fontWeight: 700,
                maxWidth: '95%',
                color: 'black',
              }}>
              {data.name}
            </Text>
            <Text
              style={{
                fontFamily: FONTS.fontFamily,
                fontSize: Dimensions.get('window').width * 0.045,
                marginTop: 8,
                marginBottom: 10,
              }}>
              HSD:{' '}
              {dayjs(data?.nearestExpiredBatch.expiredDate).format(
                'DD/MM/YYYY',
              )}
            </Text>
            <View style={{ flexDirection: 'row', paddingBottom: '2%', }}>
              <Text
                style={{
                  maxWidth: '70%',
                  fontSize: Dimensions.get('window').width * 0.035,
                  lineHeight: 20,
                  fontWeight: 'bold',
                  fontFamily: FONTS.fontFamily,
                  textDecorationLine: 'line-through'
                }}>
                {data?.priceListed.toLocaleString('vi-VN', {
                  currency: 'VND',
                })}
              </Text>
              <Text
                style={{
                  fontSize: Dimensions.get('window').width * 0.03,
                  lineHeight: 13,
                  fontWeight: 600,
                  fontFamily: FONTS.fontFamily,
                }}>
                ₫
              </Text>
            </View>

            <View style={{ flexDirection: 'row' }}>
              <Text
                style={{
                  maxWidth: '70%',
                  fontSize: Dimensions.get('window').width * 0.045,
                  lineHeight: 20,
                  color: COLORS.secondary,
                  fontWeight: 'bold',
                  fontFamily: FONTS.fontFamily,
                }}>
                {data?.nearestExpiredBatch.price.toLocaleString('vi-VN', {
                  currency: 'VND',
                })}
              </Text>
              <Text
                style={{
                  fontSize: Dimensions.get('window').width * 0.03,
                  lineHeight: 13,
                  color: COLORS.secondary,
                  fontWeight: 600,
                  fontFamily: FONTS.fontFamily,
                }}>
                ₫
              </Text>
            </View>

            {/* Button buy */}
            {/* <TouchableOpacity onPress={() => handleAddToCart(data)}>
            <Text
              style={{
                maxWidth: 150,
                maxHeight: 40,
                padding: 10,
                backgroundColor: COLORS.primary,
                borderRadius: 10,
                textAlign: 'center',
                color: '#ffffff',
                fontFamily: FONTS.fontFamily,
              }}>
              Thêm vào giỏ hàng
            </Text>
          </TouchableOpacity> */}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const ModalSortItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          const newArray = selectSort.map(i => {
            if (i.id === item.id) {
              if (i.active === true) {
                return { ...i, active: false };
              } else {
                return { ...i, active: true };
              }
            }
            return { ...i, active: false };
          });
          setSelectSort(newArray);
        }}
        style={
          item.active == true
            ? {
              borderColor: COLORS.primary,
              borderWidth: 1,
              borderRadius: 10,
              margin: 5,
            }
            : {
              borderColor: '#c8c8c8',
              borderWidth: 0.2,
              borderRadius: 10,
              margin: 5,
            }
        }>
        <Text
          style={
            item.active == true
              ? {
                width: Dimensions.get('window').width * 0.3,
                paddingHorizontal: '5%',
                paddingVertical: 10,
                textAlign: 'center',
                color: COLORS.primary,
                fontFamily: FONTS.fontFamily,
                fontSize: Dimensions.get('window').width * 0.03,
              }
              : {
                width: Dimensions.get('window').width * 0.3,
                paddingHorizontal: '3%',
                paddingVertical: 10,
                textAlign: 'center',
                color: 'black',
                fontFamily: FONTS.fontFamily,
                fontSize: Dimensions.get('window').width * 0.03,
              }
          }>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <>
      <View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginVertical: '2%',
            marginHorizontal: '2%',
          }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={icons.leftArrow}
              resizeMode="contain"
              style={{ width: Dimensions.get('window').width * 0.1, height: 35, tintColor: COLORS.primary }}
            />
          </TouchableOpacity>
          <Text
            style={{
              textAlign: 'center',
              color: 'black',
              fontSize: Dimensions.get('window').width * 0.065,
              fontFamily: FONTS.fontFamily,
            }}>
            Sản phẩm liên quan
          </Text>

          <View
            style={{
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(true);
              }}>
              <Image
                resizeMode="contain"
                style={{
                  height: 40,
                  tintColor: COLORS.primary,
                  width: Dimensions.get('window').width * 0.1,
                  marginHorizontal: '1%',
                }}
                source={icons.filter}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Cart');
              }}>
              <Image
                resizeMode="contain"
                style={{
                  height: 40,
                  tintColor: COLORS.primary,
                  width: Dimensions.get('window').width * 0.1,
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
                    style={{
                      fontSize: 12,
                      color: 'white',
                      fontFamily: 'Roboto',
                    }}>
                    {cartList.length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
        {/* List products */}
        <ScrollView
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{
            paddingBottom: 100,
            paddingTop: '5%',
          }}>
          {products.map((item, index) => (
            <Item data={item} key={index} />
          ))}
        </ScrollView>
        {products.length === 0 && (
          <View style={{ alignItems: 'center' }}>
            <Image
              style={{ width: 200, height: 200 }}
              resizeMode="contain"
              source={Empty}
            />
            <Text
              style={{
                fontSize: Dimensions.get('window').width * 0.045,
                fontFamily: 'Roboto',
                fontWeight: 'bold',
              }}>
              Không có sản phẩm
            </Text>
          </View>
        )}

        {/* Modal filter */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    color: 'black',
                    fontFamily: FONTS.fontFamily,
                    fontSize: Dimensions.get('window').width * 0.05,
                    fontWeight: 700,
                    textAlign: 'center',
                    paddingBottom: 20,
                  }}>
                  Bộ lọc tìm kiếm
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}>
                  <Image
                    resizeMode="contain"
                    style={{
                      width: 20,
                      height: 20,
                      tintColor: 'grey',
                    }}
                    source={icons.close}
                  />
                </TouchableOpacity>
              </View>
              <Text
                style={{
                  color: 'black',
                  fontFamily: FONTS.fontFamily,
                  fontSize: Dimensions.get('window').width * 0.045,
                  fontWeight: 700,
                }}>
                Sắp xếp theo
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  marginVertical: 10,
                  justifyContent: 'center',
                }}>
                {selectSort.map((item, index) => (
                  <ModalSortItem item={item} key={index} />
                ))}
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginTop: '5%',
                }}>
                <TouchableOpacity
                  style={{
                    width: '50%',
                    paddingHorizontal: '2%',
                    paddingVertical: 10,
                    backgroundColor: 'white',
                    borderRadius: 10,
                    borderColor: COLORS.primary,
                    borderWidth: 0.5,
                    marginRight: '2%',
                  }}
                  onPress={handleClear}>
                  <Text
                    style={{
                      color: COLORS.primary,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      fontSize: Dimensions.get('window').width * 0.035,
                    }}>
                    Thiết lập lại
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    width: '50%',
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                    backgroundColor: COLORS.primary,
                    color: 'white',
                    borderRadius: 10,
                  }}
                  onPress={handleApplyFilter}>
                  <Text style={styles.textStyle}>Áp dụng</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      {loading && <LoadingScreen />}
    </>
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
    marginHorizontal: '6%',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 2,
  },
  itemImage: {
    width: '40%',
    height: 130,
    borderRadius: 20,
    padding: 10,
    margin: 15,
  },
  itemText: {
    fontFamily: FONTS.fontFamily,
    fontSize: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: Dimensions.get('window').width * 0.035,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
export default ProductsBySubCategories;
