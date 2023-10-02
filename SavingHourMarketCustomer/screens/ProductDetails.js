/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import React from 'react';
import { icons } from '../constants';
import { COLORS, FONTS } from '../constants/theme';
import dayjs from 'dayjs';

const ProductDetails = ({ navigation, route }) => {
    const product = route.params.product;

    const handleBuy = () => {
        console.log('buy');
    };

    return (
        <View
            style={{
                backgroundColor: '#fff'
            }}>
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
                    }}
                >Thông tin sản phẩm</Text>

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
                <Image
                    style={{
                        width: '85%',
                        height: 250,
                        marginHorizontal: 30,
                        borderRadius: 20,
                        backgroundColor: 'green'
                    }}
                    resizeMode="contain"
                    source={{
                        uri: product.imageUrl,
                    }}
                />
                <View
                    style={{
                        marginHorizontal: 30,
                        marginVertical: 20,
                    }}>
                    <Text
                        style={{
                            fontFamily: FONTS.fontFamily,
                            fontSize: 22,
                            fontWeight: 700,
                            maxWidth: '95%',
                            color: 'black',
                        }}>
                        {product.name}
                    </Text>
                    <View
                        style={{
                            borderBottomColor: '#C8C8C8',
                            borderBottomWidth: 1,
                            width: '100%',
                            paddingVertical: 5,
                        }}>
                        <Text
                            style={{
                                fontFamily: FONTS.fontFamily,
                                fontSize: 16,
                                marginTop: 5,
                            }}>
                            HSD: {dayjs(product.expiredDate).format('DD/MM/YYYY')}
                        </Text>
                    </View>

                    <Text
                        style={{
                            fontFamily: FONTS.fontFamily,
                            fontSize: 18,
                            marginVertical: 10,
                            color: 'black'
                        }}>
                        {product.description}
                    </Text>
                </View>

                <View
                    style={{
                        flexDirection: 'row',
                        backgroundColor: '#F5F5F5',
                        marginHorizontal: 30,
                        paddingHorizontal: 10,
                        paddingTop: '8%',
                        paddingBottom: 80,
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <View style={{ flexDirection: 'row' }}>
                        <Text
                            style={{
                                fontSize: 28,
                                lineHeight: 30,
                                color: COLORS.secondary,
                                fontWeight: 700,
                            }}>
                            {product.price.toLocaleString("vi-VN", {
                                currency: "VND",
                            })}
                        </Text>
                        <Text
                            style={{
                                fontSize: 20,
                                lineHeight: 18,
                                color: COLORS.secondary,
                                fontWeight: 700,
                            }}>
                            ₫
                        </Text>
                    </View>
                    <TouchableOpacity onPress={handleBuy}>
                        <Text
                            style={{
                                paddingVertical: 15,
                                paddingHorizontal: '20%',
                                backgroundColor: COLORS.primary,
                                borderRadius: 30,
                                fontWeight: 700,
                                textAlign: 'center',
                                color: '#ffffff',
                                fontSize: 20,
                            }}>
                            Mua
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

export default ProductDetails;