/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import SearchBar from '../components/SearchBar';
import { icons } from '../constants';
import { COLORS, FONTS } from '../constants/theme';
import { API } from '../constants/api';
import { useFocusEffect } from "@react-navigation/native";

const Search = ({ navigation }) => {
    const [products, setProducts] = useState([]);
    const [result, setResult] = useState([]);
    const [productName, setProductName] = useState('');
    const [text, setText] = useState();

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
            fetch(`${API.baseURL}/api/product/getProductsForCustomer?name=${productName}&quantitySortType=DESC&expiredSortType=DESC`)
                .then(res => res.json())
                .then(data => {
                    setResult(data);
                })
                .catch(err => {
                    console.log(err);
                });
        }, [productName]
        )
    );

    // fetch recommend products for display
    useEffect(() => {
        fetch(`${API.baseURL}/api/product/getProductsForCustomer?page=0&limit=6&quantitySortType=DESC&expiredSortType=ASC`)
            .then(res => res.json())
            .then(data => {
                setProducts(data);
            })
            .catch(err => {
                console.log(err);
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
                        navigation.navigate('ProductDetails', {
                            product: item,
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
                    >{item.name}</Text>
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
        <View
            style={{
                backgroundColor: '#fff',
                paddingBottom: '30%'
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
                {/* Search Suggested */}
                {result.map((item, index) => (
                    <Item item={item} key={index} />
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
    );
};

export default Search;