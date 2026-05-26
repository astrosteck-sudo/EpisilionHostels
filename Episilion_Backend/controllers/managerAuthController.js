const pool = require("../config/db.js"); // ✅ import pool
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Controller: Login hostel manager
exports.loginManager = async (req, res) => {
  try {
    const username = req.body.managerHostelName;
    const password = req.body.managerPassword;

    // 1️⃣ Validate input
    if (!username || !password) {
      return res.status(400).json({
        error: "Username and password are required",
      });
    }

    // 2️⃣ Query database for manager by username
    const sql = `
      SELECT *
      FROM hostel_managers
      WHERE username = ?
      LIMIT 1
    `;
    const [results] = await pool.query(sql, [username]);

    // 3️⃣ If no manager found, reject login
    if (results.length === 0) {
      return res.status(401).json({
        error: "Invalid username or password",
      });
    }

    const manager = results[0];

    // 4️⃣ Compare provided password with stored hash
    const isMatch = await bcrypt.compare(password, manager.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        error: "Invalid username or password",
      });
    }

    // 5️⃣ Create JWT token with manager ID and hostel ID
    const token = jwt.sign(
      {
        managerId: manager.id,
        hostelId: manager.manager_hostel_id, // ⚠️ ensure this matches your DB column name
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 6️⃣ Send success response with token and manager info
    return res.status(200).json({
      message: "Login successful ✅",
      token,
      manager: {
        id: manager.id,
        hostel_id: manager.manager_hostel_id,
        username: manager.username,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      error: "Server error",
    });
  }
};
