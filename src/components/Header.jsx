import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Menu, ShoppingCart, Search, User, X, Heart } from "lucide-react";
import axios from "axios";
import SearchModal from "./SearchModal";
import "../styles/header.css";
import { BASE_URL } from "../util/config.js";

export default function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const location = useLocation();

  // Scroll detection for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load cart count on mount and route change
  useEffect(() => {
    loadCartCount();
  }, [location]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenu(false);
  }, [location]);

  const loadCartCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      
      if (!token || !userId) return;

      const response = await axios.get(
        `${BASE_URL}/cart/count/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCartCount(response.data || 0);
    } catch (error) {
      console.log("Could not load cart count");
    }
  };

  const isActive = (path) => {
    if (path === "/HomePage" && (location.pathname === "/HomePage" || location.pathname === "/home")) {
      return true;
    }
    return location.pathname === path;
  };

  return (
    <>
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
            <a href="/HomePage" className={`nav-link ${isActive('/HomePage') ? 'active' : ''}`}>
              <span>Home</span>
            </a>
            <a href="/categories" className={`nav-link ${isActive('/categories') ? 'active' : ''}`}>
              <span>Categories</span>
            </a>
            <a href="/new-arrivals" className={`nav-link ${isActive('/new-arrivals') ? 'active' : ''}`}>
              <span>New Arrivals</span>
            </a>
            <a href="/collections" className={`nav-link ${isActive('/collections') ? 'active' : ''}`}>
              <span>Collections</span>
            </a>
            <a href="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>
              <span>Contact</span>
            </a>
          </nav>

          <div className="header-actions">
            <button 
              className="action-btn search-btn" 
              aria-label="Search"
              onClick={() => setShowSearchModal(true)}
            >
              <Search size={22} strokeWidth={2.5} />
            </button>
            <a href="/wishlist" className={`action-btn wishlist-btn ${isActive('/wishlist') ? 'active' : ''}`} aria-label="Wishlist">
              <Heart size={22} strokeWidth={2.5} />
            </a>
            <a href="/profile" className={`action-btn user-btn ${isActive('/profile') ? 'active' : ''}`} aria-label="Profile">
              <User size={22} strokeWidth={2.5} />
            </a>
            <a href="/cart" className={`action-btn cart-btn ${isActive('/cart') ? 'active' : ''}`} aria-label="Cart">
              <ShoppingCart size={22} strokeWidth={2.5} />
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

        {/* Mobile Menu */}
        <div className={`mobile-drawer ${mobileMenu ? 'open' : ''}`}>
          <div className="mobile-nav">
            <button 
              className="mobile-nav-link mobile-search-btn" 
              onClick={() => {
                setShowSearchModal(true);
                setMobileMenu(false);
              }}
            >
              <Search size={20} strokeWidth={2.5} />
              <span>Search Products</span>
            </button>
            <div className="mobile-nav-divider"></div>
            <a href="/HomePage" className={`mobile-nav-link ${isActive('/HomePage') ? 'active' : ''}`} onClick={() => setMobileMenu(false)}>
              Home
            </a>
            <a href="/categories" className={`mobile-nav-link ${isActive('/categories') ? 'active' : ''}`} onClick={() => setMobileMenu(false)}>
              Categories
            </a>
            <a href="/new-arrivals" className={`mobile-nav-link ${isActive('/new-arrivals') ? 'active' : ''}`} onClick={() => setMobileMenu(false)}>
              New Arrivals
            </a>
            <a href="/collections" className={`mobile-nav-link ${isActive('/collections') ? 'active' : ''}`} onClick={() => setMobileMenu(false)}>
              Collections
            </a>
            <a href="/contact" className={`mobile-nav-link ${isActive('/contact') ? 'active' : ''}`} onClick={() => setMobileMenu(false)}>
              Contact
            </a>
            <div className="mobile-nav-divider"></div>
            <a href="/profile" className={`mobile-nav-link ${isActive('/profile') ? 'active' : ''}`} onClick={() => setMobileMenu(false)}>
              My Profile
            </a>
            <a href="/wishlist" className={`mobile-nav-link ${isActive('/wishlist') ? 'active' : ''}`} onClick={() => setMobileMenu(false)}>
              Wishlist
            </a>
            <a href="/orders" className={`mobile-nav-link ${isActive('/orders') ? 'active' : ''}`} onClick={() => setMobileMenu(false)}>
              My Orders
            </a>
            <a href="/cart" className={`mobile-nav-link ${isActive('/cart') ? 'active' : ''}`} onClick={() => setMobileMenu(false)}>
              Cart {cartCount > 0 && `(${cartCount})`}
            </a>
          </div>
        </div>
      </header>

      {/* Overlay for mobile menu */}
      {mobileMenu && (
        <div className="mobile-overlay" onClick={() => setMobileMenu(false)}></div>
      )}

      {/* Search Modal */}
      <SearchModal 
        show={showSearchModal} 
        onClose={() => setShowSearchModal(false)} 
      />
    </>
  );
}

