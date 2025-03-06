// src/components/Chat.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebaseConfig';
import { useAuth } from '../context/AuthContext';  // Assuming an auth context

const Chat = ({ orderId }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const { currentUser } = useAuth();  // Get current logged-in user

  useEffect(() => {
    // Fetch messages related to the order
    const unsubscribe = db.collection('chats')
      .where('orderId', '==', orderId)
      .onSnapshot((snapshot) => {
        const msgs = snapshot.docs.map(doc => doc.data());
        setMessages(msgs);
      });

    return () => unsubscribe();
  }, [orderId]);

  const sendMessage = async (e) => {
    e.preventDefault();

    // Add new message to Firestore
    await db.collection('chats').add({
      orderId,
      senderId: currentUser.uid,
      message,
      timestamp: new Date(),
    });

    setMessage('');
  };

  return (
    <div>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={msg.senderId === currentUser.uid ? 'sent' : 'received'}>
            <p>{msg.message}</p>
            <small>{new Date(msg.timestamp.seconds * 1000).toLocaleString()}</small>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input 
          type="text" 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          placeholder="Type your message"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
