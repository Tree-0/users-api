const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const dotenv = require("dotenv");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

app.get("/", (req, res) => {
  res.json({ message: "Welcome to your Express server" });
});

// endpoint to get all users
app.get("/api/users", async (req, res) => {
  try {
    const query = "SELECT * FROM users";
    const result = await pool.query(query);
    res.json(result.rows);
  } 
  catch (error) {
    console.error("Query error", error);
    res.status(500).send("Failed to fetch users");
  }
});

// endpoint to get a user by id
app.get("/api/users/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE id=$1",
      [req.params.id]
    );
    if (result.rowCount === 0)
    {
      return res.status(404).send("User not found");
    }
    res.json(result.rows);
  } 
  catch (error) {
    console.error("Query error", error);
    res.status(500).send("Failed to retrieve user");
  }
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
