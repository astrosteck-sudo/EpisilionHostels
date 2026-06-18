const pool = require("../config/db.js"); // ✅ import pool
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

/**
 * SIGNUP
 */
exports.signup = async (req, res) => {
  const { name, email } = req.body;
  const retrievedPassword = req.body.password || "";
  const password = retrievedPassword.trim();

  try {
    // 1️⃣ Check if user already exists
    const [existing] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (existing.length > 0) {
      return res.status(400).send("User already exists");
    }

    // 2️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Insert user and capture result
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword],
    );

    // 4️⃣ Get the auto-generated user_id
    const userId = result.insertId;

    // 5️⃣ Create AI usage row linked to that user
    await pool.query(
      `
      INSERT INTO ai_usage (
          user_id,
          requests_used,
          requests_limit
        )
        VALUES (?, 0, 3)
      `,
      [userId],
    );

    res.send("Signup successful ✅");
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).send("Server error");
  }
};

/**
 * LOGIN
 */
exports.login = async (req, res) => {
  const email = req.body.email;
  const retrievedPassword = req.body.password || "";
  const password = retrievedPassword.trim();

  try {
    // 1️⃣ Find user by email
    const [result] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (result.length === 0) {
      return res.status(400).send("User not found");
    }

    const user = result[0];

    // 2️⃣ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Wrong password");
    }

    // 3️⃣ Generate JWT
    const token = jwt.sign(
      {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    // 4️⃣ Respond with token + user info
    res.json({
      token,
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        createdAt: user.created_at,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Server error");
  }
};

exports.googleCallback = async (req, res) => {
  try {
    const profile = req.user;
    const email = profile.emails[0].value;

    // console.log(profile);
    // console.log("email", email);

    // 🔍 Check if user exists in DB
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    let user;

    if (rows.length === 0) {
      // 🆕 Create new user if not exists
      const newUser = {
        email,
        name: profile.displayName,
        password: crypto.randomBytes(16).toString("hex"), // placeholder
        auth_provider: "google",
      };

      const [result] = await pool.query("INSERT INTO users SET ?", newUser);
      user = { user_id: result.insertId, ...newUser, created_at: new Date() };
    } else {
      user = rows[0];
    }

    // 🔑 Generate JWT using DB user
    const token = jwt.sign(
      {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    // ✅ Send JSON response (API style)
    const userData = encodeURIComponent(
      JSON.stringify({
        id: user.user_id,
        name: user.name, // or user.username if you have it
        email: user.email,
        created_at: user.created_at,
      })
    );

    // ❌ Don’t do both JSON and redirect — pick one.
    // If you want OAuth redirect flow, replace res.json with:
    res.redirect(
      `${process.env.CLIENT_URL}/oauthsuccess?token=${token}&user=${userData}`,
    );
  } catch (err) {
    console.error(err);
    res.redirect(`${process.env.CLIENT_URL}/oautherror`);
  }
};
