// src/components/OrderDetails.js
import React, { useState, useEffect } from "react";
import { auth, firestore } from "../firebase/firebaseConfig"; // ✅ Use `firestore`
import { doc, getDoc, updateDoc } from "firebase/firestore"; // ✅ Modular Firestore functions

const OrderDetails = ({ orderId }) => {
  const [order, setOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [userRole, setUserRole] = useState(null); // Store user role

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const orderRef = doc(firestore, "orders", orderId); // ✅ Firestore reference
        const orderSnap = await getDoc(orderRef); // ✅ Get document snapshot

        if (orderSnap.exists()) {
          setOrder({ id: orderSnap.id, ...orderSnap.data() });
          setNewStatus(orderSnap.data().status);
        } else {
          console.error("Order not found");
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    const fetchUserRole = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userRef = doc(firestore, "users", user.uid); // ✅ Reference to user doc
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setUserRole(userSnap.data().role);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      }
    };

    fetchOrderDetails();
    fetchUserRole();
  }, [orderId]);

  const handleStatusChange = async () => {
    if (!order) return;

    try {
      const orderRef = doc(firestore, "orders", order.id); // ✅ Reference to Firestore document
      await updateDoc(orderRef, { status: newStatus }); // ✅ Update Firestore document
      setOrder((prevOrder) => ({ ...prevOrder, status: newStatus })); // ✅ Update UI
      alert("Order status updated!");
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Error updating order status.");
    }
  };

  if (!order) return <p>Loading...</p>;

  return (
    <div>
      <h3>Order Details</h3>
      <p><strong>Order ID:</strong> {order.id}</p>
      <p><strong>Status:</strong> {order.status}</p>
      <p><strong>Total:</strong> ${order.total}</p>
      <p><strong>Order Date:</strong> {order.orderDate?.toDate()?.toString()}</p>
      <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>

      <h3>Dishes Ordered:</h3>
      <ul>
        {order.dishes.map((dish, index) => (
          <li key={index}>{dish.name} - {dish.quantity} x ${dish.price}</li>
        ))}
      </ul>

      {/* Only show status update for Admin/Cook */}
      {(userRole === "admin" || userRole === "cook") && order.status !== "completed" && (
        <div>
          <label>Update Status: </label>
          <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
            <option value="pending">Pending</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button onClick={handleStatusChange}>Update Status</button>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
