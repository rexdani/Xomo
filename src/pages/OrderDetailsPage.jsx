import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  CreditCard,
  Calendar,
  Phone,
  Mail,
  IndianRupee,
  Download,
  Printer,
  Shield,
  Home
} from "lucide-react";
import Header from "../components/Header";
import AlertModal from "../components/AlertModal";
import "../styles/orderDetails.css";
import { BASE_URL } from "../util/config.js";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alertModal, setAlertModal] = useState({ show: false, message: "", type: "info" });

  const showAlert = (message, type = "info") => {
    setAlertModal({ show: true, message, type });
  };

  const closeAlert = () => {
    setAlertModal({ show: false, message: "", type: "info" });
  };

  const authHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: token ? `Bearer ${token}` : "" } };
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
      return;
    }
    loadOrderDetails();
  }, [id]);

  const loadOrderDetails = async () => {
    try {
      // Try to fetch specific order by ID
      const res = await axios.get(
        `${BASE_URL}/orders/${id}`,
        authHeader()
      );
      setOrder(res.data);
    } catch (err) {
      // If specific order endpoint doesn't exist, fetch all orders and find the one
      try {
        const res = await axios.get(
          `${BASE_URL}/orders`,
          authHeader()
        );
        const orders = res.data || [];
        const foundOrder = orders.find(
          o => (o.id === parseInt(id) || o.id === id || o.orderId === id)
        );
        if (foundOrder) {
          setOrder(foundOrder);
        } else {
          showAlert("Order not found", "error");
        }
      } catch (error) {
        console.error("Failed to load order details", error);
        showAlert("Failed to load order details", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case "DELIVERED":
        return <CheckCircle className="status-icon delivered" size={24} />;
      case "SHIPPED":
        return <Truck className="status-icon shipped" size={24} />;
      case "CONFIRMED":
      case "PROCESSING":
        return <Clock className="status-icon placed" size={24} />;
      case "CANCELLED":
        return <Package className="status-icon cancelled" size={24} />;
      default:
        return <Package className="status-icon" size={24} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "DELIVERED":
        return "#10b981";
      case "SHIPPED":
        return "#3b82f6";
      case "CONFIRMED":
      case "PROCESSING":
        return "#f59e0b";
      case "CANCELLED":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getStatusText = (status) => {
    switch (status?.toUpperCase()) {
      case "DELIVERED":
        return "Delivered";
      case "SHIPPED":
        return "Shipped";
      case "CONFIRMED":
        return "Order Confirmed";
      case "PROCESSING":
        return "Processing";
      case "CANCELLED":
        return "Cancelled";
      default:
        return status || "Processing";
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price || 0);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadInvoice = () => {
    showAlert("Invoice download feature coming soon!", "info");
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="order-details-loading">
          <div className="loading-spinner"></div>
          <p>Loading order details...</p>
        </div>
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Header />
        <div className="order-details-error">
          <div className="error-content">
            <Package size={64} />
            <h2>Order Not Found</h2>
            <p>The order you're looking for doesn't exist or you don't have permission to view it.</p>
            <button className="back-to-orders-btn" onClick={() => navigate("/orders")}>
              <ArrowLeft size={18} />
              Back to Orders
            </button>
          </div>
        </div>
      </>
    );
  }

  const subtotal = order.items?.reduce((sum, item) => 
    sum + (item.price || 0) * (item.quantity || 1), 0
  ) || 0;
  const shipping = order.shipping || (subtotal > 999 ? 0 : 99);
  const tax = order.tax || 0;
  const discount = order.discount || 0;
  const total = order.totalAmount || (subtotal + shipping + tax - discount);

  return (
    <>
      <Header />
      <div className="order-details-page">
        {/* Header */}
        <div className="order-details-header">
          <div className="container">
            <div className="header-content">
              <button className="back-btn" onClick={() => navigate("/orders")}>
                <ArrowLeft size={20} />
                Back to Orders
              </button>
              <div className="header-title">
                <h1 className="page-title">Order Details</h1>
                <p className="page-subtitle">Order #{order.orderId || order.id}</p>
              </div>
              <div className="header-actions">
                <button className="action-btn" onClick={handleDownloadInvoice}>
                  <Download size={18} />
                  Invoice
                </button>
                <button className="action-btn" onClick={handlePrint}>
                  <Printer size={18} />
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="order-details-content">
            {/* Order Status Card */}
            <div className="order-status-card">
              <div className="status-header">
                <div className="status-info">
                  {getStatusIcon(order.orderStatus)}
                  <div>
                    <h2 className="status-title">Order {getStatusText(order.orderStatus)}</h2>
                    <p className="status-date">
                      <Calendar size={16} />
                      Placed on {formatDate(order.orderDate)}
                    </p>
                  </div>
                </div>
                <div 
                  className="status-badge"
                  style={{
                    backgroundColor: `${getStatusColor(order.orderStatus)}15`,
                    color: getStatusColor(order.orderStatus),
                    borderColor: getStatusColor(order.orderStatus)
                  }}
                >
                  {getStatusText(order.orderStatus)}
                </div>
              </div>

              {/* Status Timeline */}
              <div className="status-timeline">
                <div className={`timeline-step ${order.orderStatus === 'CONFIRMED' || order.orderStatus === 'PROCESSING' || order.orderStatus === 'SHIPPED' || order.orderStatus === 'DELIVERED' ? 'completed' : ''}`}>
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <div className="timeline-title">Order Placed</div>
                    <div className="timeline-date">{formatDate(order.orderDate)}</div>
                  </div>
                </div>
                <div className={`timeline-step ${order.orderStatus === 'PROCESSING' || order.orderStatus === 'SHIPPED' || order.orderStatus === 'DELIVERED' ? 'completed' : ''}`}>
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <div className="timeline-title">Processing</div>
                    <div className="timeline-date">Preparing your order</div>
                  </div>
                </div>
                <div className={`timeline-step ${order.orderStatus === 'SHIPPED' || order.orderStatus === 'DELIVERED' ? 'completed' : ''}`}>
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <div className="timeline-title">Shipped</div>
                    <div className="timeline-date">On the way</div>
                  </div>
                </div>
                <div className={`timeline-step ${order.orderStatus === 'DELIVERED' ? 'completed' : ''}`}>
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <div className="timeline-title">Delivered</div>
                    <div className="timeline-date">Order completed</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="details-grid">
              {/* Left Column - Order Items */}
              <div className="details-main">
                <div className="section-card">
                  <h3 className="section-title">Order Items</h3>
                  <div className="order-items-list">
                    {order.items?.map((item, index) => (
                      <div key={item.id || index} className="order-item-detail">
                        <div className="item-image-wrapper">
                          <img
                            src={
                              item.product?.image
                                ? `data:image/jpeg;base64,${item.product.image}`
                                : item.imageUrl || "/placeholder-product.jpg"
                            }
                            alt={item.product?.name || "Product"}
                            className="item-image"
                            onError={(e) => {
                              e.target.src = "/placeholder-product.jpg";
                            }}
                          />
                          <div className="item-quantity-badge">x{item.quantity || 1}</div>
                        </div>
                        <div className="item-details">
                          <h4 className="item-name">
                            {item.product?.name || item.name || "Unnamed Product"}
                          </h4>
                          <p className="item-description">
                            {item.product?.description || "Premium quality product"}
                          </p>
                          <div className="item-price-info">
                            <span className="item-price">
                              {formatPrice((item.price || 0) * (item.quantity || 1))}
                            </span>
                            {item.originalPrice && item.originalPrice > item.price && (
                              <span className="item-original-price">
                                {formatPrice(item.originalPrice * (item.quantity || 1))}
                              </span>
                            )}
                            <span className="item-unit-price">
                              {formatPrice(item.price || 0)} each
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Order Info */}
              <div className="details-sidebar">
                {/* Shipping Address */}
                <div className="section-card">
                  <h3 className="section-title">
                    <MapPin size={20} />
                    Delivery Address
                  </h3>
                  <div className="address-details">
                    {order.address ? (
                      <>
                        <div className="address-name">{order.address.fullName || "N/A"}</div>
                        <div className="address-line">{order.address.street || ""}</div>
                        <div className="address-line">
                          {order.address.city}, {order.address.state} - {order.address.postalCode}
                        </div>
                        <div className="address-line">{order.address.country || "India"}</div>
                        {order.address.phoneNumber && (
                          <div className="address-phone">
                            <Phone size={16} />
                            {order.address.phoneNumber}
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="no-address">Address not available</p>
                    )}
                  </div>
                </div>

                {/* Payment Information */}
                <div className="section-card">
                  <h3 className="section-title">
                    <CreditCard size={20} />
                    Payment Information
                  </h3>
                  <div className="payment-details">
                    <div className="payment-row">
                      <span className="payment-label">Payment Method</span>
                      <span className="payment-value">{order.payment || "Not specified"}</span>
                    </div>
                    <div className="payment-row">
                      <span className="payment-label">Transaction ID</span>
                      <span className="payment-value">
                        {order.transactionId || order.orderId || "N/A"}
                      </span>
                    </div>
                    <div className="payment-status">
                      <Shield size={16} />
                      <span>Payment Protected by XOMO</span>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="section-card">
                  <h3 className="section-title">Order Summary</h3>
                  <div className="summary-details">
                    <div className="summary-row">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    {shipping > 0 && (
                      <div className="summary-row">
                        <span>Shipping</span>
                        <span>{formatPrice(shipping)}</span>
                      </div>
                    )}
                    {tax > 0 && (
                      <div className="summary-row">
                        <span>Tax</span>
                        <span>{formatPrice(tax)}</span>
                      </div>
                    )}
                    {discount > 0 && (
                      <div className="summary-row discount">
                        <span>Discount</span>
                        <span>-{formatPrice(discount)}</span>
                      </div>
                    )}
                    <div className="summary-divider"></div>
                    <div className="summary-row total">
                      <span>Total Amount</span>
                      <span className="total-amount">
                        <IndianRupee size={20} />
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Support */}
                <div className="section-card support-card">
                  <h3 className="section-title">Need Help?</h3>
                  <p className="support-text">
                    If you have any questions about your order, our support team is here to help.
                  </p>
                  <div className="support-actions">
                    <button className="support-btn" onClick={() => navigate("/contact")}>
                      <Mail size={18} />
                      Contact Support
                    </button>
                    <button className="support-btn" onClick={() => navigate("/faq")}>
                      <Home size={18} />
                      View FAQ
                    </button>
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

