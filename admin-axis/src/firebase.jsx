// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAfCxtKShW2HLUm5ALY9g6nKFBCa8TViJg",
  authDomain: "axixs-of-desire.firebaseapp.com",
  projectId: "axixs-of-desire",
  storageBucket: "axixs-of-desire.appspot.com",
  messagingSenderId: "259022488806",
  appId: "1:259022488806:web:0360170f9e86543cf66727",
  measurementId: "G-HFF2029H9K"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);