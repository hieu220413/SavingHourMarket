/* eslint-disable prettier/prettier */
import { View, Text, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import DiscountCard from './DiscountCard';
import { COLORS } from '../constants/theme';
import { API } from '../constants/api';

const DiscountRow = ({ discounts }) => {
    return (
        <ScrollView
            contentContainerStyle={{
                paddingHorizontal: 15,
                paddingTop: 10,
            }}
            horizontal
            showsHorizontalScrollIndicator={false}
        >
            {/* DiscountCard */}
            {discounts.map((item, index) => (
                <DiscountCard data={item} key={index} />
            ))}

        </ScrollView>
    )
}

export default DiscountRow;