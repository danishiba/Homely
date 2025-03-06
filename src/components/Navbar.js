import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig";
import { firestore } from "../firebase/firebaseConfig"; // Ensure correct import
import { getDoc, doc } from "firebase/firestore";
import './Navbar.css';
import logo from "../images/logo1.png";

const Navbar = () => {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRole = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDoc = await getDoc(doc(firestore, "users", user.uid));
          if (userDoc.exists()) {
            setRole(userDoc.data().role); // Fetch role from Firestore
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      }
    };

    fetchUserRole();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      alert("You have been logged out.");
      navigate("/"); // Redirect to signup page after logout
    } catch (error) {
      console.error("Error logging out:", error.message);
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <nav className="navbar-list">
      <ul className="left">
      <Link to="/home">
            <img src={logo} alt="Homely Logo" className="logo" />
          </Link>
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li>
          {role === "cook" ? (
            <Link to="/cookprofile">Profile</Link>
          ) : (
            <Link to="/customerprofile">Profile</Link>
          )}
        </li>
        </ul>
        <ul className="right">
        <li>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
