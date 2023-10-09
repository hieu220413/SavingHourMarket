/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput, FlatList, Modal } from 'react-native';
import React, { useState, useRef, useCallback } from 'react';
import { icons } from '../constants';
import { COLORS, FONTS } from '../constants/theme';
import dayjs from 'dayjs';
import Empty from '../assets/image/search-empty.png';
import { API } from '../constants/api';
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const SearchResult = ({
    navigation,
    route,
}) => {
    const [result, setResult] = useState(route.params.result);
    const [productName, setProductName] = useState(route.params.text);
    const [text, setText] = useState(route.params.text);
    const [cartList, setCartList] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [categories, setCategories] = useState([]);
    const [currentCate, setCurrentCate] = useState('');
    const [selectSortOption, setSelectSortOption] = useState('');

    const sortOptions = [
        {
            id: 1,
            name: 'Ngày sắp hết hạn',
        },
        {
            id: 2,
            name: 'Giá tiền tăng dần',
        },
        {
            id: 3,
            name: 'Giá tiền giảm dần',
        },
    ];

    const typingTimeoutRef = useRef(null);

    const handleTypingSearch = (value) => {
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
            setProductName(value);
        }, 400);
    };

    const handleClearText = () => {
        setText('');
        handleTypingSearch('');
    };

    const sortProduct = (id) => {
        setSelectSortOption(id);
        if (id == 1) {
            fetch(`${API.baseURL}/api/product/getProductsForCustomer?name=${productName}${currentCate === '' ? '' : '&productCategoryId=' + currentCate}&page=0&limit=5&quantitySortType=DESC&expiredSortType=ASC&priceSort=ASC`)
                .then(res => res.json())
                .then(data => {
                    setResult(data);
                })
                .catch(err => {
                    console.log(err);
                });
        } else if (id == 2) {
            fetch(`${API.baseURL}/api/product/getProductsForCustomer?name=${productName}${currentCate === '' ? '' : '&productCategoryId=' + currentCate}&page=0&limit=5&quantitySortType=DESC&expiredSortType=DESC&priceSort=ASC`)
                .then(res => res.json())
                .then(data => {
                    setResult(data);
                })
                .catch(err => {
                    console.log(err);
                });
        } else if (id == 3) {
            fetch(`${API.baseURL}/api/product/getProductsForCustomer?name=${productName}${currentCate === '' ? '' : '&productCategoryId=' + currentCate}&page=0&limit=5&quantitySortType=DESC&expiredSortType=DESC&priceSort=DESC`)
                .then(res => res.json())
                .then(data => {
                    setResult(data);
                })
                .catch(err => {
                    console.log(err);
                });
        }
    };

    const handleApplyFilter = () => {
        setModalVisible(!modalVisible);
        fetch(`${API.baseURL}/api/product/getProductsForCustomer?name=${productName}&productCategoryId=${currentCate}&page=0&limit=5&quantitySortType=DESC&expiredSortType=DESC`)
            .then(res => res.json())
            .then(data => {
                setResult(data);
            })
            .catch(err => {
                console.log(err);
            });
        sortProduct(selectSortOption);
    };

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
                return;
            }

            const cartData = { ...data, isChecked: false, cartQuantity: 1 };
            newCartList = [...newCartList, cartData];
            setCartList(newCartList);
            await AsyncStorage.setItem('CartList', JSON.stringify(newCartList));
        } catch (error) {
            console.log(error);
        }
    };

    // fetch search suggestion
    useFocusEffect(
        useCallback(() => {
            fetch(`${API.baseURL}/api/product/getProductsForCustomer?name=${productName}&quantitySortType=DESC&expiredSortType=DESC`)
                .then(res => res.json())
                .then(data => {
                    setResult(data);
                })
                .catch(err => {
                    console.log(err);
                });

            (async () => {
                try {
                    const cartList = await AsyncStorage.getItem('CartList');
                    setCartList(cartList ? JSON.parse(cartList) : []);
                } catch (err) {
                    console.log(err);
                }
            })();

            fetch(
                `${API.baseURL}/api/product/getAllCategory`,
            )
                .then(res => res.json())
                .then(data => {
                    setCategories(data);
                    setCurrentCate(data[0].id);
                })
                .catch(err => {
                    console.log(err);
                });
        }, [productName])
    );

    const Product = ({ data }) => {
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

    const ModalSortItem = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    setSelectSortOption(item.id);
                }}
                style={selectSortOption === item.id ? {
                    borderColor: COLORS.primary,
                    borderWidth: 1,
                    borderRadius: 10,
                    margin: 5,
                } : {
                    borderColor: '#c8c8c8',
                    borderWidth: 0.2,
                    borderRadius: 10,
                    margin: 5,
                }}
            >
                <Text
                    style={selectSortOption === item.id ? {
                        width: 150,
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        textAlign: 'center',
                        color: COLORS.primary,
                        fontFamily: FONTS.fontFamily,
                        fontSize: 14,
                    } : {
                        width: 150,
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        textAlign: 'center',
                        color: 'black',
                        fontFamily: FONTS.fontFamily,
                        fontSize: 14,
                    }}
                >
                    {item.name}
                </Text>
            </TouchableOpacity>
        )
    }

    const ModalCateItem = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    setCurrentCate(item.id)
                }}
                style={currentCate == item.id ? {
                    borderColor: COLORS.primary,
                    borderWidth: 1,
                    borderRadius: 10,
                    margin: 5,
                } : {
                    borderColor: '#c8c8c8',
                    borderWidth: 0.2,
                    borderRadius: 10,
                    margin: 5,
                }}
            >
                <Text
                    style={currentCate == item.id ? {
                        width: 150,
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        textAlign: 'center',
                        color: COLORS.primary,
                        fontFamily: FONTS.fontFamily,
                        fontSize: 14,
                    } : {
                        width: 150,
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        textAlign: 'center',
                        color: 'black',
                        fontFamily: FONTS.fontFamily,
                        fontSize: 14,
                    }}
                >
                    {item.name}
                </Text>
            </TouchableOpacity>
        )
    };

    return (
        <View
            style={{
                backgroundColor: '#fff',
                minHeight: '100%',
                paddingBottom: 80,
            }}
        >
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingLeft: 15,
                    marginBottom: 20,
                }}
            >
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image
                        source={icons.leftArrow}
                        resizeMode="contain"
                        style={{ width: 35, height: 35, tintColor: COLORS.primary }}
                    />
                </TouchableOpacity>

                <View style={styles.containerSearch}>
                    <View style={styles.wrapperSearch}>
                        <Image resizeMode="center" style={styles.icon} source={icons.search} />
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Bạn cần tìm gì ?"
                        value={text}
                        onChangeText={data => {
                            setText(data);
                            handleTypingSearch(data);
                        }}
                    />
                    <View style={styles.clear}>
                        <TouchableOpacity onPress={handleClearText}>
                            <Image
                                resizeMode="center"
                                style={styles.icon}
                                source={icons.clearText}></Image>
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={() => {
                        setModalVisible(true);
                    }}
                >
                    <Image
                        resizeMode="contain"
                        style={{
                            height: 45,
                            tintColor: COLORS.primary,
                            width: 35,
                            marginHorizontal: 10,
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
                    {cartList.lenght !== 0 && (
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

            {/* Search Result */}
            {result.length == 0 ? (
                <View style={{ alignItems: 'center', marginTop: '20%' }}>
                    <Image
                        style={{ width: 200, height: 200, }}
                        resizeMode="contain"
                        source={Empty}
                    />
                    <Text
                        style={{
                            fontSize: 20,
                            fontFamily: 'Roboto',
                            fontWeight: 'bold',
                        }}>
                        Không tìm thấy sản phẩm
                    </Text>
                </View>
            ) : (
                <FlatList
                    scrollEnabled={true}
                    showsVerticalScrollIndicator={true}
                    data={result}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={({ item }) => (
                        <Product data={item} />
                    )}
                />
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
                            }}
                        >
                            <Text style={{
                                color: 'black',
                                fontFamily: FONTS.fontFamily,
                                fontSize: 20,
                                fontWeight: 700,
                                textAlign: 'center',
                                paddingBottom: 10,
                            }}>Bộ lọc tìm kiếm</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    setModalVisible(!modalVisible);
                                    setCurrentCate('');
                                    setSelectSortOption('');
                                }}
                            >

                                <Image
                                    resizeMode='contain'
                                    style={{

                                        width: 20,
                                        height: 20,
                                        tintColor: 'grey'
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
                            }}
                        >Sắp xếp theo</Text>
                        <View
                            style={{
                                // flex: 1,
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                marginVertical: 10,
                            }}
                        >
                            {sortOptions.map((item, index) => (
                                <ModalSortItem item={item} key={index} />
                            ))}
                        </View>
                        <Text
                            style={{
                                color: 'black',
                                fontFamily: FONTS.fontFamily,
                                fontSize: 16,
                                fontWeight: 700,
                            }}
                        >Lọc theo loại sản phẩm</Text>
                        <View
                            style={{
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                marginVertical: 10,
                            }}
                        >
                            {categories.map((item, index) => (
                                <ModalCateItem item={item} key={index} />
                            ))}
                        </View>

                        <TouchableOpacity
                            style={{
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
            </Modal>
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
    containerSearch: {
        backgroundColor: '#f5f5f5',
        width: '60%',
        height: 45,
        borderRadius: 40,
        paddingLeft: 10,
        marginTop: 10,
        marginLeft: 20,
        marginBottom: 10,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    input: {
        fontFamily: FONTS.fontFamily,
        fontSize: 16,
        flex: 1,
    },
    wrapperSearch: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        height: 40,
        flex: 0.2,
    },
    icon: {
        width: 20,
        height: 20,
    },
    clear: {
        flex: 0.2,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 5,
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

export default SearchResult;