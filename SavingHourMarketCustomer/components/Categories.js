/* eslint-disable prettier/prettier */
import { View, Text, ScrollView } from 'react-native';
import React, { useState } from 'react';
import CategoryCard from '../components/CategoryCard';

const Categories = () => {

    const [category, setCategory] = useState("");

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
            <CategoryCard title='Thịt heo' />
            <CategoryCard title='Cá' />
            <CategoryCard title='Thịt bò' />
            <CategoryCard title='Trứng' />
            <CategoryCard title='Sữa' />
            <CategoryCard title='Rau' />
            <CategoryCard title='Mĩ phẩm' />
        </ScrollView>
    );
};

export default Categories;