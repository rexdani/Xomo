import React from "react";
import { Leaf, Recycle, Heart, Globe, CheckCircle, TrendingUp } from "lucide-react";
import Header from "../components/Header";
import "../styles/sustainability.css";

export default function SustainabilityPage() {
  const commitments = [
    {
      icon: <Leaf size={32} />,
      title: "Sustainable Materials",
      description: "We're committed to using eco-friendly and sustainable materials in our products, including organic cotton and recycled fabrics."
    },
    {
      icon: <Recycle size={32} />,
      title: "Circular Economy",
      description: "We promote a circular economy through our recycling programs and initiatives to reduce waste and extend product lifecycles."
    },
    {
      icon: <Globe size={32} />,
      title: "Carbon Neutral Shipping",
      description: "We offset carbon emissions from shipping through partnerships with environmental organizations and carbon offset programs."
    },
    {
      icon: <Heart size={32} />,
      title: "Ethical Manufacturing",
      description: "We work only with partners who share our commitment to fair labor practices and ethical manufacturing standards."
    }
  ];

  const initiatives = [
    {
      title: "Plastic-Free Packaging",
      description: "All our packaging is made from recycled and recyclable materials. We've eliminated single-use plastics from our shipping process."
    },
    {
      title: "Water Conservation",
      description: "We partner with manufacturers who use water-efficient processes and technologies to minimize water consumption."
    },
    {
      title: "Renewable Energy",
      description: "Our warehouses and offices are powered by renewable energy sources, reducing our carbon footprint significantly."
    },
    {
      title: "Community Impact",
      description: "We support local communities through various initiatives and donate a portion of our profits to environmental causes."
    }
  ];

  const goals = [
    {
      year: "2025",
      target: "100% Sustainable Materials",
      description: "All products made from sustainable or recycled materials"
    },
    {
      year: "2026",
      target: "Carbon Neutral Operations",
      description: "Achieve carbon neutrality across all operations"
    },
    {
      year: "2027",
      target: "Zero Waste",
      description: "Eliminate waste from our supply chain and operations"
    }
  ];

  const stats = [
    { number: "85%", label: "Sustainable Materials Used" },
    { number: "50%", label: "Carbon Reduction" },
    { number: "100%", label: "Recyclable Packaging" },
    { number: "1M+", label: "Trees Planted" }
  ];

  return (
    <>
      <Header />
      <div className="sustainability-page">
        {/* Hero Section */}
        <section className="sustainability-hero">
          <div className="container">
            <div className="hero-content">
              <Leaf size={64} className="hero-icon" />
              <h1 className="hero-title">Sustainability</h1>
              <p className="hero-subtitle">
                We're committed to making fashion sustainable. Our mission is to create beautiful 
                products while protecting our planet for future generations.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="sustainability-stats-section">
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

        {/* Commitments Section */}
        <section className="commitments-section">
          <div className="container">
            <h2 className="section-title">Our Commitments</h2>
            <p className="section-subtitle">
              The pillars of our sustainability strategy
            </p>
            <div className="commitments-grid">
              {commitments.map((commitment, index) => (
                <div key={index} className="commitment-card">
                  <div className="commitment-icon">{commitment.icon}</div>
                  <h3 className="commitment-title">{commitment.title}</h3>
                  <p className="commitment-description">{commitment.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Initiatives Section */}
        <section className="initiatives-section">
          <div className="container">
            <h2 className="section-title">Our Initiatives</h2>
            <p className="section-subtitle">
              Concrete actions we're taking to make a difference
            </p>
            <div className="initiatives-list">
              {initiatives.map((initiative, index) => (
                <div key={index} className="initiative-item">
                  <CheckCircle size={24} className="initiative-check" />
                  <div className="initiative-content">
                    <h3 className="initiative-title">{initiative.title}</h3>
                    <p className="initiative-description">{initiative.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Goals Section */}
        <section className="goals-section">
          <div className="container">
            <h2 className="section-title">Our Goals</h2>
            <p className="section-subtitle">
              Ambitious targets for a sustainable future
            </p>
            <div className="goals-grid">
              {goals.map((goal, index) => (
                <div key={index} className="goal-card">
                  <div className="goal-year">{goal.year}</div>
                  <h3 className="goal-target">{goal.target}</h3>
                  <p className="goal-description">{goal.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="sustainability-cta-section">
          <div className="container">
            <div className="cta-card">
              <TrendingUp size={48} className="cta-icon" />
              <h2>Join Us on This Journey</h2>
              <p>
                Sustainability is a collective effort. Together, we can make a difference. 
                Learn more about how you can contribute to a more sustainable future.
              </p>
              <a href="/contact" className="cta-btn">Get Involved</a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

