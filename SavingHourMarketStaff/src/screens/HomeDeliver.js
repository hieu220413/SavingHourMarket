/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Keyboard, Modal } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import { Image } from 'react-native-animatable';
import { icons } from '../constants';
import { COLORS, FONTS } from '../constants/theme';
import { API } from '../constants/api';
import { format } from 'date-fns';
import Empty from '../assets/image/search-empty.png';
import LoadingScreen from '../components/LoadingScreen';

const HomeDeliver = ({ navigation }) => {
    const [initializing, setInitializing] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState(null);
    const orderStatus = [
        { id: 0, display: 'Chờ xác nhận', value: 'PROCESSING', active: false },
        { id: 1, display: 'Đóng gói', value: 'PACKAGING', active: false },
        { id: 2, display: 'Đang giao', value: 'DELIVERING', active: false },
        { id: 3, display: 'Đã giao', value: 'SUCCESS', active: false },
        { id: 4, display: 'Đơn thất bại', value: 'FAIL', active: false },
        { id: 5, display: 'Đã hủy', value: 'CANCEL', active: false, },
    ];

    const deliveryOptions = [
        { id: 0, display: 'Giao hàng tại điểm nhận' },
        { id: 1, display: 'Giao hàng tận nhà' },
    ];

    const [currentOptions, setCurrentOptions] = useState({
        id: 0,
        display: 'Giao hàng tại điểm nhận',
    });

    const [selectItem, setSelectItem] = useState(orderStatus);

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
                    // console.log(e);
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
        fetchOrders(currentOptions.id);
        const subscriber = auth().onAuthStateChanged(
            async userInfo => await onAuthStateChange(userInfo),
        );

        return subscriber;
    }, []);
    const fetchOrders = async (id) => {
        const tokenId = await auth().currentUser.getIdToken();
        if (tokenId) {
            setLoading(true);
            fetch(`${API.baseURL}/api/order/staff/getOrders?${id === 1 ? 'isGrouped=false' : 'isGrouped=true'}&deliveryDateSortType=ASC&page=0&size=10`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${tokenId}`,
                },
            })
                .then(res => res.json())
                .then(respond => {
                    // console.log('item', respond);
                    setOrders(respond);
                    setLoading(false);
                })
                .catch(err => {
                    console.log(err);
                    setLoading(false);
                });
        }
    };

    const handleApplyFilter = async () => {
        setModalVisible(!modalVisible);
        const selected = selectItem.find(item => item.active === true);
        const tokenId = await auth().currentUser.getIdToken();
        if (tokenId) {
            setLoading(true);
            fetch(`${API.baseURL}/api/order/getOrdersForStaff?${currentOptions.id === 0 ? 'isGrouped=false' : 'isGrouped=true'}${selected ? `&orderStatus=${selected.value}` : ''}&page=0&size=10`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${tokenId}`,
                },
            })
                .then(res => res.json())
                .then(respond => {
                    setSelectItem(orderStatus);
                    setOrders(respond);
                    setLoading(false);
                })
                .catch(err => {
                    console.log(err);
                    setLoading(false);
                });
        }
    };

    const handleClear = () => {
        setModalVisible(!modalVisible);
        fetchOrders(currentOptions.id);
    };

    const OrderItem = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('OrderDetails', {
                        id: item.id,
                        picked: currentOptions.id
                    });
                }}
                style={{
                    position: 'relative',
                    margin: 10,
                    backgroundColor: 'white',
                    borderRadius: 10,
                    padding: 20,
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 5,
                }}
            >

                <Text
                    style={{
                        position: 'absolute',
                        top: '10%',
                        right: '5%',
                        backgroundColor: COLORS.light_green,
                        color: COLORS.primary,
                        padding: 10,
                        borderRadius: 10,
                    }}
                >
                    {item?.status === 0 && 'Chờ xác nhận'}
                    {item?.status === 1 && 'Đóng gói'}
                    {item?.status === 3 && 'Đang giao '}
                    {item?.status === 4 && 'Đã Giao'}
                    {item?.status === 5 && 'Giao thất bại'}
                    {item?.status === 6 && 'Đã hủy'}

                </Text>
                <Text
                    style={{
                        fontSize: 18,
                        fontFamily: FONTS.fontFamily,
                        color: 'black',
                        fontWeight: 'bold',
                        paddingBottom: 5,
                        maxWidth: '80%'
                    }}
                >
                    {item?.customer.fullName}
                </Text>

                <Text style={{
                    fontSize: 16,
                    fontFamily: FONTS.fontFamily,
                    color: 'black',
                    paddingBottom: 5,
                }}>
                    SĐT: {item?.customer.phone}
                </Text>
                <Text style={{
                    fontSize: 16,
                    fontFamily: FONTS.fontFamily,
                    color: 'black',
                    paddingBottom: 5,
                }}>
                    Thời gian: {item?.timeFrame
                        ? `${item?.timeFrame?.fromHour.slice(
                            0,
                            5,
                        )} đến ${item?.timeFrame?.toHour.slice(0, 5)}`
                        : ''}
                </Text>
                <Text style={{
                    fontSize: 16,
                    fontFamily: FONTS.fontFamily,
                    color: 'black',
                    paddingBottom: 5,
                }}>
                    Ngày giao: {format(new Date(item?.deliveryDate), 'dd/MM/yyyy')}
                </Text>


                <Text style={{
                    fontSize: 16,
                    fontFamily: FONTS.fontFamily,
                    color: 'black',
                    paddingBottom: 5,
                }}>
                    Địa chỉ: {item?.addressDeliver ? item?.addressDeliver : 'Pickup point Quận 9'}
                </Text>

                <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
                    <View style={{ flex: 1, height: 1.5, backgroundColor: COLORS.primary }} />
                    <View>
                        <Text style={{
                            width: 100, textAlign: 'center', color: COLORS.primary, fontWeight: 'bold', fontSize: 16,
                            fontFamily: FONTS.fontFamily,
                        }}>5 sản phẩm</Text>
                    </View>
                    <View style={{ flex: 1, height: 1.5, backgroundColor: COLORS.primary }} />
                </View>

                <Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text
                            style={{
                                fontSize: 18,
                                lineHeight: 30,
                                color: COLORS.secondary,
                                fontWeight: 700,
                                fontFamily: FONTS.fontFamily,
                                paddingRight: 5,
                            }}
                        >
                            Tổng giá tiền:
                        </Text>

                        <Text
                            style={{
                                maxWidth: '70%',
                                fontSize: 18,
                                lineHeight: 30,
                                color: COLORS.secondary,
                                fontWeight: 700,
                                fontFamily: FONTS.fontFamily,
                            }}>
                            {item.totalPrice.toLocaleString('vi-VN', {
                                currency: 'VND',
                            })}

                        </Text>
                        <Text
                            style={{
                                fontSize: 12,
                                lineHeight: 18,
                                color: COLORS.secondary,
                                fontWeight: 700,
                                fontFamily: FONTS.fontFamily,
                            }}>
                            ₫
                        </Text>
                    </View>
                </Text>

            </TouchableOpacity>
        )
    };

    const ModalItem = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    const newArray = selectItem.map(i => {
                        if (i.id === item.id) {
                            if (i.active === true) {
                                return { ...i, active: false };
                            } else {
                                return { ...i, active: true };
                            }
                        }
                        return { ...i, active: false };
                    });
                    setSelectItem(newArray);

                }}
                style={
                    item.active == true
                        ? {
                            borderColor: COLORS.primary,
                            borderWidth: 1,
                            borderRadius: 10,
                            margin: 5,
                        }
                        : {
                            borderColor: '#c8c8c8',
                            borderWidth: 0.2,
                            borderRadius: 10,
                            margin: 5,
                        }
                }>
                <Text
                    style={
                        item.active == true
                            ? {
                                width: 150,
                                paddingHorizontal: 20,
                                paddingVertical: 10,
                                textAlign: 'center',
                                color: COLORS.primary,
                                fontFamily: FONTS.fontFamily,
                                fontSize: 12,
                            }
                            : {
                                width: 150,
                                paddingHorizontal: 20,
                                paddingVertical: 10,
                                textAlign: 'center',
                                color: 'black',
                                fontFamily: FONTS.fontFamily,
                                fontSize: 12,
                            }
                    }>
                    {item.display}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <View style={styles.areaAndLogout}>
                            <View style={styles.area}>
                                <Text style={{ fontSize: 16, fontFamily: FONTS.fontFamily, }}>Khu vực:</Text>
                                <TouchableOpacity>
                                    <View style={styles.pickArea}>
                                        <View style={styles.pickAreaItem}>
                                            <Image
                                                resizeMode="contain"
                                                style={{ width: 20, height: 20, tintColor: COLORS.primary }}
                                                source={icons.location}
                                            />
                                            <Text
                                                style={{
                                                    fontSize: 18,
                                                    fontFamily: 'Roboto',
                                                    color: 'black',
                                                }}>
                                                Quận 9
                                            </Text>
                                        </View>

                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.logout}>
                                <TouchableOpacity>
                                    <Image
                                        resizeMode="contain"
                                        style={{ width: 38, height: 38 }}
                                        source={icons.userCircle}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View
                            style={{ flexDirection: 'row' }}
                        >
                            {/*  */}
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {deliveryOptions.map((item, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => {
                                            setCurrentOptions(item);
                                            fetchOrders(item.id);
                                        }}>
                                        <View
                                            style={[
                                                {
                                                    paddingTop: 15,
                                                    paddingHorizontal: 8,
                                                    paddingBottom: 15,
                                                },
                                                currentOptions.display === item.display && {
                                                    borderBottomColor: COLORS.primary,
                                                    borderBottomWidth: 2,
                                                },
                                            ]}>
                                            <Text
                                                style={{
                                                    fontFamily: 'Roboto',
                                                    fontSize: 16,
                                                    color:
                                                        currentOptions.display === item.display
                                                            ? COLORS.primary
                                                            : 'black',
                                                    fontWeight:
                                                        currentOptions.display === item.display ? 'bold' : 400,
                                                }}>
                                                {item.display}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                            {/* Filter */}
                            <TouchableOpacity
                                onPress={() => {
                                    setModalVisible(true);
                                }}>
                                <Image
                                    resizeMode="contain"
                                    style={{
                                        height: 45,
                                        tintColor: COLORS.primary,
                                        width: 30,
                                        marginLeft: '1%',
                                    }}
                                    source={icons.filter}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.body}>
                        <Text
                            style={{
                                fontFamily: FONTS.fontFamily,
                                color: 'black',
                                fontSize: 20,
                                marginLeft: 10,
                                paddingBottom: 20,
                            }}
                        >
                            Danh sách các đơn hàng
                        </Text>
                        <ScrollView
                            contentContainerStyle={{
                                paddingBottom: 100,
                            }}
                        >
                            {orders?.map((item, index) => (
                                <OrderItem item={item} key={index} />
                            ))}

                            {orders?.length === 0 && (
                                <View style={{ alignItems: 'center', marginTop: '20%' }}>
                                    <Image
                                        style={{ width: 200, height: 200 }}
                                        resizeMode="contain"
                                        source={Empty}
                                    />
                                    <Text
                                        style={{
                                            fontSize: 20,
                                            fontFamily: 'Roboto',
                                            fontWeight: 'bold',
                                        }}>
                                        Không tìm thấy sản phẩm
                                    </Text>
                                </View>
                            )}

                        </ScrollView>

                    </View>
                    {/* Modal filter */}
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
                                        Bộ lọc tìm kiếm
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
                                <Text
                                    style={{
                                        color: 'black',
                                        fontFamily: FONTS.fontFamily,
                                        fontSize: 16,
                                        fontWeight: 700,
                                    }}>
                                    Lọc theo trạng thái đơn hàng
                                </Text>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        flexWrap: 'wrap',
                                        marginVertical: 10,
                                    }}>
                                    {selectItem.map((item, index) => (
                                        <ModalItem item={item} key={index} />
                                    ))}
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
                                            paddingVertical: 10,
                                            backgroundColor: 'white',
                                            borderRadius: 10,
                                            borderColor: COLORS.primary,
                                            borderWidth: 0.5,
                                            marginRight: '2%',
                                        }}
                                        onPress={handleClear}>
                                        <Text
                                            style={{
                                                color: COLORS.primary,
                                                fontWeight: 'bold',
                                                textAlign: 'center',
                                            }}>
                                            Thiết lập lại
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={{
                                            width: '50%',
                                            paddingHorizontal: 15,
                                            paddingVertical: 10,
                                            backgroundColor: COLORS.primary,
                                            color: 'white',
                                            borderRadius: 10,
                                        }}
                                        onPress={handleApplyFilter}>
                                        <Text style={styles.textStyle}>Áp dụng</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </Modal>
                </View>
            </TouchableWithoutFeedback>
            {loading && <LoadingScreen />}
        </>

    );
};

export default HomeDeliver;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        flex: 1.5,
        paddingHorizontal: 20,
    },
    body: {
        flex: 6,
    },
    areaAndLogout: {
        paddingTop: 10,
        flexDirection: 'row',
    },
    pickArea: {
        paddingVertical: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    area: {
        flex: 7,
        // backgroundColor: 'white',
    },
    logout: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginLeft: 10,
    },
    pickAreaItem: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        width: '80%',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
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
