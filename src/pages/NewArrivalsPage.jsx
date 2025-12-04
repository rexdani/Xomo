import React, { useEffect, useState } from "react";
import axios from "axios";
import { ShoppingCart, Heart, Star, Clock, TrendingUp, Filter, Grid, List } from "lucide-react";
import Header from "../components/Header";
import AlertModal from "../components/AlertModal";
import "../styles/newArrivals.css";
import { BASE_URL } from "../util/config.js";

const host = window.location.hostname;
const backendPort = 8081;

export default function NewArrivalsPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [categories, setCategories] = useState([]);
  const [alertModal, setAlertModal] = useState({ show: false, message: "", type: "success" });

  const showAlert = (message, type = "success") => {
    setAlertModal({ show: true, message, type });
  };

  const closeAlert = () => {
    setAlertModal({ show: false, message: "", type: "success" });
  };

  useEffect(() => {
    loadNewArrivals();
    loadCategories();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [selectedCategory, sortBy, products]);

  const loadNewArrivals = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        console.error("No token found");
        setProducts(getFallbackProducts());
        setLoading(false);
        return;
      }

      const authHeader = { headers: { Authorization: `Bearer ${token}` } };
      
      // Try multiple endpoints for new arrivals
      let productsData = [];
      
      try {
        // Try specific new arrivals endpoint
        const response = await axios.get(
          `${BASE_URL}/products/new-arrivals`,
          authHeader
        );
        productsData = response.data || [];
      } catch (error) {
        console.log("New arrivals endpoint failed, trying all products...");
        
        try {
          // Fallback to all products and filter by date
          const response = await axios.get(
            `${BASE_URL}/products`,
            authHeader
          );
          productsData = response.data || [];
          // Sort by date (newest first) for new arrivals
          productsData.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
          productsData = productsData.slice(0, 12); // Limit to 12 items
        } catch (error2) {
          console.log("All products endpoint failed, using fallback data...");
          productsData = getFallbackProducts();
        }
      }

      const formattedProducts = (Array.isArray(productsData) ? productsData : [productsData])
        .map((product, index) => ({
          id: product.id || `product-${index}`,
          name: product.name || `New Arrival ${index + 1}`,
          description: product.description || "Premium quality new arrival",
          price: Number(product.price) || Math.floor(Math.random() * 5000) + 999,
          originalPrice: Number(product.originalPrice) || null,
          rating: Number(product.rating) || (Math.random() * 2 + 3).toFixed(1),
          reviews: Number(product.reviews) || Math.floor(Math.random() * 100) + 1,
          category: product.category || "Fashion",
          imageUrl: product.imageBase64 
            ? `data:image/jpeg;base64,${product.imageBase64}`
            : `/product-${(index % 6) + 1}.jpg`,
          isNew: true,
          isFeatured: index < 4,
          discount: Math.random() > 0.6 ? Math.floor(Math.random() * 30) + 10 : 0,
          arrivalDate: product.createdAt || new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
          stock: Math.floor(Math.random() * 20) + 5
        }));

      setProducts(formattedProducts);
      setFilteredProducts(formattedProducts);
    } catch (error) {
      console.error("Error loading new arrivals:", error);
      setProducts(getFallbackProducts());
      setFilteredProducts(getFallbackProducts());
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = () => {
    const cats = ["all", "Men's Fashion", "Women's Fashion", "Accessories", "Footwear", "Sports Wear"];
    setCategories(cats);
  };

  const getFallbackProducts = () => {
    const productNames = [
      "Premium Cotton T-Shirt",
      "Designer Denim Jacket",
      "Elegant Summer Dress",
      "Classic Leather Sneakers",
      "Minimalist Backpack",
      "Luxury Watch",
      "Comfortable Hoodie",
      "Tailored Blazer",
      "Casual Chino Pants",
      "Wool Blend Scarf",
      "Running Shoes",
      "Formal Shirt"
    ];

    const categories = ["Men's Fashion", "Women's Fashion", "Accessories", "Footwear", "Sports Wear"];

    return productNames.map((name, index) => ({
      id: `fallback-${index}`,
      name: name,
      description: "Premium quality new arrival with modern design",
      price: Math.floor(Math.random() * 5000) + 999,
      originalPrice: Math.floor(Math.random() * 8000) + 1500,
      rating: (Math.random() * 2 + 3).toFixed(1),
      reviews: Math.floor(Math.random() * 100) + 1,
      category: categories[index % categories.length],
      imageUrl: `/product-${(index % 6) + 1}.jpg`,
      isNew: true,
      isFeatured: index < 4,
      discount: Math.random() > 0.6 ? Math.floor(Math.random() * 30) + 10 : 0,
      arrivalDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      stock: Math.floor(Math.random() * 20) + 5
    }));
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.arrivalDate) - new Date(a.arrivalDate));
        break;
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "popular":
        filtered.sort((a, b) => b.reviews - a.reviews);
        break;
    }

    setFilteredProducts(filtered);
  };

  const addToCart = (product) => {
    console.log("Added to cart:", product);
    showAlert(`${product.name} added to cart!`, "success");
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getTimeSinceArrival = (date) => {
    const now = new Date();
    const arrival = new Date(date);
    const diffDays = Math.floor((now - arrival) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return "Recently";
  };

  if (loading) {
    return (
      <div className="new-arrivals-loading">
        <div className="loading-spinner"></div>
        <p>Loading new arrivals...</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="new-arrivals-page">
        {/* Hero Section */}
      <section className="new-arrivals-hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <TrendingUp size={16} />
              New Collection
            </div>
            <h1 className="hero-title">New Arrivals</h1>
            <p className="hero-subtitle">
              Be the first to discover our latest collection. Fresh styles, premium quality.
            </p>
            
            <div className="hero-stats">
              <div className="stat">
                <div className="stat-number">{products.length}+</div>
                <div className="stat-label">New Products</div>
              </div>
              <div className="stat">
                <div className="stat-number">Just In</div>
                <div className="stat-label">Latest Trends</div>
              </div>
              <div className="stat">
                <div className="stat-number">Limited</div>
                <div className="stat-label">Stock Available</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters & Controls */}
      <section className="arrivals-filters">
        <div className="container">
          <div className="filters-header">
            <div className="results-info">
              <span className="results-count">
                {filteredProducts.length} new arrival{filteredProducts.length !== 1 ? 's' : ''}
              </span>
              <span className="arrival-time">
                <Clock size={14} />
                Updated daily
              </span>
            </div>

            <div className="controls-group">
              <div className="view-controls">
                <button 
                  className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                  onClick={() => setViewMode("grid")}
                  title="Grid View"
                >
                  <Grid size={20} />
                </button>
                <button 
                  className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                  onClick={() => setViewMode("list")}
                  title="List View"
                >
                  <List size={20} />
                </button>
              </div>

              <div className="sort-controls">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>
          </div>

          <div className="category-filters">
            <div className="category-tabs">
              <button 
                className={`category-tab ${selectedCategory === "all" ? "active" : ""}`}
                onClick={() => setSelectedCategory("all")}
              >
                All Arrivals
              </button>
              {categories.filter(cat => cat !== "all").map(category => (
                <button 
                  key={category}
                  className={`category-tab ${selectedCategory === category ? "active" : ""}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <main className="arrivals-main">
        <div className="container">
          {filteredProducts.length > 0 ? (
            <div className={`products-container ${viewMode}`}>
              {filteredProducts.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-media">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="product-image"
                      onError={(e) => {
                        e.target.src = `/product-${Math.floor(Math.random() * 6) + 1}.jpg`;
                      }}
                    />
                    
                    <div className="product-overlay">
                      <button className="wishlist-btn">
                        <Heart size={18} />
                      </button>
                      
                      <button 
                        className="quick-view-btn"
                        onClick={() => window.location.href = `/product/${product.id}`}
                      >
                        Quick View
                      </button>
                    </div>

                    <div className="product-badges">
                      <span className="badge new">NEW</span>
                      {product.discount > 0 && (
                        <span className="badge discount">-{product.discount}%</span>
                      )}
                      {product.isFeatured && (
                        <span className="badge featured">Featured</span>
                      )}
                      {product.stock < 10 && (
                        <span className="badge low-stock">Low Stock</span>
                      )}
                    </div>

                    <div className="arrival-time">
                      <Clock size={12} />
                      {getTimeSinceArrival(product.arrivalDate)}
                    </div>
                  </div>

                  <div className="product-info">
                    <div className="product-header">
                      <h3 className="product-name">{product.name}</h3>
                      <span className="product-category">{product.category}</span>
                    </div>
                    
                    <p className="product-description">{product.description}</p>

                    <div className="product-rating">
                      <div className="stars">
                        {[...Array(5)].map((_, index) => (
                          <Star
                            key={index}
                            size={14}
                            fill={index < Math.floor(product.rating) ? "#fbbf24" : "none"}
                            color="#fbbf24"
                          />
                        ))}
                      </div>
                      <span className="rating-count">({product.reviews})</span>
                    </div>

                    <div className="product-price">
                      <span className="current-price">{formatPrice(product.price)}</span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="original-price">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>

                    <div className="product-meta">
                      <span className="stock-info">
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </span>
                    </div>

                    <button 
                      className="add-to-cart-btn"
                      onClick={() => addToCart(product)}
                      disabled={product.stock <= 0}
                    >
                      <ShoppingCart size={16} />
                      {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-arrivals">
              <div className="no-arrivals-icon">🆕</div>
              <h3>No New Arrivals Found</h3>
              <p>Check back soon for our latest products!</p>
              <button 
                className="btn secondary"
                onClick={loadNewArrivals}
              >
                Refresh
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Newsletter Banner */}
      <section className="new-arrivals-banner">
        <div className="container">
          <div className="banner-content">
            <div className="banner-text">
              <h2>Never Miss a New Arrival</h2>
              <p>Subscribe to get notified first about our latest drops and exclusive early access.</p>
            </div>
            <div className="banner-form">
              <input type="email" placeholder="Your email address" />
              <button className="btn primary">Notify Me</button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="arrivals-features">
        <div className="container">
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">🚚</div>
              <div className="feature-content">
                <h4>Free Express Shipping</h4>
                <p>On all new arrivals</p>
              </div>
            </div>
            <div className="feature">
              <div className="feature-icon">↩️</div>
              <div className="feature-content">
                <h4>30-Day Returns</h4>
                <p>No questions asked</p>
              </div>
            </div>
            <div className="feature">
              <div className="feature-icon">🔒</div>
              <div className="feature-content">
                <h4>Secure Payment</h4>
                <p>100% protected</p>
              </div>
            </div>
            <div className="feature">
              <div className="feature-icon">👑</div>
              <div className="feature-content">
                <h4>Early Access</h4>
                <p>For subscribed members</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>

      <AlertModal
        show={alertModal.show}
        message={alertModal.message}
        type={alertModal.type}
        onClose={closeAlert}
      />
    </>
  );
}