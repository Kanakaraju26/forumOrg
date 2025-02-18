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
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/user.js"; // ✅ Import User model

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

export default router;