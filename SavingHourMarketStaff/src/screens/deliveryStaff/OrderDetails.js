/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import { View, Text, TouchableOpacity, Image, ScrollView, Modal, StyleSheet } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import { icons } from '../../constants';
import { COLORS, FONTS } from '../../constants/theme';
import { format } from 'date-fns';
import { useFocusEffect } from '@react-navigation/native';
import { API } from '../../constants/api';
import LoadingScreen from '../../components/LoadingScreen';


const OrderDetails = ({ navigation, route }) => {
    const [initializing, setInitializing] = useState(true);
    const [tokenId, setTokenId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [item, setItem] = useState(null);
    const [timeFrame, setTimeFrame] = useState(null);
    const [customerTimeFrame, setCustomerTimeFrame] = useState(null);
    const [date, setDate] = useState(null);
    const id = route.params.id;
    const isScaned = route.params.isScaned;
    const [modalVisible, setModalVisible] = useState(false);
    const [errorModalVisible, setErrorModalVisible] = useState(false);
    const [alertText, setAlertText] = useState('');
    const [expDateList, setExpDateList] = useState([]);
    const onAuthStateChange = async userInfo => {
        setLoading(true);
        if (initializing) {
            setInitializing(false);
        }
        if (userInfo) {
            // check if user sessions is still available. If yes => redirect to another screen
            const userTokenId = await userInfo
                .getIdToken(true)
                .then(token => token)
                .catch(async e => {
                    console.log(e);
                    setLoading(false);
                    return null;
                });
            if (!userTokenId) {
                // sessions end. (revoke refresh token like password change, disable account, ....)
                await AsyncStorage.removeItem('userInfo');
                setLoading(false);
                navigation.navigate('Login');
                return;
            }
            const token = await auth().currentUser.getIdToken();
            setTokenId(token);
            setLoading(false);
        } else {
            // no sessions found.
            console.log('user is not logged in');
            await AsyncStorage.removeItem('userInfo');
            setLoading(false);
            navigation.navigate('Login');
        }
    };

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(
            async userInfo => await onAuthStateChange(userInfo),
        );
        return subscriber;
    }, []);

    const fetchOrderDetails = () => {
        if (tokenId) {
            setLoading(true);
            fetch(`${API.baseURL}/api/order/getOrderDetail/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${tokenId}`,
                },
            })
                .then(res => res.json())
                .then(respond => {
                    setItem(respond);
                    setLoading(false);
                })
                .catch(err => {
                    console.log(err);
                    setLoading(false);
                });
        }
    };

    useFocusEffect(
        useCallback(() => {
            if (tokenId) {
                setLoading(true);
                fetch(`${API.baseURL}/api/order/getOrderDetail/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${tokenId}`,
                    },
                })
                    .then(res => res.json())
                    .then(respond => {
                        setItem(respond);
                        const arr = [];
                        respond.orderDetailList.map(item => {
                            item.orderDetailProductBatches.map(batch => {
                                arr.push(batch.expiredDate);
                            });
                        });
                        setExpDateList(arr);
                        setLoading(false);
                    })
                    .catch(err => {
                        console.log(err);
                        setLoading(false);
                    });
            }
        }, [id, tokenId])
    );

    const confirmOrder = (bool) => {
        console.log(bool);
        setLoading(true);
        fetch(`${API.baseURL}/api/order/deliveryStaff/${bool === true ? 'confirmSucceeded' : 'confirmFail'}?orderId=${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${tokenId}`,
            },
        })
            .then((res) => res.text())
            .then(data => {
                setAlertText(data);
                setErrorModalVisible(true);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            });
    };

    return (
        <>
            <View>
                <View
                    style={{
                        alignItems: 'center',
                        flexDirection: 'row',
                        gap: 20,
                        backgroundColor: '#ffffff',
                        padding: 20,
                        elevation: 4,
                        marginBottom: 10,
                    }}>
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('Start')
                        }>
                        <Image
                            source={icons.leftArrow}
                            resizeMode="contain"
                            style={{ width: 35, height: 35, tintColor: COLORS.primary }}
                        />
                    </TouchableOpacity>
                    <Text
                        style={{
                            fontSize: 22,
                            textAlign: 'center',
                            color: '#000000',
                            fontWeight: 'bold',
                            fontFamily: 'Roboto',
                        }}>
                        Chi tiết đơn hàng
                    </Text>
                </View>
                {item && (
                    <ScrollView
                        contentContainerStyle={{
                            paddingBottom: 180,
                        }}
                    >
                        <View style={
                            item?.status === 5 && 'Đơn hàng thất bại' ?
                                { padding: 20, backgroundColor: COLORS.red } : { padding: 20, backgroundColor: COLORS.primary }}>
                            <Text
                                style={{ color: 'white', fontSize: 18, fontFamily: 'Roboto' }}>
                                {item?.status === 0 && 'Đơn hàng đang chờ xác nhận'}
                                {item?.status === 1 && 'Đơn hàng đang đóng gói'}
                                {item?.status === 2 && 'Đơn hàng đã đóng gói'}
                                {item?.status === 3 && 'Đơn hàng đang được giao '}
                                {item?.status === 4 && 'Đơn hàng thành công'}
                                {item?.status === 5 && 'Đơn hàng thất bại'}
                                {item?.status === 6 && 'Đơn hàng đã hủy'}
                            </Text>
                        </View>
                        <View
                            style={{ padding: 20, backgroundColor: 'white', marginBottom: 20 }}>
                            {/* pickup location */}
                            <View
                                style={{
                                    backgroundColor: 'white',
                                    paddingVertical: 20,
                                    gap: 10,
                                    borderBottomColor: '#decbcb',
                                    borderBottomWidth: 0.75,
                                }}>
                                <View
                                    style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                    <Image
                                        style={{ width: 20, height: 20 }}
                                        resizeMode="contain"
                                        source={icons.location}
                                    />
                                    <Text
                                        style={{ fontSize: 20, color: 'black', fontWeight: 'bold' }}>
                                        Thông tin giao hàng
                                    </Text>
                                </View>
                                <View
                                    style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                    <View style={{ width: 20 }} />
                                    <View style={{ gap: 8 }}>
                                        <View style={{ gap: 3 }}>
                                            <Text style={{ fontSize: 18, fontWeight: 'bold', maxWidth: '95%' }}>
                                                {item?.addressDeliver
                                                    ? item?.addressDeliver
                                                    : item?.pickupPoint.address}
                                            </Text>
                                        </View>
                                        {item.timeFrame && (
                                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                                                {item?.timeFrame
                                                    ? `${item?.timeFrame?.fromHour.slice(0, 5)} đến ${item?.timeFrame?.toHour.slice(0, 5)}`
                                                    : ''}
                                            </Text>
                                        )}
                                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                                            Ngày giao hàng:{' '}
                                            {format(new Date(item?.deliveryDate), 'dd/MM/yyyy')}
                                        </Text>
                                        {/* Edit date  */}
                                        {item?.status === 3 && (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    navigation.navigate('EditDeliveryDate', {
                                                        timeFrame: item?.timeFrame
                                                            ? `${item?.timeFrame?.fromHour.slice(0, 5)} đến ${item?.timeFrame?.toHour.slice(0, 5)}`
                                                            : '',
                                                        deliveryDate: item?.deliveryDate,
                                                        picked: route.params.picked,
                                                        orderItems: item?.orderDetailList,
                                                        orderId: route.params.id,
                                                        expDateList: expDateList,
                                                        setTimeFrame,
                                                        setCustomerTimeFrame,
                                                        setDate,
                                                    });
                                                }}
                                                style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: 15 }}
                                            >
                                                <Text
                                                    style={{
                                                        fontSize: 18,
                                                        color: COLORS.secondary,
                                                        fontWeight: 'bold'
                                                    }}
                                                >Sửa lại ngày giao hàng</Text>
                                                <Image
                                                    style={{ width: 20, height: 20, tintColor: COLORS.secondary }}
                                                    resizeMode="contain"
                                                    source={icons.edit}
                                                />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            </View>
                            {/* ******************* */}
                            {/* Customer information */}
                            <View
                                style={{
                                    backgroundColor: 'white',
                                    paddingVertical: 20,
                                    gap: 10,
                                }}>
                                <View
                                    style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                    <Image
                                        style={{ width: 20, height: 20 }}
                                        resizeMode="contain"
                                        source={icons.phone}
                                    />
                                    <Text
                                        style={{ fontSize: 20, color: 'black', fontWeight: 'bold' }}>
                                        Thông tin liên lạc
                                    </Text>
                                </View>
                                <View
                                    style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                    <View style={{ width: 20 }} />
                                    <View style={{ gap: 5 }}>
                                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                                            {item.customer.fullName}
                                        </Text>
                                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                                            {item.customer.phone}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            {/* *********************** */}
                        </View>

                        {/* Order Item */}
                        <View
                            style={{
                                backgroundColor: 'white',
                                paddingBottom: 10,
                                marginBottom: 10,
                                padding: 20,
                            }}>
                            {item?.orderDetailList?.map(product => (
                                <View
                                    key={product.id}
                                    style={{
                                        flexDirection: 'row',
                                        gap: 10,
                                        alignItems: 'center',
                                        backgroundColor: 'white',
                                        borderBottomColor: '#decbcb',
                                        borderBottomWidth: 0.5,
                                        paddingVertical: 20,
                                    }}>
                                    <Image
                                        source={{
                                            uri: product.images[0].imageUrl,
                                        }}
                                        style={{ flex: 4, width: '100%', height: '95%' }}
                                    />
                                    <View
                                        style={{
                                            flexDirection: 'column',
                                            gap: 10,
                                            flex: 7,
                                        }}>
                                        <Text
                                            style={{
                                                fontSize: 23,
                                                color: 'black',
                                                fontFamily: 'Roboto',
                                                fontWeight: 'bold',
                                            }}>
                                            {product.name}
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 18,
                                                color: COLORS.primary,

                                                fontFamily: 'Roboto',
                                                backgroundColor: 'white',
                                                alignSelf: 'flex-start',
                                                paddingVertical: 5,
                                                paddingHorizontal: 15,
                                                borderRadius: 15,
                                                borderColor: COLORS.primary,
                                                borderWidth: 1.5,
                                                fontWeight: 700,
                                            }}>
                                            {product.productCategory}
                                        </Text>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                            }}>
                                            <Text
                                                style={{
                                                    fontSize: 20,

                                                    fontFamily: 'Roboto',
                                                }}>
                                                {product.productPrice.toLocaleString('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND',
                                                })}
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: 18,
                                                    fontFamily: 'Roboto',
                                                }}>
                                                x{product.boughtQuantity}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            ))}

                            <View
                                style={{
                                    paddingHorizontal: 20,
                                    paddingBottom: 20,
                                    marginTop: 20,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}>
                                <Text
                                    style={{
                                        fontSize: 20,
                                        fontFamily: 'Roboto',
                                        color: 'black',
                                    }}>
                                    Tổng cộng :
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 20,
                                        color: 'red',
                                        fontFamily: 'Roboto',
                                        fontWeight: 'bold',
                                    }}>
                                    {item.totalPrice.toLocaleString('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    })}
                                </Text>
                            </View>
                        </View>
                        {/* ********************* */}

                        {/* Detail information */}
                        <View
                            style={{
                                backgroundColor: 'white',
                                padding: 20,
                                marginTop: 20,
                                marginBottom: 20,
                            }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 10,
                                    marginBottom: 20,
                                }}>
                                <Text
                                    style={{
                                        fontSize: 22,
                                        fontFamily: 'Roboto',
                                        color: 'black',
                                        fontWeight: 'bold',
                                    }}>
                                    Thanh toán
                                </Text>
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 15,
                                    paddingTop: 20,
                                    borderTopColor: '#decbcb',
                                    borderTopWidth: 0.75,
                                    justifyContent: 'space-between',
                                }}>
                                <Text
                                    style={{ fontSize: 20, fontFamily: 'Roboto', color: 'black' }}>
                                    Trạng thái
                                </Text>
                                <Text style={{ fontSize: 20, fontFamily: 'Roboto' }}>
                                    {item.paymentStatus === 0
                                        ? 'Chưa thanh toán'
                                        : 'Đã thanh toán'}
                                </Text>
                            </View>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 15,
                                    paddingTop: 20,

                                    justifyContent: 'space-between',
                                }}>
                                <Text
                                    style={{ fontSize: 20, fontFamily: 'Roboto', color: 'black' }}>
                                    Phương thức
                                </Text>
                                <Text style={{ fontSize: 20, fontFamily: 'Roboto' }}>
                                    {item.paymentMethod === 0 ? 'COD' : 'VN Pay'}
                                </Text>
                            </View>
                        </View>

                        {/* ******************* */}

                        {/* Price information */}
                        <View
                            style={{
                                backgroundColor: 'white',
                                padding: 20,
                            }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 10,
                                    marginBottom: 20,
                                }}>
                                <Text
                                    style={{
                                        fontSize: 22,
                                        fontFamily: 'Roboto',
                                        color: 'black',
                                        fontWeight: 'bold',
                                    }}>
                                    Giá tiền
                                </Text>
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 15,
                                    paddingTop: 20,
                                    justifyContent: 'space-between',
                                    borderTopColor: '#decbcb',
                                    borderTopWidth: 0.75,
                                }}>
                                <Text
                                    style={{ fontSize: 20, fontFamily: 'Roboto', color: 'black' }}>
                                    Tổng tiền sản phẩm:
                                </Text>
                                <Text style={{ fontSize: 20, fontFamily: 'Roboto' }}>
                                    {item.totalPrice.toLocaleString('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    })}
                                </Text>
                            </View>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 15,
                                    paddingVertical: 15,
                                    justifyContent: 'space-between',
                                }}>
                                <Text
                                    style={{ fontSize: 20, fontFamily: 'Roboto', color: 'black' }}>
                                    Phí giao hàng:
                                </Text>
                                <Text style={{ fontSize: 20, fontFamily: 'Roboto' }}>
                                    {item.shippingFee.toLocaleString('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    })}
                                </Text>
                            </View>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 15,
                                    paddingBottom: 15,
                                    justifyContent: 'space-between',
                                }}>
                                <Text
                                    style={{ fontSize: 20, fontFamily: 'Roboto', color: 'black' }}>
                                    Giá đã giảm:
                                </Text>
                                <Text style={{ fontSize: 20, fontFamily: 'Roboto' }}>
                                    {item.totalDiscountPrice.toLocaleString('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    })}
                                </Text>
                            </View>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 15,
                                    justifyContent: 'space-between',
                                }}>
                                <Text
                                    style={{ fontSize: 20, fontFamily: 'Roboto', color: 'black' }}>
                                    Tổng cộng:
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 20,
                                        fontFamily: 'Roboto',
                                        color: 'red',
                                        fontWeight: 'bold',
                                    }}>
                                    {(item.totalPrice - item.totalDiscountPrice).toLocaleString(
                                        'vi-VN',
                                        {
                                            style: 'currency',
                                            currency: 'VND',
                                        },
                                    )}
                                </Text>
                            </View>
                        </View>
                        {/* ******************** */}
                    </ScrollView>
                )}
            </View>
            {item?.status === 3 && isScaned === true && (
                <View
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: 'white',
                        borderTopColor: 'transparent',
                        height: 70,
                        width: '100%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 20,
                        elevation: 10,
                    }}>
                    <View style={{ width: '95%' }}>
                        <TouchableOpacity
                            onPress={() => {
                                setModalVisible(true);
                            }}
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: COLORS.primary,
                                paddingVertical: 10,
                                width: '100%',
                                borderRadius: 30,
                            }}>
                            <Text
                                style={{
                                    fontSize: 18,
                                    color: 'white',
                                    fontFamily: 'Roboto',
                                    fontWeight: 'bold',
                                }}>
                                Xác nhận đơn hàng
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {item?.status === 3 && !isScaned && (
                <View
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: 'white',
                        borderTopColor: 'transparent',
                        height: 70,
                        width: '100%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 20,
                        elevation: 10,
                    }}>
                    <View style={{ width: '95%' }}>
                        <TouchableOpacity
                            onPress={() => {
                                confirmOrder(false);
                            }}
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: COLORS.red,
                                paddingVertical: 10,
                                width: '100%',
                                borderRadius: 30,
                            }}>
                            <Text
                                style={{
                                    fontSize: 18,
                                    color: 'white',
                                    fontFamily: 'Roboto',
                                    fontWeight: 'bold',
                                }}>
                                Giao hàng thất bại
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <TouchableOpacity
                    onPress={() => setModalVisible(!modalVisible)}
                    style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}>
                            <Text
                                style={{
                                    color: 'black',
                                    fontFamily: FONTS.fontFamily,
                                    fontSize: 20,
                                    fontWeight: 700,
                                    textAlign: 'center',
                                    paddingBottom: 20,
                                }}>
                                Xác nhận đơn hàng
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    setModalVisible(!modalVisible);
                                }}>
                                <Image
                                    resizeMode="contain"
                                    style={{
                                        width: 20,
                                        height: 20,
                                        tintColor: 'grey',
                                    }}
                                    source={icons.close}
                                />
                            </TouchableOpacity>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                marginTop: '5%',
                            }}>
                            <TouchableOpacity
                                style={{
                                    width: '50%',
                                    paddingHorizontal: 15,
                                    paddingTop: 10,
                                    backgroundColor: 'white',
                                    borderRadius: 10,
                                    borderColor: COLORS.red,
                                    borderWidth: 0.5,
                                    marginRight: '2%',
                                }}
                                onPress={() => {
                                    confirmOrder(false);
                                    setModalVisible(!modalVisible);
                                }}>
                                <Text
                                    style={{
                                        color: COLORS.red,
                                        fontWeight: 'bold',
                                        textAlign: 'center',
                                    }}>
                                    Giao hàng thất bại
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{
                                    width: '50%',
                                    paddingHorizontal: 15,
                                    paddingTop: 10,
                                    backgroundColor: COLORS.primary,
                                    borderRadius: 10,
                                }}
                                onPress={() => {
                                    confirmOrder(true);
                                    setModalVisible(!modalVisible);
                                }}>
                                <Text style={styles.textStyle}>
                                    Giao hàng thành công
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>

            <Modal
                animationType="fade"
                transparent={true}
                visible={errorModalVisible}
                onRequestClose={() => {
                    setErrorModalVisible(!errorModalVisible);
                    fetchOrderDetails();
                    setLoading(false);
                }}>
                <TouchableOpacity
                    onPress={() => {
                        setErrorModalVisible(!errorModalVisible);
                        fetchOrderDetails();
                        setLoading(false);
                    }
                    }
                    style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}>
                            <Text
                                style={{
                                    color: 'black',
                                    fontFamily: FONTS.fontFamily,
                                    fontSize: 20,
                                    fontWeight: 700,
                                    textAlign: 'center',
                                    paddingBottom: 20,
                                }}>
                                Thông báo hệ thống
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    setErrorModalVisible(!errorModalVisible);
                                }}>
                                <Image
                                    resizeMode="contain"
                                    style={{
                                        width: 20,
                                        height: 20,
                                        tintColor: 'grey',
                                    }}
                                    source={icons.close}
                                />
                            </TouchableOpacity>
                        </View>
                        <View>
                            <Text
                                style={{
                                    fontSize: 18,
                                    color: 'black',
                                }}
                            >
                                {alertText}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
            {loading && <LoadingScreen />}
        </>
    );
};

export default OrderDetails;

const styles = StyleSheet.create({

    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
        backgroundColor: 'rgba(50,50,50,0.5)',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});