/* eslint-disable prettier/prettier */
import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import CategoryCard from '../components/CategoryCard';

const Categories = () => {
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
            <CategoryCard imgUrl='https://links.papareact.com/wru' title='category 1' />
            <CategoryCard imgUrl='https://links.papareact.com/wru' title='category 2' />
            <CategoryCard imgUrl='https://links.papareact.com/wru' title='category 3' />
            <CategoryCard imgUrl='https://links.papareact.com/wru' title='category 3' />
            <CategoryCard imgUrl='https://links.papareact.com/wru' title='category 3' />
            <CategoryCard imgUrl='https://links.papareact.com/wru' title='category 3' />
            <CategoryCard imgUrl='https://links.papareact.com/wru' title='category 3' />
        </ScrollView>
    );
};

export default Categories;