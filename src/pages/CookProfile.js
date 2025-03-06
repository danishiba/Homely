import React, { useState, useEffect } from "react";
import { auth, firestore } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import AddDish from "../components/AddDish";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import "./profile.css";


const CookProfile = () => {
  const [cookData, setCookData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddDish, setShowAddDish] = useState(false);
  const [dishes, setDishes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCookData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate("/login");
          return;
        }

        // Fetch cook's profile data
        const userDocRef = doc(firestore, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists() && userDoc.data().role === "cook") {
          setCookData(userDoc.data());

          // Fetch cook's dishes
          await fetchDishes(user.uid);
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching cook data:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchCookData();
  }, [navigate]);

  // Fetch dishes function
  const fetchDishes = async (cookId) => {
    try {
      const dishesQuery = query(
        collection(firestore, "dishes"),
        where("cookId", "==", cookId)
      );
      const dishesSnapshot = await getDocs(dishesQuery);
      const dishList = dishesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDishes(dishList);
    } catch (error) {
      console.error("Error fetching dishes:", error);
    }
  };

  // Callback to refresh dishes after adding a new one
  const handleDishAdded = () => {
    fetchDishes(auth.currentUser.uid);
    setShowAddDish(false); // Close form after adding a dish
  };

  // Handle cancel action
  const handleCancel = () => {
    setShowAddDish(false); // Close AddDish form and return to profile
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="profile">
      <h2>Cook Profile</h2>
      <p><strong>Name:</strong> {cookData.name}</p>
      <p><strong>Email:</strong> {cookData.email}</p>

      {/* Toggle AddDish form */}
      <button onClick={() => setShowAddDish((prev) => !prev)}>
        {showAddDish ? "Close" : "Add Dish"}
      </button>

      {/* AddDish form (handles cancel action) */}
      {showAddDish && (
        <AddDish cookId={auth.currentUser.uid} onDishAdded={handleDishAdded} onCancel={handleCancel} />
      )}

      {/* Display added dishes */}
      <h3>Your Dishes</h3>
      {dishes.length > 0 ? (
        <ul>
          {dishes.map((dish) => (
            <li key={dish.id}>
              <img src={dish.imageUrl} alt={dish.name} width="50" height="50" />
              {dish.name} - ${dish.price}
            </li>
          ))}
        </ul>
      ) : (
        <p>No dishes added yet.</p>
      )}
    </div>
  );
};

export default CookProfile;
