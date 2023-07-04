import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC6kSBqYDM8Q1TuQoCONkL90mIDlzPLPQQ",
  authDomain: "thegamechangers-9d9cc.firebaseapp.com",
  projectId: "thegamechangers-9d9cc",
  storageBucket: "thegamechangers-9d9cc.appspot.com",
  messagingSenderId: "1012792943482",
  appId: "1:1012792943482:web:5755bf8a472bf4a64aecc3",
  measurementId: "G-G4G6CBPTJ3",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);
export const storage = getStorage(app);
