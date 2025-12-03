import React, { useEffect, useState } from "react";
import api from "../services/api";
import FruitForm from "./FruitForm";

export default function FruitList() {
  const [fruits, setFruits] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const res = await api.get("/fruits");
      setFruits(res.data);
    } catch {
      alert("Failed to load fruits");
    }
  }

  async function saveFruit(data) {
    if (data.id) {
      await api.put(`/fruits/${data.id}`, data);
    } else {
      await api.post("/fruits", data);
    }
    setShowForm(false);
    setEditing(null);
    loadData();
  }

  async function deleteFruit(id) {
    if (!window.confirm("Delete fruit?")) return;
    await api.delete(`/fruits/${id}`);
    loadData();
  }

  const filtered = fruits.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* ✅ TOP BAR */}
      <div className="top-bar">
        <button
          className="btn primary"
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
        >
          + Add Fruit
        </button>

        <input
          type="text"
          placeholder="Search fruits..."
          className="search-box"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ✅ CARD GRID VIEW */}
      <div className="card-grid">
        {filtered.map((f) => (
          <div className="fruit-card" key={f.id}>
            <img
              src={f.photo}
              alt={f.name}
              className="fruit-img"
            />

            <h3>{f.name}</h3>
            <p className="price">₹ {Number(f.price).toFixed(2)}</p>
            <p className="id">ID: {f.id}</p>

            <div className="card-actions">
              <button
                className="btn edit"
                onClick={() => {
                  setEditing(f);
                  setShowForm(true);
                }}
              >
                Edit
              </button>

              <button
                className="btn danger"
                onClick={() => deleteFruit(f.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ FORM MODAL */}
      {showForm && (
        <FruitForm
          initial={editing}
          onSave={saveFruit}
          onClose={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      )}
    </>
  );
}
