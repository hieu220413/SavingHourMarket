/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import React, { useCallback, useState } from 'react';
import { icons } from '../constants';
import { COLORS, FONTS } from '../constants/theme';
import dayjs from 'dayjs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { API } from '../constants/api';
import LoadingScreen from '../components/LoadingScreen';
import Toast from 'react-native-toast-message';

const ProductsBySubCategories = ({ navigation, route }) => {
    const subCategoryId = route.params.subCategory.id;
    const [products, setProducts] = useState([]);
    const [cartList, setCartList] = useState([]);
    const [loading, setLoading] = useState(false);

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
            fetch(`${API.baseURL}/api/product/getProductsForCustomer?productSubCategoryId=${subCategoryId}&page=0&limit=9999&expiredSortType=ASC`)
                .then(res => res.json())
                .then(data => {
                    setProducts(data.productList);
                    setLoading(false);
                })
                .catch(err => {
                    console.log(err);
                    setLoading(false);
                });
        }, [subCategoryId])
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

            const cartData = { ...data, isChecked: false, cartQuantity: 1 };
            newCartList = [...newCartList, cartData];
            setCartList(newCartList);
            await AsyncStorage.setItem('CartList', JSON.stringify(newCartList));
            showToast();
        } catch (error) {
            console.log(error);
        }
    };


    const Item = ({ data }) => {
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
    return (
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
                        style={{ width: 35, height: 35, tintColor: COLORS.primary }}
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
                                style={{ fontSize: 12, color: 'white', fontFamily: 'Roboto' }}>
                                {cartList.length}
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>
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


            {loading && <LoadingScreen />}
        </View>
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
});
export default ProductsBySubCategories;