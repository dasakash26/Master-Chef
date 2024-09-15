import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";

const app = express();
dotenv.config();
const port = process.env.PORT;

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use(authRoutes);
app.use(recipeRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
