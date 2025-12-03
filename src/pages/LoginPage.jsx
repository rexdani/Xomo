import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Mail, Lock, ArrowRight, Eye, EyeOff, Sparkles } from "lucide-react";
import "../styles/login.css";
import "../styles/shared.css";
import { BASE_URL } from "../util/config.js";

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
        `${BASE_URL}/auth/login`,
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
  axios.post(`${BASE_URL}/auth/google`, { idToken })
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
    <div className="auth-page-pro">
      <div className="auth-background-pro">
        <div className="bg-blob-pro blob-1"></div>
        <div className="bg-blob-pro blob-2"></div>
        <div className="bg-blob-pro blob-3"></div>
      </div>
      
      <div className="auth-card-pro">
        <div className="auth-header-pro">
          <div className="brand-logo-pro">
            <span className="logo-text-pro">XOMO</span>
            <span className="logo-accent-pro"></span>
          </div>
          <h1 className="auth-title-pro">Welcome Back</h1>
          <p className="auth-subtitle-pro">Sign in to your XOMO account</p>
        </div>

        <div className="auth-form-pro">
          <div className="input-group-pro">
            <div className="input-wrapper-pro">
              <Mail className="input-icon-pro" size={20} />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className="auth-input-pro"
              />
            </div>
          </div>

          <div className="input-group-pro">
            <div className="input-wrapper-pro">
              <Lock className="input-icon-pro" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className="auth-input-pro"
              />
              <button 
                type="button"
                className="password-toggle-pro"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="auth-options-pro">
            <label className="checkbox-wrapper-pro">
              <input type="checkbox" />
              <span className="checkmark-pro"></span>
              <span>Remember me</span>
            </label>
            <a href="/forgot-password" className="forgot-link-pro">Forgot password?</a>
          </div>

          <button 
            className={`auth-btn-pro primary-pro ${isLoading ? 'loading' : ''}`} 
            onClick={loginUser}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="shared-spinner shared-spinner-small"></div>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>

          <div className="auth-divider-pro">
            <span>or</span>
          </div>

          <div id="googleLoginBtn" className="google-btn-container-pro"></div>
        </div>

        <div className="auth-footer-pro">
          <p>
            Don't have an account?{" "}
            <a href="/register" className="auth-link-pro">Create account</a>
          </p>
        </div>
      </div>
    </div>
  );
}