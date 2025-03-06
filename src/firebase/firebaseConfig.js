// Import necessary Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import Firebase Storage

// Firebase configuration object (use your own config)
const firebaseConfig = {
    apiKey: "AIzaSyChijl3mTvl374hSpyWpF9ZCvMq3rGKYCY",
    authDomain: "homel-eb6a1.firebaseapp.com",
    projectId: "homel-eb6a1",
    storageBucket: "homel-eb6a1.appspot.com",
    messagingSenderId: "80706500189",
    appId: "1:80706500189:web:b3199837e4b76edd4b7fb4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Auth, Firestore, and Storage instances
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app); // Initialize Firebase Storage

export { auth, firestore, storage }; // Export storage too





// apiKey: "AIzaSyChijl3mTvl374hSpyWpF9ZCvMq3rGKYCY",
// authDomain: "homel-eb6a1.firebaseapp.com",
// projectId: "homel-eb6a1",
// storageBucket: "homel-eb6a1.firebasestorage.app",
// messagingSenderId: "80706500189",
// appId: "1:80706500189:web:b3199837e4b76edd4b7fb4"