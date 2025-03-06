import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';  // Main stylesheet
import App from './App';  // Main App component
import { BrowserRouter as Router } from 'react-router-dom';  // For routing

const root = ReactDOM.createRoot(document.getElementById('root')); // Create the root
root.render(
  <Router>
    <App />
  </Router>, 
);