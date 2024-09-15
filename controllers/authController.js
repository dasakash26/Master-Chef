import bcrypt from "bcrypt";
import pg from "pg";
const connectionString = 'postgres://postgres:mysceretpassword@localhost:5432/postgres';

const db = new pg.Client({
  connectionString: connectionString,
});

db.connect((err) => {
  if (err) {
    console.error('Failed to connect to the database:', err.message);
  } else {
    console.log('Successfully connected to the database');
  }
});

// Render login page
const renderLogin = (req, res) => {
  res.render("login");
};

// Handle login logic
const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await db.query("SELECT * FROM users WHERE username = $1", [
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

  console.log("Route reached");
  
  try {
    // Check if all required fields are provided
    if (!name || !username || !password || !confirmPassword) {
      return res.render("register", { err: "All fields are required!" });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.render("register", { err: "Passwords didn't match!" });
    }

    console.log("2");
    console.log("username: ", username);

    // Use parameterized queries to prevent SQL injection
    const result = await db.query(`SELECT * FROM users WHERE username = $1`, [username]);
    const existingUser = result.rows[0];
    
    if (existingUser) {
      return res.render("register", { err: "Username already taken!" });
    }

    console.log("3");
    
    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert the new user using parameterized query
    await db.query(`INSERT INTO users (name, username, password) VALUES ($1, $2, $3)`, [name, username, hashedPassword]);

    console.log("4");
    
    // Redirect to login page after successful registration
    res.redirect("/login");

  } catch (error) {
    console.error("Database query error:", error);
    res.render("register", { err: "An error occurred during registration. Please try again." });
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
