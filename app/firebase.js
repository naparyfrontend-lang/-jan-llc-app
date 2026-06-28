import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBRKwRaiJ1Uh657evnTk6-bjZtL00IX__o",
  authDomain: "jan-llc.firebaseapp.com",
  projectId: "jan-llc",
  storageBucket: "jan-llc.firebasestorage.app",
  messagingSenderId: "838887579086",
  appId: "1:838887579086:web:182d8d753fdb70ea355f9f",
  measurementId: "G-VD3Z5YK5Q3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);