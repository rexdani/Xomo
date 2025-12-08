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
import Header from "../components/Header";
import AlertModal from "../components/AlertModal";
import "../styles/checkout.css";
import "../styles/shared.css";
import { BASE_URL } from "../util/config.js";


export default function CheckoutPage() {
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  // Auto-set delivery date to 7 days from now
  const getDeliveryDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split("T")[0];
  };
  
  const [deliveryDate] = useState(getDeliveryDate());
  const [paymentMode, setPaymentMode] = useState("");

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [alertModal, setAlertModal] = useState({ show: false, message: "", type: "error" });

  const userId = localStorage.getItem("userId");

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
        `${BASE_URL}/address`,
        authHeader()
      );
      ;
      const userAddresses =  res.data || [];
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
  // const tax = subtotal * 0.18;
  const total = subtotal + shipping ;

  // Format delivery date for display
  const formatDeliveryDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

 // Razorpay Payment
const startPayment = async () => {
  if (paymentMode !== "RAZORPAY") {
    showAlert("Please select Razorpay Online Payment", "error");
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
           
            addressId: selectedAddress,
            paymentMethod:"RAZORPAY"
            
          };

          // 4. Final order placement to backend
          await axios.post(
            `${BASE_URL}/orders/place`,
            payload,
            authHeader()
          );

          showAlert("Payment Successful!", "success");
          setTimeout(() => navigate("/order-success"), 1500);

        } catch (error) {
          console.error("Order placement failed after payment:", error);
          showAlert("Payment succeeded, but order placement failed!", "error");
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
      showAlert("Payment Failed", "error");
      setTimeout(() => navigate("/payment-failed"), 1500);
    });

  } catch (err) {
    console.error("Error starting payment:", err);
    showAlert("Failed to start payment", "error");
  }
};

  const placeOrder = async () => {
    if (!selectedAddress) {
      showAlert("Select a delivery address", "error");
      return;
    }
    if (!paymentMode) {
      showAlert("Select a payment method", "error");
      return;
    }

    if (paymentMode === "RAZORPAY") {
      startPayment();
      return;
    }

    setPlacingOrder(true);

    try {
      const payload = {
        addressId: selectedAddress,
        paymentMethod:"COD"
      };

      await axios.post(
        `${BASE_URL}/orders/place`,
        payload,
        authHeader()
      );

      showAlert("Order placed successfully!", "success");
      setTimeout(() => navigate("/orders"), 1500);
    } catch (err) {
      console.error(err);
      showAlert("Order failed", "error");
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
      <div className="shared-loading">
        <div className="shared-spinner"></div>
        <p>Loading checkout...</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="checkout-page-pro">
        {/* Page Title Header */}
        <div className="checkout-header-pro">
        <div className="shared-container">
          <button className="back-btn-pro" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
            <span>Back to Cart</span>
          </button>
          <div className="header-content-pro">
            <h1 className="page-title-pro">Checkout</h1>
            <p className="page-subtitle-pro">Complete your order securely</p>
          </div>
        </div>
      </div>

      <div className="checkout-container-pro">
        <div className="shared-container">
          <div className="checkout-content-pro">
            {/* Professional Left Column */}
            <div className="checkout-forms-pro">
              
              {/* Delivery Address */}
              <section className="checkout-section-pro">
                <div className="section-header-pro">
                  <div className="section-icon-wrapper-pro">
                    <MapPin className="section-icon-pro" size={24} />
                  </div>
                  <div>
                    <h2 className="section-title-pro">Delivery Address</h2>
                    <p className="section-subtitle-pro">
                      Where should we deliver your order?
                    </p>
                  </div>
                </div>

                <div className="addresses-grid-pro">
                  {addresses.map((addr, index) => (
                    <div
                      key={addr.id}
                      className={`address-card-pro ${
                        selectedAddress === addr.id ? "selected" : ""
                      }`}
                      onClick={() => setSelectedAddress(addr.id)}
                      style={{ '--delay': `${index * 0.1}s` }}
                    >
                      <div className="address-radio-pro">
                        <div
                          className={`radio-dot-pro ${
                            selectedAddress === addr.id ? "active" : ""
                          }`}
                        ></div>
                      </div>
                      <div className="address-content-pro">
                        <h3 className="address-name-pro">{addr.fullName}</h3>
                        <p className="address-line-pro">{addr.street}</p>
                        <p className="address-line-pro">
                          {addr.city}, {addr.state} - {addr.postalCode}
                        </p>
                        <p className="address-line-pro">{addr.country}</p>
                        <p className="address-phone-pro">📱 {addr.phoneNumber}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>


              {/* Delivery Date */}
              <section className="checkout-section-pro">
                <div className="section-header-pro">
                  <div className="section-icon-wrapper-pro">
                    <Calendar className="section-icon-pro" size={24} />
                  </div>
                  <div>
                    <h2 className="section-title-pro">Estimated Delivery</h2>
                    <p className="section-subtitle-pro">
                      Expected delivery date
                    </p>
                  </div>
                </div>

                <div className="delivery-date-display-pro">
                  <div className="delivery-date-content-pro">
                    <Calendar className="delivery-calendar-icon-pro" size={20} />
                    <div className="delivery-date-info-pro">
                      <span className="delivery-date-label-pro">Expected Delivery</span>
                      <span className="delivery-date-text-pro">{formatDeliveryDate()}</span>
                    </div>
                  </div>
                  <div className="delivery-type-wrapper-pro">
                    <span className="delivery-type-badge-pro">Standard Delivery</span>
                  </div>
                </div>
              </section>

              {/* Payment Method */}
              <section className="checkout-section-pro">
                <div className="section-header-pro">
                  <div className="section-icon-wrapper-pro">
                    <Wallet className="section-icon-pro" size={24} />
                  </div>
                  <div>
                    <h2 className="section-title-pro">Payment Method</h2>
                    <p className="section-subtitle-pro">
                      Select a payment method
                    </p>
                  </div>
                </div>

                <div className="payment-methods-pro">
                  
                  {/* COD */}
                  <div
                    className={`payment-option-pro ${
                      paymentMode === "COD" ? "selected" : ""
                    }`}
                    onClick={() => setPaymentMode("COD")}
                  >
                    <div className="payment-radio-pro">
                      <div
                        className={`radio-dot-pro ${
                          paymentMode === "COD" ? "active" : ""
                        }`}
                      ></div>
                    </div>
                    <div className="payment-content-pro">
                      <div className="payment-header-pro">
                        <h3 className="payment-name-pro">Cash on Delivery</h3>
                        <div className="payment-icon-pro">💵</div>
                      </div>
                      <p className="payment-desc-pro">
                        Pay when the order is delivered
                      </p>
                    </div>
                  </div>

                  {/* Razorpay */}
                  <div
                    className={`payment-option-pro ${
                      paymentMode === "RAZORPAY" ? "selected" : ""
                    }`}
                    onClick={() => setPaymentMode("RAZORPAY")}
                  >
                    <div className="payment-radio-pro">
                      <div
                        className={`radio-dot-pro ${
                          paymentMode === "RAZORPAY" ? "active" : ""
                        }`}
                      ></div>
                    </div>
                    <div className="payment-content-pro">
                      <div className="payment-header-pro">
                        <h3 className="payment-name-pro">Online Payment</h3>
                        <div className="payment-icon-pro">💳</div>
                      </div>
                      <p className="payment-desc-pro">
                        Pay securely using Razorpay
                      </p>
                    </div>
                  </div>
                </div>

                {/* Razorpay Button */}
                {paymentMode === "RAZORPAY" && (
                  <button onClick={startPayment} className="checkout-btn-pro">
                    <CreditCard size={20} />
                    <span>Pay with Razorpay</span>
                  </button>
                )}
              </section>
            </div>

            {/* Professional Order Summary */}
            <div className="order-summary-pro">
              <div className="summary-card-pro">
                <div className="summary-header-pro">
                  <div className="summary-icon-pro">
                    <CreditCard size={24} />
                  </div>
                  <h2 className="summary-title-pro">Order Summary</h2>
                </div>

                <div className="cart-items-pro">
                  <h3 className="items-title-pro">Items ({cart.length})</h3>
                  <div className="items-list-pro">
                    {cart.map((item, index) => (
                      <div 
                        key={item.id} 
                        className="cart-item-pro"
                        style={{ '--delay': `${index * 0.05}s` }}
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="item-image-pro"
                        />
                        <div className="item-details-pro">
                          <h4 className="item-name-pro">{item.product?.name || item.name}</h4>
                          <p className="item-quantity-pro">Qty: {item.quantity}</p>
                        </div>
                        <div className="item-price-pro">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="price-breakdown-pro">
                  <div className="price-row-pro">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="price-row-pro">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? <span className="free-shipping-pro">FREE</span> : formatPrice(shipping)}</span>
                  </div>
                  {/* <div className="price-row-pro">
                    <span>Tax</span>
                    <span>{formatPrice(tax)}</span>
                  </div> */}
                  <div className="price-divider-pro"></div>
                  <div className="price-row-pro total-pro">
                    <span>Total Amount</span>
                    <span className="total-amount-pro">{formatPrice(total)}</span>
                  </div>
                </div>

                <div className="security-badge-pro">
                  <Shield size={18} />
                  <span>Secure checkout · SSL encrypted</span>
                </div>

                {/* COD Place Order */}
                {paymentMode === "COD" && (
                  <button
                    className="place-order-btn-pro"
                    onClick={placeOrder}
                    disabled={placingOrder}
                  >
                    {placingOrder ? (
                      <>
                        <div className="shared-spinner shared-spinner-small"></div>
                        <span>Placing Order...</span>
                      </>
                    ) : (
                      <>
                        <Lock size={20} />
                        <span>Place COD Order · {formatPrice(total)}</span>
                      </>
                    )}
                  </button>
                )}

                <div className="trust-indicators-pro">
                  <div className="trust-item-pro">
                    <Truck size={18} />
                    <span>Free shipping over ₹999</span>
                  </div>
                  <div className="trust-item-pro">
                    <CheckCircle size={18} />
                    <span>Easy 15-day returns</span>
                  </div>
                  <div className="trust-item-pro">
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

      <AlertModal
        show={alertModal.show}
        message={alertModal.message}
        type={alertModal.type}
        onClose={closeAlert}
      />
    </>
  );
}
