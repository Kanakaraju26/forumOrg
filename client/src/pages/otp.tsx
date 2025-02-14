import { useState } from "react";
import { TextField, Box, Typography } from "@mui/material";
import Button from "../components/button";
import "../css/pages/otp.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";

const Otp = () => {
  const { userData } = useUser();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const navigate = useNavigate(); 


  const handleChange = (index: number, value: string) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
    }
  };

  const handleOtpSubmit = async () => {
    const otpCode = otp.join(""); 

    if (otpCode.length !== 4) {
      alert("Please enter a valid 4-digit OTP.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userData.email, otp: otpCode, password: userData.password }), 
      });

      const data = await response.json();
      if (response.ok) {
        alert("Signup successful!");
        sessionStorage.removeItem("email"); // Clear stored email after success
        navigate("/login"); 
      } else {
        alert(data.message);
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
      <Typography variant="h4" className="label-otp">Enter OTP</Typography>
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
