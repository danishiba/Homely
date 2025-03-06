import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { firestore } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import bgImage from '../images/background.jpg';


const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("customer");
  const navigate = useNavigate();

  const handleSignup = () => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("User signed up:", user);

        setDoc(doc(firestore, "users", user.uid), {
          name,
          email,
          role,
          uid: user.uid,
        })
          .then(() => {
            console.log("User data saved to Firestore");
            alert("Signup successful!");
            navigate("/home");
          })
          .catch((error) => {
            console.error("Error saving data to Firestore:", error);
            alert("Error saving user data!");
          });
      })
      .catch((error) => {
        console.error("Error during signup:", error.message);
        alert(error.message);
      });
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
          <h2 style={{ textAlign: "center" }}>Signup</h2>
          <input
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
          >
            <option value="customer">Customer</option>
            <option value="cook">Cook</option>
          </select>
          <button
            onClick={handleSignup}
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "none",
              backgroundColor: "#007bff",
              color: "white",
              cursor: "pointer",
            }}
          >
            Sign Up
          </button>
          <p style={{ textAlign: "center" }}>
            Already a member? {" "}
            <span
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => navigate("/login")}
            >
              Login here
            </span>
          </p>
        </div>
      </div>
    );
  };

export default Signup;