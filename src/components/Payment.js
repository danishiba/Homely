// src/components/Payment.js
import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const Payment = ({ totalAmount }) => {
  const [loading, setLoading] = useState(false);

  const stripePromise = loadStripe("YOUR_STRIPE_PUBLIC_KEY");

  const handlePayment = async () => {
    setLoading(true);

    try {
      const stripe = await stripePromise;

      // Create a payment session (backend logic needed here)
      const response = await fetch("/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: totalAmount * 100,  // Convert to cents
        }),
      });

      const session = await response.json();

      const result = await stripe.redirectToCheckout({ sessionId: session.id });

      if (result.error) {
        alert(result.error.message);
      }
    } catch (error) {
      console.error("Payment Error: ", error);
      alert("Payment failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Total: ${totalAmount}</h3>
      <button
        onClick={handlePayment}
        disabled={loading}
      >
        {loading ? "Processing Payment..." : "Pay Now"}
      </button>
    </div>
  );
};

export default Payment;
