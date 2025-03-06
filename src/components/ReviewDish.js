// src/components/ReviewDish.js
import React, { useState } from "react";
import { db } from "../firebase/firebaseConfig";

const ReviewDish = ({ dishId }) => {
  const [rating, setRating] = useState(1);
  const [reviewText, setReviewText] = useState("");

  const submitReview = async () => {
    const review = {
      rating,
      text: reviewText,
      timestamp: new Date(),
    };

    await db.collection("dishes").doc(dishId).collection("reviews").add(review);
    setReviewText("");
    setRating(1);
    alert("Review submitted!");
  };

  return (
    <div>
      <h3>Leave a Review</h3>
      <label>
        Rating:
        <select value={rating} onChange={(e) => setRating(parseInt(e.target.value))}>
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>{num} Stars</option>
          ))}
        </select>
      </label>
      <textarea 
        value={reviewText} 
        onChange={(e) => setReviewText(e.target.value)} 
        placeholder="Write your review"
      />
      <button onClick={submitReview}>Submit Review</button>
    </div>
  );
};

export default ReviewDish;
