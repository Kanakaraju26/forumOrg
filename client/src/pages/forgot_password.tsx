import { useState } from "react";
import Button from "../components/button";
import Textfield from "../components/Textfield";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";


function ForgotPassword() {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");

  // State to manage email input
  const [formData, setFormData] = useState({ email: "" });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData), 
      credentials: "include",
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("resetEmail", formData.email);
      alert("OTP sent to your email.");
      setTimeout(() => navigate("/otp"), 2000);
    } else {
      setMessage(data.message || "Error sending OTP");
    }
  };

  return (
    <div className="login-page">
      <div className="name-app">LETS TALK</div>
      <div className="container-form">
        <div className="container-start">
          <div className="login-title">Forgot Password</div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <Textfield
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <Button name="Proceed" type="submit" />
          </form>
          {message && <p>{message}</p>} 
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
