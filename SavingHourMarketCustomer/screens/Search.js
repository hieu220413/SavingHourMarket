/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import SearchBar from '../components/SearchBar';
import { icons } from '../constants';
import { COLORS, FONTS } from '../constants/theme';
import { API } from '../constants/api';
import { useFocusEffect } from "@react-navigation/native";
import LoadingScreen from '../components/LoadingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Search = ({ navigation }) => {
    const [products, setProducts] = useState([]);
    const [result, setResult] = useState([]);
    const [productName, setProductName] = useState('');
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchHistory, setSearchHistory] = useState([]);

    const typingTimeoutRef = useRef(null);

    const handleTypingSearch = (value) => {
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
            setProductName(value);
        }, 400);
    };

    // fetch search suggestion
    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            fetch(`${API.baseURL}/api/product/getProductsForCustomer?name=${productName}&quantitySortType=DESC&expiredSortType=DESC`)
                .then(res => res.json())
                .then(data => {
                    setResult(data.productList);
                    setLoading(false);
                })
                .catch(err => {
                    console.log(err);
                    setLoading(false);
                });

            (async () => {
                try {
                    const value = await AsyncStorage.getItem('SearchHistory');
                    let newSearchHistoryList = value ? JSON.parse(value) : [];
                    setSearchHistory(newSearchHistoryList);
                } catch (err) {
                    console.log(err);
                    setLoading(false);
                }
            })();
        }, [productName]
        )
    );

    // fetch recommend products for display
    useEffect(() => {
        setLoading(true);
        fetch(`${API.baseURL}/api/product/getProductsForCustomer?page=0&limit=6&quantitySortType=DESC&expiredSortType=ASC`)
            .then(res => res.json())
            .then(data => {
                setProducts(data.productList);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            });
    }, []);

    const Item = ({ item }) => {
        return (
            <View
                style={{
                    borderColor: '#C8C8C8',
                    borderBottomWidth: 0.2,
                    paddingLeft: 15,
                }}
            >
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('SearchResult', {
                            result: result,
                            text: item,
                        });
                    }}
                >
                    <Text
                        style={{
                            color: 'black',
                            fontFamily: FONTS.fontFamily,
                            fontSize: 16,
                            lineHeight: 40,
                        }}
                    >{item}</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const ItemSearch = ({ item }) => {
        return (
            <View
                style={{
                    borderColor: '#C8C8C8',
                    borderBottomWidth: 0.2,
                    paddingLeft: 15,
                }}
            >
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('SearchResult', {
                            result: result,
                            text: item,
                        });
                    }}
                >
                    <Text
                        style={{
                            color: 'black',
                            fontFamily: FONTS.fontFamily,
                            fontSize: 16,
                            lineHeight: 40,
                        }}
                    >{item}</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const ProductSuggestion = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('ProductDetails', {
                        product: item,
                    });
                }}
                style={{
                    borderWidth: 0.5,
                    borderColor: '#c8c8c8',
                    maxWidth: '50%',
                    flexDirection: 'row',
                    alignItems: 'center'
                }}
            >
                <Image
                    resizeMode='contain'
                    source={{
                        uri: item?.imageUrl
                    }}
                    style={{
                        width: 100,
                        height: 100,
                    }}
                />
                <Text
                    style={{
                        fontFamily: FONTS.fontFamily,
                        fontSize: 16,
                        paddingRight: '50%',
                        color: 'black',
                    }}
                >
                    {item.name}
                </Text>
            </TouchableOpacity >
        );
    }
    return (
        <>
            <View
                style={{
                    backgroundColor: '#fff',
                    paddingBottom: '10%'
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingLeft: 15,
                    }}
                >
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image
                            source={icons.leftArrow}
                            resizeMode="contain"
                            style={{ width: 35, height: 35, tintColor: COLORS.primary }}
                        />
                    </TouchableOpacity>
                    <SearchBar
                        text={text}
                        setText={setText}
                        handleTypingSearch={handleTypingSearch}
                        result={result}
                        navigation={navigation}
                    />
                </View>
                <ScrollView
                    contentContainerStyle={{
                        paddingBottom: 100,
                    }}
                >
                    {/* Search History */}
                    {text === '' && searchHistory.length > 0 && searchHistory.map((item, index) => (
                        <Item item={item} key={index} />
                    ))}
                    {text === '' && searchHistory.length > 0 && (
                        <TouchableOpacity
                            onPress={() => {
                                AsyncStorage.removeItem('SearchHistory');
                                setSearchHistory([]);
                            }}
                        >
                            <Text
                                style={{
                                    textAlign: 'center',
                                    fontFamily: FONTS.fontFamily,
                                    fontSize: 16,
                                    paddingVertical: 10,
                                    borderColor: '#c8c8c8',
                                    borderWidth: 0.8,
                                }}
                            >Xóa Lịch Sử Tìm Kiếm</Text>
                        </TouchableOpacity>
                    )}

                    {/* Search Suggestion */}
                    {text !== '' && result.map((item, index) => (
                        <ItemSearch item={item.name} key={index} />
                    ))}
                    {/* Display product suggestions */}
                    <Text
                        style={{
                            color: 'black',
                            fontSize: 18,
                            fontFamily: FONTS.fontFamily,
                            fontWeight: 700,
                            paddingTop: 20,
                            paddingLeft: 15,
                        }}
                    >
                        Gợi ý tìm kiếm
                    </Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            marginTop: '2%',
                        }}
                    >
                        {products.map((item, index) => (
                            <ProductSuggestion item={item} key={index} />
                        ))}
                    </View>
                </ScrollView>
            </View>
            {loading && <LoadingScreen />}
        </>
    );
};

export default Search;