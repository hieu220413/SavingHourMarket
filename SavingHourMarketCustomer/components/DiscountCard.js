/* eslint-disable prettier/prettier */
import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { COLORS, FONTS } from '../constants/theme';


const DiscountCard = ({ }) => {

    const handleViewProductOfCate = () => {
        console.log('click');
    };
    return (
        <TouchableOpacity
            style={{
                marginRight: 15,
                borderRadius: 10,
            }}
        >
            <Text
                style={{
                    position: 'absolute',
                    backgroundColor: COLORS.secondary,
                    maxWidth: 150,
                    color: 'white',
                    zIndex: 9999,
                    padding: 5,
                    paddingHorizontal: 15,
                    borderRadius: 10,
                    left: '4%',
                    top: '2%'
                }}
            >- 80%</Text>
            <Image source={{
                uri: 'https://reactnative.dev/img/tiny_logo.png',
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
                }}>Giảm tối đa 50k</Text>
                <Text style={{
                    fontFamily: FONTS.fontFamily,
                    fontSize: 20,
                    maxWidth: 180,

                }}>Còn lại: 20</Text>
                <Text style={{
                    fontFamily: FONTS.fontFamily,
                    fontSize: 20,
                    color: COLORS.secondary,
                }}>HSD: 23/09/2023</Text>
                <TouchableOpacity
                    onPress={handleViewProductOfCate}
                    style={{
                        alignItems: 'center',
                    }}
                >
                    <Text style={{
                        paddingHorizontal: 30,
                        paddingVertical: 5,
                        marginVertical: 15,
                        backgroundColor: COLORS.primary,
                        borderRadius: 10,
                        textAlign: 'center',
                        color: '#ffffff'
                    }}>Xem sản phẩm</Text>
                </TouchableOpacity>
            </View>

        </TouchableOpacity>
    )
}

export default DiscountCard;