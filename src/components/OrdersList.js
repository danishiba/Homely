// src/components/OrdersList.js
import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase/firebaseConfig";

const OrdersList = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const ordersSnapshot = await db
            .collection("orders")
            .where("customerId", "==", user.uid)
            .get();

          const ordersData = ordersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setOrders(ordersData);
        } catch (error) {
          console.error("Error fetching orders: ", error);
        }
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <h3>Your Orders</h3>
      {orders.length > 0 ? (
        <ul>
          {orders.map(order => (
            <li key={order.id}>
              <p>Status: {order.status}</p>
              <p>Total: ${order.total}</p>
              <p>Order Date: {order.orderDate.toDate().toString()}</p>
              <p>Delivery Address: {order.deliveryAddress}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>You have no orders yet.</p>
      )}
    </div>
  );
};

export default OrdersList;
