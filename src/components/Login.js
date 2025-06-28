import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Optional: your custom CSS
import { Link } from "react-router-dom";


export default function Login() {
    const [loginData, setLoginData] = useState({ username: "", password: "" });
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    // Input change handler
    const handleChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    // Login form submit handler
    const loginUser = (e) => {
        e.preventDefault();
        setErrorMessage(""); // Reset error

        axios
            .post("http://localhost:8080/userss/login", loginData)
            .then((res) => {
                console.log("Login response:", res.data); // 🪵 Debug log

                // Try both 'role' and 'urole', use lower case to be safe
                const role = (res.data.role || res.data.urole)?.toLowerCase();

                // Save user data to localStorage
                localStorage.setItem("user", JSON.stringify(res.data));

                // Navigate based on role
                if (role === "admin") {
                    navigate("/admin");
                } else if (role === "user") {
                    navigate("/user");
                } else {
                    setErrorMessage("Unknown user role: " + role);
                }
            })
            .catch((err) => {
                console.error("Login failed:", err);
                setErrorMessage("Invalid username or password");
            });
    };

    return (
        <div className="register-page">


            <div className="login-container">
                <h2>Login</h2>

                {/* Error Message */}
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                <form onSubmit={loginUser} className="login-form">
                    <input
                        type="text"
                        name="username"
                        value={loginData.username}
                        onChange={handleChange}
                        placeholder="Username"
                        required
                        className="form-control mb-3"
                    />
                    <input
                        type="password"
                        name="password"
                        value={loginData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        required
                        className="form-control mb-3"
                    />
                    <button type="submit" className="btn btn-primary w-100">
                        Login
                    </button>
                </form>

                <p className="login-link">
                    Don't have an account? <Link to="/register">Register here</Link>
                </p>

            </div>
        </div>
    );
}
