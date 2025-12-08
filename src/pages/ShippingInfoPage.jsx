import React from "react";
import { Truck, Clock, Package, MapPin, Shield, CheckCircle } from "lucide-react";
import Header from "../components/Header";
import "../styles/shipping.css";

export default function ShippingInfoPage() {
  const shippingOptions = [
    {
      icon: <Truck size={24} />,
      title: "Standard Shipping",
      duration: "5-7 Business Days",
      price: "Free on orders over ₹999",
      description: "Regular delivery within India"
    },
    {
      icon: <Clock size={24} />,
      title: "Express Shipping",
      duration: "2-3 Business Days",
      price: "₹199",
      description: "Fast delivery for urgent orders"
    },
    {
      icon: <Package size={24} />,
      title: "International Shipping",
      duration: "10-14 Business Days",
      price: "Varies by location",
      description: "Available to 50+ countries"
    }
  ];

  const shippingInfo = [
    {
      icon: <MapPin size={24} />,
      title: "Shipping Locations",
      details: [
        "We ship to all major cities in India",
        "International shipping to 50+ countries",
        "Free shipping on orders above ₹999 within India"
      ]
    },
    {
      icon: <Shield size={24} />,
      title: "Package Protection",
      details: [
        "All packages are securely packed",
        "Insurance included for orders above ₹5000",
        "Track your order in real-time"
      ]
    },
    {
      icon: <CheckCircle size={24} />,
      title: "Delivery Process",
      details: [
        "Order confirmation sent via email",
        "Shipping notification with tracking number",
        "SMS updates on delivery status"
      ]
    }
  ];

  const faqs = [
    {
      question: "How long does shipping take?",
      answer: "Standard shipping takes 5-7 business days within India. Express shipping (2-3 days) is available for ₹199. International orders take 10-14 business days."
    },
    {
      question: "Do you offer free shipping?",
      answer: "Yes! We offer free standard shipping on all orders above ₹999 within India. International shipping charges vary by location."
    },
    {
      question: "How can I track my order?",
      answer: "Once your order ships, you'll receive a tracking number via email and SMS. You can track your order from your account dashboard or using the tracking link provided."
    },
    {
      question: "What if my package is damaged?",
      answer: "If your package arrives damaged, please contact us within 48 hours with photos. We'll arrange a replacement or full refund immediately."
    },
    {
      question: "Can I change my shipping address?",
      answer: "You can change your shipping address within 2 hours of placing your order by contacting our support team. After that, changes may not be possible if the order has already been processed."
    }
  ];

  return (
    <>
      <Header />
      <div className="shipping-page">
        {/* Hero Section */}
        <section className="shipping-hero">
          <div className="container">
            <div className="hero-content">
              <h1 className="hero-title">Shipping Information</h1>
              <p className="hero-subtitle">
                Fast, reliable, and secure delivery to your doorstep. Learn about our shipping options and policies.
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="shipping-container">
          <div className="container">
            {/* Shipping Options */}
            <section className="shipping-options-section">
              <h2 className="section-title">Shipping Options</h2>
              <p className="section-subtitle">Choose the delivery option that works best for you</p>
              
              <div className="shipping-options-grid">
                {shippingOptions.map((option, index) => (
                  <div key={index} className="shipping-option-card">
                    <div className="option-icon">{option.icon}</div>
                    <h3 className="option-title">{option.title}</h3>
                    <p className="option-duration">{option.duration}</p>
                    <p className="option-price">{option.price}</p>
                    <p className="option-description">{option.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Shipping Information */}
            <section className="shipping-info-section">
              <h2 className="section-title">Shipping Details</h2>
              
              <div className="shipping-info-grid">
                {shippingInfo.map((info, index) => (
                  <div key={index} className="shipping-info-card">
                    <div className="info-icon">{info.icon}</div>
                    <div className="info-content">
                      <h3 className="info-title">{info.title}</h3>
                      <ul className="info-list">
                        {info.details.map((detail, idx) => (
                          <li key={idx}>{detail}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQ Section */}
            <section className="shipping-faq-section">
              <h2 className="section-title">Frequently Asked Questions</h2>
              <div className="faq-list">
                {faqs.map((faq, index) => (
                  <details key={index} className="faq-item">
                    <summary className="faq-question">
                      {faq.question}
                      <span className="faq-toggle">+</span>
                    </summary>
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

