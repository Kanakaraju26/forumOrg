import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);


mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("MongoDB Connected");
 }); 

app.get("/", (req, res) => {
  res.send("Forum API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
