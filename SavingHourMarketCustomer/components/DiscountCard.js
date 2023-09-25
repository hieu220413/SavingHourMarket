/* eslint-disable prettier/prettier */
import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { COLORS, FONTS } from '../constants/theme';


const DiscountCard = ({ imgUrl }) => {

    const handleBuy = () => {
        console.log('Buy');
    };
    return (
        <TouchableOpacity
            style={{
                marginRight: 10,
                borderWidth: 1,
                borderRadius: 10,
                borderColor: 'grey'
            }}
        >
            <Text
                style={{
                    position: 'absolute',
                    backgroundColor: COLORS.red,
                    maxWidth: 150,
                    color: 'white',
                    zIndex: 9999,
                    padding: 5,
                    borderRadius: 5,
                    right: 0,
                }}
            >- 80%</Text>
            <Image source={{
                // uri: imgUrl,
            }}
                style={{
                    backgroundColor: 'grey',
                    height: 180,
                    width: 180,
                    borderRadius: 10,
                    marginBottom: 15,
                }}
            />
            <View
                style={{
                    paddingLeft: 5,
                }}>
                <Text style={{
                    fontFamily: FONTS.fontFamily,
                    fontSize: 20,
                    fontWeight: 700,
                    maxWidth: 180,
                    color: 'black'
                }}>Meat</Text>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontSize: 18, lineHeight: 30, color: COLORS.red, fontWeight: 700, fontFamily: FONTS.fontFamily }}>1000</Text>
                    <Text style={{ fontSize: 13, lineHeight: 18, color: COLORS.red, fontWeight: 600, fontFamily: FONTS.fontFamily }}>₫</Text>
                </View>

                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontSize: 18, lineHeight: 30, textDecorationLine: 'line-through', textDecorationStyle: 'solid', fontFamily: FONTS.fontFamily }}>2400</Text>
                    <Text style={{ fontSize: 13, lineHeight: 18, fontFamily: FONTS.fontFamily }}>₫</Text>
                    <Text style={{ fontSize: 14, lineHeight: 30, paddingLeft: 5, fontFamily: FONTS.fontFamily }}>( - 80%)</Text>
                </View>
                <Text style={{
                    fontFamily: FONTS.fontFamily,
                    fontSize: 20,
                    color: COLORS.red,
                }}>HSD: 23/09/2023</Text>
                <TouchableOpacity
                    onPress={handleBuy}
                    style={{
                        alignItems: 'center',
                    }}
                >
                    <Text style={{
                        maxWidth: 100,
                        paddingHorizontal: 30,
                        paddingVertical: 5,
                        marginVertical: 10,
                        backgroundColor: COLORS.primary,
                        borderRadius: 10,
                        textAlign: 'center',
                        color: '#ffffff'
                    }}>Mua</Text>
                </TouchableOpacity>
            </View>

        </TouchableOpacity>
    )
}

export default DiscountCard;