/* eslint-disable prettier/prettier */
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { API } from '../constants/api';
import { COLORS, FONTS } from '../constants/theme';
import { icons } from '../constants';

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
                        fontSize: 22,
                        fontFamily: FONTS.fontFamily,
                        borderRadius: 20,
                        textAlign: 'center',
                        fontWeight: 700,
                        color: COLORS.secondary,

                    } : {
                        padding: 5,
                        fontSize: 20,
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
                paddingTop: 10,
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