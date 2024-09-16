import bcrypt from "bcrypt";
import db from "../db.js";

//db connection
db.connect((err) => {
  if (err) {
    console.error("Failed to connect to the database:", err.message);
  } else {
    console.log("Successfully connected to the database");
  }
});

// Render login page
const renderLogin = (req, res) => {
  res.render("login");
};

// Handle login logic
const loginUser = async (req, res) => {
  const { username, password } = req.body;
  console.log(`>> ${username} tried to log in.`);

  try {
    const result = await db.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    const user = result.rows[0];
    if (user && (await bcrypt.compare(password, user.password))) {
      req.session.user = {
        id: user.id,
        name: user.name,
        username: user.username,
      };
      res.redirect("/");
      console.log(`>> ${username} logged in successfully`);
    } else {
      console.log(`>> user ${username} login failed!!`);
      res.render("login", { err: "invalid username or password !!" });
    }
  } catch (error) {
    console.error("Database query error:", error.message);
    res.render("login", { err: "An error occurred during login !!" });
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
    console.log(`>> login attempt : ${name} mail: ${username}`);

    //check if user exists
    const result = await db.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    const existingUser = result.rows[0];

    if (existingUser) {
      return res.render("register", { err: "Username already taken!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    //store user detail into db
    await db.query(
      "INSERT INTO users (name, username, password) VALUES ($1, $2, $3)",
      [name, username, hashedPassword]
    );
    res.redirect("/login");
    console.log(`>> user: ${name} registered successfully`);
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

db.end();

export {
  renderLogin,
  loginUser,
  renderRegister,
  registerUser,
  isAuthenticated,
};
