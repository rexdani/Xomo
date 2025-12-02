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
  Plus
} from "lucide-react";
import "../styles/ProfilePage.css";
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
        
        email: editForm.email,
        phone: editForm.phone,
        address: editForm.address,name: editForm.name
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
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-error">
        <h2>Profile Not Found</h2>
        <button className="btn primary" onClick={() => navigate("/")}>
          Sign In Again
        </button>
      </div>
    );
  }

  // ---------------- UI ----------------
  return (
    <div className="profile-page">
      <header className="profile-header">
        <div className="container">
          <h1 className="page-title">My Account</h1>
          <p className="page-subtitle">Manage your profile and preferences</p>
        </div>
      </header>

      <div className="profile-content">
        <div className="container">
          <div className="profile-layout">

            {/* SIDEBAR */}
            <aside className="profile-sidebar">
              <div className="user-card">
                <div className="user-avatar">
                  <img src={user.avatar} alt={user.name} />
                </div>
                <div className="user-info">
                  <h3>{user.name}</h3>
                  <p>{user.email}</p>
                  <span className="member-since">
                    Member since {formatDate(user.joinDate)}
                  </span>
                </div>
              </div>

              <nav className="sidebar-nav">
                <button className={`nav-item ${activeTab === "profile" ? "active" : ""}`} onClick={() => setActiveTab("profile")}>
                  <User size={20} /> Profile Information
                </button>
                <button className={`nav-item ${activeTab === "orders" ? "active" : ""}`} onClick={() => setActiveTab("orders")}>
                  <ShoppingBag size={20} /> My Orders
                </button>
                <button className={`nav-item ${activeTab === "wishlist" ? "active" : ""}`} onClick={() => setActiveTab("wishlist")}>
                  <Heart size={20} /> Wishlist
                </button>
                <button className={`nav-item ${activeTab === "address" ? "active" : ""}`} onClick={() => setActiveTab("address")}>
                  <MapPin size={20} /> Address Book
                </button>
                <button className={`nav-item ${activeTab === "security" ? "active" : ""}`} onClick={() => setActiveTab("security")}>
                  <Shield size={20} /> Security
                </button>

                <div className="nav-divider"></div>

                <button className="nav-item logout" onClick={handleLogout}>
                  <LogOut size={20} /> Sign Out
                </button>
              </nav>
            </aside>

            {/* MAIN CONTENT */}
            <main className="profile-main">
              
              {/* PROFILE TAB */}
              {activeTab === "profile" && (
                <div className="tab-content">
                  <div className="tab-header">
                    <h2>Profile Information</h2>

                    {!isEditing ? (
                      <button className="btn primary" onClick={() => setIsEditing(true)}>
                        <Edit3 size={16} /> Edit Profile
                      </button>
                    ) : (
                      <div className="edit-actions">
                        <button className="btn secondary" onClick={handleCancelEdit}>
                          <X size={16} /> Cancel
                        </button>
                        <button className="btn primary" onClick={handleSaveProfile}>
                          <Save size={16} /> Save Changes
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="profile-form">
                    <div className="form-section">
                      <h3>Personal Information</h3>

                      <div className="form-grid">
                        <div className="form-group">
                          <label>Full Name</label>
                          {isEditing ? (
                            <input type="text" value={editForm.name} onChange={(e) => handleInputChange("name", e.target.value)} />
                          ) : (
                            <div className="readonly-field"><User size={18} />{user.name}</div>
                          )}
                        </div>

                        <div className="form-group">
                          <label>Email</label>
                          {isEditing ? (
                            <input type="email" value={editForm.email} onChange={(e) => handleInputChange("email", e.target.value)} />
                          ) : (
                            <div className="readonly-field"><Mail size={18} />{user.email}</div>
                          )}
                        </div>

                        <div className="form-group">
                          <label>Phone</label>
                          {isEditing ? (
                            <input type="tel" value={editForm.phone} onChange={(e) => handleInputChange("phone", e.target.value)} />
                          ) : (
                            <div className="readonly-field"><Phone size={18} />{user.phone}</div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* ADDRESS */}
                    <div className="form-section">
                      <h3>Address</h3>
                      {isEditing ? (
                        <>
                          <input type="text" placeholder="Street" value={editForm.address.street} onChange={(e) => handleAddressChange("street", e.target.value)} />
                          <input type="text" placeholder="City" value={editForm.address.city} onChange={(e) => handleAddressChange("city", e.target.value)} />
                          <input type="text" placeholder="State" value={editForm.address.state} onChange={(e) => handleAddressChange("state", e.target.value)} />
                          <input type="text" placeholder="Postal Code" value={editForm.address.postalCode} onChange={(e) => handleAddressChange("postalCode", e.target.value)} />
                          <input type="text" placeholder="Country" value={editForm.address.country} onChange={(e) => handleAddressChange("country", e.target.value)} />
                        </>
                      ) : (
                        <div className="readonly-field">
                          <MapPin size={18} />
                          {user.address.street ? (
                            `${user.address.street}, ${user.address.city}, ${user.address.state}`
                          ) : (
                            "No address added"
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* OTHER TABS */}
             {activeTab === "orders" && (() => { 
  navigate("/orders"); 
  return null; 
})()}
              {activeTab === "wishlist" && <div className="tab-content">Wishlist coming…</div>}
              {activeTab === "address" && (() => { 
  navigate("/address"); 
  return null; 
})()}
              {activeTab === "security" && <div className="tab-content">Security coming…</div>}

            </main>

          </div>
        </div>
      </div>
    </div>
  );
}