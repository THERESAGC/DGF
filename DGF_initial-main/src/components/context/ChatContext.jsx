import  { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { io } from 'socket.io-client';
 
const socket = io('http://localhost:8000'); // Adjust this URL to your server
 
export const ChatContext = createContext();
 
export const ChatProvider = ({ children }) => {
  ChatProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
 
  // Listen for new messages through Socket.io
  useEffect(() => {
    fetchMessages();
    socket.on('new-comment', (message) => {
      setMessages((prevMessages) => [message, ...prevMessages]);
    });
 
    return () => {
    };
   
 
  }, []);
 
  // Method to send a new message
  const sendMessage = async (messageText, requestId, createdBy,requestStatus) => {
    const newMessageData = {
      requestid: requestId,
      comment_text: messageText,
      created_by: createdBy,
      created_date: new Date().toISOString(),
      parent_comment_id: null,
      requeststatus:requestStatus,
    };
 
    try {
        // First, send the message to the backend API (save to DB)
        const response = await fetch('http://localhost:8000/api/comments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newMessageData),
        });
       
        const savedMessage = await response.json();
        console.log('Message saved:', savedMessage);
 
        // Emit the message through Socket.io (for real-time updates)
        socket.emit('send-comment', savedMessage); // Emit the saved message to socket server
        setMessages((prevMessages) => [savedMessage, ...prevMessages]); // Update locally
 
        setNewMessage(''); // Clear the input field
      } catch (error) {
        console.error('Error saving message:', error);
      }
    socket.emit('send-comment', newMessage); // Emit the message to the server
   
  };
  const fetchMessages = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/comments/${requestId}`);
      const fetchedMessages = await response.json();
      setMessages(fetchedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };
 
 
  return (
    <ChatContext.Provider value={{ messages, sendMessage, newMessage, setNewMessage }}>
      {children}
    </ChatContext.Provider>
  );
};