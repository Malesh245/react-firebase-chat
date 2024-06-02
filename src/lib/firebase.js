import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "reactchat-5aded.firebaseapp.com",
  projectId: "reactchat-5aded",
  storageBucket: "reactchat-5aded.appspot.com",
  messagingSenderId: "613529599480",
  appId: "1:613529599480:web:e086de9363e931ac762a0d",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
