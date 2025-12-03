import React, { useState } from "react";
import axios from "axios";
import { Mail, Lock, User, Phone, MapPin, ArrowRight, Eye, EyeOff, Sparkles } from "lucide-react";
import "../styles/register.css";
import "../styles/shared.css";
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
          
          <div className="step-indicator-pro">
            <div className={`step-pro ${currentStep >= 1 ? 'active' : ''}`}>
              <div className="step-number-pro">
                <span>1</span>
              </div>
              <div className="step-label-pro">Personal</div>
            </div>
            <div className="step-line-pro"></div>
            <div className={`step-pro ${currentStep >= 2 ? 'active' : ''}`}>
              <div className="step-number-pro">
                <span>2</span>
              </div>
              <div className="step-label-pro">Address</div>
            </div>
          </div>
        </div>

        <div className="auth-form-pro">
          {currentStep === 1 && (
            <>
              <div className="input-group-pro">
                <div className="input-wrapper-pro">
                  <User className="input-icon-pro" size={20} />
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    className="auth-input-pro"
                  />
                </div>
              </div>

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
                <div className="input-hint-pro">Minimum 6 characters</div>
              </div>

              <div className="input-group-pro">
                <div className="input-wrapper-pro">
                  <Phone className="input-icon-pro" size={20} />
                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    className="auth-input-pro"
                  />
                </div>
              </div>

              <button className="auth-btn-pro primary-pro" onClick={nextStep}>
                <span>Continue</span>
                <ArrowRight size={18} />
              </button>
            </>
          )}

          {currentStep === 2 && (
            <>
              <div className="address-section-pro">
                <div className="section-header-pro">
                  <div className="section-icon-wrapper-pro">
                    <MapPin className="section-icon-pro" size={20} />
                  </div>
                  <h3 className="section-title-pro">Shipping Address</h3>
                </div>

                <div className="input-group-pro">
                  <input
                    type="text"
                    name="street"
                    placeholder="Street Address"
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    className="auth-input-pro"
                  />
                </div>

                <div className="form-row-pro">
                  <div className="input-group-pro">
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      onChange={handleChange}
                      onKeyPress={handleKeyPress}
                      className="auth-input-pro"
                    />
                  </div>
                  <div className="input-group-pro">
                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      onChange={handleChange}
                      onKeyPress={handleKeyPress}
                      className="auth-input-pro"
                    />
                  </div>
                </div>

                <div className="form-row-pro">
                  <div className="input-group-pro">
                    <input
                      type="text"
                      name="country"
                      placeholder="Country"
                      onChange={handleChange}
                      onKeyPress={handleKeyPress}
                      className="auth-input-pro"
                    />
                  </div>
                  <div className="input-group-pro">
                    <input
                      type="text"
                      name="postalCode"
                      placeholder="Postal Code"
                      onChange={handleChange}
                      onKeyPress={handleKeyPress}
                      className="auth-input-pro"
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions-pro">
                <button className="auth-btn-pro secondary-pro" onClick={prevStep}>
                  Back
                </button>
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
            </>
          )}
        </div>

        <div className="auth-footer-pro">
          <p>
            Already have an account?{" "}
            <a href="/" className="auth-link-pro">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}