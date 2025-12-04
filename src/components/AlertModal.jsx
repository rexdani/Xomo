import React from "react";
import { AlertCircle, CheckCircle, XCircle, Info } from "lucide-react";
import "../styles/alertModal.css";

export default function AlertModal({ show, message, type = "error", onClose }) {
  if (!show) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle size={48} />;
      case "error":
        return <XCircle size={48} />;
      case "info":
        return <Info size={48} />;
      default:
        return <AlertCircle size={48} />;
    }
  };

  const getIconClass = () => {
    switch (type) {
      case "success":
        return "alert-modal-icon success";
      case "error":
        return "alert-modal-icon error";
      case "info":
        return "alert-modal-icon info";
      default:
        return "alert-modal-icon";
    }
  };

  return (
    <div className="alert-modal-overlay" onClick={onClose}>
      <div className="alert-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className={getIconClass()}>
          {getIcon()}
        </div>
        <p className="alert-modal-message">{message}</p>
        <button className="alert-modal-btn" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
}

