import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  IndianRupee, 
  ArrowLeft,
  ChevronRight,
  MapPin,
  CreditCard,
  Calendar,
  Shield
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import AlertModal from "../components/AlertModal";
import "../styles/orders.css";
import { BASE_URL } from "../util/config.js";


export default function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
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
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/orders`,
        authHeader()
      );
      setOrders(res.data || []);
    } catch (err) {
      console.error("Failed to load orders", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case "DELIVERED":
        return <CheckCircle className="status-icon delivered" size={22} />;
      case "SHIPPED":
        return <Truck className="status-icon shipped" size={22} />;
      case "CONFIRMED":
      case "PROCESSING":
        return <Clock className="status-icon placed" size={22} />;
      case "CANCELLED":
        return <Package className="status-icon cancelled" size={22} />;
      default:
        return <Package className="status-icon" size={22} />;
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
      month: 'short',
      year: 'numeric'
    });
  };

  const getFilteredOrders = () => {
    if (activeTab === "all") return orders;
    return orders.filter(order => 
      order.orderStatus?.toUpperCase() === activeTab.toUpperCase()
    );
  };

  const getStatusText = (status) => {
    switch (status?.toUpperCase()) {
      case "DELIVERED":
        return "Delivered";
      case "SHIPPED":
        return "Shipped";
      case "CONFIRMED":
        return "Order Placed";
        
      case "PROCESSING":
        return "Processing";
      case "CANCELLED":
        return "Cancelled";
      default:
        return status || "Processing";
    }
  };

  if (loading) {
    return (
      <div className="orders-loading">
        <div className="loading-spinner"></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  const filteredOrders = getFilteredOrders();

  return (
    <>
      <Header />
      <div className="orders-page">
        {/* Page Title Header */}
        <div className="orders-header">
          <div className="container">
            <div className="header-content">
              <button className="back-btn" onClick={() => navigate(-1)}>
                <ArrowLeft size={20} />
                Back
              </button>
              <div className="header-title">
                <h1 className="orders-title">My Orders</h1>
                <p className="orders-subtitle">Track and manage your purchases</p>
              </div>
            </div>
          </div>
        </div>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon total">
                <Package size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-number">{orders.length}</div>
                <div className="stat-label">Total Orders</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon delivered">
                <CheckCircle size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-number">
                  {orders.filter(o => o.orderStatus?.toUpperCase() === "DELIVERED").length}
                </div>
                <div className="stat-label">Delivered</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon shipped">
                <Truck size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-number">
                  {orders.filter(o => o.orderStatus?.toUpperCase() === "SHIPPED").length}
                </div>
                <div className="stat-label">Shipped</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon pending">
                <Clock size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-number">
                  {orders.filter(o => 
                    ["PLACED", "PROCESSING"].includes(o.orderStatus?.toUpperCase())
                  ).length}
                </div>
                <div className="stat-label">Pending</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="orders-tabs">
        <div className="container">
          <div className="tabs-container">
            {["all", "placed", "shipped", "delivered", "cancelled"].map((tab) => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container">
        {orders.length === 0 ? (
          <div className="no-orders">
            <div className="empty-icon">
              <Package size={80} />
            </div>
            <h2>No Orders Yet</h2>
            <p>You haven't placed any orders. Start shopping to see them here!</p>
            <button className="shop-btn" onClick={() => navigate("/")}>
              Start Shopping
              <ChevronRight size={18} />
            </button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="no-orders">
            <div className="empty-icon">
              <Package size={80} />
            </div>
            <h2>No {activeTab} Orders</h2>
            <p>You don't have any {activeTab} orders at the moment.</p>
            <button className="shop-btn" onClick={() => setActiveTab("all")}>
              View All Orders
              <ChevronRight size={18} />
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {filteredOrders.map((order) => (
              <div key={order.id || order.orderId} className="order-card">
                {/* Order Header */}
                <div className="order-card-header">
                  <div className="order-meta">
                    <div className="order-id">
                      <strong>Order #:</strong> {order.orderId || order.id}
                    </div>
                    <div className="order-date">
                      <Calendar size={16} />
                      {formatDate(order.orderDate)}
                    </div>
                  </div>
                  
                  <div className="order-status-badge" style={{ 
                    backgroundColor: `${getStatusColor(order.orderStatus)}15`,
                    color: getStatusColor(order.orderStatus),
                    borderColor: getStatusColor(order.orderStatus)
                  }}>
                    {getStatusIcon(order.orderStatus)}
                    <span>{getStatusText(order.orderStatus)}</span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="order-items">
                  {order.items?.map((item, index) => (
                    <div key={item.id || index} className="order-item">
                      <div className="order-item-media">
                        <img
                          src={
                            item.product?.image
                              ? `data:image/jpeg;base64,${item.product?.image}`
                              : item.imageUrl || "/placeholder-product.jpg"
                          }
                          alt={item.product?.name || "Product"}
                          className="order-item-image"
                          onError={(e) => {
                            e.target.src = "/placeholder-product.jpg";
                          }}
                        />
                        <div className="item-quantity">x{item.quantity || 1}</div>
                      </div>

                      <div className="order-item-details">
                        <h4 className="item-name">
                          {item.product?.name || item.name || "Unnamed Product"}
                        </h4>
                        <p className="item-description">
                          {item.product?.description || "Premium quality product"}
                        </p>
                        <div className="item-price-row">
                          <span className="item-price">
                            {formatPrice((item.price || 0) * (item.quantity || 1))}
                          </span>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <span className="item-original-price">
                              {formatPrice(item.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Info */}
                <div className="order-info-grid">
                  <div className="info-item">
                    <div className="info-icon">
                      <MapPin size={18} />
                    </div>
                    <div className="info-content">
                      <div className="info-label">Delivery Address</div>
                      <div className="info-value">
                        {order.address?.street || "Address not specified"}
                      </div>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <div className="info-icon">
                      <CreditCard size={18} />
                    </div>
                    <div className="info-content">
                      <div className="info-label">Payment Method</div>
                      <div className="info-value">
                        {order.payment || "Not specified"}
                      </div>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <div className="info-icon">
                      <Shield size={18} />
                    </div>
                    <div className="info-content">
                      <div className="info-label">Order Protection</div>
                      <div className="info-value">Covered by XOMO Guarantee</div>
                    </div>
                  </div>
                </div>

                {/* Order Footer */}
                <div className="order-footer">
                  <div className="order-total">
                    <div className="total-label">Total Amount</div>
                    <div className="total-amount">
                      <IndianRupee size={20} />
                      {formatPrice(order.totalAmount || 0)}
                    </div>
                  </div>
                  
                  <div className="order-actions">
                    <button 
                      className="btn secondary"
                      onClick={() => {
                        // Add tracking functionality
                        showAlert(`Tracking order ${order.orderId || order.id}`, "info");
                      }}
                    >
                      Track Order
                    </button>
                    
                    <button 
                      className="btn primary"
                      onClick={() => navigate(`/orders/${order.id || order.orderId}`)}
                    >
                      View Details
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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