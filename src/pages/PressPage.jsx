import React from "react";
import { FileText, Download, Mail, Calendar, Image as ImageIcon } from "lucide-react";
import Header from "../components/Header";
import "../styles/press.css";

export default function PressPage() {
  const pressReleases = [
    {
      date: "March 15, 2024",
      title: "XOMO Reaches 1 Million Orders Milestone",
      description: "Company celebrates major milestone in customer growth and satisfaction"
    },
    {
      date: "February 10, 2024",
      title: "XOMO Expands to 50+ Countries",
      description: "International expansion brings fashion to customers worldwide"
    },
    {
      date: "January 5, 2024",
      title: "New Sustainable Collection Launch",
      description: "Introducing eco-friendly fashion line made from recycled materials"
    },
    {
      date: "December 1, 2023",
      title: "XOMO Partners with Leading Fashion Designers",
      description: "Collaboration brings exclusive designer collections to customers"
    }
  ];

  const mediaKit = [
    {
      icon: <ImageIcon size={24} />,
      title: "Brand Assets",
      description: "Logos, brand guidelines, and visual assets",
      download: "Download"
    },
    {
      icon: <FileText size={24} />,
      title: "Press Kit",
      description: "Company overview, facts, and key information",
      download: "Download"
    },
    {
      icon: <ImageIcon size={24} />,
      title: "Product Images",
      description: "High-resolution product photography",
      download: "Download"
    }
  ];

  const contactInfo = {
    email: "press@xomo.com",
    phone: "+91 98765 43210",
    hours: "Monday - Friday, 9am - 6pm IST"
  };

  return (
    <>
      <Header />
      <div className="press-page">
        {/* Hero Section */}
        <section className="press-hero">
          <div className="container">
            <div className="hero-content">
              <FileText size={64} className="hero-icon" />
              <h1 className="hero-title">Press & Media</h1>
              <p className="hero-subtitle">
                Stay updated with the latest news, press releases, and media resources from XOMO.
              </p>
            </div>
          </div>
        </section>

        {/* Press Releases */}
        <section className="press-releases-section">
          <div className="container">
            <h2 className="section-title">Press Releases</h2>
            <p className="section-subtitle">
              Latest news and announcements from XOMO
            </p>
            
            <div className="releases-list">
              {pressReleases.map((release, index) => (
                <article key={index} className="release-card">
                  <div className="release-date">
                    <Calendar size={18} />
                    <span>{release.date}</span>
                  </div>
                  <h3 className="release-title">{release.title}</h3>
                  <p className="release-description">{release.description}</p>
                  <a href="/contact" className="read-more">Read More →</a>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Media Kit */}
        <section className="media-kit-section">
          <div className="container">
            <h2 className="section-title">Media Kit</h2>
            <p className="section-subtitle">
              Download brand assets and resources for media use
            </p>
            
            <div className="media-kit-grid">
              {mediaKit.map((item, index) => (
                <div key={index} className="media-kit-card">
                  <div className="kit-icon">{item.icon}</div>
                  <h3 className="kit-title">{item.title}</h3>
                  <p className="kit-description">{item.description}</p>
                  <button className="kit-download-btn">
                    <Download size={18} />
                    {item.download}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="press-contact-section">
          <div className="container">
            <div className="contact-content">
              <Mail size={48} className="contact-icon" />
              <h2 className="section-title">Media Inquiries</h2>
              <p className="contact-text">
                For media inquiries, interview requests, or additional information, 
                please contact our press team.
              </p>
              
              <div className="contact-details">
                <div className="contact-item">
                  <strong>Email:</strong>
                  <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
                </div>
                <div className="contact-item">
                  <strong>Phone:</strong>
                  <a href={`tel:${contactInfo.phone}`}>{contactInfo.phone}</a>
                </div>
                <div className="contact-item">
                  <strong>Hours:</strong>
                  <span>{contactInfo.hours}</span>
                </div>
              </div>
              
              <a href="/contact" className="contact-btn">Contact Press Team</a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

