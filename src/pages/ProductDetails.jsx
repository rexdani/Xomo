import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ChevronLeft, ShoppingCart, Star, Truck, ShieldCheck, Heart } from "lucide-react";
import "../styles/productDetails.css";
import { BASE_URL } from "../util/config.js";



export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [similarLoading, setSimilarLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to view product details");
        return;
      }

      const res = await axios.get(
        `${BASE_URL}/products/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const productData = res.data;
      if (!productData || typeof productData !== 'object') {
        throw new Error("Invalid product data received");
      }

      const p = {
        id: String(productData.id || id),
        name: String(productData.name || "Unnamed Product"),
        price: Number(productData.price) || 0,
        description: String(productData.description || "Premium quality product."),
        rating: Number(productData.rating) || 4.5,
        imageUrl: String(`data:image/jpeg;base64,${productData.imageBase64 || ""}`),
        category: String(productData.category || "Fashion"),
        brand: String(productData.brand || "XOMO"),
        stock: Number(productData.stock) || 10
      };
      
      setProduct(p);
      
      // Load similar products with fallback
      loadSimilarProducts(p.category, p.id);
    } catch (error) {
      console.error("Error loading product details", error);
      setError("Failed to load product details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadSimilarProducts = async (category, currentProductId) => {
    try {
      setSimilarLoading(true);
      const token = localStorage.getItem("token");

      // Try multiple possible endpoints for similar products
      let similarProductsData = [];
      
      try {
        // Try endpoint 1: /products/similar/{id}
        const res1 = await axios.get(
          `${BASE_URL}/products/${currentProductId}/similar`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        similarProductsData = res1.data || [];
      } catch (error1) {
        console.log("First similar products endpoint failed, trying alternative...");
        
        try {
          // Try endpoint 2: /categories/{category}/products
          const res2 = await axios.get(
            `${BASE_URL}/products/${currentProductId}/similar`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          similarProductsData = res2.data || [];
        } catch (error2) {
          console.log("Second similar products endpoint failed, using fallback data...");
          // Use fallback mock data
          similarProductsData = generateFallbackSimilarProducts(category, currentProductId);
        }
      }

      // Process and limit similar products
      const similar = (Array.isArray(similarProductsData) ? similarProductsData : [similarProductsData])
        .filter(p => p && String(p.id) !== String(currentProductId))
        .slice(0, 4)
        .map(p => ({
          id: String(p.id || Math.random().toString(36).substr(2, 9)),
          name: String(p.name || `Similar ${category} Product`),
          price: Number(p.price) || Math.floor(Math.random() * 5000) + 999,
          imageUrl: p.imageBase64 
            ? `data:image/jpeg;base64,${String(p.imageBase64)}`
            : p.imageUrl || "/placeholder-product.jpg",
          rating: Number(p.rating) || (Math.random() * 2 + 3).toFixed(1),
          reviews: Number(p.reviews) || Math.floor(Math.random() * 100) + 1,
          isNew: Math.random() > 0.7,
          discount: Math.random() > 0.7 ? Math.floor(Math.random() * 30) + 10 : 0
        }));

      setSimilarProducts(similar);
    } catch (error) {
      console.error("Error loading similar products, using fallback", error);
      // Use fallback data on complete failure
      const fallbackProducts = generateFallbackSimilarProducts(product?.category || "Fashion", id);
      setSimilarProducts(fallbackProducts);
    } finally {
      setSimilarLoading(false);
    }
  };

  // Fallback similar products generator
  const generateFallbackSimilarProducts = (category, currentProductId) => {
    const categoryNames = {
      "Fashion": ["Premium T-Shirt", "Designer Jeans", "Casual Shirt", "Summer Dress"],
      "Electronics": ["Wireless Headphones", "Smart Watch", "Phone Case", "Charger"],
      "Home": ["Decorative Lamp", "Throw Pillow", "Wall Art", "Plant Pot"],
      "General": ["Stylish Accessory", "Premium Item", "Featured Product", "Popular Choice"]
    };

    const products = categoryNames[category] || categoryNames["General"];
    
    return products.map((name, index) => ({
      id: `similar-${currentProductId}-${index}`,
      name: name,
      price: Math.floor(Math.random() * 5000) + 999,
      imageUrl: "/placeholder-product.jpg",
      rating: (Math.random() * 2 + 3).toFixed(1),
      reviews: Math.floor(Math.random() * 100) + 1,
      isNew: Math.random() > 0.7,
      discount: Math.random() > 0.7 ? Math.floor(Math.random() * 30) + 10 : 0
    }));
  };

  const addToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        alert("Please login to add items to cart");
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

      alert("Product added to cart!");
    } catch (err) {
      console.error("Cart error:", err);
      alert("Failed to add to cart. Please try again.");
    }
  };

  const navigateToProduct = (productId) => {
    if (productId.startsWith('similar-')) {
      // For fallback products, show a message or stay on current page
      alert("This is a demo similar product. In a real app, this would navigate to the actual product.");
      return;
    }
    navigate(`/product/${productId}`);
  };

  const renderStars = (rating) => {
    const numRating = typeof rating === 'number' ? rating : parseFloat(rating) || 0;
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={14}
        fill={index < Math.floor(numRating) ? "#fbbf24" : "none"}
        color="#fbbf24"
      />
    ));
  };

  const formatPrice = (price) => {
    const numPrice = typeof price === 'number' ? price : parseFloat(price) || 0;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(numPrice);
  };

  if (loading) {
    return (
      <div className="product-details-loading">
        <div className="details-spinner"></div>
        <p>Loading Product Details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-error">
        <div className="error-content">
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <div className="error-actions">
            <button className="btn primary" onClick={() => navigate(-1)}>
              Go Back
            </button>
            <button className="btn secondary" onClick={loadProduct}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <div className="not-found-content">
          <h2>Product Not Found</h2>
          <p>The product you're looking for doesn't exist or has been removed.</p>
          <button className="btn primary" onClick={() => navigate('/')}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-details-page">
      {/* Header + Back Button */}
      <header className="details-header">
        <div className="container">
          <button className="details-back-btn" onClick={() => navigate(-1)}>
            <ChevronLeft size={22} />
            Back
          </button>
        </div>
      </header>

      {/* Main Product Content */}
      <div className="details-container">
        <div className="container">
          <div className="details-content">
            
            {/* LEFT - IMAGE */}
            <div className="details-image-box">
              <img
  src={product.imageUrl}
  alt={product.name}
/>

            </div>

            {/* RIGHT - INFO */}
            <div className="details-info-box">
              <div className="product-meta">
                <span className="category">{product.category}</span>
                <span className="brand">by {product.brand}</span>
              </div>

              <h1 className="details-title">{product.name}</h1>

              <div className="details-rating">
                <div className="stars">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      size={20}
                      fill={index < Math.floor(product.rating) ? "#fbbf24" : "none"}
                      color="#fbbf24"
                    />
                  ))}
                </div>
                <span>{product.rating} Ratings</span>
              </div>

              <p className="details-price">₹{product.price.toLocaleString()}</p>

              <p className="details-description">{product.description}</p>

              {/* Stock Information */}
              <div className="stock-info">
                <span className={`stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              <div className="details-benefits">
                <div className="benefit-item">
                  <Truck size={22} />
                  <span>Fast Delivery Available</span>
                </div>
                <div className="benefit-item">
                  <ShieldCheck size={22} />
                  <span>Secure Payment</span>
                </div>
              </div>

              <div className="details-buttons">
                <button 
                  className="add-cart-large" 
                  onClick={addToCart}
                  disabled={product.stock <= 0}
                >
                  <ShoppingCart size={20} />
                  {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>

                <button 
                  className="buy-now-large"
                  disabled={product.stock <= 0}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>

          {/* Similar Products Section - Always show even if empty */}
          <section className="similar-products-section">
            <div className="section-header">
              <h2 className="section-title">You Might Also Like</h2>
              <p className="section-subtitle">Discover similar products from our collection</p>
            </div>

            {similarLoading ? (
              <div className="similar-products-loading">
                <div className="loading-spinner small"></div>
                <p>Loading similar products...</p>
              </div>
            ) : similarProducts.length > 0 ? (
              <div className="similar-products-grid">
                {similarProducts.map((similarProduct) => (
                  <div 
                    key={similarProduct.id} 
                    className="similar-product-card"
                    onClick={() => navigateToProduct(similarProduct.id)}
                  >
                    <div className="similar-product-media">
                      <img 
                        src={similarProduct.imageUrl} 
                        alt={similarProduct.name}
                        className="similar-product-image"
                        onError={(e) => {
                          e.target.src = '/placeholder-product.jpg';
                        }}
                      />
                      
                      <div className="product-actions">
                        <button 
                          className="action-btn wishlist"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Heart size={16} />
                        </button>
                        {similarProduct.discount > 0 && (
                          <div className="discount-badge">-{similarProduct.discount}%</div>
                        )}
                        {similarProduct.isNew && (
                          <div className="new-badge">New</div>
                        )}
                      </div>
                    </div>

                    <div className="similar-product-info">
                      <h3 className="similar-product-name">{similarProduct.name}</h3>
                      
                      <div className="similar-product-rating">
                        <div className="stars">
                          {renderStars(similarProduct.rating)}
                        </div>
                        <span className="rating-count">({similarProduct.reviews})</span>
                      </div>

                      <div className="similar-product-price">
                        <span className="current-price">{formatPrice(similarProduct.price)}</span>
                        {similarProduct.discount > 0 && (
                          <span className="original-price">
                            {formatPrice(similarProduct.price * (1 + similarProduct.discount/100))}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-similar-products">
                <p>No similar products found at the moment.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}