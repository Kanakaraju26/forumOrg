import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, unique: true, required: true }, // Ensure uniqueness
});

export default mongoose.model("User", userSchema);
