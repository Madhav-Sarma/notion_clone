import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD4hBlhloQu8o6AOingvDIzNWJpT5mfbLU",
  authDomain: "notion-clone-5f300.firebaseapp.com",
  projectId: "notion-clone-5f300",
  storageBucket: "notion-clone-5f300.firebasestorage.app",
  messagingSenderId: "249938269219",
  appId: "1:249938269219:web:9f7e02cc44fc1bd51c0d96"
};

const app=getApps.length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
export { db };