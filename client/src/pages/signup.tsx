import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/button";
import Textfield from "../components/Textfield";
import { useUser } from "../context/userContext";
import { API_BASE_URL } from "../config";

function Signup() {
  const {  setPassword } = useUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const gotoLogin = () => { 
    navigate("/login");
  }

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignups = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email}),
        credentials: "include",
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem("signupEmail", formData.email); 
        setPassword(formData.password);
        navigate("/otp"); 
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    }
  };
  

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
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Call signup function
    handleSignups();
  };

  return (
    <div className="login-page">
      <div className="name-app">LETS TALK</div>
      <div className="container-form">
        <div className="container-start">
          <div className="login-title">Sign Up</div>
          <form className="auth-signup" onSubmit={handleSubmit}>
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
            <div className="form-group">
              <Textfield
                placeholder="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <div className="button-group">
              <Button name="Sign Up" type="submit" />
              <Button name="Already Registered? Login" type="button"  onClick={gotoLogin}/>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
