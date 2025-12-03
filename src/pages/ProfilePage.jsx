import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit3,
  Save,
  X,
  ShoppingBag,
  Heart,
  LogOut,
  Shield,
  Plus,
  ArrowLeft
} from "lucide-react";
import Header from "../components/Header";
import "../styles/ProfilePage.css";
import "../styles/shared.css";
import { BASE_URL } from "../util/config.js";



export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    loadUserProfile();
  }, []);
  useEffect(() => {
  if (activeTab === "orders") {
    navigate("/orders");
  }
  if (activeTab === "address") {
    navigate("/address");
  }
}, [activeTab, navigate]);


  // ---------------- LOAD PROFILE ----------------
  const loadUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        navigate("/");
        return;
      }

      const authHeader = { headers: { Authorization: `Bearer ${token}` } };

      const userRes = await axios.get(
        `${BASE_URL}/user/profile`,
        authHeader
      );

      const u = userRes.data;

      const formattedUser = {
        id: u.id,
        name: u.name || "",
        email: u.email || "",
        phone: u.phone || "",
        address: u.address || {
          street: "",
          city: "",
          state: "",
          country: "",
          postalCode: ""
        },
        joinDate: u.createdAt || new Date().toISOString(),
        avatar: u.avatar || "/placeholder-avatar.jpg"
      };

      setUser(formattedUser);
      setEditForm(formattedUser);

      // Orders
      try {
        const ordersRes = await axios.get(
          `${BASE_URL}/users/${u.id}/orders`,
          authHeader
        );
        setOrders(Array.isArray(ordersRes.data) ? ordersRes.data.slice(0, 5) : []);
      } catch {
        setOrders([]);
      }

      // Wishlist
      try {
        const wishlistRes = await axios.get(
          `${BASE_URL}/users/${u.id}/wishlist`,
          authHeader
        );
        setWishlist(Array.isArray(wishlistRes.data) ? wishlistRes.data : []);
      } catch {
        setWishlist([]);
      }

    } catch (error) {
      console.error("Error loading profile:", error);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- UPDATE PROFILE ----------------
  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      // FIX: send only valid fields
      const updatePayload = {
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
        address: editForm.address
      };

      await axios.put(
        `${BASE_URL}/user/profile`,
        updatePayload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser(editForm);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  const handleCancelEdit = () => {
    setEditForm(user);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddressChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  // ---------------- LOADING ----------------
  if (loading) {
    return (
      <div className="shared-loading">
        <div className="shared-spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="shared-error">
        <div className="shared-error-content">
          <h2 className="shared-error-title">Profile Not Found</h2>
          <p className="shared-error-message">Unable to load your profile. Please sign in again.</p>
          <button className="shared-btn shared-btn-primary" onClick={() => navigate("/")}>
            Sign In Again
          </button>
        </div>
      </div>
    );
  }

  // ---------------- UI ----------------
  return (
    <>
      <Header />
      <div className="profile-page-pro">
        <div className="profile-header-pro">
          <div className="shared-container">
            <button className="back-btn-pro" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} />
              <span>Back</span>
            </button>
          </div>
      
          <div className="shared-container">
            <h1 className="page-title-pro">My Account</h1>
            <p className="page-subtitle-pro">Manage your profile and preferences</p>
          </div>
        </div>

      <div className="profile-content-pro">
        <div className="shared-container">
          <div className="profile-layout-pro">

            {/* Professional Sidebar */}
            <aside className="profile-sidebar-pro">
              <div className="user-card-pro">
                <div className="user-avatar-pro">
                  <img src={user.avatar} alt={user.name} />
                  <div className="avatar-ring-pro"></div>
                </div>
                <div className="user-info-pro">
                  <h3 className="user-name-pro">{user.name}</h3>
                  <p className="user-email-pro">{user.email}</p>
                  <span className="member-since-pro">
                    Member since {formatDate(user.joinDate)}
                  </span>
                </div>
              </div>

              <nav className="sidebar-nav-pro">
                <button 
                  className={`nav-item-pro ${activeTab === "profile" ? "active" : ""}`} 
                  onClick={() => setActiveTab("profile")}
                >
                  <User size={20} />
                  <span>Profile Information</span>
                </button>
                <button 
                  className={`nav-item-pro ${activeTab === "orders" ? "active" : ""}`} 
                  onClick={() => setActiveTab("orders")}
                >
                  <ShoppingBag size={20} />
                  <span>My Orders</span>
                </button>
                <button 
                  className={`nav-item-pro ${activeTab === "wishlist" ? "active" : ""}`} 
                  onClick={() => setActiveTab("wishlist")}
                >
                  <Heart size={20} />
                  <span>Wishlist</span>
                </button>
                <button 
                  className={`nav-item-pro ${activeTab === "address" ? "active" : ""}`} 
                  onClick={() => setActiveTab("address")}
                >
                  <MapPin size={20} />
                  <span>Address Book</span>
                </button>
                <button 
                  className={`nav-item-pro ${activeTab === "security" ? "active" : ""}`} 
                  onClick={() => setActiveTab("security")}
                >
                  <Shield size={20} />
                  <span>Security</span>
                </button>

                <div className="nav-divider-pro"></div>

                <button className="nav-item-pro logout-pro" onClick={handleLogout}>
                  <LogOut size={20} />
                  <span>Sign Out</span>
                </button>
              </nav>
            </aside>

            {/* Professional Main Content */}
            <main className="profile-main-pro">
              
              {/* PROFILE TAB */}
              {activeTab === "profile" && (
                <div className="tab-content-pro">
                  <div className="tab-header-pro">
                    <h2 className="tab-title-pro">Profile Information</h2>

                    {!isEditing ? (
                      <button className="shared-btn shared-btn-primary" onClick={() => setIsEditing(true)}>
                        <Edit3 size={18} />
                        <span>Edit Profile</span>
                      </button>
                    ) : (
                      <div className="edit-actions-pro">
                        <button className="shared-btn shared-btn-secondary" onClick={handleCancelEdit}>
                          <X size={18} />
                          <span>Cancel</span>
                        </button>
                        <button className="shared-btn shared-btn-primary" onClick={handleSaveProfile}>
                          <Save size={18} />
                          <span>Save Changes</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="profile-form-pro">
                    <div className="form-section-pro">
                      <h3 className="section-title-pro">Personal Information</h3>

                      <div className="form-grid-pro">
                        <div className="form-group-pro">
                          <label className="form-label-pro">Full Name</label>
                          {isEditing ? (
                            <input 
                              type="text" 
                              className="form-input-pro"
                              value={editForm.name} 
                              onChange={(e) => handleInputChange("name", e.target.value)} 
                            />
                          ) : (
                            <div className="readonly-field-pro">
                              <User size={18} />
                              <span>{user.name}</span>
                            </div>
                          )}
                        </div>

                        <div className="form-group-pro">
                          <label className="form-label-pro">Email</label>
                          {isEditing ? (
                            <input 
                              type="email" 
                              className="form-input-pro"
                              value={editForm.email} 
                              onChange={(e) => handleInputChange("email", e.target.value)} 
                            />
                          ) : (
                            <div className="readonly-field-pro">
                              <Mail size={18} />
                              <span>{user.email}</span>
                            </div>
                          )}
                        </div>

                        <div className="form-group-pro">
                          <label className="form-label-pro">Phone</label>
                          {isEditing ? (
                            <input 
                              type="tel" 
                              className="form-input-pro"
                              value={editForm.phone} 
                              onChange={(e) => handleInputChange("phone", e.target.value)} 
                            />
                          ) : (
                            <div className="readonly-field-pro">
                              <Phone size={18} />
                              <span>{user.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* ADDRESS */}
                    <div className="form-section-pro">
                      <h3 className="section-title-pro">Address</h3>
                      {isEditing ? (
                        <div className="address-form-pro">
                          <input 
                            type="text" 
                            className="form-input-pro"
                            placeholder="Street" 
                            value={editForm.address.street} 
                            onChange={(e) => handleAddressChange("street", e.target.value)} 
                          />
                          <div className="form-row-pro">
                            <input 
                              type="text" 
                              className="form-input-pro"
                              placeholder="City" 
                              value={editForm.address.city} 
                              onChange={(e) => handleAddressChange("city", e.target.value)} 
                            />
                            <input 
                              type="text" 
                              className="form-input-pro"
                              placeholder="State" 
                              value={editForm.address.state} 
                              onChange={(e) => handleAddressChange("state", e.target.value)} 
                            />
                          </div>
                          <div className="form-row-pro">
                            <input 
                              type="text" 
                              className="form-input-pro"
                              placeholder="Postal Code" 
                              value={editForm.address.postalCode} 
                              onChange={(e) => handleAddressChange("postalCode", e.target.value)} 
                            />
                            <input 
                              type="text" 
                              className="form-input-pro"
                              placeholder="Country" 
                              value={editForm.address.country} 
                              onChange={(e) => handleAddressChange("country", e.target.value)} 
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="readonly-field-pro">
                          <MapPin size={18} />
                          <span>
                            {user.address.street ? (
                              `${user.address.street}, ${user.address.city}, ${user.address.state}`
                            ) : (
                              "No address added"
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* OTHER TABS */}
              {activeTab === "wishlist" && (
                <div className="tab-content-pro">
                  <div className="shared-empty">
                    <Heart size={80} className="shared-empty-icon" />
                    <h3 className="shared-empty-title">Your Wishlist is Empty</h3>
                    <p className="shared-empty-message">Start adding items you love to your wishlist</p>
                    <button className="shared-btn shared-btn-primary" onClick={() => navigate('/')}>
                      Start Shopping
                    </button>
                  </div>
                </div>
              )}
              
              {activeTab === "security" && (
                <div className="tab-content-pro">
                  <div className="shared-empty">
                    <Shield size={80} className="shared-empty-icon" />
                    <h3 className="shared-empty-title">Security Settings</h3>
                    <p className="shared-empty-message">Security features coming soon</p>
                  </div>
                </div>
              )}

            </main>

          </div>
        </div>
      </div>
      </div>
    </>
  );
}