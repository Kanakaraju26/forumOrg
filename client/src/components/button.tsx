import React from "react";
import "../css/components/button.css";

interface ButtonProps {
  name: string;
  className?: string;
  onClick?: () => void; 
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({ name, className, onClick, type = "button" }) => {
  return (
    <button className={className ? className +" auth-btn":"auth-btn"} onClick={onClick} type={type}>
      {name}
    </button>
  );
};

export default Button;
