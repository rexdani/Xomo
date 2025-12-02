import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  CreditCard,
  Calendar,
  Truck,
  Wallet,
  CheckCircle,
  ArrowLeft,
  Shield,
  Lock,
  Star
} from "lucide-react";
import "../styles/checkout.css";
import { BASE_URL } from "../util/config.js";


export default function CheckoutPage() {
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [deliveryDate, setDeliveryDate] = useState("");
  const [paymentMode, setPaymentMode] = useState("");

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const userId = localStorage.getItem("userId");

  const authHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: token ? `Bearer ${token}` : "" } };
  };

  // Load cart + address data
  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }
    loadAddresses();
    loadCart();
  }, []);

  const loadAddresses = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/user/profile`,
        authHeader()
      );
      const user = res.data;
      const userAddresses = user.address ? [user.address] : [];
      setAddresses(userAddresses);
      if (userAddresses.length > 0) {
        setSelectedAddress(userAddresses[0].id);
      }
    } catch (err) {
      console.error("Address load failed", err);
    }
  };

  const loadCart = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/cart`,
        authHeader()
      );
      let items = res.data.items || [];

     const itemsWithImages = items.map(item => ({
  ...item,
  imageUrl: item.product?.image
    ? `data:image/jpeg;base64,${item.product.image}`
    : "/placeholder-product.jpg"
}));
      setCart(itemsWithImages);
    } catch (err) {
      console.error("Cart load failed", err);
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cart.reduce((sum, it) => sum + it.price * it.quantity, 0);
  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 99;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  // Delivery dates
  const getDeliveryDates = () => {
    const dates = [];
    for (let i = 1; i <= 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const formattedDate = d.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short"
      });
      dates.push({
        value: d.toISOString().split("T")[0],
        label: formattedDate,
        isExpress: i <= 2
      });
    }
    return dates;
  };

 // Razorpay Payment
