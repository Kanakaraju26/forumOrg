import { useState } from "react";
import Button from "../components/button";
import Textfield from "../components/Textfield";
import "../css/pages/login.css";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";


function Loginp() {
  const navigate = useNavigate();

  // State to store email, password, and error messages
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const gotoforgot = () => {
    navigate("/forgot-password");
  }

  const gotosignup = () => {
    navigate("/signup");
  }

  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.email.includes("@")) {
      setError("Invalid email address");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/"); 
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="name-app">LETS TALK</div>
      <div className="container-form">
        <div className="container-start">
          <div className="login-title">Login</div>
          <form className="auth-login" onSubmit={handleSubmit}>
            <div className="form-group">
              <Textfield
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <Textfield
                placeholder="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {/* Show error message if there's any */}
            {error && <p className="error-message">{error}</p>}

            <div className="button-group">
              <Button name="Forgot Password?" type="button" onClick={gotoforgot}/>
              <Button name="Login" type="submit" />
              <Button name="Not Registered? Sign Up" type="button" onClick={gotosignup}/>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Loginp;
