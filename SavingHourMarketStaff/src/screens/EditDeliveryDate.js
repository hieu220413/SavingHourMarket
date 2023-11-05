/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import { View, Text, Image } from 'react-native';

import React, { useCallback, useState } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { icons } from '../constants';
import { COLORS } from '../constants/theme';
import { useFocusEffect } from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';
import { format } from 'date-fns';
import { API } from '../constants/api';
import LoadingScreen from '../components/LoadingScreen';
import dayjs from "dayjs";
import Modal, { ModalButton, ModalFooter, ScaleAnimation } from 'react-native-modals';

const EditDeliveryDate = ({ navigation, route }) => {
    const [timeFrameList, setTimeFrameList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedTimeFrame, setSelectedTimeFrame] = useState('');
    const [open, setOpen] = useState(false);
    const [timeFrame, setTimeFrame] = useState(null);
    const [date, setDate] = useState(null);
    const [orderItems, setOrderItems] = useState(route.params.orderItems);
    // console.log(route.params);

    // Check valid 
    const [minDate, setMinDate] = useState(new Date());
    const [maxDate, setMaxDate] = useState(new Date());
    const [cannotChangeDate, setCannotChangeDate] = useState(false);
    const [validateMessage, setValidateMessage] = useState('');
    const [openValidateDialog, setOpenValidateDialog] = useState(false);

    const dayDiffFromToday = expDate => {
        return Math.ceil((expDate - new Date()) / (1000 * 3600 * 24));
    };

    const getDateAfterToday = numberOfDays => {
        const today = new Date();
        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + numberOfDays);
        return nextDate;
    };

    const getMaxDate = expDate => {
        const maxDate = new Date(expDate);
        maxDate.setDate(expDate.getDate() - 1);
        return maxDate;
    };

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            const fetchTimeFrame = () => {
                if (route.params.picked === 0) {
                    fetch(`${API.baseURL}/api/timeframe/getForPickupPoint`)
                        .then(res => res.json())
                        .then(response => {
                            setTimeFrameList(response);
                            setLoading(false);
                        })
                        .catch(err => {
                            console.log(err);
                            setLoading(false);
                        });
                } else {
                    fetch(`${API.baseURL}/api/timeframe/getForHomeDelivery`)
                        .then(res => res.json())
                        .then(response => {
                            setTimeFrameList(response);
                            setLoading(false);
                        })
                        .catch(err => {
                            console.log(err);
                            setLoading(false);
                        });
                }
            };


            // const minExpDateOrderItems = new Date(
            //     Math.min(...orderItems.map(item => Date.parse(item.expiredDate))),
            // );
            // console.log(dayDiffFromToday(minExpDateOrderItems));


            // if (dayDiffFromToday(minExpDateOrderItems) > 3) {
            //     setMinDate(getDateAfterToday(2));
            //     setMaxDate(getMaxDate(minExpDateOrderItems));
            // }
            // if (
            //     dayDiffFromToday(minExpDateOrderItems) === 1 ||
            //     dayDiffFromToday(minExpDateOrderItems) === 2
            // ) {
            //     setMinDate(getDateAfterToday(1));
            //     setMaxDate(getDateAfterToday(1));
            //     setDate(getDateAfterToday(1));
            //     setCannotChangeDate(true);
            // }
            // if (dayDiffFromToday(minExpDateOrderItems) === 3) {
            //     setMinDate(getDateAfterToday(2));
            //     setMaxDate(getDateAfterToday(2));
            //     setDate(getDateAfterToday(2));
            //     setCannotChangeDate(true);
            // }
            fetchTimeFrame();
        }, [route.params.picked]),
    );

    const handleEdit = () => {
        if (!date) {
            setValidateMessage('Vui lòng chọn ngày giao hàng');
            setOpenValidateDialog(true);
            return;
        }

        if (!timeFrame) {
            setValidateMessage('Vui lòng chọn khung giờ');
            setOpenValidateDialog(true);
            return false;
        }
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
                            navigation.goBack()
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
                        Chỉnh sửa ngày/giờ giao hàng
                    </Text>
                </View>
                <ScrollView>
                    {/* Manage Date */}
                    <TouchableOpacity
                        onPress={() => {
                            if (cannotChangeDate) {
                                setValidateMessage(
                                    'Một trong số sản phẩm của bạn sắp hết hạn, chỉ có thể giao vào ngày này !',
                                );
                                setOpenValidateDialog(true);
                                return;
                            }
                            setOpen(true);
                        }}>
                        <View
                            style={{
                                paddingHorizontal: 20,
                                paddingVertical: 20,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                borderTopColor: '#decbcb',
                                borderTopWidth: 0.75,
                                borderBottomWidth: 0.75,
                                borderBottomColor: '#decbcb',
                                backgroundColor: 'white',
                                marginBottom: 20,
                            }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    gap: 10,
                                    alignItems: 'center',
                                    flex: 9,
                                }}>
                                <Image
                                    resizeMode="contain"
                                    style={{ width: 25, height: 25 }}
                                    source={icons.calendar}
                                />
                                <Text
                                    style={{
                                        fontSize: 20,
                                        fontFamily: 'Roboto',
                                        color: 'black',
                                    }}>
                                    {date ? format(date, 'dd-MM-yyyy') : 'Chọn ngày giao'}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <DatePicker
                        modal
                        mode="date"
                        open={open}
                        date={date ? date : minDate}
                        onConfirm={date => {
                            const getDate = new Date();
                            let day = getDate.getDate();
                            let month = getDate.getMonth() + 1;
                            let year = getDate.getFullYear();
                            let currentDate = `${year}-${month}-${day}`;

                            if (dayjs(currentDate).format("YYYY/MM/DD") > dayjs(date).format("YYYY/MM/DD")) {
                                console.log('Không thể chọn ngày giao trước ngày hôm nay');
                                setValidateMessage(
                                    'Không thể chọn ngày giao trước ngày hôm nay',
                                );
                                setOpenValidateDialog(true);
                                return;
                            }

                            setOpen(false);
                            setDate(date);
                        }}
                        onCancel={() => {
                            setOpen(false);
                        }}
                    />
                    {/* Time Frame */}
                    <View style={{ backgroundColor: 'white', padding: 20 }}>
                        <Text
                            style={{
                                fontSize: 20,
                                color: 'black',
                                fontFamily: 'Roboto',
                                fontWeight: 'bold',
                                marginBottom: 20,
                            }}>
                            Khung giờ
                        </Text>
                        {/* Time Frames */}
                        {timeFrameList.map(item => (
                            <TouchableOpacity
                                key={item.id}
                                onPress={() => {
                                    setSelectedTimeFrame(item.id);
                                    setTimeFrame(item);
                                    if (route.params.picked === 0) {
                                        route.params.setTimeFrame(item);
                                    } else {
                                        route.params.setCustomerTimeFrame(item);
                                    }
                                }}
                                style={
                                    item.id === selectedTimeFrame ?
                                        {
                                            paddingVertical: 15,
                                            borderTopColor: '#decbcb',
                                            borderTopWidth: 0.75,
                                            backgroundColor: COLORS.primary,
                                        }
                                        : {
                                            paddingVertical: 15,
                                            borderTopColor: '#decbcb',
                                            borderTopWidth: 0.75,
                                        }
                                }>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: 15,
                                        flex: 1,
                                        justifyContent: 'space-between',
                                        paddingHorizontal: 10,
                                    }}>
                                    <Text
                                        style={
                                            item.id === selectedTimeFrame ?
                                                {
                                                    fontSize: 17,
                                                    color: 'white',
                                                    fontFamily: 'Roboto',
                                                }
                                                : {
                                                    fontSize: 17,
                                                    color: 'black',
                                                    fontFamily: 'Roboto',
                                                }}>
                                        {item.fromHour.slice(0, 5)} đến {item.toHour.slice(0, 5)}
                                    </Text>
                                    <Text
                                        style={
                                            item.id === selectedTimeFrame ?
                                                {
                                                    fontSize: 17,
                                                    color: 'white',
                                                    fontFamily: 'Roboto',
                                                }
                                                : {
                                                    fontSize: 17,
                                                    color: 'black',
                                                    fontFamily: 'Roboto',
                                                }}>
                                        {item.dayOfWeek === 0 && 'Mỗi ngày'}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </View >
            {/* <Modal
                width={0.8}
                visible={openValidateDialog}
                onTouchOutside={() => {
                    setOpenValidateDialog(false);
                }}
                dialogAnimation={
                    new ScaleAnimation({
                        initialValue: 0, // optional
                        useNativeDriver: true, // optional
                    })
                }
                footer={
                    <ModalFooter>
                        <ModalButton
                            textStyle={{ color: 'red' }}
                            text="Đóng"
                            onPress={() => {
                                setOpenValidateDialog(false);
                            }}
                        />
                    </ModalFooter>
                }>
                <View
                    style={{ padding: 20, alignItems: 'center', justifyContent: 'center' }}>
                    <Text
                        style={{
                            fontSize: 20,
                            fontFamily: 'Roboto',
                            color: 'black',
                            textAlign: 'center',
                        }}>
                        {validateMessage}
                    </Text>
                </View>
            </Modal> */}
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
                }}
            >
                <View style={{ width: '95%' }}>
                    <TouchableOpacity
                        onPress={() => {
                            handleEdit();
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
                            Chỉnh sửa
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            {loading && <LoadingScreen />}
        </>
    );
};

export default EditDeliveryDate;