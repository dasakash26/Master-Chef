import express from "express";
import {
  renderDashboard,
  searchRecipes,
  recipeDetails,
} from "../controllers/recipeController.js";
import { isAuthenticated } from "../controllers/authController.js";

const router = express.Router();

router.get("/", renderDashboard);
router.get("/search-results", isAuthenticated, searchRecipes);
router.get("/recipe-details", isAuthenticated, recipeDetails);

export default router;
