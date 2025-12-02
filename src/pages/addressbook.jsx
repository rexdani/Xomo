import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../util/config.js";
import "../styles/addressbook.css";
import { Edit, Trash2, Plus, MapPin, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AddressBook() {
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState({
    fullName: "",
    phoneNumber: "",
    street: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  });

  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const authHeader = {
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  };

  // Load addresses
  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/address`, authHeader);
      setAddresses(res.data || []);
    } catch (err) {
      console.error("Failed to load addresses", err);
    }
  };

  // Add form
  const openAddForm = () => {
    setForm({
      fullName: "",
      phoneNumber: "",
      street: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    });
    setEditMode(false);
    setShowForm(true);
  };

  // Edit form
  const openEditForm = (address) => {
    setForm(address);
    setEditMode(true);
    setShowForm(true);
  };

  // Save (Add / Edit)
  const saveAddress = async () => {
    try {
      if (editMode) {
        await axios.put(`${BASE_URL}/address/${form.id}`, form, authHeader);
      } else {
        await axios.post(`${BASE_URL}/address`, form, authHeader);
      }
      setShowForm(false);
      loadAddresses();
    } catch (err) {
      console.error("Failed to save address", err);
      alert("Error saving address");
    }
  };

  // Delete
  const deleteAddress = async (id) => {
    if (!window.confirm("Delete this address?")) return;

    try {
      await axios.delete(`${BASE_URL}/address/${id}`, authHeader);
      loadAddresses();
    } catch (err) {
      console.error("Failed to delete address", err);
    }
  };

  return (
    <>
      <header className="products-header">
        <div className="container">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
            Back
          </button>
        </div>
      </header>

      <div className="address-page">
        <div className="address-header">
          <h2>Address Book</h2>
          <button className="add-btn" onClick={openAddForm}>
            <Plus size={18} /> Add New Address
          </button>
        </div>

        {/* Address List */}
        <div className="address-list">
          {addresses.length === 0 ? (
            <p>No address added yet.</p>
          ) : (
            addresses.map((addr) => (
              <div className="address-card" key={addr.id}>
                <div className="address-info">
                  <MapPin size={22} className="address-icon" />
                  <div>
                    <h3>{addr.fullName}</h3>
                    <p>{addr.street}</p>
                    <p>
                      {addr.city}, {addr.state} - {addr.postalCode}
                    </p>
                    <p>{addr.country}</p>
                    <p>📞 {addr.phoneNumber}</p>
                  </div>
                </div>

                <div className="address-actions">
                  <button className="edit-btn" onClick={() => openEditForm(addr)}>
                    <Edit size={18} />
                  </button>
                  <button className="delete-btn" onClick={() => deleteAddress(addr.id)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Form */}
        {showForm && (
          <div className="address-modal">
            <div className="modal-content">
              <h3>{editMode ? "Edit Address" : "Add New Address"}</h3>

              <input
                type="text"
                placeholder="Full Name"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              />

              <input
                type="text"
                placeholder="Phone Number"
                value={form.phoneNumber}
                onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
              />

              <input
                type="text"
                placeholder="Street Address"
                value={form.street}
                onChange={(e) => setForm({ ...form, street: e.target.value })}
              />

              <input
                type="text"
                placeholder="City"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />

              <input
                type="text"
                placeholder="State"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
              />

              <input
                type="text"
                placeholder="Country"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
              />

              <input
                type="text"
                placeholder="Postal Code"
                value={form.postalCode}
                onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
              />

              <div className="modal-actions">
                <button className="save-btn" onClick={saveAddress}>Save</button>
                <button className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
