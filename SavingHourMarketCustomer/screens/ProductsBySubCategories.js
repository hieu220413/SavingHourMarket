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
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {icons} from '../constants';
import {COLORS, FONTS} from '../constants/theme';
import dayjs from 'dayjs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {API} from '../constants/api';
import LoadingScreen from '../components/LoadingScreen';
import Toast from 'react-native-toast-message';

const ProductsBySubCategories = ({navigation, route}) => {
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
      fetch(
        `${API.baseURL}/api/product/getProductsForCustomer?productSubCategoryId=${subCategoryId}&page=0&limit=9999`,
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

      (async () => {
        try {
          const cartList = await AsyncStorage.getItem('CartList');
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
      const jsonValue = await AsyncStorage.getItem('CartList');
      let newCartList = jsonValue ? JSON.parse(jsonValue) : [];
      const itemExisted = newCartList.some(item => item.id === data.id);
      if (itemExisted) {
        const index = newCartList.findIndex(item => item.id === data.id);
        newCartList[index].cartQuantity = newCartList[index].cartQuantity + 1;
        setCartList(newCartList);
        await AsyncStorage.setItem('CartList', JSON.stringify(newCartList));
        showToast();
        return;
      }

      const cartData = {...data, isChecked: false, cartQuantity: 1};
      newCartList = [...newCartList, cartData];
      setCartList(newCartList);
      await AsyncStorage.setItem('CartList', JSON.stringify(newCartList));
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
        `${
          API.baseURL
        }/api/product/getProductsForCustomer?productSubCategoryId=${subCategoryId}&page=0&limit=10${
          sortItem?.id == 1 ? '&expiredSortType=ASC' : ''
        }${sortItem?.id == 2 ? '&expiredSortType=DESC' : ''}${
          sortItem?.id == 3 ? '&priceSort=ASC' : ''
        }${sortItem?.id == 4 ? '&priceSort=DESC' : ''}`,
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
        `${API.baseURL}/api/product/getProductsForCustomer?productSubCategoryId=${subCategoryId}&page=0&limit=10`,
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
    fetch(`${API.baseURL}/api/product/getProductsForCustomer?page=0&limit=10`)
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

  const Item = ({data}) => {
    return (
      <TouchableOpacity
        key={data.id}
        onPress={() => {
          navigation.navigate('ProductDetails', {
            product: data,
          });
        }}>
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

            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  maxWidth: '70%',
                  fontSize: 18,
                  lineHeight: 30,
                  color: COLORS.secondary,
                  fontWeight: 600,
                  fontFamily: FONTS.fontFamily,
                }}>
                {data.price.toLocaleString('vi-VN', {
                  currency: 'VND',
                })}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  lineHeight: 18,
                  color: COLORS.secondary,
                  fontWeight: 600,
                  fontFamily: FONTS.fontFamily,
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
            <TouchableOpacity onPress={() => handleAddToCart(data)}>
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
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const ModalSortItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          const newArray = selectSort.map(i => {
            if (i.id === item.id) {
              if (i.active === true) {
                return {...i, active: false};
              } else {
                return {...i, active: true};
              }
            }
            return {...i, active: false};
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
                  width: 150,
                  paddingVertical: 10,
                  textAlign: 'center',
                  color: COLORS.primary,
                  fontFamily: FONTS.fontFamily,
                  fontSize: 12,
                }
              : {
                  width: 150,
                  paddingVertical: 10,
                  textAlign: 'center',
                  color: 'black',
                  fontFamily: FONTS.fontFamily,
                  fontSize: 12,
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
            marginVertical: 15,
            marginHorizontal: 25,
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
              textAlign: 'center',
              color: 'black',
              fontSize: 24,
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
                  height: 45,
                  tintColor: COLORS.primary,
                  width: 35,
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
          }}>
          {products.map((item, index) => (
            <Item data={item} key={index} />
          ))}
        </ScrollView>

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
                    fontSize: 20,
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
                  fontSize: 16,
                  fontWeight: 700,
                }}>
                Sắp xếp theo
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  marginVertical: 10,
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
                    paddingHorizontal: 15,
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
    backgroundColor: '#fff',
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
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
export default ProductsBySubCategories;
