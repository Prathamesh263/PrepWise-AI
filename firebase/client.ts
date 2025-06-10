// Import the functions you need from the SDKs you need
import { initializeApp,getApp,getApps } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCTz5K5uHgYY8JO-WgNBet7M2gQNGcj5JM",
    authDomain: "prepwise-7b278.firebaseapp.com",
    projectId: "prepwise-7b278",
    storageBucket: "prepwise-7b278.firebasestorage.app",
    messagingSenderId: "791379704644",
    appId: "1:791379704644:web:2430ce60072ce3e3f43511",
    measurementId: "G-WP89WZWV8R"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig):getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);