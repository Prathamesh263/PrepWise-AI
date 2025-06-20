// // Import the functions you need from the SDKs you need
// import { initializeApp,getApp,getApps } from "firebase/app";
// import {getAuth , setPersistence ,browserLocalPersistence} from "firebase/auth";
// import {getFirestore} from "firebase/firestore";

// const firebaseConfig = {
//     apiKey: "AIzaSyDS4-z--w47iUlNFxbFca52KKHFdldxKqE",
//     authDomain: "mock-interview-c16d4.firebaseapp.com",
//     projectId: "mock-interview-c16d4",
//     storageBucket: "mock-interview-c16d4.firebasestorage.app",
//     messagingSenderId: "147587489203",
//     appId: "1:147587489203:web:75d39576e3cf3c7de2ffc6",
//     measurementId: "G-YRN7R03ZNH"
// };

// const app = !getApps().length ? initializeApp(firebaseConfig):getApp();
// export const auth = getAuth(app);
// export const db = getFirestore(app);
// (async () => {
//     try {
//         await setPersistence(auth, browserLocalPersistence);
//         console.log("Auth persistence set to LOCAL");
//     } catch (error) {
//         console.error("Failed to set persistence:", error);
//     }
// })();

// Import the functions you need from the SDKs you need
import { initializeApp , getApp, getApps} from "firebase/app";
import {getAuth , setPersistence ,browserLocalPersistence} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDS4-z--w47iUlNFxbFca52KKHFdldxKqE",
  authDomain: "mock-interview-c16d4.firebaseapp.com",
  projectId: "mock-interview-c16d4",
  storageBucket: "mock-interview-c16d4.firebasestorage.app",
  messagingSenderId: "147587489203",
  appId: "1:147587489203:web:75d39576e3cf3c7de2ffc6",
  measurementId: "G-YRN7R03ZNH"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig):getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
(async () => {
    try {
        await setPersistence(auth, browserLocalPersistence);
        console.log("Auth persistence set to LOCAL");
    } catch (error) {
        console.error("Failed to set persistence:", error);
    }
})();


// const analytics = getAnalytics(app);