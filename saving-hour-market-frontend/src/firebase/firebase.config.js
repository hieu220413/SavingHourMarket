// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCwMbYNwd_Z7qSJ8oyXKdxjF57iolO4UUE",
  authDomain: "capstone-project-398104.firebaseapp.com",
  databaseURL:
    "https://capstone-project-398104-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "capstone-project-398104",
  storageBucket: "capstone-project-398104.appspot.com",
  messagingSenderId: "857253936194",
  appId: "1:857253936194:web:d8d1fc0f459f92f87501db",
  measurementId: "G-D2QD50K8V6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
