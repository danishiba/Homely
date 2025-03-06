import React, { useState, useEffect } from "react";
import { firestore, auth } from "../firebase/firebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";
import "./order.css";

const Order = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dish = location.state?.dish || null;

  useEffect(() => {
    if (!dish) {
      console.error("No dish found, redirecting to homepage.");
      navigate("/home");
    }
  }, [dish, navigate]);

  const [totalPrice, setTotalPrice] = useState(0);
  const [deliveryAddress, setDeliveryAddress] = useState("");

  useEffect(() => {
    if (dish) {
      setTotalPrice(dish.price);
    }
  }, [dish]);

  const handlePlaceOrder = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to place an order!");
      return;
    }

    if (!deliveryAddress) {
      alert("Please enter a delivery address.");
      return;
    }

    try {
      await addDoc(collection(firestore, "orders"), {
        customerId: user.uid,
        dishId: dish.id,
        dishName: dish.name,
        total: totalPrice,
        status: "pending",
        orderDate: Timestamp.fromDate(new Date()),
        paymentStatus: "pending",
        deliveryAddress,
      });

      alert("Order placed successfully!");
      navigate("/home"); // Redirect to home after order
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Error placing order. Please try again.");
    }
  };

  return (
    <div className="order-container">
      <h3>Order Summary</h3>
      {dish ? (
        <div className="order-details">
          <p>{dish.name} - {dish.price}</p>
          <h4>Total: {totalPrice}</h4>
          <input
            type="text"
            placeholder="Enter delivery address"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
          />
          <button onClick={handlePlaceOrder} className="place-order-btn">
            Place Order
          </button>
        </div>
      ) : (
        <p>Redirecting...</p>
      )}
    </div>
  );
};

export default Order;