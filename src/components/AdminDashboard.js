import React, { useState, useEffect } from "react";
import { auth, firestore } from "../firebase/firebaseConfig";
import { collection, getDocs, doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./admindashboard.css";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      navigate("/login"); // Redirect if not logged in
      return;
    }
    
    const checkAdmin = async () => {
      const userDoc = await getDoc(doc(firestore, "users", user.uid));
      if (!userDoc.exists() || userDoc.data().role !== "admin") {
        navigate("/unauthorized"); // Redirect if not admin
      } else {
        fetchDashboardData();
      }
    };

    checkAdmin();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      const orderSnapshot = await getDocs(collection(firestore, "orders"));
      setOrders(orderSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

      const userSnapshot = await getDocs(collection(firestore, "users"));
      setUsers(userSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

      const dishSnapshot = await getDocs(collection(firestore, "dishes"));
      setDishes(dishSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      navigate("/login");
    }
  };

  const handleOrderUpdate = async (orderId, status) => {
    await updateDoc(doc(firestore, "orders", orderId), { status });
    setOrders(orders.map(order => order.id === orderId ? { ...order, status } : order));
  };

  const handleBanUser = async (userId) => {
    if (window.confirm("Are you sure you want to ban this user?")) {
      await updateDoc(doc(firestore, "users", userId), { role: "banned" });
      setUsers(users.map(user => user.id === userId ? { ...user, role: "banned" } : user));
    }
  };

  const handleDeletePost = async (dishId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await deleteDoc(doc(firestore, "dishes", dishId));
      setDishes(dishes.filter(dish => dish.id !== dishId));
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                {user.role !== "banned" && (
                  <button onClick={() => handleBanUser(user.id)}>Ban</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Orders</h2>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Status</th>
            <th>Customer</th>
            <th>Cook</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.status}</td>
              <td>{order.customerId}</td>
              <td>{order.cookId}</td>
              <td>
                <button onClick={() => handleOrderUpdate(order.id, "completed")}>Complete</button>
                <button onClick={() => handleOrderUpdate(order.id, "cancelled")}>Cancel</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Posts (Dishes)</h2>
      <table>
        <thead>
          <tr>
            <th>Dish Name</th>
            <th>Price</th>
            <th>Cook</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {dishes.map((dish) => (
            <tr key={dish.id}>
              <td>{dish.name}</td>
              <td>${dish.price}</td>
              <td>{dish.cookId}</td>
              <td>
                <button onClick={() => handleDeletePost(dish.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;