// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDs-cS5yxN0Ubyv4ZMRtn65RgpyMfg2keE",
  authDomain: "fitcal-8714c.firebaseapp.com",
  projectId: "fitcal-8714c",
  storageBucket: "fitcal-8714c.appspot.com",
  messagingSenderId: "555734430190",
  appId: "1:555734430190:web:259e7db55aa2e803079eff",
  measurementId: "G-ZF3K6QLNNR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;