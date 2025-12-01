import React, { useEffect } from "react";
import { CheckCircle, Truck, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/orderSuccess.css";
import { BASE_URL } from "../util/config.js";

export default function OrderSuccessPage() {
  const navigate = useNavigate();

  // Auto redirect after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/orders");
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="success-page">

      <div className="success-card">

        {/* Success Icon */}
        <div className="success-icon">
          <CheckCircle size={80} />
        </div>

        {/* Main Message */}
        <h1 className="success-title">Order Placed Successfully!</h1>
        <p className="success-subtitle">
          Thank you for shopping with us. Your payment has been received and your order is now confirmed.
        </p>

        {/* Delivery Info */}
        <div className="delivery-box">
          <Truck size={28} className="delivery-icon" />
          <div>
            <h3 className="delivery-title">Estimated Delivery</h3>
            <p className="delivery-date">
              Arrival within <strong>3 - 5 business days</strong>
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="success-actions">
          <button 
            className="btn-primary"
            onClick={() => navigate("/orders")}
          >
            View Orders <ArrowRight size={18} />
          </button>

          <button 
            className="btn-secondary"
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </button>
        </div>

        <p className="auto-redirect-text">
          Redirecting to your orders in <strong>5 seconds...</strong>
        </p>
      </div>

    </div>
  );
}
