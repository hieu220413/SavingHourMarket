import {View, Text} from 'react-native';
import React from 'react';
import Modal, {
  ModalFooter,
  ModalButton,
  ScaleAnimation,
} from 'react-native-modals';
import {COLORS} from '../constants/theme';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AccountDisable = ({
  openAccountDisableModal,
  setOpenAccountDisableModal,
  pickupPoint,
  navigation,
}) => {
  return (
    <Modal
      width={0.8}
      visible={openAccountDisableModal}
      dialogAnimation={
        new ScaleAnimation({
          initialValue: 0, // optional
          useNativeDriver: true, // optional
        })
      }
      footer={
        <ModalFooter>
          <ModalButton
            text="Đồng ý"
            textStyle={{color: COLORS.primary}}
            onPress={async () => {
              setOpenAccountDisableModal(false);
              await GoogleSignin.signOut();
              if (auth().currentUser) {
                auth()
                  .signOut()
                  .then(async () => {
                    await AsyncStorage.clear();
                    navigation.navigate('Home');
                  })
                  .catch(e => console.log(e));
              } else {
                await AsyncStorage.clear();
                navigation.navigate('Home');
              }
            }}
          />
        </ModalFooter>
      }>
      <View
        style={{padding: 20, alignItems: 'center', justifyContent: 'center'}}>
        <Text
          style={{
            fontSize: 20,
            fontFamily: 'Roboto',
            color: 'black',
            textAlign: 'center',
          }}>
          Tài khoản của bạn đã bị vô hiệu hóa. Hệ thống sẽ tự động đăng xuất .
          Vui lòng đăng nhập tài khoản khác !
        </Text>
      </View>
    </Modal>
  );
};

export default AccountDisable;
