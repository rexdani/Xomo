import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import "../styles/login.css";
const host = window.location.hostname;
const backendPort = 8081;
export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const loginUser = async () => {
    if (!form.email || !form.password) {
      alert("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `http://${host}:${backendPort}/auth/login`,
        form,
        { headers: { "Content-Type": "application/json" } }
      );

      // Save JWT
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.userId);

      navigate("/HomePage", { replace: true });

    } catch (err) {
      alert(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      loginUser();
    }
  };
  const handleGoogleLogin = (response) => {
  const idToken = response.credential;

  // Send Google ID Token → Spring Boot
  axios.post(`http://${host}:${backendPort}/auth/google`, { idToken })
    .then((res) => {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);

      navigate("/HomePage", { replace: true });
    })
    .catch(() => {
      alert("Google login failed");
    });
};
useEffect(() => {
  if (window.google) {
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleGoogleLogin,
    });

    google.accounts.id.renderButton(
      document.getElementById("googleLoginBtn"),
      { theme: "outline", size: "large", width: 340 }
    );
  }
}, []);

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-gradient"></div>
      </div>
      
      <div className="auth-card">
        <div className="auth-header">
          <div className="brand-logo">XOMO</div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your XOMO account</p>
        </div>

        <div className="auth-form">
          <div className="input-group">
            <div className="input-wrapper">
              <Mail className="input-icon" size={20} />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className="auth-input"
              />
            </div>
          </div>

          <div className="input-group">
            <div className="input-wrapper">
              <Lock className="input-icon" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className="auth-input"
              />
              <button 
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="auth-options">
            <label className="checkbox-wrapper">
              <input type="checkbox" />
              <span className="checkmark"></span>
              Remember me
            </label>
            <a href="/forgot-password" className="forgot-link">Forgot password?</a>
          </div>

          <button 
            className={`auth-btn primary ${isLoading ? 'loading' : ''}`} 
            onClick={loginUser}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="spinner"></div>
            ) : (
              <>
                Sign In
                <ArrowRight size={18} />
              </>
            )}
          </button>

          <div className="auth-divider">
            <span>or</span>
          </div>

         <div id="googleLoginBtn" className="google-btn-container"></div>
        </div>

        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <a href="/register" className="auth-link">Create account</a>
          </p>
        </div>
      </div>
    </div>
  );
}