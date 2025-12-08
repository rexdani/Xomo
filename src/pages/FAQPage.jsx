import React, { useState } from "react";
import { HelpCircle, Search, ShoppingBag, CreditCard, Truck, RotateCcw, User, Package } from "lucide-react";
import Header from "../components/Header";
import "../styles/faq.css";

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const faqCategories = [
    {
      icon: <ShoppingBag size={24} />,
      title: "Orders & Products",
      faqs: [
        {
          question: "How do I place an order?",
          answer: "Browse our collection, select items you like, add them to your cart, and proceed to checkout. You'll need to create an account or log in to complete your purchase."
        },
        {
          question: "Can I modify or cancel my order?",
          answer: "You can modify or cancel your order within 2 hours of placing it by contacting our customer service. After that, orders are processed and cannot be changed."
        },
        {
          question: "How do I track my order?",
          answer: "Once your order ships, you'll receive a tracking number via email and SMS. You can also track your order from your account dashboard under 'Orders'."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit/debit cards, UPI, net banking, and cash on delivery (COD) for orders within India."
        }
      ]
    },
    {
      icon: <Truck size={24} />,
      title: "Shipping & Delivery",
      faqs: [
        {
          question: "How long does shipping take?",
          answer: "Standard shipping takes 5-7 business days within India. Express shipping (2-3 days) is available for ₹199. International orders take 10-14 business days."
        },
        {
          question: "Do you offer free shipping?",
          answer: "Yes! We offer free standard shipping on all orders above ₹999 within India. International shipping charges vary by location."
        },
        {
          question: "Which countries do you ship to?",
          answer: "We currently ship to over 50 countries worldwide. Check our shipping page for the complete list and shipping rates."
        },
        {
          question: "What if my package is lost or damaged?",
          answer: "If your package is lost or arrives damaged, contact us immediately with photos. We'll arrange a replacement or full refund at no extra cost."
        }
      ]
    },
    {
      icon: <RotateCcw size={24} />,
      title: "Returns & Exchanges",
      faqs: [
        {
          question: "What is your return policy?",
          answer: "We offer a 30-day return policy. Items must be unworn, unwashed, and have original tags attached. Returns are free for defective items or wrong orders."
        },
        {
          question: "How do I return an item?",
          answer: "Log into your account, go to 'Orders', select the order you want to return, and click 'Return Item'. Follow the instructions to generate a prepaid return label."
        },
        {
          question: "How long does it take to process a refund?",
          answer: "Once we receive your return, we'll process your refund within 5-7 business days. The refund will appear in your original payment method within 2-3 additional business days."
        },
        {
          question: "Can I exchange an item for a different size?",
          answer: "Yes! You can request an exchange when initiating a return. If the item you want is in stock, we'll ship it immediately."
        }
      ]
    },
    {
      icon: <User size={24} />,
      title: "Account & Profile",
      faqs: [
        {
          question: "How do I create an account?",
          answer: "Click on 'Sign Up' in the header, fill in your details, and verify your email address. You can also sign up using your Google account."
        },
        {
          question: "I forgot my password. How do I reset it?",
          answer: "Click on 'Forgot Password' on the login page, enter your email address, and we'll send you a password reset link."
        },
        {
          question: "How do I update my profile information?",
          answer: "Log into your account and go to 'Profile'. You can update your personal information, shipping addresses, and preferences there."
        },
        {
          question: "Can I have multiple addresses saved?",
          answer: "Yes! You can save multiple shipping addresses in your address book and select the one you want to use during checkout."
        }
      ]
    },
    {
      icon: <Package size={24} />,
      title: "Product Information",
      faqs: [
        {
          question: "How do I know what size to order?",
          answer: "Each product page includes a size guide with measurements. We recommend measuring yourself and comparing with our size chart for the best fit."
        },
        {
          question: "Are your products authentic?",
          answer: "Yes, all our products are 100% authentic. We source directly from authorized suppliers and manufacturers."
        },
        {
          question: "Do you offer gift wrapping?",
          answer: "Yes! You can add gift wrapping during checkout for an additional ₹99. We'll include a personalized message card."
        },
        {
          question: "What materials are your products made from?",
          answer: "We use high-quality materials including organic cotton, sustainable fabrics, and premium materials. Check individual product descriptions for specific details."
        }
      ]
    },
    {
      icon: <CreditCard size={24} />,
      title: "Payment & Billing",
      faqs: [
        {
          question: "Is it safe to shop on your website?",
          answer: "Absolutely! We use industry-standard SSL encryption to protect your personal and payment information. We never store your complete card details."
        },
        {
          question: "Do you charge for COD?",
          answer: "Yes, there is a ₹50 COD charge for cash on delivery orders. This helps cover the additional processing costs."
        },
        {
          question: "When will I be charged?",
          answer: "For card payments and UPI, you'll be charged immediately when you place your order. For COD, you pay when you receive the package."
        },
        {
          question: "Can I use multiple payment methods?",
          answer: "Currently, you can only use one payment method per order. However, you can split payments using gift cards and another payment method."
        }
      ]
    }
  ];

  const allFaqs = faqCategories.flatMap(category => 
    category.faqs.map(faq => ({ ...faq, category: category.title }))
  );

  const filteredFaqs = searchQuery
    ? allFaqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allFaqs;

  return (
    <>
      <Header />
      <div className="faq-page">
        {/* Hero Section */}
        <section className="faq-hero">
          <div className="container">
            <div className="hero-content">
              <HelpCircle size={64} className="hero-icon" />
              <h1 className="hero-title">Frequently Asked Questions</h1>
              <p className="hero-subtitle">
                Find answers to common questions about shopping, shipping, returns, and more.
              </p>
              
              {/* Search Bar */}
              <div className="faq-search">
                <Search size={20} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search for questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="faq-container">
          <div className="container">
            {searchQuery ? (
              /* Search Results */
              <section className="search-results-section">
                <h2 className="section-title">
                  Search Results {filteredFaqs.length > 0 && `(${filteredFaqs.length})`}
                </h2>
                {filteredFaqs.length > 0 ? (
                  <div className="faq-list">
                    {filteredFaqs.map((faq, index) => (
                      <details key={index} className="faq-item">
                        <summary className="faq-question">
                          {faq.question}
                          <span className="faq-category">{faq.category}</span>
                          <span className="faq-toggle">+</span>
                        </summary>
                        <div className="faq-answer">
                          <p>{faq.answer}</p>
                        </div>
                      </details>
                    ))}
                  </div>
                ) : (
                  <div className="no-results">
                    <p>No results found for "{searchQuery}"</p>
                    <p className="no-results-subtitle">Try searching with different keywords</p>
                  </div>
                )}
              </section>
            ) : (
              /* Category Sections */
              faqCategories.map((category, categoryIndex) => (
                <section key={categoryIndex} className="faq-category-section">
                  <div className="category-header">
                    <div className="category-icon">{category.icon}</div>
                    <h2 className="section-title">{category.title}</h2>
                  </div>
                  <div className="faq-list">
                    {category.faqs.map((faq, index) => (
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
              ))
            )}

            {/* Contact Section */}
            <section className="faq-contact-section">
              <div className="contact-card">
                <h3>Still have questions?</h3>
                <p>Can't find what you're looking for? Our customer service team is here to help.</p>
                <a href="/contact" className="contact-btn">Contact Us</a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

