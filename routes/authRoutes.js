import express from "express";
import pool from "../db.js";

import {
  renderLogin,
  loginUser,
  renderRegister,
  registerUser,
  isAuthenticated,
} from "../controllers/authController.js";

const router = express.Router();

db.connect((err) => {
  if (err) {
    console.error("Failed to connect to the database:", err.message);
  } else {
    console.log("Successfully connected to the database");
  }
});
router.get("/data", async (req, res) => {
  try {
    const createTableQuery = `
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        username VARCHAR(50) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    console.log("Starting table creation");

    await pool.query(createTableQuery); 

    console.log("Table creation completed");

    res.json({ message: "Table created successfully" }); // Corrected the response
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
