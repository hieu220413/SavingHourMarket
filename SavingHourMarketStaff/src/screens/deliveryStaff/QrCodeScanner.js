/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import { Image } from 'react-native-animatable';
import { icons } from '../../constants';
import { COLORS, FONTS } from '../../constants/theme';
import { useFocusEffect } from '@react-navigation/native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import database from '@react-native-firebase/database';
import { checkSystemState } from '../../common/utils';

const QrCodeScanner = ({ navigation }) => {
    // listen to system state
    useFocusEffect(
        useCallback(() => {
            checkSystemState();
        }, []),
    );

    const [initializing, setInitializing] = useState(true);
    const [data, setData] = useState('');
    const isScaned = true;
    // const onAuthStateChange = async userInfo => {
    //     // console.log(userInfo);
    //     if (initializing) {
    //         setInitializing(false);
    //     }
    //     if (userInfo) {
    //         // check if user sessions is still available. If yes => redirect to another screen
    //         const userTokenId = await userInfo
    //             .getIdToken(true)
    //             .then(token => token)
    //             .catch(async e => {
    //                 console.log(e);
    //                 return null;
    //             });
    //         if (!userTokenId) {
    //             // sessions end. (revoke refresh token like password change, disable account, ....)
    //             await AsyncStorage.removeItem('userInfo');
    //             // navigation.navigate('Login');
    //             navigation.reset({
    //                 index: 0,
    //                 routes: [{name: 'Login'}],
    //               });
    //             return;
    //         }
    //     } else {
    //         // no sessions found.
    //         console.log('user is not logged in');
    //         await AsyncStorage.removeItem('userInfo');
    //         // navigation.navigate('Login');
    //         navigation.reset({
    //             index: 0,
    //             routes: [{name: 'Login'}],
    //           });
    //     }
    // };

    // useEffect(() => {
    //     const subscriber = auth().onAuthStateChanged(
    //         async userInfo => await onAuthStateChange(userInfo),
    //     );

    //     return subscriber;
    // }, []);


    return (
        <View
            style={{ backgroundColor: '#fff' }}
        >
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 100,
                    marginVertical: 15,
                    marginHorizontal: 15,
                }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image
                        source={icons.leftArrow}
                        resizeMode="contain"
                        style={{ width: 35, height: 35, tintColor: COLORS.primary }}
                    />
                </TouchableOpacity>
                <Text
                    style={{
                        textAlign: 'center',
                        color: 'black',
                        fontSize: 24,
                        fontFamily: FONTS.fontFamily,
                    }}>
                    Quét mã
                </Text>
            </View>
            {/* QR Scanner */}
            <View
                style={{
                    backgroundColor: 'blue'
                }}
            >
                <QRCodeScanner
                    onRead={({ data }) => {
                        navigation.navigate('OrderDetails', {
                            id: data,
                            isScaned: isScaned,
                        });
                    }}
                    flashMode={RNCamera.Constants.FlashMode.off}
                    reactivate={true}
                    showMarker={true}
                    reactivateTimeout={500}
                    topContent={
                        <Text style={styles.centerText}>
                            {data}
                        </Text>
                    }
                    bottomContent={
                        <TouchableOpacity style={styles.buttonTouchable}>
                            <Text style={styles.buttonText}>OK. Got it!</Text>
                        </TouchableOpacity>
                    }
                />
            </View>
        </View>
    );
};

export default QrCodeScanner;

const styles = StyleSheet.create({
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: '#777',
    },
    textBold: {
        fontWeight: '500',
        color: '#000',
    },
    buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)',
    },
    buttonTouchable: {
        padding: 16,
    }
});