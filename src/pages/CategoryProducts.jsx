import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, ShoppingCart, Heart, Star, Grid, List } from "lucide-react";
import Header from "../components/Header";
import AlertModal from "../components/AlertModal";
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
  const [alertModal, setAlertModal] = useState({ show: false, message: "", type: "error" });

  const showAlert = (message, type = "error") => {
    setAlertModal({ show: true, message, type });
  };

  const closeAlert = () => {
    setAlertModal({ show: false, message: "", type: "error" });
  };

  useEffect(() => {
    loadProductsByCategory();
  }, [id]);

  const loadProductsByCategory = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
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

  const addToCart = async (product) => {
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
          productId: String(product.id), 
          quantity: 1 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showAlert("Product added to cart!", "success");
    } catch (err) {
      console.error("Cart error:", err);
      showAlert("Failed to add to cart. Please try again.", "error");
    }
  };

  const addToWishlist = async (product) => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        showAlert("Please login to add items to wishlist", "error");
        return;
      }

      await axios.post(
        `${BASE_URL}/wishlist/add`,
        { 
          productId:(product.id)
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showAlert("Product added to wishlist!", "success");
    } catch (err) {
      console.error("Wishlist error:", err);
      if (err.response?.status === 409) {
        showAlert("Product already in wishlist", "info");
      } else {
        showAlert("Failed to add to wishlist. Please try again.", "error");
      }
    }
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
    <>
      <Header />
      <div className="category-products-page">
        {/* Page Title Header */}
        <div className="products-header">
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
        </div>

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
              <div 
                className="product-card" 
                key={product.id}
              > 
                <div className="product-media">
                  <Link to={`/product/${product.id}`} className="product-image-link">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="product-image"
                      onError={(e) => {
                        e.target.src = "/placeholder-product.jpg";
                      }}
                    />
                  </Link>
                  
                  <div className="product-actions">
                    <button 
                      className="action-btn wishlist"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToWishlist(product);
                      }}
                      aria-label="Add to wishlist"
                    >
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
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    aria-label="Add to cart"
                  >
                    <ShoppingCart size={14} />
                    Add
                  </button>
                </div>

                <div className="product-info">
                  <Link to={`/product/${product.id}`} className="product-name-link">
                    <h3 className="product-name">{product.name}</h3>
                  </Link>
                  
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
              </div>
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

      <AlertModal
        show={alertModal.show}
        message={alertModal.message}
        type={alertModal.type}
        onClose={closeAlert}
      />
    </>
  );
}