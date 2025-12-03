import React, { useState, useEffect } from "react";

export default function FruitForm({ initial, onClose, onSave }) {
  const [name, setName] = useState(initial?.name || "");
  const [photo, setPhoto] = useState(initial?.photo || "");
  const [price, setPrice] = useState(initial?.price ?? "");
  const [error, setError] = useState("");

  useEffect(() => {
    setName(initial?.name || "");
    setPhoto(initial?.photo || "");
    setPrice(initial?.price ?? "");
  }, [initial]);

  async function submit(e) {
    e.preventDefault();

    if (!name) return setError("Name is required");
    if (price === "" || isNaN(Number(price)))
      return setError("Valid price required");

    try {
      await onSave({
        id: initial?.id,
        name,
        photo,
        price: Number(price),
      });

      onClose();
    } catch (err) {
      setError("Failed to save fruit");
    }
  }

  return (
    <div className="modal">
      <form className="modal-content" onSubmit={submit}>
        <h2>{initial ? "Edit Fruit" : "Add Fruit"}</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <label>Name:</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />

        <label>Photo URL:</label>
        <input value={photo} onChange={(e) => setPhoto(e.target.value)} />

        <label>Price:</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <button type="submit" className="btn primary">Save</button>
        <button type="button" className="btn" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
}
