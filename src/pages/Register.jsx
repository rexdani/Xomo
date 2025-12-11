import React, { useState } from "react";
import axios from "axios";
import { Mail, Lock, User, Phone, ArrowRight, Eye, EyeOff } from "lucide-react";
import AlertModal from "../components/AlertModal";
import "../styles/register.css";
import "../styles/shared.css";
import { BASE_URL } from "../util/config.js";
export default function RegisterPage() {
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertModal, setAlertModal] = useState({ show: false, message: "", type: "error" });

  const showAlert = (message, type = "error") => {
    setAlertModal({ show: true, message, type });
  };

  const closeAlert = () => {
    setAlertModal({ show: false, message: "", type: "error" });
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const registerUser = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const payload = {
        fullName: user.fullName,
        email: user.email,
        password: user.password,
        phone: user.phone
      };
      const response = await axios.post(
        `${BASE_URL}/auth/register`,
        payload,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      showAlert(response.data.message || "Registration successful! Please login.", "success");
      setTimeout(() => { window.location.href = "/"; }, 1500);
    } catch (err) {
      showAlert(err.response?.data?.message || "Registration failed. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    if (!user.fullName || !user.email || !user.password || !user.phone) {
      showAlert("Please fill in all required fields", "error");
      return false;
    }
    if (user.password.length < 6) {
      showAlert("Password must be at least 6 characters long", "error");
      return false;
    }
    return true;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      registerUser();
    }
  };

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
          <h1 className="auth-title-pro">Create Account</h1>
          <p className="auth-subtitle-pro">Join XOMO for exclusive benefits</p>
        </div>

        <div className="auth-form-pro">
              <div className="input-group-pro">
                <div className="input-wrapper-pro">
              <User className="input-icon-pro" size={20} strokeWidth={2} />
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    className="auth-input-pro"
                autoComplete="name"
                  />
                </div>
              </div>

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
                autoComplete="new-password"
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
                <div className="input-hint-pro">Minimum 6 characters</div>
              </div>

              <div className="input-group-pro">
                <div className="input-wrapper-pro">
              <Phone className="input-icon-pro" size={20} strokeWidth={2} />
                  <input
                type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    className="auth-input-pro"
                autoComplete="tel"
                    />
                  </div>
                </div>

                <button 
                  className={`auth-btn-pro primary-pro ${isLoading ? 'loading' : ''}`}
                  onClick={registerUser}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="shared-spinner shared-spinner-small"></div>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
        </div>

        <div className="auth-footer-pro">
          <p>
            Already have an account?{" "}
            <a href="/" className="auth-link-pro">Sign in</a>
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