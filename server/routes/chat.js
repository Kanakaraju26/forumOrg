import express from "express";
import { sendMessage, getMessages, fetchRecentChats } from "../controllers/chatController.js";
import authMiddleware from "../middleware/authMiddleware.js"; 

const router = express.Router();

// Send message
router.post("/send", authMiddleware, sendMessage);

// Fetch chat messages between two users
router.get("/messages/:senderId/:receiverId", getMessages);

//fetch recent chats
router.get("/recent-chats/:userId", fetchRecentChats);

export default router;
