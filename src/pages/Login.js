import React, { useState } from "react";
import { auth, firestore } from "../firebase/firebaseConfig";
import { useNavigate, Link } from "react-router-dom";

// Import necessary Firebase functions
import { signInWithEmailAndPassword } from "firebase/auth";  // Modular approach
import { doc, getDoc } from "firebase/firestore"; // Modular approach for Firestore
import bgImage from '../images/background.jpg';



const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Use the modular signInWithEmailAndPassword
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Use modular Firestore API to fetch user data
      const userDocRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role === 'admin') {
          navigate('/admin');
        } else if (userData.role === 'customer') {
          navigate('/customerprofile');
        } else if (userData.role === 'cook') {
          navigate('/cookprofile');
        } else {
          alert('Role not assigned!');
        }
      } else {
        alert('User data not found');
      }
    } catch (error) {
      console.error('Login failed:', error.message);
      alert(`Login failed. Error: ${error.message}`);
      console.log('Error Code:', error.code);  // Logs the error code (e.g., "auth/user-not-found")
      console.log('Error Message:', error.message); // Logs the error message
    }
  };
  
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundImage: `url(${bgImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}>
      <div className="login" style={{
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        width: "300px",
      }}>
        <h2 style={{ textAlign: "center" }}>Login</h2>
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
          <button
            type="submit"
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "none",
              backgroundColor: "#007bff",
              color: "white",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        </form>
        <p style={{ textAlign: "center" }}>
          Not registered? {" "}
          <Link to="/" style={{ color: "blue", cursor: "pointer" }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
