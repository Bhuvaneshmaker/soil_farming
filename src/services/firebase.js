import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { logInfo } from '../utils/logger';

const firebaseConfig = {
    apiKey: "AIzaSyDwA0qEDNrlplbCnvd9eFI9vfcbGdTcMaY",
    authDomain: "soil-farm.firebaseapp.com",
    projectId: "soil-farm",
    storageBucket: "soil-farm.firebasestorage.app",
    messagingSenderId: "1040834864036",
    appId: "1:1040834864036:web:01aef968bd693cacd19731",
    measurementId: "G-BHJ9B4YZVY"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
logInfo('Firebase initialized');

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };