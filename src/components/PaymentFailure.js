// src/components/PaymentFailure.js
import React from "react";

const PaymentFailure = () => {
  return (
    <div>
      <h3>Payment Failed</h3>
      <p>Unfortunately, your payment could not be processed. Please try again.</p>
      <button onClick={() => window.location.href = "/checkout"}>Try Again</button>
    </div>
  );
};

export default PaymentFailure;

