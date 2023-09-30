/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { icons } from '../constants';
import { COLORS, FONTS } from '../constants/theme';

const DiscountForCategories = ({ navigation }) => {

    const data = [
        {
            id: 1,
            name: 'Chuối',
            price: 500,
            price_original: 1000,
            quantity: 5,
            expired_date: '30/09/2023',
            image_url:
                'https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2022/11/23/a-va-dai-thao-duong-co-an-duoc-chuoi-16691977534161220101928.jpg',
        },

        {
            id: 2,
            name: 'Beef',
            price: 1000,
            price_original: 2000,
            quantity: 5,
            expired_date: '30/09/2023',
            image_url:
                'https://tfruit.com.vn/wp-content/uploads/2021/07/tao-xanh-my.jpg',
        },
    ];


    const handleBuy = () => {
        console.log('Buy');
    };


    const Item = ({ data }) => (
        <TouchableOpacity onPress={() => {
            navigation.navigate('ProductDetails');
        }}>
            <View style={styles.itemContainer}>
                {/* Image Product */}
                <Image
                    resizeMode="contain"
                    source={{
                        uri: data.image_url,
                    }}
                    style={styles.itemImage}
                />
                <View style={{ justifyContent: 'center' }}>
                    <Text
                        style={{
                            fontFamily: FONTS.fontFamily,
                            fontSize: 20,
                            fontWeight: 700,
                            maxWidth: '75%',
                            color: 'black',
                        }}>
                        {data.name}
                    </Text>

                    <View style={{ flexDirection: 'row' }}>
                        <Text
                            style={{
                                fontSize: 20,
                                lineHeight: 30,
                                color: COLORS.secondary,
                                fontWeight: 600,
                            }}>
                            {data.price}
                        </Text>
                        <Text
                            style={{
                                fontSize: 15,
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
                        HSD: {data.expired_date}
                    </Text>

                    <TouchableOpacity onPress={handleBuy}>
                        <Text
                            style={{
                                maxWidth: '100%',
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
        <View
            style={{
                // backgroundColor: '#fff'
            }}
        >
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginVertical: 15,
                    marginHorizontal: 30,
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
                >Giảm giá 50k</Text>
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

            {/* List product of Category */}
            <ScrollView
                keyboardShouldPersistTaps="always"
                contentContainerStyle={{
                    paddingBottom: 100,
                    paddingTop: 20,
                }}>
                {data.map(item => (
                    <Item data={item} />
                ))}

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    itemContainer: {
        backgroundColor: '#F5F5F5',
        maxWidth: '90%',
        borderRadius: 20,
        marginHorizontal: '7%',
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

export default DiscountForCategories;