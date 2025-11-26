import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  XCircle,
  ArrowLeft,
  Truck,
  ShieldCheck,
  RotateCcw
} from "lucide-react";
import "../styles/cart.css";

const host = window.location.hostname;
const backendPort = 8081;

export default function CartPage() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [coupon, setCoupon] = useState("");
  const [discountAmt, setDiscountAmt] = useState(0);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const uid = localStorage.getItem("userId");
    setUserId(uid);
    if (uid) loadCart(uid);
    else setIsLoading(false);
  }, []);

  const authHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: token ? `Bearer ${token}` : "" } };
  };

  const loadCart = async (uid) => {
    setIsLoading(true);
    try {
      const res = await axios.get(`http://${host}:${backendPort}/cart`, authHeader());

      let items = [];
      if (Array.isArray(res.data)) {
        items = res.data;
      } else if (Array.isArray(res.data?.items)) {
        items = res.data.items;
      } else if (Array.isArray(res.data?.content)) {
        items = res.data.content;
      } else {
        console.error("Unknown cart response", res.data);
        items = [];
      }

      const formatted = items.map((it) => ({
        ...it,
        imageUrl: it.imageBase64
          ? `data:image/jpeg;base64,${it.imageBase64}`
          : "/placeholder-product.jpg",
        qty: it.qty || 1,
        totalPrice: (it.price || 0) * (it.qty || 1)
      }));

      setItems(formatted);
    } catch (err) {
      console.error("Failed loading cart", err);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQtyLocal = (itemId, qty) => {
    setItems((prev) =>
      prev.map((it) => 
        it.id === itemId ? { 
          ...it, 
          qty: Math.max(1, qty),
          totalPrice: (it.price || 0) * Math.max(1, qty)
        } : it
      )
    );
  };

  const changeQty = async (itemId, newQty) => {
    if (newQty < 1) return;
    updateQtyLocal(itemId, newQty);
    try {
      await axios.put(
        `http://${host}:${backendPort}/cart/update/${itemId}`,
        { quantity: newQty },
        authHeader()
      );
    } catch (err) {
      console.error("Update qty failed", err);
      if (userId) loadCart(userId);
    }
  };

  const removeItem = async (itemId) => {
    if (!confirm("Remove this item from cart?")) return;
    try {
      await axios.delete(`http://${host}:${backendPort}/cart/remove/${itemId}`, authHeader());
      setItems((prev) => prev.filter((it) => it.id !== itemId));
    } catch (err) {
      console.error("Remove failed", err);
    }
  };

  const applyCoupon = async () => {
    if (!coupon.trim()) return alert("Enter coupon code");
    try {
      const res = await axios.post(
        `http://${host}:${backendPort}/cart/apply-coupon`,
        { userId, coupon },
        authHeader()
      );
      setDiscountAmt(res.data.discountAmount || 0);
      alert("Coupon applied successfully!");
    } catch (err) {
      console.error("Coupon failed", err);
      alert(err.response?.data?.message || "Invalid coupon code");
    }
  };

  const subtotal = items.reduce((s, it) => s + (it.price || 0) * (it.qty || 1), 0);
  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 99;
  const total = Math.max(0, subtotal + shipping - discountAmt);

  const checkout = async () => {
    if (!userId) {
      alert("Please login to checkout");
      navigate("/login");
      return;
    }
    if (items.length === 0) return alert("Cart is empty");
    
    setProcessing(true);
    try {
      const payload = {
        userId,
        items: items.map((it) => ({ productId: it.productId, quantity: it.qty })),
        coupon: coupon || null,
      };
      const res = await axios.post(
        `http://${host}:${backendPort}/orders/create`,
        payload,
        authHeader()
      );
      
      alert(res.data.message || "Order placed successfully!");
      setItems([]);
      setCoupon("");
      setDiscountAmt(0);
      // navigate('/orders');
    } catch (err) {
      console.error("Checkout failed", err);
      alert(err.response?.data?.message || "Checkout failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="cart-loading">
        <div className="loading-spinner"></div>
        <p>Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className="cart-page">
      {/* Header */}
      <header className="cart-header">
        <div className="container">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
            Continue Shopping
          </button>
          
          <div className="header-content">
            <h1 className="page-title">Shopping Cart</h1>
            <p className="page-subtitle">
              {items.length} item{items.length !== 1 ? 's' : ''} in your cart
            </p>
          </div>
        </div>
      </header>

      {items.length === 0 ? (
        <div className="cart-empty-state">
          <div className="empty-content">
            <XCircle size={80} className="empty-icon" />
            <h2>Your cart is empty</h2>
            <p>Discover our premium collection and find something you love</p>
            <div className="empty-actions">
              <button className="btn primary" onClick={() => navigate('/')}>
                Start Shopping
              </button>
              <button className="btn secondary" onClick={() => navigate('/categories')}>
                Browse Categories
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="cart-content">
          <div className="container">
            <div className="cart-layout">
              {/* Cart Items */}
              <main className="cart-main">
                <div className="cart-items-section">
                  <div className="section-header">
                    <h2>Cart Items</h2>
                    <span className="items-count">{items.length} items</span>
                  </div>
                  
                  <div className="cart-items">
                    {items.map((item) => (
                      <div className="cart-item" key={item.id}>
                        <div className="item-image">
                          <img 
                            src={item.imageUrl} 
                            alt={item.name}
                            onClick={() => navigate(`/product/${item.productId}`)}
                          />
                        </div>
                        
                        <div className="item-details">
                          <h3 className="item-name" onClick={() => navigate(`/product/${item.productId}`)}>
                            {item.name}
                          </h3>
                          
                          <div className="item-price">₹{item.price?.toLocaleString()}</div>
                          
                          <div className="item-actions">
                            <button 
                              className="remove-btn"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 size={16} />
                              Remove
                            </button>
                          </div>
                        </div>
                        
                        <div className="item-controls">
                          <div className="quantity-selector">
                            <button 
                              onClick={() => changeQty(item.id, item.qty - 1)}
                              disabled={item.qty <= 1}
                            >
                              <Minus size={16} />
                            </button>
                            <span className="quantity">{item.qty}</span>
                            <button onClick={() => changeQty(item.id, item.qty + 1)}>
                              <Plus size={16} />
                            </button>
                          </div>
                          
                          <div className="item-total">
                            ₹{item.totalPrice?.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features Strip */}
                <div className="cart-features">
                  <div className="feature-item">
                    <Truck size={24} />
                    <div className="feature-content">
                      <div className="feature-title">Free Shipping</div>
                      <div className="feature-desc">On orders over ₹999</div>
                    </div>
                  </div>
                  
                  <div className="feature-item">
                    <RotateCcw size={24} />
                    <div className="feature-content">
                      <div className="feature-title">Easy Returns</div>
                      <div className="feature-desc">15 days hassle-free</div>
                    </div>
                  </div>
                  
                  <div className="feature-item">
                    <ShieldCheck size={24} />
                    <div className="feature-content">
                      <div className="feature-title">Secure Payment</div>
                      <div className="feature-desc">100% protected</div>
                    </div>
                  </div>
                </div>
              </main>

              {/* Order Summary */}
              <aside className="cart-sidebar">
                <div className="order-summary">
                  <h3>Order Summary</h3>
                  
                  <div className="summary-items">
                    <div className="summary-row">
                      <span>Subtotal ({items.length} items)</span>
                      <span>₹{subtotal.toLocaleString()}</span>
                    </div>
                    
                    <div className="summary-row">
                      <span>Shipping</span>
                      <span>
                        {shipping === 0 ? (
                          <span className="free-shipping">FREE</span>
                        ) : (
                          `₹${shipping}`
                        )}
                      </span>
                    </div>
                    
                    {discountAmt > 0 && (
                      <div className="summary-row discount">
                        <span>Discount</span>
                        <span className="discount-amount">-₹{discountAmt.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="coupon-section">
                    <div className="coupon-input">
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                      />
                      <button 
                        className="apply-coupon"
                        onClick={applyCoupon}
                        disabled={!coupon.trim()}
                      >
                        Apply
                      </button>
                    </div>
                  </div>

                  <div className="summary-total">
                    <div className="total-row">
                      <span>Total</span>
                      <span className="total-amount">₹{total.toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    className="checkout-btn"
                    onClick={checkout}
                    disabled={processing}
                  >
                    {processing ? (
                      <>
                        <div className="spinner-small"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard size={20} />
                        Proceed to Checkout
                      </>
                    )}
                  </button>

                  <div className="security-note">
                    <ShieldCheck size={16} />
                    <span>Your payment information is secure and encrypted</span>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}