const startPayment = async () => {
  if (paymentMode !== "RAZORPAY") {
    alert("Please select Razorpay Online Payment");
    return;
  }

  try {
    // 1. Create Razorpay Order from backend
    const orderRes = await axios.post(
      `${BASE_URL}/payments/create-order`,
      { amount: total },
      authHeader()
    );

    const order = orderRes.data;

    // 2. Razorpay options
    const options = {
      key: "rzp_test_RmEi7bwQyWNCUh",
      amount: order.amount,
      currency: "INR",
      name: "Clothing Store",
      description: "Order Payment",
      order_id: order.id,

      // 3. Payment Success Handler
      handler: async function (response) {
        try {
          // Build order payload
          const payload = {
            userId,
            addressId: selectedAddress,
            deliveryDate,
            paymentMode,
            items: cart.map(i => ({
              productId: i.productId,
              quantity: i.quantity
            }))
          };

          // 4. Final order placement to backend
          await axios.post(
            `${BASE_URL}/orders/place`,
            payload,
            authHeader()
          );

          alert("Payment Successful!");
          navigate("/order-success");

        } catch (error) {
          console.error("Order placement failed after payment:", error);
          alert("Payment succeeded, but order placement failed!");
        }
      },

      prefill: {
        name: localStorage.getItem("userName"),
        email: localStorage.getItem("email"),
        contact: localStorage.getItem("phone")
      },

      theme: { color: "#3861fb" }
    };

    // 5. Open Razorpay window
    const rzp = new window.Razorpay(options);
    rzp.open();

    rzp.on("payment.failed", function () {
      alert("Payment Failed");
      navigate("/payment-failed");
    });

  } catch (err) {
    console.error("Error starting payment:", err);
    alert("Failed to start payment");
  }
};

  const placeOrder = async () => {
    if (!selectedAddress) return alert("Select a delivery address");
    if (!deliveryDate) return alert("Select a delivery date");
    if (!paymentMode) return alert("Select a payment method");

    if (paymentMode === "RAZORPAY") {
      startPayment();
      return;
    }

    setPlacingOrder(true);

    try {
      const payload = {
        userId,
        addressId: selectedAddress,
        deliveryDate,
        paymentMode,
        items: cart.map(i => ({
          productId: i.productId,
          quantity: i.quantity
        }))
      };

      await axios.post(
        `${BASE_URL}/orders/place`,
        payload,
        authHeader()
      );

      alert("Order placed successfully!");
      navigate("/orders");
    } catch (err) {
      console.error(err);
      alert("Order failed");
    } finally {
      setPlacingOrder(false);
    }
  };

  const formatPrice = price => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="checkout-loading">
        <div className="loading-spinner"></div>
        <p>Loading checkout...</p>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      {/* Header */}
      <header className="checkout-header">
        <div className="container">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} /> Back to Cart
          </button>
          <h1 className="page-title">Checkout</h1>
        </div>
      </header>

      <div className="checkout-container">
        <div className="container">
          <div className="checkout-content">
            {/* Left Column */}
            <div className="checkout-forms">
              
              {/* Delivery Address */}
              <section className="checkout-section">
                <div className="section-header">
                  <MapPin className="section-icon" size={24} />
                  <div>
                    <h2 className="section-title">Delivery Address</h2>
                    <p className="section-subtitle">
                      Where should we deliver your order?
                    </p>
                  </div>
                </div>

                <div className="addresses-grid">
                  {addresses.map(addr => (
                    <div
                      key={addr.id}
                      className={`address-card ${
                        selectedAddress === addr.id ? "selected" : ""
                      }`}
                      onClick={() => setSelectedAddress(addr.id)}
                    >
                      <div className="address-radio">
                        <div
                          className={`radio-dot ${
                            selectedAddress === addr.id ? "active" : ""
                          }`}
                        ></div>
                      </div>
                      <div className="address-content">
                        <h3 className="address-name">{addr.fullName}</h3>
                        <p className="address-line">{addr.street}</p>
                        <p className="address-line">
                          {addr.city}, {addr.state} - {addr.postalCode}
                        </p>
                        <p className="address-line">{addr.country}</p>
                        <p className="address-phone">📱 {addr.phoneNumber}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>


              {/* Delivery Date */}
              <section className="checkout-section">
                <div className="section-header">
                  <Calendar className="section-icon" size={24} />
                  <div>
                    <h2 className="section-title">Delivery Date</h2>
                    <p className="section-subtitle">
                      Choose your preferred delivery date
                    </p>
                  </div>
                </div>

                <div className="delivery-dates">
                  {getDeliveryDates().map(date => (
                    <div
                      key={date.value}
                      className={`delivery-option ${
                        deliveryDate === date.value ? "selected" : ""
                      } ${date.isExpress ? "express" : ""}`}
                      onClick={() => setDeliveryDate(date.value)}
                    >
                      <div className="date-radio">
                        <div
                          className={`radio-dot ${
                            deliveryDate === date.value ? "active" : ""
                          }`}
                        ></div>
                      </div>
                      <div className="date-content">
                        <span className="date-label">{date.label}</span>
                        {date.isExpress && (
                          <span className="express-badge">Express</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Payment Method */}
              <section className="checkout-section">
                <div className="section-header">
                  <Wallet className="section-icon" size={24} />
                  <div>
                    <h2 className="section-title">Payment Method</h2>
                    <p className="section-subtitle">
                      Select a payment method
                    </p>
                  </div>
                </div>

                <div className="payment-methods">
                  
                  {/* COD */}
                  <div
                    className={`payment-option ${
                      paymentMode === "COD" ? "selected" : ""
                    }`}
                    onClick={() => setPaymentMode("COD")}
                  >
                    <div className="payment-radio">
                      <div
                        className={`radio-dot ${
                          paymentMode === "COD" ? "active" : ""
                        }`}
                      ></div>
                    </div>
                    <div className="payment-content">
                      <div className="payment-header">
                        <h3 className="payment-name">Cash on Delivery</h3>
                        <div className="payment-icon">💵</div>
                      </div>
                      <p className="payment-desc">
                        Pay when the order is delivered
                      </p>
                    </div>
                  </div>

                  {/* Razorpay */}
                  <div
                    className={`payment-option ${
                      paymentMode === "RAZORPAY" ? "selected" : ""
                    }`}
                    onClick={() => setPaymentMode("RAZORPAY")}
                  >
                    <div className="payment-radio">
                      <div
                        className={`radio-dot ${
                          paymentMode === "RAZORPAY" ? "active" : ""
                        }`}
                      ></div>
                    </div>
                    <div className="payment-content">
                      <div className="payment-header">
                        <h3 className="payment-name">Online Payment</h3>
                        <div className="payment-icon">💳</div>
                      </div>
                      <p className="payment-desc">
                        Pay securely using Razorpay
                      </p>
                    </div>
                  </div>
                </div>

                {/* Razorpay Button */}
                {paymentMode === "RAZORPAY" && (
                  <button onClick={startPayment} className="checkout-btn">
                    Pay with Razorpay
                  </button>
                )}
              </section>
            </div>

            {/* Right Column – Summary */}
            <div className="order-summary">
              <div className="summary-card">
                <div className="summary-header">
                  <CreditCard size={24} />
                  <h2>Order Summary</h2>
                </div>

                <div className="cart-items">
                  <h3 className="items-title">Items ({cart.length})</h3>
                  {cart.map(item => (
                    <div key={item.id} className="cart-item">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="item-image"
                      />
                      <div className="item-details">
                        <h4 className="item-name">{item.product.name}</h4>
                        <p className="item-quantity">Qty: {item.quantity}</p>
                      </div>
                      <div className="item-price">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="price-breakdown">
                  <div className="price-row">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="price-row">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
                  </div>
                  <div className="price-row">
                    <span>Tax</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <div className="price-divider"></div>
                  <div className="price-row total">
                    <span>Total Amount</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <div className="security-badge">
                  <Shield size={16} />
                  <span>Secure checkout · SSL encrypted</span>
                </div>

                {/* COD Place Order */}
                {paymentMode === "COD" && (
                  <button
                    className="place-order-btn"
                    onClick={placeOrder}
                  >
                    <Lock size={20} />
                    Place COD Order · {formatPrice(total)}
                  </button>
                )}

                <div className="trust-indicators">
                  <div className="trust-item">
                    <Truck size={18} />
                    <span>Free shipping over ₹999</span>
                  </div>
                  <div className="trust-item">
                    <CheckCircle size={18} />
                    <span>Easy 15-day returns</span>
                  </div>
                  <div className="trust-item">
                    <Star size={18} />
                    <span>Premium quality guarantee</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
