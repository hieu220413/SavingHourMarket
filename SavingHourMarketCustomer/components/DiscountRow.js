/* eslint-disable prettier/prettier */
import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import DiscountCard from './DiscountCard';

const DiscountRow = () => {
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
            <DiscountCard />
            <DiscountCard />
            <DiscountCard />
        </ScrollView>
    )
}

export default DiscountRow;