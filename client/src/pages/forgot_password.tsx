import { useState } from "react";
import Button from "../components/button";
import Textfield from "../components/Textfield";

function ForgotPassword() {
  // State to manage email input
  const [formData, setFormData] = useState({ email: "" });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload
    console.log("Forgot Password request for:", formData.email);
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
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
