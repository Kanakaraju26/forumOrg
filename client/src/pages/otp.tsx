import { useState } from "react";
import { TextField, Box, Typography } from "@mui/material";
import Button from "../components/button";
import '../css/pages/otp.css';

const Otp = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);

  const handleChange = (index: number, value: string) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
    }
  };

  const handleSubmit = () => {
    const otpCode = otp.join("");
    console.log("Entered OTP:", otpCode);
    // Add OTP verification logic here
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
              style: { textAlign: "center", fontSize: "20px",border: "1px solid white", color: "white" },  
            }}
            sx={{ width: "50px" }}
          />
        ))}
      </Box>
      <Button name="Verify OTP" className="otp-btn" />
    </Box>
  );
};

export default Otp;