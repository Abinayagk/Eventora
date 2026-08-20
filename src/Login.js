import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import "./App.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Regular email/password login
  const handleLogin = async () => {
    setError("");
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email.toLowerCase(), password);
      navigate("/event");
    } catch (err) {
      console.error("Login error:", err);
      if (err.code === "auth/user-not-found") {
        setError("You are not signed up yet. Please sign up first.");
        navigate("/signup");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password. Please enter a valid password.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email format. Please enter a valid email.");
      } else {
        setError("Login failed. Please check your credentials.");
      }
    }
  };

  // Google login
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      alert(`Logged in as ${user.email}`);
      navigate("/event");
    } catch (err) {
      console.error("Google login error:", err);
      alert("Google login failed: " + err.message);
    }
  };

  return (
    <div className="app-container">
      <div className="paw-bg"></div>

      {/* Header */}
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
          <Link to="/signup"><button>Sign Up</button></Link>
        </nav>
      </header>

      {/* Login Section */}
      <section className="regis-section">
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value.toLowerCase())}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="find-btn" onClick={handleLogin}>Login</button>
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


        <p>Don’t have an account? <Link to="/signup">Sign Up</Link></p>
      </section>
    </div>
  );
}
