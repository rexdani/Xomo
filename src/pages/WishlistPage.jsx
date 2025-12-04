import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowLeft,
  Star,
  Package
} from "lucide-react";
import Header from "../components/Header";
import AlertModal from "../components/AlertModal";
import "../styles/wishlist.css";
import "../styles/shared.css";
import { BASE_URL } from "../util/config.js";

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alertModal, setAlertModal] = useState({ show: false, message: "", type: "error" });
  const navigate = useNavigate();

  const showAlert = (message, type = "error") => {
    setAlertModal({ show: true, message, type });
  };

  const closeAlert = () => {
    setAlertModal({ show: false, message: "", type: "error" });
  };

  const authHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: token ? `Bearer ${token}` : "" } };
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/wishlist`, authHeader());
  
      // Backend always returns: { id, user, items: [] }
      const items = res.data?.items || [];
  
      const formatted = items
        .filter((item) => item && item.product) // Filter out items without products
        .map((item) => {
          const product = item.product;
          
          // Ensure product is an object and has required fields
          if (!product || typeof product !== 'object') {
            return null;
          }
  
          return {
            id: item.id,
            productId: product.id || product.productId || null,
            name: String(product.name || "Unnamed Product"),
            price: Number(product.price) || 0,
            description: String(product.description || "Premium quality product"),
            rating: Number(product.rating) || 4.5,
            imageUrl: product.image
              ? `data:image/jpeg;base64,${String(product.image)}`
              : product.imageBase64
              ? `data:image/jpeg;base64,${String(product.imageBase64)}`
              : "/placeholder-product.jpg",
            category: String(product.category || "Fashion"),
            stock: Number(product.stock) || 10
          };
        })
        .filter((item) => item !== null); // Remove any null items
  
      setWishlistItems(formatted);
  
    } catch (err) {
      console.error("Failed to load wishlist", err);
      setWishlistItems([]);
    } finally {
      setIsLoading(false);
    }
  };
  

  const removeFromWishlist = async (wishlistItemId) => {
    try {
      await axios.delete(`${BASE_URL}/wishlist/${wishlistItemId}`, authHeader());
      setWishlistItems((prev) => prev.filter((item) => item.id !== wishlistItemId));
      showAlert("Removed from wishlist", "success");
    } catch (err) {
      console.error("Failed to remove from wishlist", err);
      showAlert("Failed to remove item", "error");
    }
  };

  const addToCart = async (item) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        showAlert("Please login to add items to cart", "error");
        return;
      }

      await axios.post(
        `${BASE_URL}/cart/add`,
        {
          userId: String(userId),
          productId: String(item.productId),
          quantity: 1
        },
        authHeader()
      );

      showAlert("Added to cart!", "success");
    } catch (err) {
      console.error("Failed to add to cart", err);
      showAlert("Failed to add to cart", "error");
    }
  };

  const navigateToProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(price);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={14}
        fill={index < Math.floor(rating) ? "#fbbf24" : "none"}
        color="#fbbf24"
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="shared-loading">
        <div className="shared-spinner"></div>
        <p>Loading your wishlist...</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="wishlist-page">
        {/* Page Header */}
        <div className="wishlist-header">
          <div className="shared-container">
            <button className="back-btn-pro" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} />
              <span>Back</span>
            </button>

            <div className="header-content-pro">
              <h1 className="page-title-pro">My Wishlist</h1>
              <p className="page-subtitle-pro">
                {wishlistItems.length} item{wishlistItems.length !== 1 ? "s" : ""} saved
              </p>
            </div>
          </div>
        </div>

        <div className="wishlist-content">
          <div className="shared-container">
            {wishlistItems.length === 0 ? (
              <div className="shared-empty">
                <Heart size={80} className="shared-empty-icon" />
                <h2 className="shared-empty-title">Your Wishlist is Empty</h2>
                <p className="shared-empty-message">
                  Save items you love to your wishlist and shop them anytime
                </p>
                <div className="empty-actions-pro">
                  <button
                    className="shared-btn shared-btn-primary"
                    onClick={() => navigate("/HomePage")}
                  >
                    Start Shopping
                  </button>
                  <button
                    className="shared-btn shared-btn-secondary"
                    onClick={() => navigate("/categories")}
                  >
                    Browse Categories
                  </button>
                </div>
              </div>
            ) : (
              <div className="wishlist-grid">
                {wishlistItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="wishlist-card"
                    style={{ "--delay": `${index * 0.05}s` }}
                  >
                    <div
                      className="wishlist-card-image"
                      onClick={() => navigateToProduct(item.productId)}
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        onError={(e) => {
                          e.target.src = "/placeholder-product.jpg";
                        }}
                      />
                      <div className="image-overlay">
                        <span className="view-details">View Details</span>
                      </div>
                    </div>

                    <div className="wishlist-card-content">
                      <div className="card-header">
                        <span className="product-category">{item.category}</span>
                        <button
                          className="remove-btn"
                          onClick={() => removeFromWishlist(item.id)}
                          aria-label="Remove from wishlist"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <h3
                        className="product-name"
                        onClick={() => navigateToProduct(item.productId)}
                      >
                        {item.name}
                      </h3>

                      <div className="product-rating">
                        <div className="stars">{renderStars(item.rating)}</div>
                        <span className="rating-value">{item.rating}</span>
                      </div>

                      <p className="product-description">{item.description}</p>

                      <div className="product-price">{formatPrice(item.price)}</div>

                      <div className="stock-status">
                        {item.stock > 0 ? (
                          <span className="in-stock">
                            <Package size={14} /> In Stock
                          </span>
                        ) : (
                          <span className="out-of-stock">Out of Stock</span>
                        )}
                      </div>

                      <div className="card-actions">
                        <button
                          className="add-to-cart-btn"
                          onClick={() => addToCart(item)}
                          disabled={item.stock <= 0}
                        >
                          <ShoppingCart size={18} />
                          <span>{item.stock > 0 ? "Add to Cart" : "Out of Stock"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
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

