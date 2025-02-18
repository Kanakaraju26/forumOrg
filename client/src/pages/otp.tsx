import { useState } from "react";
import { TextField, Box, Typography } from "@mui/material";
import Button from "../components/button";
import "../css/pages/otp.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";

const Otp = () => {
  const { password, clearPassword } = useUser(); // Call the hook here
  const [otp, setOtp] = useState(["", "", "", ""]);
  const navigate = useNavigate();

  // Check if this OTP page is for forgot password
  const resetEmail = localStorage.getItem("resetEmail");

  const handleChange = (index: number, value: string) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
    }
  };

  const handleOtpSubmit = async () => {
    const otpCode = otp.join(""); // Combine OTP digits into a string

    if (otpCode.length !== 4) {
      alert("Please enter a valid 4-digit OTP.");
      return;
    }

    try {
      let response;
      if (resetEmail) {
        // Forgot Password OTP Verification
        response = await fetch("http://localhost:5000/api/auth/verify-forgot-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" }, 
          body: JSON.stringify({ email: resetEmail, otp: otpCode }),
        });

        
        if (response.ok) {
          alert("OTP verified! Redirecting to reset password page.");
          navigate("/set-password"); // Redirect after successful OTP verification
        }else{
          alert("Invalid OTP. Please try again.");
        }
      } else {
        // Signup OTP Verification
        let email = localStorage.getItem("signupEmail");

        // Pass password from context here
        const response = await fetch("http://localhost:5000/api/auth/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email, otp: otpCode, password: password }),
          credentials: "include",
        });

        localStorage.removeItem("signupEmail"); // Remove after OTP verification

        if (response.ok) {
          alert("OTP verified!");
          clearPassword(); // Clear password from context
          navigate("/"); // Redirect after successful OTP verification
        } else {
          alert("Invalid OTP. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      gap={2}
    >
      <div className="name-app">LETS TALK</div>
      <Typography variant="h4" className="label-otp">
        Enter OTP
      </Typography>
      <Box display="flex" gap={1}>
        {otp.map((digit, index) => (
          <TextField
            key={index}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            inputProps={{
              maxLength: 1,
              style: {
                textAlign: "center",
                fontSize: "20px",
                border: "1px solid white",
                color: "white",
              },
            }}
            sx={{ width: "50px" }}
          />
        ))}
      </Box>
      <Button name="Verify OTP" className="otp-btn" onClick={handleOtpSubmit} />
    </Box>
  );
};

export default Otp;
