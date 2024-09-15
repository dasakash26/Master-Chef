import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import session  from "express-session";

const app = express();
dotenv.config();
const port = process.env.SERVER_PORT;

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }  
}));
app.use(express.urlencoded({ extended: true }));

app.use(authRoutes);
app.use(recipeRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
