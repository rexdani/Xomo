import React, { useEffect, useState } from "react";
import axios from "axios";
import { Menu, ShoppingCart, Search, User, X, ChevronRight, Star, Truck, Shield, RotateCcw } from "lucide-react";
import "../styles/home.css";
const host = window.location.hostname;
const backendPort = 8081;
export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [ads, setAds] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (ads.length > 1) {
      const interval = setInterval(() => {
        setCurrentAdIndex((prev) => (prev + 1) % ads.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [ads.length]);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([loadAds(), loadCategories(), loadCartCount()]);
    } catch (error) {
      console.error("Error loading initial data", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ------------------- LOAD ADS ------------------- //
  const loadAds = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const authHeader = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(`http://${host}:${backendPort}/home-ads`, authHeader);

      const formattedAds = (res.data || []).map((a) => ({
        ...a,
        imageUrl: `data:image/jpeg;base64,${a.imageBase64 || ""}`,
      }));

      setAds(formattedAds);
    } catch (error) {
      console.error("Error loading ads", error);
    }
  };

  // ------------------- LOAD CATEGORIES ------------------- //
  const loadCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token missing! Please login again.");
        return;
      }
      const authHeader = { headers: { Authorization: `Bearer ${token}` } };

      const category = await axios.get(`http://${host}:${backendPort}/categories`, authHeader);

      const rawCategories = Array.isArray(category.data) ? category.data : [category.data];
      const categoryFormatted = rawCategories.map((c) => ({
        ...c,
        imageUrl: `data:image/jpeg;base64,${c.imageBase64 || ""}`,
      }));

      setCategories(categoryFormatted);
    } catch (error) {
      console.error("Error loading categories", error);
    }
  };

  // ------------------- LOAD CART COUNT ------------------- //
  const loadCartCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      if (!token || !userId) return;
      const authHeader = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(`http://${host}:${backendPort}/cart/count/${userId}`, authHeader);
      setCartCount(res.data || 0);
    } catch (error) {
      console.error("Error fetching cart count", error);
    }
  };

  const nextAd = () => {
    setCurrentAdIndex((prev) => (prev + 1) % ads.length);
  };

  const prevAd = () => {
    setCurrentAdIndex((prev) => (prev - 1 + ads.length) % ads.length);
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading XOMO...</p>
      </div>
    );
  }

  return (
    <div className="home-root">
      {/* ENHANCED NAVIGATION */}
      <header className="site-header">
        <div className="header-inner">
          <div className="brand">
            <a href="/" className="logo">XOMO</a>
          </div>

          <nav className="header-nav">
            <a href="/" className="nav-link active">Home</a>
            <a href="/categories" className="nav-link">Categories</a>
            <a href="/new-arrivals" className="nav-link">New Arrivals</a>
            <a href="/collections" className="nav-link">Collections</a>
            <a href="/contact" className="nav-link">Contact</a>
          </nav>

          <div className="header-actions">
            <div className="search-wrapper">
              <Search className="icon" size={20} />
            </div>
            <a href="/profile" className="user-link">
            <div className="user-wrapper">
              <User className="icon" size={20} />
            </div>
            </a>
            <a href="/cart" className="cart-link">
            <div className="cart-wrapper" title="Cart">
              <ShoppingCart className="icon" size={20} />
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </div>
            </a>

            <button
              className={`hamburger ${mobileMenu ? 'active' : ''}`}
              onClick={() => setMobileMenu((s) => !s)}
              aria-label="Toggle menu"
            >
              {mobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* ENHANCED MOBILE MENU */}
        {mobileMenu && (
          <div className="mobile-drawer">
            <div className="mobile-nav">
              <a href="/" className="mobile-nav-link">Home</a>
              <a href="/categories" className="mobile-nav-link">Categories</a>
              <a href="/new-arrivals" className="mobile-nav-link">New Arrivals</a>
              <a href="/collections" className="mobile-nav-link">Collections</a>
              <a href="/contact" className="mobile-nav-link">Contact</a>
            </div>
          </div>
        )}
      </header>

      {/* ENHANCED HERO SECTION */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-content">
            <div className="hero-copy">
              <div className="hero-badge">New Collection</div>
              <h1 className="hero-title">
                Elevate Your
                <span className="title-accent"> Everyday Style</span>
              </h1>
              <p className="hero-sub">
                Minimal, premium, and built for everyday wear — discover curated collections and exclusive offers crafted for the modern individual.
              </p>

              <div className="hero-cta">
                <a className="btn primary" href="/shop">
                  Shop Collection
                  <ChevronRight size={16} />
                </a>
                <a className="btn secondary" href="/sale">
                  Explore Offers
                </a>
              </div>

              <div className="hero-stats">
                <div className="stat">
                  <div className="stat-number">10K+</div>
                  <div className="stat-label">Happy Customers</div>
                </div>
                <div className="stat">
                  <div className="stat-number">500+</div>
                  <div className="stat-label">Premium Products</div>
                </div>
                <div className="stat">
                  <div className="stat-number">50+</div>
                  <div className="stat-label">Brand Partners</div>
                </div>
              </div>
            </div>

            <div className="hero-media">
  <div className="hero-carousel">
    {ads.length > 0 ? (
      <>
        <div className="carousel-track">
          {ads.map((ad, idx) => (
            <div 
              className={`carousel-slide ${idx === currentAdIndex ? 'active' : ''}`} 
              key={ad.id}
              style={{ 
                transform: `translateX(${(idx - currentAdIndex) * 100}%)`,
                opacity: idx === currentAdIndex ? 1 : 0
              }}
            >
              <img 
                src={ad.imageUrl} 
                alt={ad.title} 
                className="slide-image"
                onError={(e) => {
                  e.target.src = '/placeholder-hero.jpg';
                }}
              />
              <div className="slide-overlay">
                <div className="slide-content">
                  <h3>{ad.title}</h3>
                  <p>{ad.description || 'Discover amazing offers'}</p>
                  {ad.redirectUrl && (
                    <a href={ad.redirectUrl} className="slide-link">
                      Discover More
                      <ChevronRight size={16} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {ads.length > 1 && (
          <>
            <div className="carousel-controls">
              <button className="control-btn prev" onClick={prevAd}>
                <ChevronRight size={20} />
              </button>
              <button className="control-btn next" onClick={nextAd}>
                <ChevronRight size={20} />
              </button>
            </div>
            
            <div className="carousel-indicators">
              {ads.map((_, idx) => (
                <button
                  key={idx}
                  className={`indicator ${idx === currentAdIndex ? 'active' : ''}`}
                  onClick={() => setCurrentAdIndex(idx)}
                />
              ))}
            </div>
          </>
        )}
      </>
    ) : (
      // Fallback when no ads
      <div className="carousel-slide active">
        <img 
          src="/placeholder-hero.jpg" 
          alt="Premium Fashion Collection" 
          className="slide-image"
        />
        <div className="slide-overlay">
          <div className="slide-content">
            <h3>Seasonal Essentials</h3>
            <p>Discover our curated collection for the modern wardrobe</p>
            <a href="/shop" className="slide-link">
              Shop Now
              <ChevronRight size={16} />
            </a>
          </div>
        </div>
      </div>
    )}
  </div>
</div>
          </div>
        </div>
      </section>

      {/* ENHANCED FEATURES STRIP */}
      <section className="features-strip">
        <div className="features-inner">
          <div className="feature-item">
            <Truck className="feature-icon" size={24} />
            <div className="feature-content">
              <div className="feature-title">Free Shipping</div>
              <div className="feature-desc">On orders ₹999+</div>
            </div>
          </div>
          
          <div className="feature-item">
            <RotateCcw className="feature-icon" size={24} />
            <div className="feature-content">
              <div className="feature-title">Easy Returns</div>
              <div className="feature-desc">15 days hassle-free</div>
            </div>
          </div>
          
          <div className="feature-item">
            <Shield className="feature-icon" size={24} />
            <div className="feature-content">
              <div className="feature-title">Secure Payment</div>
              <div className="feature-desc">100% protected</div>
            </div>
          </div>
          
          <div className="feature-item">
            <Star className="feature-icon" size={24} />
            <div className="feature-content">
              <div className="feature-title">Premium Quality</div>
              <div className="feature-desc">Guaranteed</div>
            </div>
          </div>
        </div>
      </section>
      {/* ENHANCED CATEGORIES SECTION */}
      <main className="main-content">
        <section className="categories-section">
          <div className="section-header">
            <h2 className="section-title">Shop by Category</h2><br></br>
            <p className="section-subtitle">Discover our carefully curated collections</p>
            <a href="/categories" className="section-link">
              View All Categories
              <ChevronRight size={16} />
            </a>
          </div>

          <div className="category-grid">
            {categories.map((cat, index) => (
              <a 
                key={cat.id} 
                className="category-card" 
                href={`/category/${cat.id}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="cat-media">
                  <img src={cat.imageUrl} alt={cat.name} />
                  <div className="cat-overlay">
                    <span className="cat-explore">
                      Explore
                      <ChevronRight size={16} />
                    </span>
                  </div>
                </div>
                <div className="cat-info">
                  <div className="cat-name">{cat.name}</div>
                  <div className="cat-products">{cat.productCount || 'Various'} products</div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* NEW FEATURED PRODUCTS SECTION */}
        <section className="featured-section">
          <div className="section-header">
            <h2 className="section-title">New Arrivals</h2>
            <p className="section-subtitle">Fresh styles for the season</p>
          </div>
          <div className="placeholder-products">
            <div className="product-placeholder">
              <div className="product-image"></div>
              <div className="product-info">
                <div className="product-name">Premium T-Shirt</div>
                <div className="product-price">₹1,999</div>
              </div>
            </div>
            <div className="product-placeholder">
              <div className="product-image"></div>
              <div className="product-info">
                <div className="product-name">Designer Jeans</div>
                <div className="product-price">₹3,499</div>
              </div>
            </div>
            <div className="product-placeholder">
              <div className="product-image"></div>
              <div className="product-info">
                <div className="product-name">Classic Blazer</div>
                <div className="product-price">₹5,999</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ENHANCED FOOTER */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-main">
            <div className="footer-brand">
              <div className="logo">XOMO</div>
              <p className="footer-desc">
                Premium fashion for the modern individual. Quality, style, and comfort in every piece.
              </p>
            </div>
            
            <div className="footer-links">
              <div className="link-group">
                <h4>Shop</h4>
                <a href="/new-arrivals">New Arrivals</a>
                <a href="/best-sellers">Best Sellers</a>
                <a href="/sale">Sale</a>
                <a href="/collections">Collections</a>
              </div>
              
              <div className="link-group">
                <h4>Support</h4>
                <a href="/contact">Contact Us</a>
                <a href="/shipping">Shipping Info</a>
                <a href="/returns">Returns</a>
                <a href="/faq">FAQ</a>
              </div>
              
              <div className="link-group">
                <h4>Company</h4>
                <a href="/about">About Us</a>
                <a href="/careers">Careers</a>
                <a href="/press">Press</a>
                <a href="/sustainability">Sustainability</a>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <div className="copyright">
              © {new Date().getFullYear()} XOMO. All rights reserved.
            </div>
            <div className="footer-legal">
              <a href="/terms">Terms</a>
              <a href="/privacy">Privacy</a>
              <a href="/cookies">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}