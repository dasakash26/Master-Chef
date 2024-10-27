import bcrypt from "bcrypt";
import db from "../utils/db.js";
import { v4 as randomUUID } from "uuid";

// Render login page
const renderLogin = (req, res) => {
  res.render("login");
};

// Handle login logic
const loginUser = async (req, res) => {
  const { username, password } = req.body;
  console.log(`>> ${username} tried to log in.`);

  try {
    const result = await db.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    const user = result.rows[0];

    if (user && (await bcrypt.compare(password, user.password))) {
      req.session.user = {
        id: user.id,
        name: user.name,
        username: user.username,
      };
      console.log(`>> ${username} logged in successfully`);
      return res.redirect("/");
    } else {
      console.log(`>> Login failed for user: ${username}`);
      return res.render("login", { err: "Invalid username or password!" });
    }
  } catch (error) {
    console.error("Database query error:", error.message);
    return res.render("login", { err: "An error occurred during login!" });
  }
};

// Render registration page
const renderRegister = (req, res) => {
  res.render("register");
};

// Handle registration logic
const registerUser = async (req, res) => {
  const { name, username, password, confirmPassword } = req.body;

  try {
    if (password !== confirmPassword) {
      return res.render("register", { err: "Passwords didn't match!" });
    }

    console.log(`>> Registration attempt for name: ${name}, username: ${username}`);

    // Check if user exists
    const result = await db.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    const existingUser = result.rows[0];

    if (existingUser) {
      return res.render("register", { err: "Username already taken!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // Store user details in the database
    await db.query(
      "INSERT INTO users (id, name, username, password) VALUES ($1, $2, $3, $4)",
      [randomUUID(), name, username, hashedPassword]
    );
    console.log(`>> User registered successfully: ${name}`);
    return res.redirect("/login");
  } catch (error) {
    console.error("Database query error:", error.message);
    return res.render("register", {
      err: "An error occurred during registration",
    });
  }
};

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.redirect("/login");
};

export {
  renderLogin,
  loginUser,
  renderRegister,
  registerUser,
  isAuthenticated,
};
