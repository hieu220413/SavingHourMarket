/* eslint-disable prettier/prettier */
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';


export function checkSystemState() {
  database().ref(`systemStatus`).off('value');
  database()
    .ref(`systemStatus`)
    .on(
      'value',
      async snapshot => {
        console.log('System status: ', snapshot.val());
        if (snapshot.val() === 0) {
          if (auth().currentUser) {
            await auth().signOut();
          }
        }
      },
      error => {
        console.error(error);
      },
    );
}
