import React, { useState, useEffect } from 'react';
import { auth, firestore } from '../firebase/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';

const CustomerProfile = () => {
  const [customerData, setCustomerData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchCustomerData = async () => {
      try {
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.role === 'customer') {
            setCustomerData(userData);
            fetchOrders(user.uid);
          } else {
            navigate('/login');
          }
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching customer data:', error);
        navigate('/login');
      }
    };

    const fetchOrders = async (customerId) => {
      try {
        const ordersQuery = query(collection(firestore, 'orders'), where('customerId', '==', customerId));
        const ordersSnapshot = await getDocs(ordersQuery);
        const ordersList = ordersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setOrders(ordersList);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [user, navigate]);

  const handleOrderClick = (order) => {
    navigate('/order-details', { state: { order } });
  };

  const handleCancelOrder = async (orderId) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this order?");
    if (!confirmCancel) return;

    try {
      const orderRef = doc(firestore, 'orders', orderId);
      await updateDoc(orderRef, { status: 'cancelled' });

      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: 'cancelled' } : order
      ));
    } catch (error) {
      console.error("Error cancelling order:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={styles.profile}>
      <h2 style={styles.header}>Customer Profile</h2>
      <p style={styles.text}><strong>Name:</strong> {customerData.name}</p>
      <p style={styles.text}><strong>Email:</strong> {customerData.email}</p>

      <h3 style={styles.orderHeader}>Your Orders</h3>
      {orders.length > 0 ? (
        <ul style={styles.orderList}>
          {orders.map((order) => (
            <li key={order.id} style={styles.orderItem}>
              <p><strong>Order ID:</strong> {order.id}</p>
              <p><strong>Total Price:</strong> ${order.total}</p>
              <p><strong>Status:</strong> {order.status}</p>

              {/* View Order Button */}
              <button 
                style={styles.viewButton} 
                onClick={() => handleOrderClick(order)}
              >
                View Details
              </button>

              {/* Cancel Order Button (only if order is not completed) */}
              {order.status !== "completed" && order.status !== "cancelled" && (
                <button 
                  style={styles.cancelButton} 
                  onClick={() => handleCancelOrder(order.id)}
                >
                  Cancel Order
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p style={styles.text}>No orders placed yet.</p>
      )}
    </div>
  );
};

// 🎨 Inline Styles
const styles = {
  profile: {
    maxWidth: '600px',
    margin: '40px auto',
    padding: '20px',
    background: '#fff',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
    textAlign: 'center'
  },
  header: {
    fontSize: '24px',
    marginBottom: '10px',
    color: '#333'
  },
  text: {
    fontSize: '16px',
    margin: '5px 0',
    color: '#555'
  },
  orderHeader: {
    marginTop: '20px',
    fontSize: '20px',
    color: '#444'
  },
  orderList: {
    listStyle: 'none',
    padding: 0
  },
  orderItem: {
    background: '#f8f8f8',
    padding: '15px',
    margin: '10px 0',
    borderRadius: '8px',
    transition: '0.3s'
  },
  viewButton: {
    background: '#007bff',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    margin: '5px',
    fontSize: '14px',
    cursor: 'pointer',
    borderRadius: '5px',
    transition: '0.3s'
  },
  cancelButton: {
    background: '#ff4d4d',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    margin: '5px',
    fontSize: '14px',
    cursor: 'pointer',
    borderRadius: '5px',
    transition: '0.3s'
  }
};

export default CustomerProfile;
