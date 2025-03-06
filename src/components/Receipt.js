// src/components/Receipt.js
import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";

const Receipt = ({ orderId }) => {
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const orderDoc = await db.collection("orders").doc(orderId).get();
      setOrderDetails(orderDoc.data());
    };

    fetchOrderDetails();
  }, [orderId]);

  if (!orderDetails) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Receipt for Order #{orderDetails.id}</h2>
      <p><strong>Total: </strong>${orderDetails.totalAmount}</p>
      <p><strong>Status: </strong>{orderDetails.paymentStatus}</p>
      <p><strong>Payment Method: </strong>{orderDetails.receipt.paymentMethod}</p>
      <p><strong>Receipt ID: </strong>{orderDetails.receipt.receiptId}</p>
    </div>
  );
};

export default Receipt;
