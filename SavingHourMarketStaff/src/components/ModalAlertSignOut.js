import React from 'react';
import {
    Text,
    View,
    Modal,
    Pressable,
    StyleSheet,
} from 'react-native';

export default ModalAlertSignOut = ({
    alertVisible
}) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={alertVisible}>
            <Pressable
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
                                fontSize: 20,
                                fontWeight: 700,
                                textAlign: 'center',
                                paddingBottom: 20,
                            }}>
                            Thông báo
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}>
                        <Text
                            style={{
                                color: 'black',
                                fontSize: 18,
                                fontWeight: 400,
                                paddingBottom: 15,
                            }}>
                            Phiên đăng nhập của bạn đã hết hạn!{'\n'}Bạn sẽ bị thoát ra trong 3 giây!
                        </Text>
                    </View>
                </View>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
    header: {
      flex: 2,
      // backgroundColor: 'orange',
      paddingHorizontal: 20,
      zIndex: 100,
      backgroundColor: 'white',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    body: {
      flex: 11,
      // backgroundColor: 'pink',
      marginTop: 10,
      paddingHorizontal: 20,
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
      width: '90%',
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: '15%',
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
