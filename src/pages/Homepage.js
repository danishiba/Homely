import React, { useState, useEffect } from "react";
import { firestore } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./Homepage.css";

const Homepage = () => {
  const [dishes, setDishes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const dishesCollection = collection(firestore, "dishes");
        const dishesSnapshot = await getDocs(dishesCollection);
        const dishesList = dishesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDishes(dishesList);
      } catch (error) {
        console.error("Error fetching dishes:", error);
      }
    };

    fetchDishes();
  }, []);

  const handleOrderNow = (dish) => {
    navigate("/order", { state: { dish } });
  };

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      navigate("/search", { state: { searchQuery } });
    }
  };

  return (
    <div>
      <section className="hero-section">
        <div className="hero-text">
          <h1 className="hero-heading">Discover Homely Dishes Near You</h1>
          <p className="hero-subheading">Freshly cooked meals delivered to your doorstep</p>
        </div>
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search for dishes or restaurants" 
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="search-btn" onClick={handleSearch}>Search</button>
        </div>
      </section>

      <section className="featured-dishes">
        <h2 className="section-heading">Featured Dishes</h2>
        <div className="dishes-container">
          {dishes.length > 0 ? (
            dishes.map((dish) => (
              <div className="dish-card" key={dish.id}>
                <img src={dish.imageUrl || "https://via.placeholder.com/150"} alt={dish.name} className="dish-image" />
                <div className="dish-details">
                  <h3 className="dish-name">{dish.name}</h3>
                  <p className="dish-description">{dish.description}</p>
                  <span className="dish-price">{dish.price}</span>
                  <button className="order-btn" onClick={() => handleOrderNow(dish)}>Order Now</button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-dishes">No dishes available</p>
          )}
        </div>
      </section>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-logo">
            <img src="/logo-footer.png" alt="Homely" className="logo" />
          </div>
          <div className="footer-links">
            <a href="#about" className="footer-link">About</a>
            <a href="#terms" className="footer-link">Terms of Service</a>
            <a href="#privacy" className="footer-link">Privacy Policy</a>
          </div>
        </div>
        <p className="footer-copy">© 2025 Homely. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Homepage;
