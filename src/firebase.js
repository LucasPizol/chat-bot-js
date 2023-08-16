// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import * as firestore from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyADDEpLAZ8Iq8cEfXr5FBxzYgks_mlo-zc",
  authDomain: "projeto-moura-2.firebaseapp.com",
  projectId: "projeto-moura-2",
  storageBucket: "projeto-moura-2.appspot.com",
  messagingSenderId: "275539079296",
  appId: "1:275539079296:web:3fc4c56969f9840ad17665",
  measurementId: "G-CJFWJEY1R4",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = firestore.getFirestore(app);
