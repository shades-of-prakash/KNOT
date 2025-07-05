// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import dotenv from "dotenv"

dotenv.config();

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "svgs-405d5.firebaseapp.com",
  projectId: "svgs-405d5",
  storageBucket: "svgs-405d5.appspot.com",
  messagingSenderId: "670144861835",
  appId: "1:670144861835:web:8418208e9f8ec831f3668e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const bucket = getStorage(app);
