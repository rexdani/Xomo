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
import Header from "../components/Header";
import "../styles/cart.css";
import "../styles/shared.css";
import { BASE_URL } from "../util/config.js";

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

  // Fixed image function
  const getProductImage = async (productId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/products/image/${productId}`,
        {
          ...authHeader(),
          responseType: "arraybuffer"
        }
      );
      
      // Convert arraybuffer to base64
      const base64 = btoa(
        new Uint8Array(response.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ''
        )
      );
      
      return `data:image/jpeg;base64,${base64}`;
    } catch (error) {
      console.error("Error loading product image:", error);
      return "/placeholder-image.jpg"; // Return empty string or placeholder image
    }
  };

  const loadCart = async (uid) => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/cart`, authHeader());
      let items = Array.isArray(res.data)
        ? res.data
        : res.data?.items || res.data?.content || [];

      // Fetch images for all cart items
      // Fetch images & product details for all cart items
const formatted = items.map((it) => {
  if (!it.product) {
    console.error("Missing product in cart item:", it);
    return null;
  }

  const product = it.product;

  return {
    ...it,
    productId: product.id,
    name: product.name,
    price: product.price,
    qty: it.quantity || 1,
    totalPrice: (product.price || 0) * (it.quantity || 1),

    // Use BASE64 image directly from backend
    imageUrl: product.image
      ? `data:image/jpeg;base64,${product.image}`
      : "/placeholder-image.jpg",
  };
});



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
        `${BASE_URL}/cart/update/${itemId}`,
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
      await axios.delete(`${BASE_URL}/cart/remove/${itemId}`, authHeader());
      setItems((prev) => prev.filter((it) => it.id !== itemId));
    } catch (err) {
      console.error("Remove failed", err);
    }
  };

  const applyCoupon = async () => {
    if (!coupon.trim()) return alert("Enter coupon code");
    try {
      const res = await axios.post(
        `${BASE_URL}/cart/apply-coupon`,
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
      navigate("/");
      return;
    }
    if (items.length === 0) return alert("Cart is empty");
    
    setProcessing(true);
    try {
      navigate('/checkout');
    } catch (err) {
      console.error("Checkout failed", err);
      alert(err.response?.data?.message || "Checkout failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="shared-loading">
        <div className="shared-spinner"></div>
        <p>Loading your cart...</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="cart-page-pro">
        {/* Page Title Section */}
        <div className="cart-header-pro">
          <div className="shared-container">
            <button className="back-btn-pro" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} />
              <span>Continue Shopping</span>
            </button>
            
            <div className="header-content-pro">
              <h1 className="page-title-pro">Shopping Cart</h1>
              <p className="page-subtitle-pro">
                {items.length} item{items.length !== 1 ? 's' : ''} in your cart
              </p>
            </div>
          </div>
        </div>

      {items.length === 0 ? (
        <div className="shared-empty">
          <XCircle size={80} className="shared-empty-icon" />
          <h2 className="shared-empty-title">Your cart is empty</h2>
          <p className="shared-empty-message">Discover our premium collection and find something you love</p>
          <div className="empty-actions-pro">
            <button className="shared-btn shared-btn-primary" onClick={() => navigate('/')}>
              Start Shopping
            </button>
            <button className="shared-btn shared-btn-secondary" onClick={() => navigate('/categories')}>
              Browse Categories
            </button>
          </div>
        </div>
      ) : (
        <div className="cart-content-pro">
          <div className="shared-container">
            <div className="cart-layout-pro">
              {/* Professional Cart Items */}
              <main className="cart-main-pro">
                <div className="cart-items-section-pro">
                  <div className="section-header-pro">
                    <h2 className="section-title-pro">Cart Items</h2>
                    <span className="items-count-pro">{items.length} items</span>
                  </div>
                  
                  <div className="cart-items-pro">
                    {items.map((item, index) => (
                      <div 
                        className="cart-item-pro" 
                        key={item.id}
                        style={{ '--delay': `${index * 0.1}s` }}
                      >
                        <div className="item-image-pro">
                          <img 
                            src={item.imageUrl} 
                            onClick={() => navigate(`/product/${item.productId}`)}
                            alt={item.name}
                            onError={(e) => {
                              e.target.src = '/placeholder-image.jpg';
                            }}
                          />
                          <div className="image-overlay-pro"></div>
                        </div>
                        
                        <div className="item-details-pro">
                          <h3 
                            className="item-name-pro" 
                            onClick={() => navigate(`/product/${item.productId}`)}
                          >
                            {item.name}
                          </h3>
                          
                          <div className="item-price-pro">₹{item.price?.toLocaleString()}</div>
                          
                          <button 
                            className="remove-btn-pro"
                            onClick={() => removeItem(item.id)}
                            aria-label="Remove item"
                          >
                            <Trash2 size={18} />
                            <span>Remove</span>
                          </button>
                        </div>
                        
                        <div className="item-controls-pro">
                          <div className="quantity-selector-pro">
                            <button 
                              className="qty-btn"
                              onClick={() => changeQty(item.id, item.qty - 1)}
                              disabled={item.qty <= 1}
                              aria-label="Decrease quantity"
                            >
                              <Minus size={18} />
                            </button>
                            <span className="quantity-pro">{item.qty}</span>
                            <button 
                              className="qty-btn"
                              onClick={() => changeQty(item.id, item.qty + 1)}
                              aria-label="Increase quantity"
                            >
                              <Plus size={18} />
                            </button>
                          </div>
                          
                          <div className="item-total-pro">
                            ₹{item.totalPrice?.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Professional Features Strip */}
                <div className="cart-features-pro">
                  <div className="feature-item-pro">
                    <div className="feature-icon-pro">
                      <Truck size={24} />
                    </div>
                    <div className="feature-content-pro">
                      <div className="feature-title-pro">Free Shipping</div>
                      <div className="feature-desc-pro">On orders over ₹999</div>
                    </div>
                  </div>
                  
                  <div className="feature-item-pro">
                    <div className="feature-icon-pro">
                      <RotateCcw size={24} />
                    </div>
                    <div className="feature-content-pro">
                      <div className="feature-title-pro">Easy Returns</div>
                      <div className="feature-desc-pro">15 days hassle-free</div>
                    </div>
                  </div>
                  
                  <div className="feature-item-pro">
                    <div className="feature-icon-pro">
                      <ShieldCheck size={24} />
                    </div>
                    <div className="feature-content-pro">
                      <div className="feature-title-pro">Secure Payment</div>
                      <div className="feature-desc-pro">100% protected</div>
                    </div>
                  </div>
                </div>
              </main>

              {/* Professional Order Summary */}
              <aside className="cart-sidebar-pro">
                <div className="order-summary-pro">
                  <h3 className="summary-title-pro">Order Summary</h3>
                  
                  <div className="summary-items-pro">
                    <div className="summary-row-pro">
                      <span>Subtotal ({items.length} items)</span>
                      <span>₹{subtotal.toLocaleString()}</span>
                    </div>
                    
                    <div className="summary-row-pro">
                      <span>Shipping</span>
                      <span>
                        {shipping === 0 ? (
                          <span className="free-shipping-pro">FREE</span>
                        ) : (
                          `₹${shipping}`
                        )}
                      </span>
                    </div>
                    
                    {discountAmt > 0 && (
                      <div className="summary-row-pro discount-pro">
                        <span>Discount</span>
                        <span className="discount-amount-pro">-₹{discountAmt.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="coupon-section-pro">
                    <div className="coupon-input-pro">
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                        className="coupon-field-pro"
                      />
                      <button 
                        className="apply-coupon-pro"
                        onClick={applyCoupon}
                        disabled={!coupon.trim()}
                      >
                        Apply
                      </button>
                    </div>
                  </div>

                  <div className="summary-total-pro">
                    <div className="total-row-pro">
                      <span>Total</span>
                      <span className="total-amount-pro">₹{total.toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    className="checkout-btn-pro"
                    onClick={checkout}
                    disabled={processing}
                  >
                    {processing ? (
                      <>
                        <div className="shared-spinner shared-spinner-small"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard size={20} />
                        <span>Proceed to Checkout</span>
                      </>
                    )}
                  </button>

                  <div className="security-note-pro">
                    <ShieldCheck size={18} />
                    <span>Your payment information is secure and encrypted</span>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
}