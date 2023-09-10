import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider, getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC1dzAH03UY2BUBzUy5a58PLvnLIert0QI",
  authDomain: "travel-journal-zeus.firebaseapp.com",
  projectId: "travel-journal-zeus",
  storageBucket: "travel-journal-zeus.appspot.com",
  messagingSenderId: "917363085757",
  appId: "1:917363085757:web:03e2d5d3d730ffe91ac2d4",
  measurementId: "G-BB62V264W2",
};

const app = initializeApp(firebaseConfig);
export const provider = new GoogleAuthProvider(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
