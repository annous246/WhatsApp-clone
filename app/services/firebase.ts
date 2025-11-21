import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getAuth,
  getReactNativePersistence,
} from "firebase/auth";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBRMu4q5WhbwpT7VDG5ahZhsin9J-IsYQg",
  authDomain: "whatsapp-7eed6.firebaseapp.com",
  projectId: "whatsapp-7eed6",
  storageBucket: "whatsapp-7eed6.firebasestorage.app",
  messagingSenderId: "824562572494",
  appId: "1:824562572494:web:b2aca9331ee0ae2a35849f",
  measurementId: "G-H9BGCKF4V1",
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getFirestore(app);
