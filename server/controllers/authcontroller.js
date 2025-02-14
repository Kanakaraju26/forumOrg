import User from "../models/user.js";
import Otp from "../models/otp.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();
// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Signup function
export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    
    // Generate OTP (4-digit code)
    const otpCode = crypto.randomInt(1000, 9999).toString();

    // Save OTP in database
    await Otp.create({ email, otp: otpCode });

    // Send OTP via email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otpCode}`,
    });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Error is coming" });
  }
};

// OTP Verification function
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    // Find OTP in database
    const otpRecord = await Otp.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Remove OTP after verification
    await Otp.deleteOne({ email });

    // Create user
    await User.create({ email, password });

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    res.status(500).json({ message: "Error verifying OTP" });
  }
};
