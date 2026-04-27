// Firebase Compat SDK — works with plain <script> tags (no module/server needed)
const firebaseConfig = {
    apiKey: "AIzaSyDnDYwW1xhuTvK3U6DqthhH468kGlF0fYU",
    authDomain: "health-monitoring-22a98.firebaseapp.com",
    databaseURL: "https://health-monitoring-22a98-default-rtdb.firebaseio.com",
    projectId: "health-monitoring-22a98",
    storageBucket: "health-monitoring-22a98.firebasestorage.app",
    messagingSenderId: "617570428934",
    appId: "1:617570428934:web:5080502340423fdbefbb87",
    measurementId: "G-1HF7JKRCJH"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services — used globally in app.js
const db = firebase.database();
const auth = firebase.auth();
