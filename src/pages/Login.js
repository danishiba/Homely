import React, { useState } from "react";
import { auth, firestore } from "../firebase/firebaseConfig";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import bgImage from '../images/background.jpg';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

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
    }
  };

  return (
    <div style={styles.container}>
      <div className="login" style={styles.loginBox}>
        <h2 style={styles.heading}>Login</h2>
        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Login</button>
        </form>
        <p style={styles.signupText}>
          Not registered? <Link to="/" style={styles.signupLink}>Sign up</Link>
        </p>
      </div>
    </div>
  );
};

// Styles with Responsive Design
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    padding: "20px",
  },
  loginBox: {
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    width: "100%",
    maxWidth: "350px",
    textAlign: "center",
  },
  heading: {
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    width: "100%",
  },
  button: {
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#007bff",
    color: "white",
    fontSize: "1rem",
    cursor: "pointer",
  },
  signupText: {
    fontSize: "0.9rem",
    textAlign: "center",
  },
  signupLink: {
    color: "blue",
    cursor: "pointer",
  },
};

export default Login;
