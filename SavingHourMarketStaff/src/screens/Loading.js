/* eslint-disable prettier/prettier */
import { Text, View, ActivityIndicator, Image } from 'react-native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect, useCallback } from 'react';
import { API } from '../constants/api';
import { COLORS } from '../constants/theme';
import database from '@react-native-firebase/database';
import { useFocusEffect } from '@react-navigation/native';

const Loading = ({ navigation }) => {
    useFocusEffect(
        useCallback(() => {
            database().ref(`systemStatus`).off('value');
            database()
                .ref('systemStatus')
                .on('value', async snapshot => {
                    console.log('System status: ', snapshot.val());
                    if (snapshot.val() === 0) {
                        setSystemStatus(snapshot.val());
                        if (auth().currentUser) {
                            await auth().signOut();
                        }
                        setLoading(false);
                    } else {
                        const currentUser = await AsyncStorage.getItem('userInfo');
                        if (currentUser) {
                            // setSystemStatus(snapshot.val());
                            setLoading(false);
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Tabs' }],
                            });
                        } else {
                            setSystemStatus(snapshot.val());
                            setLoading(false);
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Login' }],
                            });
                        }
                    }
                });
        }, []),
    );

    const [systemStatus, setSystemStatus] = useState(1);
    const [loading, setLoading] = useState(true);


    return (
        <View
            style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
            }}>
            <Image
                resizeMode="contain"
                style={{
                    width: '70%',
                    height: '30%',
                    backgroundColor: 'white',
                    position: 'absolute',
                    top: '30%',
                }}
                source={require('../assets/image/logo.png')}
            />
            {loading && (
                <ActivityIndicator
                    style={{
                        position: 'absolute',
                        bottom: '38%',
                    }}
                    color={COLORS.primary}
                    size="large"
                />
            )}
            {systemStatus === 0 && (
                <Text
                    style={{
                        position: 'absolute',
                        bottom: '40%',
                        color: COLORS.red,
                    }}>
                    Hệ thống đang được bảo trì!
                </Text>
            )}
        </View>
    );
};

export default Loading;
