import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiShield, FiEye, FiEyeOff, FiAlertCircle } from "react-icons/fi";
import "./Login.css";

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Call the actual JWT API
      const response = await fetch(
        "http://localhost:5001/api/auth/moderator/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: credentials.username,
            password: credentials.password,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        // Store token and user info
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setLoading(false);
        onLogin("moderator");
        navigate("/moderator");
      } else {
        setLoading(false);
        setError(data.error || "Invalid credentials. Please try again.");
      }
    } catch (error) {
      setLoading(false);
      setError("Connection error. Please make sure the server is running.");
      console.error("Login error:", error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">
            <FiShield size={48} />
          </div>
          <h1>Moderator Login</h1>
          <p>Access the Lost & Found Portal administration panel</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <FiAlertCircle size={20} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your username"
              required
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                tabIndex="-1"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg login-btn"
            disabled={loading || !credentials.username || !credentials.password}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                Signing In...
              </>
            ) : (
              <>
                <FiShield size={20} />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p className="text-secondary">
            <strong>Demo Credentials:</strong>
            <br />
            Username: <code>admin</code>
            <br />
            Password: <code>admin123</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
