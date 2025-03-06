import React, { useState, useEffect } from "react";
import { firestore } from "../firebase/firebaseConfig"; 
import { collection, query, where, getDocs } from "firebase/firestore";

const SearchDishes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [dishes, setDishes] = useState([]);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        let dishesRef = collection(firestore, "dishes"); // Reference to 'dishes' collection
        let q = dishesRef;

        if (searchQuery) {
          q = query(dishesRef, 
            where("name", ">=", searchQuery), 
            where("name", "<=", searchQuery + "\uf8ff")
          );
        }

        const dishSnapshot = await getDocs(q);
        setDishes(dishSnapshot.docs.map((doc) => doc.data()));
      } catch (error) {
        console.error("Error fetching dishes:", error);
      }
    };

    fetchDishes();
  }, [searchQuery]);

  return (
    <div>
      <input 
        type="text" 
        value={searchQuery} 
        onChange={(e) => setSearchQuery(e.target.value)} 
        placeholder="Search for dishes"
      />
      <div>
        {dishes.map((dish, index) => (
          <div key={index}>
            <h3>{dish.name}</h3>
            <p>{dish.description}</p>
            <p>Price: ${dish.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchDishes;
