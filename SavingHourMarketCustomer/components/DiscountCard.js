/* eslint-disable prettier/prettier */
import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { COLORS, FONTS } from '../constants/theme';
import dayjs from 'dayjs';

const DiscountCard = ({ data }) => {
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
            >- {data.percentage}%</Text>
            <Image source={{
                uri: data?.imageUrl,
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
                <Text
                    numberOfLines={1}
                    style={{
                        fontFamily: FONTS.fontFamily,
                        fontSize: 18,
                        fontWeight: 700,
                        maxWidth: 180,
                        color: 'black'
                    }}>{data.name} </Text>
                <Text style={{
                    fontFamily: FONTS.fontFamily,
                    fontSize: 16,
                    maxWidth: 180,

                }}>Còn lại: {data.quantity}</Text>
                <Text style={{
                    fontFamily: FONTS.fontFamily,
                    fontSize: 18,
                    color: COLORS.secondary,
                }}>HSD: {dayjs(data.expiredDate).format('DD/MM/YYYY')}</Text>
                {/* <TouchableOpacity
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
                </TouchableOpacity> */}
            </View>
        </TouchableOpacity>
    )
}

export default DiscountCard;