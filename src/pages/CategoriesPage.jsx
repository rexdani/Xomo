import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChevronRight, Search, Filter, Grid, List } from "lucide-react";
import "../styles/categories.css";

const host = window.location.hostname;
const backendPort = 8081;

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [activeFilter, setActiveFilter] = useState("all"); // 'all', 'featured', 'popular'

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    filterCategories();
  }, [searchTerm, activeFilter, categories]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        console.error("No token found");
        setCategories(getFallbackCategories());
        setLoading(false);
        return;
      }

      const authHeader = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(
        `http://${host}:${backendPort}/categories`,
        authHeader
      );

      const categoriesData = response.data || [];
      const formattedCategories = (Array.isArray(categoriesData) ? categoriesData : [categoriesData])
        .map((category, index) => ({
          id: category.id || `category-${index}`,
          name: category.name || `Category ${index + 1}`,
          description: category.description || "Explore our premium collection",
          productCount: category.productCount || Math.floor(Math.random() * 50) + 10,
          imageUrl: category.imageBase64 
            ? `data:image/jpeg;base64,${category.imageBase64}`
            : `/category-placeholder-${(index % 5) + 1}.jpg`,
          featured: index < 3,
          popular: category.productCount > 30
        }));

      setCategories(formattedCategories);
    } catch (error) {
      console.error("Error loading categories:", error);
      setCategories(getFallbackCategories());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackCategories = () => {
    return [
      {
        id: "men-fashion",
        name: "Men's Fashion",
        description: "Premium clothing for men",
        productCount: 45,
        imageUrl: "/category-placeholder-1.jpg",
        featured: true,
        popular: true
      },
      {
        id: "women-fashion",
        name: "Women's Fashion",
        description: "Elegant styles for women",
        productCount: 62,
        imageUrl: "/category-placeholder-2.jpg",
        featured: true,
        popular: true
      },
      {
        id: "accessories",
        name: "Accessories",
        description: "Complete your look",
        productCount: 28,
        imageUrl: "/category-placeholder-3.jpg",
        featured: true,
        popular: false
      },
      {
        id: "footwear",
        name: "Footwear",
        description: "Comfort meets style",
        productCount: 34,
        imageUrl: "/category-placeholder-4.jpg",
        featured: false,
        popular: true
      },
      {
        id: "sports-wear",
        name: "Sports Wear",
        description: "Active lifestyle gear",
        productCount: 22,
        imageUrl: "/category-placeholder-5.jpg",
        featured: false,
        popular: false
      },
      {
        id: "formal-wear",
        name: "Formal Wear",
        description: "Professional attire",
        productCount: 18,
        imageUrl: "/category-placeholder-1.jpg",
        featured: false,
        popular: true
      },
      {
        id: "casual-wear",
        name: "Casual Wear",
        description: "Everyday comfort",
        productCount: 56,
        imageUrl: "/category-placeholder-2.jpg",
        featured: false,
        popular: true
      },
      {
        id: "seasonal",
        name: "Seasonal Collection",
        description: "Latest seasonal trends",
        productCount: 31,
        imageUrl: "/category-placeholder-3.jpg",
        featured: false,
        popular: true
      }
    ];
  };

  const filterCategories = () => {
    let filtered = [...categories];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (activeFilter === "featured") {
      filtered = filtered.filter(category => category.featured);
    } else if (activeFilter === "popular") {
      filtered = filtered.filter(category => category.popular);
    }

    setFilteredCategories(filtered);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return (
      <div className="categories-loading">
        <div className="loading-spinner"></div>
        <p>Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="categories-page">
      {/* Hero Section */}
      <section className="categories-hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Our Collections</h1>
            <p className="hero-subtitle">
              Discover premium fashion categories curated for every style and occasion.
            </p>
            
            <div className="search-container">
              <div className="search-box">
                <Search size={20} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="search-input"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="filters-section">
        <div className="container">
          <div className="filters-bar">
            <div className="filter-tabs">
              <button 
                className={`filter-tab ${activeFilter === "all" ? "active" : ""}`}
                onClick={() => setActiveFilter("all")}
              >
                All Categories
              </button>
              <button 
                className={`filter-tab ${activeFilter === "featured" ? "active" : ""}`}
                onClick={() => setActiveFilter("featured")}
              >
                <Filter size={16} />
                Featured
              </button>
              <button 
                className={`filter-tab ${activeFilter === "popular" ? "active" : ""}`}
                onClick={() => setActiveFilter("popular")}
              >
                Most Popular
              </button>
            </div>

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
          </div>

          <div className="results-info">
            <span className="results-count">
              {filteredCategories.length} {filteredCategories.length === 1 ? "category" : "categories"} found
            </span>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <main className="categories-main">
        <div className="container">
          {filteredCategories.length > 0 ? (
            <div className={`categories-container ${viewMode}`}>
              {filteredCategories.map((category) => (
                <div 
                  key={category.id} 
                  className="category-card"
                  onClick={() => window.location.href = `/category/${category.id}`}
                >
                  <div className="category-media">
                    <img 
                      src={category.imageUrl} 
                      alt={category.name}
                      className="category-image"
                      onError={(e) => {
                        e.target.src = `/category-placeholder-${Math.floor(Math.random() * 5) + 1}.jpg`;
                      }}
                    />
                    
                    <div className="category-overlay">
                      <span className="explore-text">
                        Explore Collection
                        <ChevronRight size={16} />
                      </span>
                    </div>

                    {(category.featured || category.popular) && (
                      <div className="category-badges">
                        {category.featured && (
                          <span className="badge featured">Featured</span>
                        )}
                        {category.popular && (
                          <span className="badge popular">Popular</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="category-info">
                    <h3 className="category-name">{category.name}</h3>
                    <p className="category-description">{category.description}</p>
                    
                    <div className="category-meta">
                      <span className="product-count">
                        {category.productCount} products
                      </span>
                      <button className="view-category-btn">
                        View Collection
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>No Categories Found</h3>
              <p>Try adjusting your search or filters</p>
              <button 
                className="btn primary"
                onClick={() => {
                  setSearchTerm("");
                  setActiveFilter("all");
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Stats Section */}
      <section className="categories-stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">50+</div>
              <div className="stat-label">Categories</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">1000+</div>
              <div className="stat-label">Products</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">Premium</div>
              <div className="stat-label">Quality</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <h2>Stay Updated</h2>
            <p>Subscribe to get notified about new collections and exclusive offers.</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email" />
              <button className="btn primary">Subscribe</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}