import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import session from "express-session";

const app = express();
dotenv.config();
const port = process.env.SERVER_PORT||4000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);
app.use(express.urlencoded({ extended: true }));

app.use(authRoutes);
app.use(recipeRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


// Gracefully handle shutdown
process.on("SIGINT", () => {
  db.end().then(() => {
    console.log("Database connection closed.");
    process.exit(0);
  });
});


// Gracefully handle shutdown
process.on("SIGINT", () => {
  db.end().then(() => {
    console.log("Database connection closed.");
    process.exit(0);
  });
});

// Gracefully handle shutdown
process.on("SIGINT", () => {
  db.end().then(() => {
    console.log("Database connection closed.");
    process.exit(0);
  });
});

