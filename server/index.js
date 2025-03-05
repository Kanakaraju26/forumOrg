import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import http from "http";

import { Message } from "./models/message.js";

// Routes
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/post.js";
import chatRoutes from "./routes/chat.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://letstalk-forum.netlify.app/",
    credentials: true,
  })
);

// Serve static uploads
app.use("/uploads", express.static("./uploads"));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
  res.send("Forum API is running...");
});

// Create HTTP server and integrate with Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://letstalk-forum.netlify.app/",
    credentials: true,
    methods: ["GET", "POST"],
  },
});

const users = {}; 

// Socket.io connection handling
io.on("connection", (socket) => {
  socket.on("registerUser", (userId) => {
    users[userId] = socket.id;
  });

  socket.on("sendMessage", async (message) => {
    const newMessage = new Message(message);
    await newMessage.save(); // Save to MongoDB

    // Send message to the receiver if online
    const receiverSocketId = users[message.receiver];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", message);
    }
  });

  socket.on("disconnect", () => {
    Object.keys(users).forEach((userId) => {
      if (users[userId] === socket.id) {
        delete users[userId];
      }
    });
  });
});

// Connect to MongoDB and start the server
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .then(() => server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`)))
  .catch((error) => console.error("❌ MongoDB connection error:", error));
