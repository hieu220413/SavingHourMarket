/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import { View, Text, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import SearchBar from '../components/SearchBar';
import { icons } from '../constants';
import { COLORS, FONTS } from '../constants/theme';
import { API } from '../constants/api';
import { useFocusEffect } from "@react-navigation/native";
import LoadingScreen from '../components/LoadingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import database from '@react-native-firebase/database';

const Search = ({ navigation }) => {
    const [products, setProducts] = useState([]);
    const [result, setResult] = useState([]);
    const [productName, setProductName] = useState('');
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchHistory, setSearchHistory] = useState([]);
    const [pickupPoint, setPickupPoint] = useState({
        id: "accf0ac0-5541-11ee-8a50-a85e45c41921",
        address: "Hẻm 662 Nguyễn Xiển, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh",
        status: 1,
        longitude: 106.83102962168277,
        latitude: 10.845020092805793,
    });

    const typingTimeoutRef = useRef(null);

    const handleTypingSearch = (value) => {
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
            setProductName(value);
        }, 400);
    };

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

    // fetch search suggestion
    useFocusEffect(
        useCallback(() => {
            // Get pickup point from AS
            (async () => {
                try {
                    const value = await AsyncStorage.getItem('PickupPoint');
                    setPickupPoint(JSON.parse(value));
                } catch (err) {
                    console.log(err);
                }
            })();

            fetch(`${API.baseURL}/api/product/getProductsForCustomer?name=${productName}&pickupPointId=${pickupPoint.id}&quantitySortType=DESC&expiredSortType=DESC`)
                .then(res => res.json())
                .then(data => {
                    setResult(data.productList);
                })
                .catch(err => {
                    console.log(err);
                });

            (async () => {
                try {
                    const value = await AsyncStorage.getItem('SearchHistory');
                    let newSearchHistoryList = value ? JSON.parse(value) : [];
                    setSearchHistory(newSearchHistoryList);
                } catch (err) {
                    console.log(err);
                }
            })();

        }, [pickupPoint.id, productName]
        )
    );

    // fetch recommend products for display
    useEffect(() => {
        setLoading(true);
        fetch(`${API.baseURL}/api/product/getProductsForCustomer?page=0&limit=6&quantitySortType=DESC&expiredSortType=ASC&pickupPointId=${pickupPoint.id}`)
            .then(res => res.json())
            .then(data => {
                setProducts(data.productList);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            });
    }, [pickupPoint.id]);

    const Item = ({ item }) => {
        return (
            <View
                style={{
                    borderColor: '#C8C8C8',
                    borderBottomWidth: 0.2,
                    paddingLeft: '2%',
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
                            fontSize: Dimensions.get('window').width * 0.04,
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
                            fontSize: Dimensions.get('window').width * 0.045,
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
                    alignItems: 'center',
                    paddingVertical: '2%'
                }}
            >
                <Image
                    resizeMode='contain'
                    source={{
                        uri: item?.imageUrlImageList[0].imageUrl,
                    }}
                    style={{
                        width: '50%',
                        height: 100,
                    }}
                />
                <Text
                    style={{
                        fontFamily: FONTS.fontFamily,
                        fontSize: Dimensions.get('window').width * 0.04,
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
                        paddingLeft: '2%',
                    }}
                >
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image
                            source={icons.leftArrow}
                            resizeMode="contain"
                            style={{ width: Dimensions.get('window').width * 0.1, height: 35, tintColor: COLORS.primary }}
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
                                    fontSize: Dimensions.get('window').width * 0.035,
                                    paddingVertical: '2%',
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
                            fontSize: Dimensions.get('window').width * 0.045,
                            fontFamily: FONTS.fontFamily,
                            fontWeight: 700,
                            paddingTop: 20,
                            paddingLeft: '2%',
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