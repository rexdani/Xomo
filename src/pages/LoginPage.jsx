import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import AlertModal from "../components/AlertModal";
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
  const [alertModal, setAlertModal] = useState({ show: false, message: "", type: "error" });
  const navigate = useNavigate();

  const showAlert = (message, type = "error") => {
    setAlertModal({ show: true, message, type });
  };

  const closeAlert = () => {
    setAlertModal({ show: false, message: "", type: "error" });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Helper function to create address from user profile
  const createAddressFromProfile = async (token) => {
    try {
      // Check if user already has addresses
      const addressRes = await axios.get(
        `${BASE_URL}/address`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // If addresses exist, skip
      if (addressRes.data && addressRes.data.length > 0) {
        return;
      }

      // Fetch user profile
      const profileRes = await axios.get(
        `${BASE_URL}/user/profile`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const user = profileRes.data;

      // Check if user has address data in profile
      if (user.address && (
        user.address.street || 
        user.address.city || 
        user.address.state || 
        user.address.country || 
        user.address.postalCode
      )) {
        // Create address from profile data
        const addressData = {
          fullName: user.name || "User",
          phoneNumber: user.phone || "",
          street: user.address.street || "",
          city: user.address.city || "",
          state: user.address.state || "",
          country: user.address.country || "",
          postalCode: user.address.postalCode || ""
        };

        // Only create if we have meaningful address data
        if (addressData.street || addressData.city || addressData.state) {
          await axios.post(
            `${BASE_URL}/address`,
            addressData,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      }
    } catch (err) {
      // Silently fail - user can add address manually
      console.log("Could not auto-create address from profile");
    }
  };

  const loginUser = async () => {
    if (!form.email || !form.password) {
      showAlert("Please fill in all fields");
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
      const token = response.data.token;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", response.data.userId);

      // Create address from profile if needed (non-blocking)
      createAddressFromProfile(token).catch(() => {});

      navigate("/HomePage", { replace: true });

    } catch (err) {
      showAlert(err.response?.data?.message || "Login failed. Please check your credentials.");
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
    
    // Show loading screen
    setIsLoading(true);

  // Send Google ID Token → Spring Boot
  axios.post(`${BASE_URL}/auth/google`, { idToken })
    .then((res) => {
      const token = res.data.token;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", res.data.userId);

      // Create address from profile if needed (non-blocking)
      createAddressFromProfile(token).catch(() => {});

      navigate("/HomePage", { replace: true });
    })
    .catch(() => {
        showAlert("Google login failed");
      })
      .finally(() => {
        setIsLoading(false);
    });
};
useEffect(() => {
  const checkGoogle = setInterval(() => {
    if (window.google) {
      google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleLogin,
      });

      google.accounts.id.renderButton(
        document.getElementById("googleLoginBtn"),
        { theme: "outline", size: "large", width: 340 }
      );

      clearInterval(checkGoogle);
    }
  }, 300);

  return () => clearInterval(checkGoogle);
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
              <Mail className="input-icon-pro" size={20} strokeWidth={2} />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className="auth-input-pro"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="input-group-pro">
            <div className="input-wrapper-pro">
              <Lock className="input-icon-pro" size={20} strokeWidth={2} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className="auth-input-pro"
                autoComplete="current-password"
              />
              <button 
                type="button"
                className="password-toggle-pro"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={20} strokeWidth={2} /> : <Eye size={20} strokeWidth={2} />}
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

      <AlertModal
        show={alertModal.show}
        message={alertModal.message}
        type={alertModal.type}
        onClose={closeAlert}
      />
    </div>
  );
}