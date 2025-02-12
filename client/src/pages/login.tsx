import { useState } from "react";
import Button from "../components/button";
import Textfield from "../components/Textfield";
import "../css/pages/login.css";

function Loginp() {
  // State to store email, password, and error messages
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload
    
    // Validation
    if (!formData.email.includes("@")) {
      setError("Invalid email address");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setError(""); // Clear error on success
    console.log("Login submitted:", formData);
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
              <Button name="Forgot Password?" type="button" />
              <Button name="Login" type="submit" />
              <Button name="Not Registered? Sign Up" type="button" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Loginp;
