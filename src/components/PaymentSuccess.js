// src/components/PaymentSuccess.js
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { loadStripe } from "@stripe/stripe-js";

const PaymentSuccess = () => {
  const location = useLocation();
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const sessionIdFromUrl = queryParams.get("session_id");
    if (sessionIdFromUrl) {
      setSessionId(sessionIdFromUrl);
      handlePaymentSuccess(sessionIdFromUrl);
    }
  }, [location]);

  const handlePaymentSuccess = async (sessionId) => {
    try {
      const stripe = loadStripe("YOUR_STRIPE_PUBLIC_KEY"); // Stripe public key (for client-side)
      const paymentIntent = await stripe.paymentIntents.retrieve(sessionId);

      // Assuming you already have the orderId saved in your app state or Firestore
      const orderId = "YOUR_ORDER_ID"; // Replace with the actual order ID

      // Update order in Firestore after successful payment
      await db.collection("orders").doc(orderId).update({
        paymentStatus: "paid",
        receipt: {
          receiptId: paymentIntent.id,
          paymentMethod: paymentIntent.payment_method_types[0],
        },
      });

      alert("Payment successful and receipt generated!");
    } catch (error) {
      console.error("Error updating payment status: ", error);
      alert("Error handling payment.");
    }
  };

  return (
    <div>
      <h3>Payment Successful</h3>
      <p>Thank you for your payment!</p>
    </div>
  );
};

export default PaymentSuccess;
