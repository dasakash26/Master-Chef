import express from "express";
import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const connectionString = process.env.DB_STR;

const db = new pg.Client({
  connectionString: connectionString,
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Failed to connect to the database:", err.message);
  } else {
    console.log("Successfully connected to the database");
  }
});

import {
  renderLogin,
  loginUser,
  renderRegister,
  registerUser,
  isAuthenticated,
} from "../controllers/authController.js";

const router = express.Router();

router.get("/data", async (req, res) => {
  console.log(connectionString);
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        username VARCHAR(50) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log("Starting table creation");
    await db.query(createTableQuery); // Ensure the query is executed after connection
    console.log("Table creation successful");
    res.json({ message: "Table created successfully" });
  } catch (error) {
    console.error("Error creating table:", error.message);
    res.status(500).send("Error creating table");
  }
});

router.get("/login", renderLogin);
router.post("/login", loginUser);
router.get("/register", renderRegister);
router.post("/register", registerUser);

export default router;
