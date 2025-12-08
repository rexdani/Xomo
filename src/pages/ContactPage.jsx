import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, Check, Loader } from "lucide-react";
import Header from "../components/Header";
import "../styles/contact.css";
import axios from "axios";
import { BASE_URL } from "../util/config.js";
export default function ContactPage() {
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    subject: "", 
    message: "" 
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const token = localStorage.getItem("token");
  const authHeader = {
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!form.subject.trim()) newErrors.subject = "Subject is required";
    if (!form.message.trim()) newErrors.message = "Message is required";
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    setLoading(true);
  
    try {
  
      // SEND FORM DATA PROPERLY
      const response = await axios.post(
        `${BASE_URL}/contact`,
        form,authHeader// <-- Body (correct)
      );
  
      console.log("Backend Response:", response.data);
  
      // Show success message
      setSubmitted(true);
      setForm({ name: "", email: "", subject: "", message: "" });
  
      // Auto-hide success message
      setTimeout(() => setSubmitted(false), 5000);
  
    } catch (error) {
      console.error("Error submitting contact form:", error);
    } finally {
      setLoading(false);
    }
  };
  

  const contactInfo = [
    {
      icon: <Mail size={24} />,
      title: "Email Us",
      details: ["support@xomo.com", "sales@xomo.com"],
      description: "We'll respond within 24 hours"
    },
    {
      icon: <Phone size={24} />,
      title: "Call Us",
      details: ["+91 98765 43210", "+91 98765 43211"],
      description: "Mon-Fri, 9am-6pm IST"
    },
    {
      icon: <MapPin size={24} />,
      title: "Visit Us",
      details: ["123 Fashion Street", "Mumbai, Maharashtra 400001"],
      description: "By appointment only"
    },
    {
      icon: <Clock size={24} />,
      title: "Business Hours",
      details: ["Monday - Friday: 9am - 6pm", "Saturday: 10am - 4pm"],
      description: "Closed on Sundays & Public Holidays"
    }
  ];

  const faqs = [
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy on all items. Items must be in original condition with tags attached."
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping takes 5-7 business days within India. Express shipping (2-3 days) is available at an additional charge."
    },
    {
      question: "Do you ship internationally?",
      answer: "Yes, we ship to over 50 countries. International shipping takes 10-14 business days and duties may apply."
    },
    {
      question: "How can I track my order?",
      answer: "Once your order ships, you'll receive a tracking number via email. You can also track it from your account dashboard."
    }
  ];

  return (
    <>
      <Header />
      <div className="contact-page">
        {/* Hero Section */}
      <section className="contact-hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Get in Touch</h1>
            <p className="hero-subtitle">
              We're here to help! Reach out with any questions, feedback, or partnership inquiries.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="contact-container">
        <div className="container">
          <div className="contact-content">
            {/* Contact Info Sidebar */}
            <div className="contact-sidebar">
              <div className="contact-info-section">
                <h2 className="section-title">Contact Information</h2>
                <p className="section-subtitle">
                  Choose your preferred method to connect with our team.
                </p>
                
                <div className="contact-info-grid">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="contact-info-card">
                      <div className="info-icon">{info.icon}</div>
                      <div className="info-content">
                        <h3 className="info-title">{info.title}</h3>
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="info-detail">{detail}</p>
                        ))}
                        <p className="info-description">{info.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ Section */}
              <div className="faq-section">
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
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-section">
              <div className="form-header">
                <h2 className="form-title">Send us a Message</h2>
                <p className="form-subtitle">
                  Fill out the form below and our team will get back to you as soon as possible.
                </p>
              </div>

              {submitted ? (
                <div className="success-message">
                  <div className="success-icon">
                    <Check size={48} />
                  </div>
                  <h3>Message Sent Successfully!</h3>
                  <p>Thank you for reaching out. We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name" className="form-label">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Enter your full name"
                        value={form.name}
                        onChange={handleChange}
                        className={`form-input ${errors.name ? 'error' : ''}`}
                      />
                      {errors.name && <span className="error-message">{errors.name}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="email" className="form-label">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        value={form.email}
                        onChange={handleChange}
                        className={`form-input ${errors.email ? 'error' : ''}`}
                      />
                      {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject" className="form-label">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className={`form-input ${errors.subject ? 'error' : ''}`}
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="order">Order Support</option>
                      <option value="returns">Returns & Exchanges</option>
                      <option value="feedback">Product Feedback</option>
                      <option value="partnership">Business Partnership</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.subject && <span className="error-message">{errors.subject}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="message" className="form-label">
                      Your Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      placeholder="Please describe your inquiry in detail..."
                      rows="6"
                      value={form.message}
                      onChange={handleChange}
                      className={`form-textarea ${errors.message ? 'error' : ''}`}
                    />
                    {errors.message && <span className="error-message">{errors.message}</span>}
                  </div>

                  <div className="form-footer">
                    <button 
                      type="submit" 
                      className="submit-btn"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader size={20} className="spinner" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={20} />
                          Send Message
                        </>
                      )}
                    </button>
                    
                    <p className="form-note">
                      * Required fields. By submitting this form, you agree to our Privacy Policy.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Map Section */}
          <div className="map-section">
            <div className="map-header">
              <h2 className="section-title">Find Our Store</h2>
              <p className="section-subtitle">Visit our location in Vaiyampatti, Tamil Nadu</p>
            </div>
            <div className="map-container">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7844.713273079413!2d78.2975219893639!3d10.551240005804052!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baa72c57bd70875%3A0x2dca6b7dfc0882ab!2sVaiyampatti%2C%20Tamil%20Nadu%20621315!5e0!3m2!1sen!2sin!4v1765219376119!5m2!1sen!2sin" 
                width="100%" 
                height="450" 
                style={{border:0}} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="map-iframe"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}