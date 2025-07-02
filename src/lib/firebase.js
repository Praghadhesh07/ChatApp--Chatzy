// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

console.log('API KEY:', import.meta.env.VITE_API_KEY);


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "chatapp-cec39.firebaseapp.com",
  projectId: "chatapp-cec39",
  storageBucket: "chatapp-cec39.firebasestorage.app",
  messagingSenderId: "670629734938",
  appId: "1:670629734938:web:9d04620da786b3e7eb3fa3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth()
export const db = getFirestore();
export const storage = getStorage()