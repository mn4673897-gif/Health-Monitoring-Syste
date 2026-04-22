import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDnDYwW1xhuTvK3U6DqthhH468kGlF0fYU",
    authDomain: "health-monitoring-22a98.firebaseapp.com",
    projectId: "health-monitoring-22a98",
    storageBucket: "health-monitoring-22a98.firebasestorage.app",
    messagingSenderId: "617570428934",
    appId: "1:617570428934:web:5080502340423fdbefbb87",
    measurementId: "G-1HF7JKRCJH"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);