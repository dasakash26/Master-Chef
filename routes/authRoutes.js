import express from "express";
import db from "../db.js";

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
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        username VARCHAR(50) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log("testing1");
    await db.query(createTableQuery);
    console.log("testing2");
    res.json({ done });
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
