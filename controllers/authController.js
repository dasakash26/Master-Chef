import bcrypt from "bcrypt";
import db from "../db.js";

// Render login page
const renderLogin = (req, res) => {
  res.render("login");
};

// Handle login logic
const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    const user = result.rows[0];
    if (user && (await bcrypt.compare(password, user.password))) {
      req.session.user = username;
      res.redirect("/");
    } else {
      res.send("Invalid username or password");
    }
  } catch (error) {
    console.error("Database query error:", error);
    res.send("An error occurred during login");
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
    console.log(`New user registered: ${name} [${username}]`);
    if (password != confirmPassword)
      res.render("register", { err: "Passwords didn't match!!" });
    //check if username exists in db
    const result = await db.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    console.log(result);
    const existingUser = result.rows[0];
    console.log(existingUser);
    if (existingUser) {
      res.render("register", { err: "Username already taken!!" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO users (name, username, password) VALUES ($1, $2, $3)",
      [name, username, hashedPassword]
    );
    console.log(name, username, hashedPassword);
    res.redirect("/login");
  } catch (error) {
    console.error("Database query error:", error);
    res.send("An error occurred during registration");
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
