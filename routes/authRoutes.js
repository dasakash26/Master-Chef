import express from "express";
import db from "../db.js";

import {
  renderLogin,
  loginUser,
  renderRegister,
  registerUser,
  isAuthenticated,
} from "../controllers/authController.js";

async function connectToDB() {
  try {
    await db.connect();
    console.log("Successfully connected to the database");
  } catch (err) {
    console.error("Failed to connect to the database:", err.message);
    process.exit(1);
  }
}
await connectToDB();

const router = express.Router();

router.get("/data", async (req, res) => {
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

    await db.query(createTableQuery);

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
