/* eslint-disable prettier/prettier */
import { Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import React from 'react';
import { COLORS, FONTS } from '../constants/theme';

const Categories = (
    {
        categories,
        currentCate,
        setCurrentCate,
    }
) => {
    const Item = ({ data }) => {
        return (
            <TouchableOpacity
                onPress={() => setCurrentCate(data.id)}
                style={{
                    marginRight: 5,
                }}>
                <Text
                    style={currentCate == data.id ? {
                        paddingBottom: 5,
                        paddingHorizontal: 5,
                        fontSize: Dimensions.get('window').width * 0.055,
                        fontFamily: '',
                        borderRadius: 20,
                        textAlign: 'center',
                        fontWeight: 700,
                        color: COLORS.secondary,
                    } : {
                        padding: 5,
                        fontSize: Dimensions.get('window').width * 0.045,
                        fontFamily: FONTS.fontFamily,
                        borderRadius: 20,
                        fontWeight: 700,
                        textAlign: 'center',
                    }}
                >{data.name}</Text>
            </TouchableOpacity>
        );
    };
    return (
        <ScrollView
            contentContainerStyle={{
                paddingHorizontal: 15,
            }}
            horizontal
            showsHorizontalScrollIndicator={false}
        >
            {/* Category */}
            {categories.map((item, index) => (
                <Item data={item} key={index} />
            ))}
        </ScrollView>
    );
};

export default Categories;