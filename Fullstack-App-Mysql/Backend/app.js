require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

const db = pool.promise();

// ---------------- GET ALL FRUITS ----------------
app.get("/fruits", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM fruits ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error("GET ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- GET BY ID ----------------
app.get("/fruits/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query("SELECT * FROM fruits WHERE id=?", [id]);
    if (!rows[0]) return res.status(404).json({ message: "Not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- CREATE FRUIT ----------------
app.post("/fruits", async (req, res) => {
  try {
    let { name, photo, price } = req.body;

    if (!name || price === "" || isNaN(Number(price))) {
      return res.status(400).json({ message: "Valid name and price required" });
    }

    price = Number(price);

    const [result] = await db.query(
      "INSERT INTO fruits (name, photo, price) VALUES (?, ?, ?)",
      [name, photo || null, price]
    );

    res.status(201).json({
      message: "Fruit added successfully",
      id: result.insertId,
    });
  } catch (err) {
    console.error("CREATE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- UPDATE FRUIT ----------------
app.put("/fruits/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let { name, photo, price } = req.body;

    if (!name || price === "" || isNaN(Number(price))) {
      return res.status(400).json({ message: "Valid name and price required" });
    }

    price = Number(price);

    await db.query(
      "UPDATE fruits SET name=?, photo=?, price=? WHERE id=?",
      [name, photo || null, price, id]
    );

    res.json({ message: "Fruit updated successfully" });
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- DELETE FRUIT ----------------
app.delete("/fruits/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM fruits WHERE id=?", [id]);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- START SERVER ----------------
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
