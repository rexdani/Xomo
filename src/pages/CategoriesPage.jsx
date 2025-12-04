import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChevronRight, Search, Filter, Grid, List, Sparkles, TrendingUp } from "lucide-react";
import Header from "../components/Header";
import "../styles/categories.css";
import "../styles/shared.css";
import { BASE_URL } from "../util/config.js";

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
        `${BASE_URL}/categories`,
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
      <div className="shared-loading">
        <div className="shared-spinner"></div>
        <p>Loading categories...</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="categories-page-pro">
        {/* Filters Section - At Top */}
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

      {/* Professional Hero Section */}
      <section className="categories-hero-pro">
        <div className="shared-container">
          <div className="hero-content-pro">
            <div className="hero-badge-pro">
              <Sparkles size={14} />
              <span>Collections</span>
            </div>
            <h1 className="hero-title-pro">Our Collections</h1>
            <p className="hero-subtitle-pro">
              Discover premium fashion categories curated for every style and occasion.
            </p>
            
            <div className="search-container-pro">
              <div className="search-box-pro">
                <Search size={20} className="search-icon-pro" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="search-input-pro"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Categories Grid - Round Cards */}
      <main className="categories-main-pro">
        <div className="shared-container">
          {filteredCategories.length > 0 ? (
            <div className={`categories-grid-pro ${viewMode}`}>
              {filteredCategories.map((category, index) => (
                <a
                  key={category.id}
                  href={`/category/${category.id}`}
                  className="category-card-pro"
                  style={{ '--delay': `${index * 0.1}s` }}
                >
                  <div className="category-image-wrapper-pro">
                    <img 
                      src={category.imageUrl} 
                      alt={category.name}
                      className="category-image-pro"
                      onError={(e) => {
                        e.target.src = `/category-placeholder-${Math.floor(Math.random() * 5) + 1}.jpg`;
                      }}
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
                    <div className="category-pulse-ring-pro"></div>

                    {(category.featured || category.popular) && (
                      <div className="category-badges-pro">
                        {category.featured && (
                          <span className="badge-pro featured-pro">Featured</span>
                        )}
                        {category.popular && (
                          <span className="badge-pro popular-pro">
                            <TrendingUp size={12} />
                            Popular
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="category-info-pro">
                    <h3 className="category-name-pro">{category.name}</h3>
                    <p className="category-description-pro">{category.description}</p>
                    <div className="category-count-pro">
                      {category.productCount} products
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="shared-empty">
              <div className="shared-empty-icon">🔍</div>
              <h3 className="shared-empty-title">No Categories Found</h3>
              <p className="shared-empty-message">Try adjusting your search or filters</p>
              <button 
                className="shared-btn shared-btn-primary"
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
    </>
  );
}