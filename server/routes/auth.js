import { Router } from "express";
import {
  forgotPassword,
  login,
  logout,
  setPassword,
  signup,
  verifyForgotPasswordOtp,
  verifyOtp,
} from "../controllers/authcontroller.js";
import authMiddleware, { verifyToken } from "../middleware/authMiddleware.js";
import User from "../models/user.js"; 
import bcrypt from "bcrypt"; 
import Post from "../models/Post.js";

const router = Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/verify-otp", verifyOtp);
router.post("/forgot-password", forgotPassword);
router.post("/verify-forgot-otp", verifyForgotPasswordOtp); 
router.post("/logout",logout)
router.post("/set-password",setPassword)
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); 
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile" });
  }
});

router.put("/update-username", authMiddleware, async (req, res) => {
  try {
    const { username } = req.body;
    const userId = req.user.id;

    // Find the current user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

     // Check if the new username is the same as the old one
     if (user.username === username) {
      return res.status(400).json({ message: "New username must be different from the current one" });
    }

    // Check if the new username is already taken by another user
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username is already taken. Please choose another one." });
    }
    
    const oldUsername = user.username; // Get old username before updating

    // Update the username in the User model
    user.username = username;
    await user.save();

    // Update all posts created by the user
    await Post.updateMany(
      { username: oldUsername },  // Find posts with the old username
      { $set: { username } }      // Update them with the new username
    );

    res.json({ message: "Username updated successfully", user });
  } catch (error) {
    console.error("Error updating username:", error);
    res.status(500).json({ message: "Error updating username" });
  }
});


// Update Password Route
router.put("/update-password", verifyToken, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Find user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect old password" });

    // Hash new password
    user.password = await bcrypt.hash(newPassword, 10);

    // Save updated user
    await user.save();
    res.status(200).json({ message: "Password updated successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "_id username"); 
    res.json(users.map((user) => ({ _id: user._id, username: user.username }))); 
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});


export default router;