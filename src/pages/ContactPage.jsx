import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, Check, Loader, MessageCircle, ArrowRight, Sparkles } from "lucide-react";
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
      const response = await axios.post(
        `${BASE_URL}/contact`,
        form,
        authHeader
      );
  
      console.log("Backend Response:", response.data);
  
      setSubmitted(true);
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSubmitted(false), 5000);
  
    } catch (error) {
      console.error("Error submitting contact form:", error);
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <Mail size={28} />,
      title: "Email Us",
      details: ["support@xomo.com", "sales@xomo.com"],
      description: "We'll respond within 24 hours",
      color: "#667eea"
    },
    {
      icon: <Phone size={28} />,
      title: "Call Us",
      details: ["+91 98765 43210", "+91 98765 43211"],
      description: "Mon-Fri, 9am-6pm IST",
      color: "#10b981"
    },
    {
      icon: <MapPin size={28} />,
      title: "Visit Us",
      details: ["123 Fashion Street", "Mumbai, Maharashtra 400001"],
      description: "By appointment only",
      color: "#f59e0b"
    },
    {
      icon: <Clock size={28} />,
      title: "Business Hours",
      details: ["Monday - Friday: 9am - 6pm", "Saturday: 10am - 4pm"],
      description: "Closed on Sundays & Public Holidays",
      color: "#8b5cf6"
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
      <div className="contact-page-new">
        {/* Hero Section */}
        <section className="contact-hero-new">
          <div className="hero-bg-pattern"></div>
          <div className="container-new">
            <div className="hero-content-new">
              <div className="hero-badge-new">
                <Sparkles size={16} />
                <span>Get in Touch</span>
              </div>
              <h1 className="hero-title-new">
                Let's Start a <span className="gradient-text-new">Conversation</span>
              </h1>
              <p className="hero-subtitle-new">
                We're here to help! Whether you have a question, feedback, or want to explore partnership opportunities, 
                our team is ready to assist you.
              </p>
              <div className="hero-stats-new">
                <div className="stat-item-new">
                  <div className="stat-number-new">24h</div>
                  <div className="stat-label-new">Response Time</div>
                </div>
                <div className="stat-divider-new"></div>
                <div className="stat-item-new">
                  <div className="stat-number-new">100%</div>
                  <div className="stat-label-new">Satisfaction</div>
                </div>
                <div className="stat-divider-new"></div>
                <div className="stat-item-new">
                  <div className="stat-number-new">24/7</div>
                  <div className="stat-label-new">Support</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Methods Section */}
        <section className="contact-methods-section">
          <div className="container-new">
            <div className="section-header-new">
              <h2 className="section-title-new">Choose Your Preferred Method</h2>
              <p className="section-subtitle-new">
                Multiple ways to reach us - pick what works best for you
              </p>
            </div>
            <div className="contact-cards-grid">
              {contactInfo.map((info, index) => (
                <div key={index} className="contact-card-new" style={{ '--card-color': info.color }}>
                  <div className="card-icon-wrapper-new">
                    <div className="card-icon-bg-new"></div>
                    <div className="card-icon-new">{info.icon}</div>
                  </div>
                  <h3 className="card-title-new">{info.title}</h3>
                  <div className="card-details-new">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="card-detail-item">{detail}</p>
                    ))}
                  </div>
                  <p className="card-description-new">{info.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content - Form & Info */}
        <section className="contact-main-section">
          <div className="container-new">
            <div className="contact-layout-new">
              {/* Contact Form */}
              <div className="form-container-new">
                <div className="form-header-new">
                  <div className="form-icon-wrapper-new">
                    <MessageCircle size={32} />
                  </div>
                  <h2 className="form-title-new">Send us a Message</h2>
                  <p className="form-subtitle-new">
                    Fill out the form below and our team will get back to you as soon as possible.
                  </p>
                </div>

                {submitted ? (
                  <div className="success-container-new">
                    <div className="success-icon-wrapper-new">
                      <Check size={48} />
                    </div>
                    <h3 className="success-title-new">Message Sent Successfully!</h3>
                    <p className="success-message-new">
                      Thank you for reaching out. We'll get back to you within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form className="contact-form-new" onSubmit={handleSubmit}>
                    <div className="form-grid-new">
                      <div className="form-group-new">
                        <label htmlFor="name" className="form-label-new">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          placeholder="John Doe"
                          value={form.name}
                          onChange={handleChange}
                          className={`form-input-new ${errors.name ? 'error' : ''}`}
                        />
                        {errors.name && <span className="error-text-new">{errors.name}</span>}
                      </div>

                      <div className="form-group-new">
                        <label htmlFor="email" className="form-label-new">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          placeholder="john@example.com"
                          value={form.email}
                          onChange={handleChange}
                          className={`form-input-new ${errors.email ? 'error' : ''}`}
                        />
                        {errors.email && <span className="error-text-new">{errors.email}</span>}
                      </div>
                    </div>

                    <div className="form-group-new">
                      <label htmlFor="subject" className="form-label-new">
                        Subject *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        className={`form-input-new form-select-new ${errors.subject ? 'error' : ''}`}
                      >
                        <option value="">Select a subject</option>
                        <option value="general">General Inquiry</option>
                        <option value="order">Order Support</option>
                        <option value="returns">Returns & Exchanges</option>
                        <option value="feedback">Product Feedback</option>
                        <option value="partnership">Business Partnership</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.subject && <span className="error-text-new">{errors.subject}</span>}
                    </div>

                    <div className="form-group-new">
                      <label htmlFor="message" className="form-label-new">
                        Your Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        placeholder="Please describe your inquiry in detail..."
                        rows="6"
                        value={form.message}
                        onChange={handleChange}
                        className={`form-textarea-new ${errors.message ? 'error' : ''}`}
                      />
                      {errors.message && <span className="error-text-new">{errors.message}</span>}
                    </div>

                    <button 
                      type="submit" 
                      className="submit-button-new"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader size={20} className="spinner-new" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <ArrowRight size={20} />
                        </>
                      )}
                    </button>
                    
                    <p className="form-note-new">
                      * Required fields. By submitting this form, you agree to our Privacy Policy.
                    </p>
                  </form>
                )}
              </div>

              {/* FAQ Sidebar */}
              <div className="faq-sidebar-new">
                <div className="faq-header-new">
                  <h2 className="faq-title-new">Frequently Asked Questions</h2>
                  <p className="faq-subtitle-new">
                    Quick answers to common questions
                  </p>
                </div>
                <div className="faq-list-new">
                  {faqs.map((faq, index) => (
                    <details key={index} className="faq-item-new">
                      <summary className="faq-question-new">
                        <span>{faq.question}</span>
                        <span className="faq-icon-new">+</span>
                      </summary>
                      <div className="faq-answer-new">
                        <p>{faq.answer}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="map-section-new">
          <div className="container-new">
            <div className="map-header-new">
              <h2 className="map-title-new">Find Our Store</h2>
              <p className="map-subtitle-new">
                Visit our location in Vaiyampatti, Tamil Nadu
              </p>
            </div>
            <div className="map-wrapper-new">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7844.713273079413!2d78.2975219893639!3d10.551240005804052!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baa72c57bd70875%3A0x2dca6b7dfc0882ab!2sVaiyampatti%2C%20Tamil%20Nadu%20621315!5e0!3m2!1sen!2sin!4v1765219376119!5m2!1sen!2sin" 
                width="100%" 
                height="500" 
                style={{border:0}} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="map-iframe-new"
              ></iframe>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
