import { getAuth, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyChijl3mTvl374hSpyWpF9ZCvMq3rGKYCY",
  authDomain: "homel-eb6a1.firebaseapp.com",
  projectId: "homel-eb6a1",
  storageBucket: "homel-eb6a1.appspot.com",  // Corrected storageBucket URL
  messagingSenderId: "80706500189",
  appId: "1:80706500189:web:b3199837e4b76edd4b7fb4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);

// Function to handle phone number signup with OTP
export const signUpWithPhone = async (phoneNumber, recaptchaVerifier) => {
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    return confirmationResult;  // Returns confirmationResult to handle OTP verification
  } catch (error) {
    console.error("Error during phone signup:", error);
    throw error;
  }
};

// Function to verify OTP and sign in the user
export const verifyOTP = async (verificationId, otp) => {
  try {
    const credential = PhoneAuthProvider.credential(verificationId, otp);
    const userCredential = await signInWithCredential(auth, credential);
    return userCredential;  // Returns the userCredential
  } catch (error) {
    console.error("Error during OTP verification:", error);
    throw error;
  }
};

// Function to sign the user in using email and password
export const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;  // Returns the userCredential
  } catch (error) {
    console.error("Error during email login:", error);
    throw error;
  }
};

// Function to sign the user up using email and password
export const signUpWithEmail = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential;  // Returns the userCredential
  } catch (error) {
    console.error("Error during email signup:", error);
    throw error;
  }
};

// Function to sign out the user
export const signOutUser = async () => {
  try {
    await signOut(auth);
    console.log("User signed out");
  } catch (error) {
    console.error("Error during sign out:", error);
    throw error;
  }
};

// Function to check if the user is currently logged in
export const checkAuthState = (callback) => {
  onAuthStateChanged(auth, (user) => {
    callback(user);  // Passes the user object if logged in, or null if logged out
  });
};

// Function to get the current authenticated user's UID
export const getCurrentUserUID = () => {
  const user = auth.currentUser;
  return user ? user.uid : null;
};

export { auth };
