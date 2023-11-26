import {View, Text} from 'react-native';
import React from 'react';
import Modal, {
  ModalFooter,
  ModalButton,
  ScaleAnimation,
} from 'react-native-modals';
import {COLORS} from '../constants/theme';

const AccountDisable = ({
  openAccountDisableModal,
  setOpenAccountDisableModal,
  pickupPoint,
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
            onPress={async () => {
              setOpenAccountDisableModal(false);
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
          Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng đăng nhập tài khoản khác
        </Text>
      </View>
    </Modal>
  );
};

export default AccountDisable;
