import express from "express";
import pg from "pg";
// import pem from '../public/'

const connectionString = '';

const db = new pg.Client({
  connectionString: connectionString,
});

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

import {
  renderLogin,
  loginUser,
  renderRegister,
  registerUser,
  isAuthenticated,
} from "../controllers/authController.js";

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
