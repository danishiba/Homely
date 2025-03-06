import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Homepage from './pages/Homepage';
import CookProfile from './pages/CookProfile';
import CustomerProfile from './pages/CustomerProfile';
import Dishes from './components/Dishes';
import AddDish from './components/AddDish';
import Navbar from './components/Navbar';
import Order from './pages/Order';
import OrderDetails from "./components/OrderDetails";
import Search from './components/SearchDishes';
import Admin from './components/AdminDashboard';
import './App.css';

const App = () => {
  return (
    <div className="app">
      {/* Conditionally render Navbar */}
      <Routes>  
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        {/* Render Navbar on other routes */}
        <Route 
          path="*" 
          element={
            <>
              <Navbar />
              <div className="content">
                <Routes>
                  <Route path="/home" element={<Homepage />} />
                  <Route path="/cookprofile" element={<CookProfile />} />
                  <Route path="/customerprofile" element={<CustomerProfile />} />
                  <Route path="/order-details" element={<OrderDetails />} />
                  <Route path="/dishes" element={<Dishes />} />
                  <Route path="/add-dish" element={<AddDish />} />
                  <Route path="/order" element={<Order />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/admin" element={<Admin />} />
                </Routes>
              </div>
            </>
          } 
        />
      </Routes>
    </div>
  );
};

export default App;
