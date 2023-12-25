import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import PushNotification from 'react-native-push-notification';

const RemotePushController = () => {
  useEffect(() => {
    PushNotification.configure({
      onRegister: function (token) {
        console.log('token', token);
      },

      onNotification: function (notification) {
        console.log('Remote controller =>', notification);
      },
      senderID: '857253936194',
      popInitialNotification: true,
      requestPermissions: true,
    });
  }, []);
  return null;
};

export default RemotePushController;
