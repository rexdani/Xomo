import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Search, X, ShoppingCart, Heart, Star } from "lucide-react";
import "../styles/searchModal.css";
import { BASE_URL } from "../util/config.js";

export default function SearchModal({ show, onClose }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (show) {
      inputRef.current?.focus();
      loadWishlist();
    } else {
      setSearchTerm("");
      setSearchResults([]);
    }
  }, [show]);

  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      const debounceTimer = setTimeout(() => {
        searchProducts(searchTerm);
      }, 300);

      return () => clearTimeout(debounceTimer);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const loadWishlist = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const authHeader = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(`${BASE_URL}/wishlist`, authHeader);
      
      const items = res.data?.items || [];
      const productIds = items
        .filter(item => item && item.product)
        .map(item => String(item.product.id || item.product.productId));
      
      setWishlistItems(productIds);
    } catch (err) {
      console.error("Failed to load wishlist", err);
    }
  };

  const searchProducts = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setSearchResults([]);
        setIsLoading(false);
        return;
      }

      const authHeader = { headers: { Authorization: `Bearer ${token}` } };
      
      // Fetch all products and filter client-side
      const response = await axios.get(`${BASE_URL}/products`, authHeader);
      const allProducts = Array.isArray(response.data) ? response.data : [];

      // Filter products by search term
      const filtered = allProducts
        .filter(product => {
          const name = (product.name || "").toLowerCase();
          const description = (product.description || "").toLowerCase();
          const category = (product.category || "").toLowerCase();
          const queryLower = query.toLowerCase();
          
          return name.includes(queryLower) || 
                 description.includes(queryLower) || 
                 category.includes(queryLower);
        })
        .slice(0, 10) // Limit to 10 results
        .map(product => ({
          id: String(product.id),
          name: String(product.name || "Unnamed Product"),
          price: Number(product.price || 0),
          description: String(product.description || ""),
          category: String(product.category || "Fashion"),
          imageUrl: product.imageBase64 
            ? `data:image/jpeg;base64,${product.imageBase64}`
            : product.image
            ? `data:image/jpeg;base64,${product.image}`
            : "/placeholder-product.jpg",
          rating: Number(product.rating || 4.5)
        }));

      setSearchResults(filtered);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.includes(String(productId));
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    onClose();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (!show) return null;

  return (
    <div className="search-modal-overlay" onClick={onClose}>
      <div className="search-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="search-modal-header">
          <div className="search-input-wrapper">
            <Search size={20} className="search-icon" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  onClose();
                }
              }}
            />
          </div>
          <button className="close-search-btn" onClick={onClose} aria-label="Close search">
            <X size={20} />
          </button>
        </div>

        <div className="search-results">
          {isLoading ? (
            <div className="search-loading">
              <div className="search-spinner"></div>
              <p>Searching...</p>
            </div>
          ) : searchTerm.trim().length === 0 ? (
            <div className="search-empty">
              <Search size={48} />
              <p>Start typing to search for products</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="search-empty">
              <Search size={48} />
              <p>No products found for "{searchTerm}"</p>
            </div>
          ) : (
            <div className="search-results-list">
              {searchResults.map((product) => (
                <div
                  key={product.id}
                  className="search-result-item"
                  onClick={() => handleProductClick(product.id)}
                >
                  <div className="result-image">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = "/placeholder-product.jpg";
                      }}
                    />
                  </div>
                  <div className="result-info">
                    <h4 className="result-name">{product.name}</h4>
                    <p className="result-category">{product.category}</p>
                    <div className="result-footer">
                      <span className="result-price">{formatPrice(product.price)}</span>
                      <div className="result-rating">
                        <Star size={14} fill="#fbbf24" color="#fbbf24" />
                        <span>{product.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

