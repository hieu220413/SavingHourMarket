/* eslint-disable prettier/prettier */
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

export const notificationListener = () => {
  // Assume a message-notification contains a "type" property in the data payload of the screen to open

  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
  });

  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
      }
    });
};

export function checkSystemState(navigation) {
  database().ref(`systemStatus`).off('value');
  database()
    .ref(`systemStatus`)
    .on(
      'value',
      async snapshot => {
        console.log('System status: ', snapshot.val());
        if (snapshot.val() === 0) {
          if (auth().currentUser) {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Start' }],
          });
          }
        }
      },
      error => {
        console.error(error);
      },
    );
}
