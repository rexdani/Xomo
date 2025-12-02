import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Star, Clock, Users, ShoppingBag, TrendingUp } from "lucide-react";
import "../styles/collections.css";

export default function CollectionsPage() {
  const [collections, setCollections] = useState([
    {
      id: 1,
      name: "Summer Vibes 2024",
      description: "Fresh, breezy styles for the sunny days ahead",
      itemCount: 42,
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&auto=format&fit=crop",
      featured: true,
      newArrivals: true,
      discount: 20
    },
    {
      id: 2,
      name: "Minimalist Wardrobe",
      description: "Essential pieces for timeless style",
      itemCount: 28,
      image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w-800&auto=format&fit=crop",
      featured: true
    },
    {
      id: 3,
      name: "Office Essentials",
      description: "Professional attire for the modern workplace",
      itemCount: 35,
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop",
      trending: true
    },
    {
      id: 4,
      name: "Weekend Casual",
      description: "Comfort meets style for your downtime",
      itemCount: 51,
      image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&auto=format&fit=crop"
    },
    {
      id: 5,
      name: "Athleisure",
      description: "Performance wear with everyday aesthetics",
      itemCount: 39,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop",
      newArrivals: true
    },
    {
      id: 6,
      name: "Evening Elegance",
      description: "Statement pieces for special occasions",
      itemCount: 24,
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop",
      featured: true
    }
  ]);

  const [activeFilter, setActiveFilter] = useState("all");

  const filteredCollections = collections.filter(collection => {
    if (activeFilter === "all") return true;
    if (activeFilter === "featured") return collection.featured;
    if (activeFilter === "new") return collection.newArrivals;
    if (activeFilter === "trending") return collection.trending;
    return true;
  });

  return (
    <div className="collections-page">
      {/* Hero Section */}
      <section className="collections-hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">Curated Collections</h1>
              <p className="hero-subtitle">
                Discover thoughtfully assembled collections designed for your lifestyle. 
                Each collection tells a story through carefully selected pieces.
              </p>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">{collections.length}</div>
                <div className="stat-label">Collections</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">219</div>
                <div className="stat-label">Unique Pieces</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">New Arrivals</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Navigation */}
      <section className="collections-filters">
        <div className="container">
          <div className="filters-container">
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${activeFilter === "all" ? "active" : ""}`}
                onClick={() => setActiveFilter("all")}
              >
                All Collections
              </button>
              <button 
                className={`filter-btn ${activeFilter === "featured" ? "active" : ""}`}
                onClick={() => setActiveFilter("featured")}
              >
                <Star size={16} />
                Featured
              </button>
              <button 
                className={`filter-btn ${activeFilter === "new" ? "active" : ""}`}
                onClick={() => setActiveFilter("new")}
              >
                <Clock size={16} />
                New Arrivals
              </button>
              <button 
                className={`filter-btn ${activeFilter === "trending" ? "active" : ""}`}
                onClick={() => setActiveFilter("trending")}
              >
                <TrendingUp size={16} />
                Trending
              </button>
            </div>
            
            <div className="filter-info">
              <span className="results-count">
                Showing {filteredCollections.length} of {collections.length} collections
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Collections Grid */}
      <main className="collections-main">
        <div className="container">
          <div className="collections-grid">
            {filteredCollections.map((collection) => (
              <div key={collection.id} className="collection-card">
                <div className="collection-media">
                  <img 
                    src={collection.image} 
                    alt={collection.name}
                    className="collection-image"
                  />
                  <div className="collection-badges">
                    {collection.featured && (
                      <span className="badge featured">
                        <Star size={12} />
                        Featured
                      </span>
                    )}
                    {collection.newArrivals && (
                      <span className="badge new">New</span>
                    )}
                    {collection.trending && (
                      <span className="badge trending">
                        <TrendingUp size={12} />
                        Trending
                      </span>
                    )}
                    {collection.discount && (
                      <span className="badge discount">-{collection.discount}%</span>
                    )}
                  </div>
                  <div className="collection-overlay">
                    <Link to={`/collection/${collection.id}`} className="view-collection-btn">
                      View Collection
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
                
                <div className="collection-content">
                  <div className="collection-header">
                    <h3 className="collection-name">{collection.name}</h3>
                    <div className="collection-meta">
                      <span className="meta-item">
                        <ShoppingBag size={14} />
                        {collection.itemCount} items
                      </span>
                    </div>
                  </div>
                  
                  <p className="collection-description">{collection.description}</p>
                  
                  <div className="collection-footer">
                    <Link to={`/collection/${collection.id}`} className="collection-link">
                      Explore Collection
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredCollections.length === 0 && (
            <div className="empty-collections">
              <div className="empty-icon">📦</div>
              <h3>No Collections Found</h3>
              <p>Try adjusting your filters or check back later for new collections.</p>
              <button 
                className="btn primary"
                onClick={() => setActiveFilter("all")}
              >
                View All Collections
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Featured Collection */}
      {collections.some(c => c.featured) && (
        <section className="featured-collection">
          <div className="container">
            <div className="featured-content">
              <div className="featured-text">
                <span className="featured-label">Featured Collection</span>
                <h2 className="featured-title">Summer Vibes 2024</h2>
                <p className="featured-description">
                  Our most popular collection this season. Fresh, vibrant styles designed 
                  for comfort and confidence. Limited time offer available.
                </p>
                <div className="featured-stats">
                  <div className="featured-stat">
                    <Users size={20} />
                    <div>
                      <div className="stat-value">5K+</div>
                      <div className="stat-label">Happy Customers</div>
                    </div>
                  </div>
                  <div className="featured-stat">
                    <ShoppingBag size={20} />
                    <div>
                      <div className="stat-value">42</div>
                      <div className="stat-label">Unique Items</div>
                    </div>
                  </div>
                </div>
                <Link to="/collection/1" className="btn featured-cta">
                  Explore Featured Collection
                  <ChevronRight size={18} />
                </Link>
              </div>
              <div className="featured-image">
                <img 
                  src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=1000&auto=format&fit=crop" 
                  alt="Featured Collection"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <section className="collections-newsletter">
        <div className="container">
          <div className="newsletter-content">
            <h2 className="newsletter-title">Stay Updated</h2>
            <p className="newsletter-subtitle">
              Be the first to know about new collections, exclusive offers, and style tips.
            </p>
            <form className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email address"
                className="newsletter-input"
              />
              <button type="submit" className="newsletter-btn">
                Subscribe
              </button>
            </form>
            <p className="newsletter-note">
              By subscribing, you agree to our Privacy Policy and consent to receive updates.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}