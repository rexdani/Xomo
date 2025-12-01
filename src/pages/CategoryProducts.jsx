import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, ShoppingCart, Heart, Star, Grid, List } from "lucide-react";
import "../styles/categoryProducts.css";
import { BASE_URL } from "../util/config.js";



export default function CategoryProducts() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

  useEffect(() => {
    loadProductsByCategory();
  }, [id]);

  const loadProductsByCategory = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const authHeader = { headers: { Authorization: `Bearer ${token}` } };

      // Fetch category details
      const categoryRes = await axios.get(
        `${BASE_URL}/categories/${id}`,
        authHeader
      );
      setCategoryName(categoryRes.data.name);

      // Fetch products under this category
      const productRes = await axios.get(
        `${BASE_URL}/categories/${id}/products`,
        authHeader
      );

      const productFormatted = (productRes.data || []).map((p) => ({
        ...p,
        imageUrl: `data:image/jpeg;base64,${p.imageBase64 || ""}`,
        rating: p.rating || Math.random() * 2 + 3,
        reviews: p.reviews || Math.floor(Math.random() * 100) + 1,
        isNew: Math.random() > 0.7,
        discount: Math.random() > 0.8 ? Math.floor(Math.random() * 30) + 10 : 0
      }));

      setProducts(productFormatted);
    } catch (err) {
      console.error("Error loading products", err);
    } finally {
      setIsLoading(false);
    }
  };

  const sortProducts = (products) => {
    switch (sortBy) {
      case "price-low":
        return [...products].sort((a, b) => a.price - b.price);
      case "price-high":
        return [...products].sort((a, b) => b.price - a.price);
      case "rating":
        return [...products].sort((a, b) => b.rating - a.rating);
      default:
        return [...products].sort((a, b) => a.name.localeCompare(b.name));
    }
  };

  const addToCart = (product) => {
    console.log("Added to cart:", product);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={12}
        fill={index < Math.floor(rating) ? "#fbbf24" : "none"}
        color="#fbbf24"
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  const sortedProducts = sortProducts(products);

  return (
    <div className="category-products-page">
      {/* Header */}
      <header className="products-header">
        <div className="container">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
            Back
          </button>
          
          <div className="header-content">
            <h1 className="page-title">{categoryName}</h1>
            <p className="page-subtitle">
              {products.length} product{products.length !== 1 ? 's' : ''} available
            </p>
          </div>
        </div>
      </header>

      {/* Filters and Controls */}
      <section className="controls-section">
        <div className="container">
          <div className="controls-bar">
            <div className="view-controls">
              <button 
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid size={18} />
              </button>
              <button 
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <List size={18} />
              </button>
            </div>
            
            <div className="sort-controls">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid/List */}
      <main className="main-content">
        <div className="container">
          <div className={`products-container ${viewMode}`}>
            {sortedProducts.map((product) => (
              <Link 
  to={`/product/${product.id}`} 
  className="product-card" 
  key={product.id}
> 
                <div className="product-media">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="product-image"
                  />
                  
                  <div className="product-actions">
                    <button className="action-btn wishlist">
                      <Heart size={16} />
                    </button>
                    {product.discount > 0 && (
                      <div className="discount-badge">-{product.discount}%</div>
                    )}
                    {product.isNew && (
                      <div className="new-badge">New</div>
                    )}
                  </div>

                  <button 
                    className="quick-add-btn"
                    onClick={() => addToCart(product)}
                  >
                    <ShoppingCart size={14} />
                    Add
                  </button>
                </div>

                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  
                  <div className="product-meta">
                    <div className="product-rating">
                      <div className="stars">
                        {renderStars(product.rating)}
                      </div>
                      <span className="rating-count">({product.reviews})</span>
                    </div>
                  </div>

                  <div className="product-price">
                    <span className="current-price">{formatPrice(product.price)}</span>
                    {product.discount > 0 && (
                      <span className="original-price">
                        {formatPrice(product.price * (1 + product.discount/100))}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Empty State */}
          {products.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h3>No Products Found</h3>
              <p>Check back later for new {categoryName.toLowerCase()} arrivals.</p>
              <button 
                className="btn primary"
                onClick={() => navigate('/categories')}
              >
                Browse Categories
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}