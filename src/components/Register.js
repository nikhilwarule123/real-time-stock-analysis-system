import React, { useState } from "react";
import axios from "axios";
import "./Register.css";
import { Link } from "react-router-dom";

export default function Register() {
    const [user, setUser] = useState({
        username: "",
        email: "",
        contanctno: "",
        password: "",
        urole: "user",
    });

    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [otpVerified, setOtpVerified] = useState(false);

    // Input field handler
    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    // Send OTP (with username and email)
    const sendOtp = () => {
        axios.post("http://localhost:8080/api/otp/generate", {
            email: user.email,
            username: user.username
        })
            .then(() => {
                alert("OTP sent to email");
                setOtpSent(true);
            })
            .catch((err) => {
                alert("Failed to send OTP");
                console.error(err);
            });
    };

    // Verify OTP
    const verifyOtp = () => {
        axios.post("http://localhost:8080/api/otp/verify", {
            email: user.email,
            otp: otp
        })
            .then((res) => {
                alert(res.data);
                if (res.data === "OTP verified successfully.") {
                    setOtpVerified(true);
                }
            })
            .catch((err) => {
                alert("Invalid or expired OTP");
                console.error(err);
            });
    };

    // Register user (only after OTP verification)
    const registerUser = (e) => {
        e.preventDefault();
        if (!otpVerified) {
            alert("Please verify OTP first");
            return;
        }

        axios.post("http://localhost:8080/userss/register", user)
            .then(() => alert(" Registered Successfully"))
            .catch((err) => {
                console.error(err);
                alert("Registration failed");
            });
    };

    return (
        <div className="register-page">
            <div className="register-container">
                <h2>Register</h2>
                <form onSubmit={registerUser} className="register-form">
                    <input
                        name="username"
                        onChange={handleChange}
                        placeholder="Username"
                        value={user.username}
                        required
                    />
                    <input
                        name="email"
                        onChange={handleChange}
                        placeholder="Email"
                        value={user.email}
                        required
                    />
                    <button type="button" onClick={sendOtp}>Send OTP</button>

                    {otpSent && (
                        <>
                            <input
                                type="text"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                            <button type="button" onClick={verifyOtp}>Verify OTP</button>
                        </>
                    )}

                    <input
                        name="contanctno"
                        onChange={handleChange}
                        placeholder="Contact No"
                        value={user.contanctno}
                        required
                    />
                    <input
                        name="password"
                        type="password"
                        onChange={handleChange}
                        placeholder="Password"
                        value={user.password}
                        required
                    />
                    <select name="urole" value={user.urole} onChange={handleChange}>
                        <option value="select">Select</option>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>

                    <button type="submit">Register</button>
                </form>

                <p className="login-link">
                    Already have an account? <Link to="/">Login here</Link>
                </p>
            </div>
        </div>
    );
}
