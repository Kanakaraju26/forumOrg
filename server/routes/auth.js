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

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const user = await User.findByIdAndUpdate(userId, { username }, { new: true });

    res.status(200).json({ message: "Username updated successfully", user });
  } catch (error) {
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
    console.log("Update Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
export default router;