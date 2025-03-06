import React, { useState, useEffect } from "react";
import { firestore } from '../firebase/firebaseConfig';

const Dishes = () => {
  const [dishes, setDishes] = useState([]);

  useEffect(() => {
    const fetchDishes = async () => {
      const dishSnapshot = await firestore.collection("dishes").get();
      setDishes(dishSnapshot.docs.map(doc => doc.data()));
    };

    fetchDishes();
  }, []);

  const handleOrder = (dishId) => {
    // Order logic for customers
    console.log(`Ordering dish with id: ${dishId}`);
  };

  return (
    <div>
      <h2>Available Dishes</h2>
      {dishes.map((dish) => (
        <div key={dish.id}>
          <h3>{dish.name}</h3>
          <p>{dish.description}</p>
          <button onClick={() => handleOrder(dish.id)}>Order</button>
        </div>
      ))}
    </div>
  );
};

export default Dishes;

