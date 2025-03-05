import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import "../css/components/chat.css"; // Import the separated CSS file
import { API_BASE_URL } from "../config";

const socket = io("http://localhost:5000", { transports: ["websocket"] });

interface ChatProps {
  userId: string;
  receiverId: string;
}

const Chat: React.FC<ChatProps> = ({ userId, receiverId }) => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [receiverName, setReceiverName] = useState("User"); // ✅ Store receiver's name
  const messagesEndRef = useRef<HTMLDivElement | null>(null); // ✅ Reference for auto-scroll

  // ✅ Fetch receiver's name when receiverId changes
  useEffect(() => {
    
    if (!receiverId) return;
    fetch(`${API_BASE_URL}/auth/users/`) // Adjust API route as needed
      .then((res) => res.json())
      .then((data) =>  {
        const foundUser = data.find((user: { _id: string }) => user._id === receiverId);
      setReceiverName(foundUser ? foundUser.username : "User"); 
      })
      .catch((error) => console.error("Error fetching user:", error));
  }, [receiverId]);

  // ✅ Fetch old messages when receiverId changes
  useEffect(() => {
    if (!receiverId) return;
    fetch(`${API_BASE_URL}/chat/messages/${userId}/${receiverId}`)
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);
        scrollToBottom(); // ✅ Scroll to bottom after loading messages
      })
      .catch((error) => console.error("Error fetching messages:", error));
  }, [userId, receiverId]);

  // ✅ Listen for incoming messages
  useEffect(() => {
    const messageListener = (message: any) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom(); // ✅ Scroll down when a new message arrives
    };

    socket.on("receiveMessage", messageListener);

    return () => {
      socket.off("receiveMessage", messageListener); // Remove old listener
    };
  }, [receiverId]);

  // ✅ Scroll to the bottom of the chat box
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100); // Add slight delay for smooth scrolling
  };

  // ✅ Register user for WebSocket
  useEffect(() => {
    if (userId) {
      socket.emit("registerUser", userId);
    }
  }, [userId]);

  // ✅ Send message only when receiverId is valid
  const sendMessage = () => {
    if (!newMessage.trim() || !receiverId) return;
    const messageData = { sender: userId, receiver: receiverId, text: newMessage };

    socket.emit("sendMessage", messageData);
    setMessages((prev) => [...prev, messageData]); // Optimistic UI update
    setNewMessage("");
    scrollToBottom(); // ✅ Scroll to bottom after sending a message
  };

  return (
    <div className="chat-container">
      {/* ✅ Show receiver's username at the top */}
      <div className="chat-header">
        <h2>Chat with {receiverName}</h2>
      </div>

      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender === userId ? "sent" : "received"}`}>
            <p className="text-message">{msg.text}</p>
          </div>
        ))}
        <div ref={messagesEndRef}></div> {/* ✅ Auto-scroll target */}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
