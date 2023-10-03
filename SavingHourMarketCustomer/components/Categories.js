/* eslint-disable prettier/prettier */
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { API } from '../constants/api';
import { COLORS, FONTS } from '../constants/theme';
import { icons } from '../constants';

const Categories = () => {

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetch(
            `${API.baseURL}/api/product/getAllCategory`,
        )
            .then(res => res.json())
            .then(data => {
                setCategories(data);
                // console.log('cate:', data);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    const handleSelectCategory = () => {
        console.log('select');
    };
    const Item = ({ data }) => {
        return (
            <TouchableOpacity
                onPress={handleSelectCategory}
                style={{
                    marginRight: 5,
                }}>
                <Text
                    style={{
                        padding: 5,
                        fontSize: 20,
                        fontFamily: FONTS.fontFamily,
                        borderRadius: 20,
                        textAlign: 'center',
                    }}
                >{data}</Text>
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
                <Item data={item.name} key={index} />
            ))}
        </ScrollView>
    );
};

export default Categories;