import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Menu, ShoppingCart, Search, User, X, ChevronRight, Star, 
  Truck, Shield, RotateCcw, ChevronLeft, Sparkles, TrendingUp,
  Award, Heart, ArrowRight, Play
} from "lucide-react";
import AlertModal from "../components/AlertModal";
import "../styles/home.css";
import { BASE_URL } from "../util/config.js";

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [ads, setAds] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [scrollProgress, setScrollProgress] = useState(0);
  const [alertModal, setAlertModal] = useState({ show: false, message: "", type: "error" });
  const heroRef = useRef(null);
  const carouselIntervalRef = useRef(null);
  const parallaxRef = useRef(null);
  const navigate = useNavigate();

  const showAlert = (message, type = "error") => {
    setAlertModal({ show: true, message, type });
  };

  const closeAlert = () => {
    setAlertModal({ show: false, message: "", type: "error" });
  };

  // Scroll detection for header and parallax
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);
      
      // Calculate scroll progress
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const progress = (scrollY / (documentHeight - windowHeight)) * 100;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
      
      // Parallax effect for hero background
      if (parallaxRef.current) {
        const parallaxElements = parallaxRef.current.querySelectorAll('.parallax-element');
        parallaxElements.forEach((el, index) => {
          const speed = 0.5 + (index * 0.1);
          const yPos = -(scrollY * speed);
          el.style.transform = `translateY(${yPos}px)`;
        });
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for animations - runs after content is loaded
  useEffect(() => {
    if (isLoading) return; // Wait until loading is complete

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            setVisibleSections((prev) => new Set(prev).add(entry.target.id));
            
            // Animate counters when stats section is visible
            if (entry.target.id === 'hero') {
              const counters = entry.target.querySelectorAll('.stat-number');
              counters.forEach((counter) => {
                const target = parseInt(counter.getAttribute('data-count') || '0');
                animateCounter(counter, target);
              });
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    // Counter animation function
    const animateCounter = (element, target) => {
      let current = 0;
      const increment = target / 50;
      const duration = 2000;
      const stepTime = duration / 50;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          element.textContent = target + (target >= 10 ? 'K+' : '+');
          clearInterval(timer);
        } else {
          element.textContent = Math.floor(current) + (target >= 10 ? 'K+' : '+');
        }
      }, stepTime);
    };

    // Use setTimeout to ensure DOM is fully rendered
    const timeoutId = setTimeout(() => {
      const sections = document.querySelectorAll('[data-animate]');
      sections.forEach((section) => observer.observe(section));
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      const sections = document.querySelectorAll('[data-animate]');
      sections.forEach((section) => observer.unobserve(section));
    };
  }, [isLoading]);

  // Load initial data
  useEffect(() => {
    // Set a maximum loading time to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      console.warn("Loading timeout - showing content anyway");
      setIsLoading(false);
    }, 10000); // 10 second max loading time

    loadInitialData();

    return () => {
      clearTimeout(loadingTimeout);
      if (carouselIntervalRef.current) {
        clearInterval(carouselIntervalRef.current);
      }
    };
  }, []);

  // Auto-rotate carousel
  useEffect(() => {
    if (ads.length > 1) {
      carouselIntervalRef.current = setInterval(() => {
        setCurrentAdIndex((prev) => (prev + 1) % ads.length);
      }, 6000);
      return () => {
        if (carouselIntervalRef.current) {
          clearInterval(carouselIntervalRef.current);
        }
      };
    }
  }, [ads.length]);

  const loadInitialData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Use Promise.allSettled to ensure all requests complete even if some fail
      await Promise.allSettled([
        loadAds(),
        loadCategories(),
        loadCartCount(),
        loadNewArrivals()
      ]);
    } catch (err) {
      console.error("Error loading initial data", err);
      // Don't set error state - allow page to render with empty data
    } finally {
      // Always set loading to false, even if requests fail
      setIsLoading(false);
    }
  };

  const loadAds = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setAds([]); // Set empty array if no token
        return;
      }

      const authHeader = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(`${BASE_URL}/home-ads`, authHeader);

      const formattedAds = (res.data || []).map((a) => ({
        ...a,
        imageUrl: `data:image/jpeg;base64,${a.imageBase64 || ""}`,
      }));

      setAds(formattedAds);
    } catch (error) {
      console.error("Error loading ads", error);
      setAds([]); // Set empty array on error
    }
  };

  const loadCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token missing! Please login again.");
        setCategories([]); // Set empty array if no token
        return;
      }
      const authHeader = { headers: { Authorization: `Bearer ${token}` } };

      const category = await axios.get(`${BASE_URL}/categories`, authHeader);

      const rawCategories = Array.isArray(category.data) ? category.data : [category.data];
      const categoryFormatted = rawCategories.map((c) => ({
        ...c,
        imageUrl: `data:image/jpeg;base64,${c.imageBase64 || ""}`,
      }));

      setCategories(categoryFormatted);
    } catch (error) {
      console.error("Error loading categories", error);
      setCategories([]); // Set empty array on error
    }
  };

  const loadCartCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      if (!token || !userId) return;
      const authHeader = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(`${BASE_URL}/cart/count/${userId}`, authHeader);
      setCartCount(res.data || 0);
    } catch (error) {
      console.error("Error fetching cart count", error);
    }
  };

  const loadNewArrivals = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setNewArrivals([]);
        return;
      }

      const authHeader = { headers: { Authorization: `Bearer ${token}` } };
      
      let productsData = [];
      
      try {
        // Try new arrivals endpoint
        const response = await axios.get(
          `${BASE_URL}/products/new-arrivals`,
          authHeader
        );
        productsData = response.data || [];
      } catch (error) {
        console.log("New arrivals endpoint failed, trying all products...");
        try {
          // Fallback to all products and sort by date
          const response = await axios.get(
            `${BASE_URL}/products`,
            authHeader
          );
          productsData = response.data || [];
          productsData.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
          productsData = productsData.slice(0, 4); // Limit to 4 for homepage
        } catch (error2) {
          console.error("Error loading new arrivals", error2);
          productsData = [];
        }
      }

      const formattedProducts = (Array.isArray(productsData) ? productsData : [productsData])
        .slice(0, 4) // Show only 4 on homepage
        .map((product) => ({
          id: product.id || `product-${Math.random()}`,
          name: product.name || "New Arrival",
          description: product.description || "Premium quality product",
          price: Number(product.price) || 0,
          originalPrice: Number(product.originalPrice) || null,
          rating: Number(product.rating) || 4.5,
          reviews: Number(product.reviews) || 0,
          category: product.category || "Fashion",
          imageUrl: product.imageBase64 
            ? `data:image/jpeg;base64,${product.imageBase64}`
            : product.image
            ? `data:image/jpeg;base64,${product.image}`
            : "/placeholder-product.jpg",
          stock: Number(product.stock) || 10
        }));

      setNewArrivals(formattedProducts);
    } catch (error) {
      console.error("Error loading new arrivals", error);
      setNewArrivals([]);
    }
  };

  const addToCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        showAlert("Please login to add items to cart", "error");
        return;
      }

      await axios.post(
        `${BASE_URL}/cart/add`,
        { 
          userId: String(userId), 
          productId: String(productId), 
          quantity: 1 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showAlert("Product added to cart!", "success");
      loadCartCount(); // Refresh cart count
    } catch (err) {
      console.error("Cart error:", err);
      showAlert("Failed to add to cart. Please try again.", "error");
    }
  };

  const nextAd = useCallback(() => {
    setCurrentAdIndex((prev) => (prev + 1) % ads.length);
    if (carouselIntervalRef.current) {
      clearInterval(carouselIntervalRef.current);
    }
  }, [ads.length]);

  const prevAd = useCallback(() => {
    setCurrentAdIndex((prev) => (prev - 1 + ads.length) % ads.length);
    if (carouselIntervalRef.current) {
      clearInterval(carouselIntervalRef.current);
    }
  }, [ads.length]);

  const goToSlide = useCallback((index) => {
    setCurrentAdIndex(index);
    if (carouselIntervalRef.current) {
      clearInterval(carouselIntervalRef.current);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p className="loading-text">Loading XOMO...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-screen">
        <div className="error-container">
          <p>{error}</p>
          <button onClick={loadInitialData} className="btn btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="home-root">
      {/* Enhanced Navigation */}
      <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-inner">
          <div className="brand">
            <a href="/HomePage" className="logo">
              <div className="logo-icon">
                <span className="logo-x">X</span>
              </div>
              <div className="logo-wordmark">
                <span className="logo-text">XOMO</span>
                <span className="logo-tagline">FASHION</span>
              </div>
            </a>
          </div>

          <nav className="header-nav">
            <a href="/HomePage" className="nav-link active">
              <span>Home</span>
            </a>
            <a href="/categories" className="nav-link">
              <span>Categories</span>
            </a>
            <a href="/new-arrivals" className="nav-link">
              <span>New Arrivals</span>
            </a>
            <a href="/collections" className="nav-link">
              <span>Collections</span>
            </a>
            <a href="/contact" className="nav-link">
              <span>Contact</span>
            </a>
          </nav>

          <div className="header-actions">
            <button className="action-btn search-btn" aria-label="Search">
              <Search size={20} />
            </button>
            <a href="/wishlist" className="action-btn wishlist-btn" aria-label="Wishlist">
              <Heart size={20} />
            </a>
            <a href="/profile" className="action-btn user-btn" aria-label="Profile">
              <User size={20} />
            </a>
            <a href="/cart" className="action-btn cart-btn" aria-label="Cart">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount > 99 ? '99+' : cartCount}</span>
              )}
            </a>

            <button
              className={`hamburger ${mobileMenu ? 'active' : ''}`}
              onClick={() => setMobileMenu((s) => !s)}
              aria-label="Toggle menu"
            >
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        <div className={`mobile-drawer ${mobileMenu ? 'open' : ''}`}>
          <div className="mobile-nav">
            <a href="/HomePage" className="mobile-nav-link" onClick={() => setMobileMenu(false)}>
              Home
            </a>
            <a href="/categories" className="mobile-nav-link" onClick={() => setMobileMenu(false)}>
              Categories
            </a>
            <a href="/new-arrivals" className="mobile-nav-link" onClick={() => setMobileMenu(false)}>
              New Arrivals
            </a>
            <a href="/collections" className="mobile-nav-link" onClick={() => setMobileMenu(false)}>
              Collections
            </a>
            <a href="/contact" className="mobile-nav-link" onClick={() => setMobileMenu(false)}>
              Contact
            </a>
            <div className="mobile-nav-divider"></div>
            <a href="/profile" className="mobile-nav-link" onClick={() => setMobileMenu(false)}>
              My Profile
            </a>
            <a href="/wishlist" className="mobile-nav-link" onClick={() => setMobileMenu(false)}>
              Wishlist
            </a>
            <a href="/orders" className="mobile-nav-link" onClick={() => setMobileMenu(false)}>
              My Orders
            </a>
            <a href="/cart" className="mobile-nav-link" onClick={() => setMobileMenu(false)}>
              Cart {cartCount > 0 && `(${cartCount})`}
            </a>
          </div>
        </div>
      </header>

      {/* Scroll Progress Indicator */}
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }}></div>

      {/* Professional Hero Section - Complete Redesign */}
      <section className="hero-pro" ref={heroRef} data-animate id="hero">
        {/* Animated Background Layers */}
        <div className="hero-pro-bg" ref={parallaxRef}>
          <div className="bg-layer layer-1"></div>
          <div className="bg-layer layer-2"></div>
          <div className="bg-layer layer-3"></div>
          <div className="bg-particles">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="particle" style={{ '--delay': `${i * 0.1}s` }}></div>
            ))}
          </div>
        </div>

        <div className="hero-pro-container">
          <div className="hero-pro-layout">
            {/* Left Side - Content */}
            <div className="hero-pro-content">
              {/* Animated Badge */}
              <div className="hero-pro-badge" data-animate>
                <div className="badge-pulse-ring"></div>
                <Sparkles className="badge-icon-pro" size={16} />
                <span className="badge-text">New Collection 2024</span>
                <div className="badge-shine"></div>
              </div>

              {/* Main Heading with Split Animation */}
              <h1 className="hero-pro-title" data-animate>
                <span className="title-line-1">
                  <span className="word">Fashion</span>
                  <span className="word">That</span>
                </span>
                <span className="title-line-2">
                  <span className="word gradient-word">Defines</span>
                  <span className="word">You</span>
                </span>
              </h1>

              {/* Description with Fade */}
              <p className="hero-pro-desc" data-animate>
                Experience premium fashion curated for the modern lifestyle. 
                Where quality craftsmanship meets contemporary design in every detail.
              </p>

              {/* Action Buttons */}
              <div className="hero-pro-actions" data-animate>
                <a href="/categories" className="btn-pro btn-pro-primary">
                  <span className="btn-text">Shop Collection</span>
                  <div className="btn-icon-wrapper">
                    <ArrowRight size={18} />
                  </div>
                  <div className="btn-bg-effect"></div>
                </a>
                <a href="/collections" className="btn-pro btn-pro-outline">
                  <Play size={18} />
                  <span className="btn-text">Watch Story</span>
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="hero-pro-trust" data-animate>
                <div className="trust-item">
                  <div className="trust-icon">
                    <TrendingUp size={18} />
                  </div>
                  <div className="trust-content">
                    <div className="trust-number" data-count="10">0</div>
                    <div className="trust-label">K+ Customers</div>
                  </div>
                </div>
                <div className="trust-divider"></div>
                <div className="trust-item">
                  <div className="trust-icon">
                    <Award size={18} />
                  </div>
                  <div className="trust-content">
                    <div className="trust-number" data-count="500">0</div>
                    <div className="trust-label">Products</div>
                  </div>
                </div>
                <div className="trust-divider"></div>
                <div className="trust-item">
                  <div className="trust-icon">
                    <Star size={18} />
                  </div>
                  <div className="trust-content">
                    <div className="trust-number" data-count="50">0</div>
                    <div className="trust-label">Brands</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Visual Showcase */}
            <div className="hero-pro-visual" data-animate>
              <div className="visual-container">
                {ads.length > 0 ? (
                  <>
                    <div className="visual-carousel">
                      {ads.map((ad, idx) => (
                        <div
                          key={ad.id || idx}
                          className={`visual-slide ${idx === currentAdIndex ? 'active' : ''}`}
                        >
                          <div className="slide-frame">
                            <div className="slide-image-box">
                              <img
                                src={ad.imageUrl}
                                alt={ad.title || 'Collection'}
                                className="slide-img"
                                loading={idx === 0 ? 'eager' : 'lazy'}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextElementSibling?.classList.add('show');
                                }}
                              />
                              <div className="slide-placeholder-pro">
                                <Sparkles size={40} />
                              </div>
                              <div className="slide-overlay-pro">
                                {ad.title && (
                                  <div className="slide-info">
                                    <h3>{ad.title}</h3>
                                    {ad.description && <p>{ad.description}</p>}
                                    {ad.redirectUrl && (
                                      <a href={ad.redirectUrl} className="slide-link-pro">
                                        Explore <ChevronRight size={16} />
                                      </a>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {ads.length > 1 && (
                      <>
                        <div className="visual-controls">
                          <button
                            className="control-arrow prev-arrow"
                            onClick={prevAd}
                            aria-label="Previous"
                          >
                            <ChevronLeft size={20} />
                          </button>
                          <button
                            className="control-arrow next-arrow"
                            onClick={nextAd}
                            aria-label="Next"
                          >
                            <ChevronRight size={20} />
                          </button>
                        </div>
                        <div className="visual-indicators">
                          {ads.map((_, idx) => (
                            <button
                              key={idx}
                              className={`indicator-dot ${idx === currentAdIndex ? 'active' : ''}`}
                              onClick={() => goToSlide(idx)}
                              aria-label={`Slide ${idx + 1}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="visual-carousel">
                    <div className="visual-slide active">
                      <div className="slide-frame">
                        <div className="slide-image-box">
                          <div className="slide-placeholder-pro show">
                            <Sparkles size={40} />
                            <p>Premium Collection</p>
                          </div>
                          <div className="slide-overlay-pro">
                            <div className="slide-info">
                              <h3>Seasonal Essentials</h3>
                              <p>Discover our curated collection</p>
                              <a href="/categories" className="slide-link-pro">
                                Shop Now <ChevronRight size={16} />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Floating Feature Cards */}
                <div className="visual-features">
                  <div className="feature-float float-1">
                    <div className="float-icon">
                      <Star size={18} />
                    </div>
                    <div className="float-text">
                      <span>Premium</span>
                    </div>
                  </div>
                  <div className="feature-float float-2">
                    <div className="float-icon">
                      <Truck size={18} />
                    </div>
                    <div className="float-text">
                      <span>Free Shipping</span>
                    </div>
                  </div>
                  <div className="feature-float float-3">
                    <div className="float-icon">
                      <Shield size={18} />
                    </div>
                    <div className="float-text">
                      <span>Secure</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Features Strip */}
      <section className="features-pro" data-animate id="features">
        <div className="features-pro-container">
          {[
            { icon: Truck, title: "Free Shipping", desc: "On orders ₹999+", color: "#667eea" },
            { icon: RotateCcw, title: "Easy Returns", desc: "15 days hassle-free", color: "#764ba2" },
            { icon: Shield, title: "Secure Payment", desc: "100% protected", color: "#f093fb" },
            { icon: Star, title: "Premium Quality", desc: "Guaranteed", color: "#4facfe" },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="feature-pro-card"
              data-animate
              style={{ '--feature-color': feature.color, '--delay': `${idx * 0.1}s` }}
            >
              <div className="feature-pro-icon-wrapper">
                <div className="feature-pro-icon-bg"></div>
                <feature.icon className="feature-pro-icon" size={24} />
                <div className="feature-pro-icon-glow"></div>
              </div>
              <div className="feature-pro-content">
                <h3 className="feature-pro-title">{feature.title}</h3>
                <p className="feature-pro-desc">{feature.desc}</p>
              </div>
              <div className="feature-pro-hover-effect"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Professional Categories Section */}
      <main className="main-content">
        <section className="categories-pro" data-animate id="categories">
          <div className="section-header-pro">
            <div className="section-header-content-pro">
              <div className="section-badge-pro">
                <Sparkles size={14} />
                <span>Collections</span>
              </div>
              <h2 className="section-title-pro">
                Shop by <span className="title-highlight-pro">Category</span>
              </h2>
              <p className="section-subtitle-pro">
                Discover our carefully curated collections designed for every style and occasion
              </p>
            </div>
            <a href="/categories" className="section-cta-pro">
              <span>View All</span>
              <ChevronRight size={18} />
            </a>
          </div>

          <div className="category-grid-pro">
            {categories.length > 0 ? (
              categories.map((cat, index) => (
                <a
                  key={cat.id}
                  href={`/category/${cat.id}`}
                  className="category-card-pro"
                  data-animate
                  style={{ '--delay': `${index * 0.1}s` }}
                >
                  <div className="category-image-wrapper-pro">
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      className="category-image-pro"
                      loading="lazy"
                    />
                    <div className="category-overlay-pro">
                      <div className="category-overlay-content-pro">
                        <span className="explore-text-pro">
                          Explore
                          <ChevronRight size={18} />
                        </span>
                      </div>
                    </div>
                    <div className="category-shine-pro"></div>
                    <div className="category-pulse-ring"></div>
                  </div>
                  <div className="category-info-pro">
                    <h3 className="category-name-pro">{cat.name}</h3>
                    <p className="category-count-pro">
                      {cat.productCount || 'Various'} products
                    </p>
                  </div>
                </a>
              ))
            ) : (
              <div className="empty-categories-pro">
                <Sparkles size={32} />
                <p>No categories available at the moment.</p>
              </div>
            )}
          </div>
        </section>

        {/* Professional Featured Products Section */}
        <section className="featured-products-pro" data-animate id="featured">
          <div className="section-header-pro">
            <div className="section-header-content-pro">
              <div className="section-badge-pro">
                <TrendingUp size={14} />
                <span>Latest</span>
              </div>
              <h2 className="section-title-pro">
                New <span className="title-highlight-pro">Arrivals</span>
              </h2>
              <p className="section-subtitle-pro">
                Fresh styles for the season, handpicked for you
              </p>
            </div>
            <a href="/new-arrivals" className="section-cta-pro">
              <span>See All</span>
              <ChevronRight size={18} />
            </a>
          </div>

          <div className="products-grid-pro">
            {newArrivals.length > 0 ? (
              newArrivals.map((product, idx) => (
                <div 
                  key={product.id} 
                  className="product-card-pro" 
                  data-animate 
                  style={{ '--delay': `${idx * 0.1}s` }}
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <div className="product-image-wrapper-pro">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="product-image-pro"
                      onError={(e) => {
                        e.target.src = "/placeholder-product.jpg";
                      }}
                    />
                    <div className="product-actions-pro">
                      <button 
                        className="product-action-btn-pro" 
                        aria-label="Add to wishlist"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add wishlist functionality here if needed
                        }}
                      >
                        <Heart size={18} />
                      </button>
                      <button 
                        className="product-action-btn-pro" 
                        aria-label="Quick view"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/product/${product.id}`);
                        }}
                      >
                        <Search size={18} />
                      </button>
                    </div>
                    <div className="product-badge-pro">
                      <span>New</span>
                    </div>
                    <div className="product-hover-overlay"></div>
                  </div>
                  <div className="product-info-pro">
                    <h3 className="product-name-pro">{product.name}</h3>
                    <div className="product-rating-pro">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={14} 
                          className="star-icon-pro" 
                          fill={i < Math.floor(product.rating) ? "#fbbf24" : "none"}
                          color="#fbbf24"
                        />
                      ))}
                      <span className="rating-text-pro">({product.rating})</span>
                    </div>
                    <div className="product-price-pro">
                      <span className="price-current-pro">
                        ₹{product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="price-original-pro">
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <button 
                      className="add-to-cart-btn-pro"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product.id);
                      }}
                      disabled={product.stock <= 0}
                    >
                      <ShoppingCart size={16} />
                      {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              [1, 2, 3, 4].map((item, idx) => (
                <div key={idx} className="product-card-pro" data-animate style={{ '--delay': `${idx * 0.1}s` }}>
                  <div className="product-image-wrapper-pro">
                    <div className="product-image-placeholder-pro">
                      <Sparkles size={32} />
                    </div>
                    <div className="product-actions-pro">
                      <button className="product-action-btn-pro" aria-label="Add to wishlist">
                        <Heart size={18} />
                      </button>
                      <button className="product-action-btn-pro" aria-label="Quick view">
                        <Search size={18} />
                      </button>
                    </div>
                    <div className="product-badge-pro">
                      <span>New</span>
                    </div>
                    <div className="product-hover-overlay"></div>
                  </div>
                  <div className="product-info-pro">
                    <h3 className="product-name-pro">Loading...</h3>
                    <div className="product-rating-pro">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className="star-icon-pro" fill="#fbbf24" />
                      ))}
                      <span className="rating-text-pro">(4.8)</span>
                    </div>
                    <div className="product-price-pro">
                      <span className="price-current-pro">₹0</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {/* Professional Footer */}
      <footer className="footer-pro">
        <div className="footer-pro-container">
          <div className="footer-pro-main">
            <div className="footer-pro-brand">
              <div className="footer-pro-logo">
                <span className="logo-text-pro">XOMO</span>
                <span className="logo-accent-pro"></span>
              </div>
              <p className="footer-pro-description">
                Premium fashion for the modern individual. Quality, style, and comfort 
                in every piece. Experience the difference.
              </p>
            </div>

            <div className="footer-pro-links-grid">
              <div className="footer-pro-column">
                <h4 className="footer-pro-heading">Shop</h4>
                <ul className="footer-pro-list">
                  <li><a href="/new-arrivals">New Arrivals</a></li>
                  <li><a href="/best-sellers">Best Sellers</a></li>
                  <li><a href="/sale">Sale</a></li>
                  <li><a href="/collections">Collections</a></li>
                </ul>
              </div>

              <div className="footer-pro-column">
                <h4 className="footer-pro-heading">Support</h4>
                <ul className="footer-pro-list">
                  <li><a href="/contact">Contact Us</a></li>
                  <li><a href="/shipping">Shipping Info</a></li>
                  <li><a href="/returns">Returns</a></li>
                  <li><a href="/faq">FAQ</a></li>
                </ul>
              </div>

              <div className="footer-pro-column">
                <h4 className="footer-pro-heading">Company</h4>
                <ul className="footer-pro-list">
                  <li><a href="/about">About Us</a></li>
                  <li><a href="/careers">Careers</a></li>
                  <li><a href="/press">Press</a></li>
                  <li><a href="/sustainability">Sustainability</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="footer-pro-bottom">
            <div className="footer-pro-copyright">
              © {new Date().getFullYear()} XOMO. All rights reserved.
            </div>
            <div className="footer-pro-legal">
              <a href="/terms">Terms</a>
              <a href="/privacy">Privacy</a>
              <a href="/cookies">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

      <AlertModal
        show={alertModal.show}
        message={alertModal.message}
        type={alertModal.type}
        onClose={closeAlert}
      />
    </div>
  );
}
