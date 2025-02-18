import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000", 
    credentials: true, 
  })
);
app.use("/api/auth", authRoutes);


mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("MongoDB Connected");
 }); 

app.get("/", (req, res) => {
  res.send("Forum API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
