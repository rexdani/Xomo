import React from "react";
import { Heart, Target, Users, Award, TrendingUp, Sparkles } from "lucide-react";
import Header from "../components/Header";
import "../styles/about.css";

export default function AboutPage() {
  const values = [
    {
      icon: <Heart size={32} />,
      title: "Customer First",
      description: "Your satisfaction is our top priority. We're committed to providing exceptional service and quality products."
    },
    {
      icon: <Target size={32} />,
      title: "Quality Excellence",
      description: "We source only the finest materials and work with trusted partners to ensure premium quality in every product."
    },
    {
      icon: <Sparkles size={32} />,
      title: "Innovation",
      description: "We stay ahead of trends and continuously innovate to bring you the latest in fashion and style."
    },
    {
      icon: <Users size={32} />,
      title: "Community",
      description: "We believe in building a community of fashion enthusiasts who share our passion for style and quality."
    }
  ];

  const milestones = [
    {
      year: "2020",
      title: "Founded",
      description: "XOMO was born with a vision to revolutionize online fashion retail"
    },
    {
      year: "2021",
      title: "10K Customers",
      description: "Reached our first 10,000 happy customers milestone"
    },
    {
      year: "2022",
      title: "National Expansion",
      description: "Expanded shipping to all major cities across India"
    },
    {
      year: "2023",
      title: "International Launch",
      description: "Started shipping to 50+ countries worldwide"
    },
    {
      year: "2024",
      title: "1M+ Orders",
      description: "Celebrated over 1 million successful orders delivered"
    }
  ];

  const stats = [
    { number: "1M+", label: "Happy Customers" },
    { number: "50+", label: "Countries Served" },
    { number: "10K+", label: "Products" },
    { number: "99%", label: "Satisfaction Rate" }
  ];

  return (
    <>
      <Header />
      <div className="about-page">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="container">
            <div className="hero-content">
              <h1 className="hero-title">About XOMO</h1>
              <p className="hero-subtitle">
                We're more than just a fashion brand. We're a movement dedicated to bringing you 
                the latest trends, premium quality, and exceptional service.
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="story-section">
          <div className="container">
            <div className="story-content">
              <div className="story-text">
                <h2 className="section-title">Our Story</h2>
                <p className="story-paragraph">
                  Founded in 2020, XOMO began with a simple mission: to make high-quality fashion 
                  accessible to everyone. What started as a small online store has grown into a 
                  trusted brand serving customers across India and beyond.
                </p>
                <p className="story-paragraph">
                  We believe that fashion is a form of self-expression. Every piece in our collection 
                  is carefully curated to help you express your unique style. From everyday essentials 
                  to statement pieces, we've got something for everyone.
                </p>
                <p className="story-paragraph">
                  Our commitment to quality, customer service, and sustainability drives everything 
                  we do. We're not just selling clothes—we're building a community of fashion lovers 
                  who value style, quality, and authenticity.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="container">
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <div key={index} className="stat-card">
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="values-section">
          <div className="container">
            <h2 className="section-title text-center">Our Values</h2>
            <p className="section-subtitle text-center">
              The principles that guide everything we do
            </p>
            <div className="values-grid">
              {values.map((value, index) => (
                <div key={index} className="value-card">
                  <div className="value-icon">{value.icon}</div>
                  <h3 className="value-title">{value.title}</h3>
                  <p className="value-description">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Milestones Section */}
        <section className="milestones-section">
          <div className="container">
            <h2 className="section-title text-center">Our Journey</h2>
            <p className="section-subtitle text-center">
              Key milestones in our growth story
            </p>
            <div className="milestones-timeline">
              {milestones.map((milestone, index) => (
                <div key={index} className="milestone-item">
                  <div className="milestone-year">{milestone.year}</div>
                  <div className="milestone-content">
                    <h3 className="milestone-title">{milestone.title}</h3>
                    <p className="milestone-description">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="mission-section">
          <div className="container">
            <div className="mission-content">
              <Award size={64} className="mission-icon" />
              <h2 className="section-title">Our Mission</h2>
              <p className="mission-text">
                To democratize fashion by making premium quality, trend-forward clothing accessible 
                to everyone. We're committed to providing exceptional value, outstanding customer 
                service, and a shopping experience that exceeds expectations.
              </p>
              <p className="mission-text">
                We envision a future where everyone can express their unique style confidently, 
                knowing they're wearing quality products from a brand they can trust.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

