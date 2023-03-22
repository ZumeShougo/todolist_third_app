// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFireStore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDGa1wjtjecg2WsIcQ5zOj-1hpIcDfncGM",
  authDomain: "todolist-third-app.firebaseapp.com",
  projectId: "todolist-third-app",
  storageBucket: "todolist-third-app.appspot.com",
  messagingSenderId: "1066843570327",
  appId: "1:1066843570327:web:3c910cb908fd4b3940e9d2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFireStore(app);