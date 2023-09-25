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
            <DiscountCard imgUrl='https://links.papareact.com/wru' />
            <DiscountCard imgUrl='https://links.papareact.com/wru' />
            <DiscountCard imgUrl='https://links.papareact.com/wru' />
        </ScrollView>
    )
}

export default DiscountRow;