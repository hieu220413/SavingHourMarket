// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from 'firebase/storage';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCwMbYNwd_Z7qSJ8oyXKdxjF57iolO4UUE",
  authDomain: "capstone-project-398104.firebaseapp.com",
  databaseURL: "https://capstone-project-398104-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "capstone-project-398104",
  storageBucket: "capstone-project-398104.appspot.com",
  messagingSenderId: "857253936194",
  appId: "1:857253936194:web:d8d1fc0f459f92f87501db",
  measurementId: "G-D2QD50K8V6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const imageDB = getStorage(app);
export const auth = getAuth(app);
