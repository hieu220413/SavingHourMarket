import PushNotification from 'react-native-push-notification';

PushNotification.configure({
  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function (notification) {
    console.log('Local Notification:', notification);
  },
  popInitialNotification: true,
  requestPermissions: true,
});

PushNotification.createChannel(
  {
    channelId: 'channel-id',
    channelName: 'my channel',
    channelDescription: 'A channel for notification',
    playSound: true,
    soundName: 'default',
    importance: 10,
    vibrate: true,
    vibration: 1000,
  },
  created => console.log(`channel created ${created}`),
);

export const LocalNotification = () => {
  PushNotification.localNotification({
    channelId: 'channel-id',
    channelName: 'my channel',
    autoCancel: false,
    bigText:
      'This is local notification demo from react-native, it will show when expanded',
    subText: 'Local notification demo',
    title: 'Local notification title',
    message: 'Hey, expand me to see more',
    vibrate: true,
    vibration: 300,
    playSound: true,
    soundName: 'default',
    action: '["Yes","No"]',
  });
};
