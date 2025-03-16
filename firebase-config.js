// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";


// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCsDXa7OmJ2wcpaoV7RRJKBh6ithhABp7o",
    authDomain: "aarogya-lekha.firebaseapp.com",
    projectId: "aarogya-lekha",
    storageBucket: "aarogya-lekha.appspot.com",
    messagingSenderId: "253609387970",
    appId: "1:253609387970:web:66adac86ff86d88853185b",
    measurementId: "G-JH2F1H03S6"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };  // Export Firestore database
