import React from "react";
import { Briefcase, Users, TrendingUp, Heart, Mail, MapPin, Clock } from "lucide-react";
import Header from "../components/Header";
import "../styles/careers.css";

export default function CareersPage() {
  const openPositions = [
    {
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "Remote / Mumbai",
      type: "Full-time",
      description: "We're looking for an experienced React developer to join our engineering team."
    },
    {
      title: "UX/UI Designer",
      department: "Design",
      location: "Mumbai",
      type: "Full-time",
      description: "Create beautiful and intuitive user experiences for our e-commerce platform."
    },
    {
      title: "Customer Success Manager",
      department: "Support",
      location: "Remote",
      type: "Full-time",
      description: "Help our customers have the best shopping experience possible."
    },
    {
      title: "Marketing Specialist",
      department: "Marketing",
      location: "Mumbai",
      type: "Full-time",
      description: "Drive growth through creative marketing campaigns and strategies."
    }
  ];

  const benefits = [
    {
      icon: <Heart size={24} />,
      title: "Health & Wellness",
      description: "Comprehensive health insurance and wellness programs"
    },
    {
      icon: <Clock size={24} />,
      title: "Work-Life Balance",
      description: "Flexible working hours and remote work options"
    },
    {
      icon: <TrendingUp size={24} />,
      title: "Career Growth",
      description: "Opportunities for professional development and advancement"
    },
    {
      icon: <Users size={24} />,
      title: "Great Culture",
      description: "Collaborative environment with amazing colleagues"
    }
  ];

  const values = [
    "Innovation and creativity",
    "Customer-centric approach",
    "Collaboration and teamwork",
    "Continuous learning",
    "Work-life balance"
  ];

  return (
    <>
      <Header />
      <div className="careers-page">
        {/* Hero Section */}
        <section className="careers-hero">
          <div className="container">
            <div className="hero-content">
              <Briefcase size={64} className="hero-icon" />
              <h1 className="hero-title">Join Our Team</h1>
              <p className="hero-subtitle">
                Be part of a dynamic team that's revolutionizing online fashion retail. 
                We're looking for passionate individuals who share our vision.
              </p>
            </div>
          </div>
        </section>

        {/* Why Join Us Section */}
        <section className="why-join-section">
          <div className="container">
            <h2 className="section-title">Why Join XOMO?</h2>
            <div className="benefits-grid">
              {benefits.map((benefit, index) => (
                <div key={index} className="benefit-card">
                  <div className="benefit-icon">{benefit.icon}</div>
                  <h3 className="benefit-title">{benefit.title}</h3>
                  <p className="benefit-description">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="positions-section">
          <div className="container">
            <h2 className="section-title">Open Positions</h2>
            <p className="section-subtitle">
              We're always looking for talented individuals to join our growing team
            </p>
            
            <div className="positions-list">
              {openPositions.map((position, index) => (
                <div key={index} className="position-card">
                  <div className="position-header">
                    <h3 className="position-title">{position.title}</h3>
                    <div className="position-badges">
                      <span className="badge department">{position.department}</span>
                      <span className="badge type">{position.type}</span>
                    </div>
                  </div>
                  <div className="position-details">
                    <div className="detail-item">
                      <MapPin size={18} />
                      <span>{position.location}</span>
                    </div>
                  </div>
                  <p className="position-description">{position.description}</p>
                  <a href="/contact" className="apply-btn">Apply Now</a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Culture Section */}
        <section className="culture-section">
          <div className="container">
            <div className="culture-content">
              <h2 className="section-title">Our Culture</h2>
              <p className="culture-text">
                At XOMO, we believe in creating an environment where everyone can thrive. 
                We value diversity, encourage innovation, and support each other's growth.
              </p>
              <div className="values-list">
                <h3 className="values-title">What We Value:</h3>
                <ul className="values-items">
                  {values.map((value, index) => (
                    <li key={index}>{value}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="careers-contact-section">
          <div className="container">
            <div className="contact-card">
              <Mail size={48} className="contact-icon" />
              <h3>Don't See a Role That Fits?</h3>
              <p>
                We're always interested in connecting with talented people. 
                Send us your resume and we'll keep you in mind for future opportunities.
              </p>
              <a href="/contact" className="contact-btn">Get in Touch</a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

