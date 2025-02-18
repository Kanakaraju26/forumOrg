import { useState } from "react";
import Button from "../components/button";
import Textfield from "../components/Textfield";
import { useNavigate } from "react-router-dom";

function Setpassword() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({
        password: "",
        confirmPassword: "",
    });

    let email = localStorage.getItem("resetEmail");

    // Password Validation Rules
    const validatePassword = (password: string) => {
        if (password.length < 8) return "Password must be at least 8 characters long";
        if (!/\d/.test(password)) return "Password must include at least one number";
        if (!/[!@#$%^&*]/.test(password)) return "Password must include at least one special character (!@#$%^&*)";
        return "";
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === "password") {
            setErrors({ ...errors, password: validatePassword(value) });
        }
        if (name === "confirmPassword") {
            setErrors({
                ...errors,
                confirmPassword: value !== formData.password ? "Passwords do not match" : "",
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const passwordError = validatePassword(formData.password);
        const confirmPasswordError =
            formData.password !== formData.confirmPassword ? "Passwords do not match" : "";

        if (passwordError || confirmPasswordError) {
            setErrors({
                password: passwordError,
                confirmPassword: confirmPasswordError,
            });
            return;
        }


        try {
            const response = await fetch("http://localhost:5000/api/auth/set-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email, password: formData.password }),
                credentials: "include",
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(errorData.message || "Error setting password. Try again.");
                return;
            }
            localStorage.removeItem("resetEmail"); // Remove after OTP verification
            alert("Password set successfully! Redirecting to login.");
            navigate("/login");
        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong. Please try again later.");
        }
    };

    return (
        <div className="login-page">
            <div className="name-app">LETS TALK</div>
            <div className="container-form">
                <div className="container-start">
                    <div className="login-title">Set New Password</div>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <Textfield
                                type="password"
                                placeholder="Type a strong new password"
                                name="password"
                                onChange={handleChange}
                            />
                            {errors.password && <p className="error-text">{errors.password}</p>}
                        </div>
                        <div className="form-group">
                            <Textfield
                                type="password"
                                placeholder="Retype the password"
                                name="confirmPassword"
                                onChange={handleChange}
                            />
                            {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
                        </div>
                        <Button name="Proceed" type="submit" />
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Setpassword;
