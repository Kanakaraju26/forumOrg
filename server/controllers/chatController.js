import { Message } from "../models/message.js";

// Send Message
export const sendMessage = async (req, res) => {
  try {
    const { receiver, text } = req.body;
    const sender = req.user.id; // Get sender from authenticated user

    if (!receiver || !text) {
      return res.status(400).json({ message: "Receiver and text are required" });
    }

    const message = new Message({ sender, receiver, text });
    await message.save();

    res.status(201).json({ message: "Message sent", data: message });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Fetch Messages Between Two Users
export const getMessages = async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;
    
    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId }
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
}

export const fetchRecentChats = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find all messages where the user is either sender or receiver
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .sort({ createdAt: -1 }) // Sort by latest message
      .lean();

    if (!messages.length) {
      return res.json([]);
    }

    // Extract unique chat partners
    const chatUsers = new Map();

    messages.forEach((msg) => {
      const chatPartner = msg.sender.toString() === userId ? msg.receiver : msg.sender;
      if (!chatUsers.has(chatPartner)) {
        chatUsers.set(chatPartner, msg);
      }
    });

    // Convert Map to array and sort by latest message time
    const recentChats = Array.from(chatUsers.values()).sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.json(recentChats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch recent chats" });
  }
};
