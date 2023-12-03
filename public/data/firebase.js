// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCojL0SO7A6sA6PyON7OAKDMlh4XGKu00M",
  authDomain: "child-care-management-c9083.firebaseapp.com",
  projectId: "child-care-management-c9083",
  storageBucket: "child-care-management-c9083.appspot.com",
  messagingSenderId: "744419018816",
  appId: "1:744419018816:web:5f2a12b020776a713637a5",
  measurementId: "G-L44HTV2J0S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export { app };
