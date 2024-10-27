import express from "express";

import {
  renderLogin,
  loginUser,
  renderRegister,
  registerUser,
} from "../controllers/authController.js";

const router = express.Router();

router.get("/login", renderLogin);
router.post("/login", loginUser);
router.get("/register", renderRegister);
router.post("/register", registerUser);

export default router;
