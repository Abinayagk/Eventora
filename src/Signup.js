import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "./firebase"; // Import Firebase auth
import { createUserWithEmailAndPassword } from "firebase/auth";
import "./App.css";

export default function Signup() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // Signup function
  const handleSignup = async () => {
    setError("");

    // Basic validation
    const passwordRegex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please fill all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!passwordRegex.test(password)) {
      setError("Password must be at least 8 characters and include a special character.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email.toLowerCase(), password);
      // Signup successful
      navigate("/Event"); // Navigate to Event page
    } catch (err) {
      console.error("Signup error:", err);
      setError("Failed to create account. Please try again.");
    }
  };

  // Google login placeholder
  const handleGoogleLogin = async () => {
    console.log("Google login clicked");
    // TODO: Add Firebase Google login logic here
  };

  return (
    <div className="app-container">
      <div className="paw-bg"></div>

      {/* Header Section */}
      <header className="header">
        <div className="logo-section">
          <div className="logo-circle animate-bounce-slow">🎉</div>
          <div>
            <h1 className="logo-title">Eventora</h1>
            <p className="tagline">Celebrating Life, One Event at a Time</p>
          </div>
        </div>
        <nav>
          <button onClick={() => navigate("/")}>Home</button>
          <Link to="/login"><button>Login</button></Link>
          <Link to="/signup"><button>Sign Up</button></Link>
        </nav>
      </header>

      {/* Signup Section */}
      <section className="regis-section">
        <h2>Sign Up</h2>
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value.toLowerCase())} // lowercase email
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {/* Sign Up button */}
        <button className="find-btn" onClick={handleSignup}>
          Sign Up
        </button>

        {/* Login button */}
        

        {/* Error message */}
        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

        {/* Google Login Button */}
        <button className="google-btn" onClick={handleGoogleLogin}>
          <img
            src="/image/download.png"
            alt="Google logo"
            className="google-icon"
          />
          <span>Login with Google</span>
        </button>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </section>
    </div>
  );
}
