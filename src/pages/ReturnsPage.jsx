import React from "react";
import { RotateCcw, Clock, Package, CheckCircle, AlertCircle, Mail } from "lucide-react";
import Header from "../components/Header";
import "../styles/returns.css";

export default function ReturnsPage() {
  const returnSteps = [
    {
      icon: <Package size={24} />,
      title: "Initiate Return",
      description: "Log into your account and request a return within 30 days of delivery"
    },
    {
      icon: <RotateCcw size={24} />,
      title: "Pack Items",
      description: "Pack items in original packaging with tags attached"
    },
    {
      icon: <CheckCircle size={24} />,
      title: "Ship Back",
      description: "Use the prepaid return label we provide"
    },
    {
      icon: <Clock size={24} />,
      title: "Get Refund",
      description: "Receive refund within 5-7 business days after we receive your return"
    }
  ];

  const returnPolicy = [
    {
      icon: <Clock size={24} />,
      title: "30-Day Return Window",
      details: [
        "Returns accepted within 30 days of delivery",
        "Items must be unworn, unwashed, and with tags",
        "Original packaging preferred but not required"
      ]
    },
    {
      icon: <AlertCircle size={24} />,
      title: "Non-Returnable Items",
      details: [
        "Underwear and intimate apparel",
        "Items marked as 'Final Sale'",
        "Customized or personalized items",
        "Items damaged by customer"
      ]
    },
    {
      icon: <CheckCircle size={24} />,
      title: "Refund Process",
      details: [
        "Refunds processed to original payment method",
        "Processing time: 5-7 business days",
        "Shipping costs non-refundable (unless item is defective)",
        "Store credit available for faster processing"
      ]
    }
  ];

  const faqs = [
    {
      question: "How do I return an item?",
      answer: "Log into your account, go to 'Orders', select the order you want to return, and click 'Return Item'. Follow the instructions to generate a prepaid return label."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy. Items must be unworn, unwashed, and have original tags attached. Returns are free for defective items or wrong orders."
    },
    {
      question: "How long does it take to process a refund?",
      answer: "Once we receive your return, we'll process your refund within 5-7 business days. The refund will appear in your original payment method within 2-3 additional business days."
    },
    {
      question: "Can I exchange an item instead of returning?",
      answer: "Yes! You can request an exchange when initiating a return. If the item you want is in stock, we'll ship it immediately. If not, we'll process a refund and you can place a new order."
    },
    {
      question: "What if I received a damaged or wrong item?",
      answer: "We're sorry for the inconvenience! Contact us immediately and we'll arrange a free return pickup and send a replacement right away. You may also be eligible for expedited shipping."
    }
  ];

  return (
    <>
      <Header />
      <div className="returns-page">
        {/* Hero Section */}
        <section className="returns-hero">
          <div className="container">
            <div className="hero-content">
              <h1 className="hero-title">Returns & Exchanges</h1>
              <p className="hero-subtitle">
                Easy returns within 30 days. We make the return process simple and hassle-free.
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="returns-container">
          <div className="container">
            {/* Return Process */}
            <section className="return-process-section">
              <h2 className="section-title">How to Return</h2>
              <p className="section-subtitle">Follow these simple steps to return your items</p>
              
              <div className="return-steps-grid">
                {returnSteps.map((step, index) => (
                  <div key={index} className="return-step-card">
                    <div className="step-number">{index + 1}</div>
                    <div className="step-icon">{step.icon}</div>
                    <h3 className="step-title">{step.title}</h3>
                    <p className="step-description">{step.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Return Policy */}
            <section className="return-policy-section">
              <h2 className="section-title">Return Policy</h2>
              
              <div className="return-policy-grid">
                {returnPolicy.map((policy, index) => (
                  <div key={index} className="policy-card">
                    <div className="policy-icon">{policy.icon}</div>
                    <div className="policy-content">
                      <h3 className="policy-title">{policy.title}</h3>
                      <ul className="policy-list">
                        {policy.details.map((detail, idx) => (
                          <li key={idx}>{detail}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQ Section */}
            <section className="returns-faq-section">
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

            {/* Contact Section */}
            <section className="returns-contact-section">
              <div className="contact-card">
                <Mail size={32} className="contact-icon" />
                <h3>Need Help with Returns?</h3>
                <p>Our customer service team is here to assist you with any questions about returns or exchanges.</p>
                <a href="/contact" className="contact-btn">Contact Support</a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

