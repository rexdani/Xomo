import React, { useState } from "react";
import axios from "axios";
import { Mail, Lock, User, Phone, MapPin, ArrowRight, Eye, EyeOff } from "lucide-react";
import "../styles/register.css";
import { BASE_URL } from "../util/config.js";
export default function RegisterPage() {
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    country: "",
    postalCode: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

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
        phone: user.phone,
        address: {
          fullName: user.fullName,
          phoneNumber: user.phone,
          street: user.street,
          city: user.city,
          state: user.state,
          country: user.country,
          postalCode: user.postalCode
        }
      };
const host = window.location.hostname;
      const response = await axios.post(
        `${BASE_URL}/auth/register`,
        payload,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      alert(response.data.message || "Registration successful! Please login.");
      window.location.href = "/";
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    if (!user.fullName || !user.email || !user.password || !user.phone) {
      alert("Please fill in all required fields");
      return false;
    }
    if (user.password.length < 6) {
      alert("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (currentStep === 1 && user.fullName && user.email && user.password && user.phone) {
      setCurrentStep(2);
    }
  };

  const prevStep = () => {
    setCurrentStep(1);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (currentStep === 1) nextStep();
      else registerUser();
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-gradient"></div>
      </div>
      
      <div className="auth-card">
        <div className="auth-header">
          <div className="brand-logo">XOMO</div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join XOMO for exclusive benefits</p>
          
          <div className="step-indicator">
            <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
              <span>1</span>
              <div className="step-label">Personal</div>
            </div>
            <div className="step-line"></div>
            <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
              <span>2</span>
              <div className="step-label">Address</div>
            </div>
          </div>
        </div>

        <div className="auth-form">
          {currentStep === 1 && (
            <>
              <div className="input-group">
                <div className="input-wrapper">
                  <User className="input-icon" size={20} />
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    className="auth-input"
                  />
                </div>
              </div>

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
                <div className="input-hint">Minimum 6 characters</div>
              </div>

              <div className="input-group">
                <div className="input-wrapper">
                  <Phone className="input-icon" size={20} />
                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    className="auth-input"
                  />
                </div>
              </div>

              <button className="auth-btn primary" onClick={nextStep}>
                Continue
                <ArrowRight size={18} />
              </button>
            </>
          )}

          {currentStep === 2 && (
            <>
              <div className="address-section">
                <div className="section-header">
                  <MapPin className="section-icon" size={20} />
                  <h3>Shipping Address</h3>
                </div>

                <div className="input-group">
                  <input
                    type="text"
                    name="street"
                    placeholder="Street Address"
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    className="auth-input"
                  />
                </div>

                <div className="form-row">
                  <div className="input-group">
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      onChange={handleChange}
                      onKeyPress={handleKeyPress}
                      className="auth-input"
                    />
                  </div>
                  <div className="input-group">
                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      onChange={handleChange}
                      onKeyPress={handleKeyPress}
                      className="auth-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="input-group">
                    <input
                      type="text"
                      name="country"
                      placeholder="Country"
                      onChange={handleChange}
                      onKeyPress={handleKeyPress}
                      className="auth-input"
                    />
                  </div>
                  <div className="input-group">
                    <input
                      type="text"
                      name="postalCode"
                      placeholder="Postal Code"
                      onChange={handleChange}
                      onKeyPress={handleKeyPress}
                      className="auth-input"
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button className="auth-btn secondary" onClick={prevStep}>
                  Back
                </button>
                <button 
                  className={`auth-btn primary ${isLoading ? 'loading' : ''}`}
                  onClick={registerUser}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="spinner"></div>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <a href="/" className="auth-link">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}