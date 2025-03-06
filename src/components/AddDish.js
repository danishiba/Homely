import React, { useState } from "react";
import { firestore } from "../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import './adddish.css';

const AddDish = ({ cookId, onDishAdded, onCancel }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "my_unsigned_preset");

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/dcmbqtbv7/image/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image.");
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Image upload error:", error);
      alert("Image upload failed. Please try again.");
      return null;
    }
  };

  const handleAddDish = async () => {
    if (!name || !price || !quantity || !imageFile) {
      alert("Please fill in all required fields.");
      return;
    }

    if (quantity <= 0) {
      alert("Quantity must be greater than 0.");
      return;
    }

    setLoading(true);

    const imageUrl = await uploadToCloudinary(imageFile);
    if (!imageUrl) {
      setLoading(false);
      return;
    }

    const dish = {
      name,
      description,
      price: parseFloat(price),
      imageUrl,
      quantity: parseInt(quantity, 10),
      cookId,
      createdAt: new Date(),
    };

    try {
      await addDoc(collection(firestore, "dishes"), dish);
      alert("Dish added successfully!");
      onDishAdded();
      onCancel();
    } catch (error) {
      console.error("Error adding dish:", error);
      alert("Failed to add dish. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="add-dish-overlay" onClick={onCancel}></div>
      <div className="add-dish-modal">
        <h2>Add a New Dish</h2>
        <input type="text" placeholder="Dish Name" value={name} onChange={(e) => setName(e.target.value)} />
        <textarea placeholder="Dish Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />

        <button onClick={handleAddDish} disabled={loading}>
          {loading ? "Adding..." : "Add Dish"}
        </button>
        <button onClick={onCancel} className="cancel-btn">Cancel</button>
      </div>
    </>
  );
};

export default AddDish;
