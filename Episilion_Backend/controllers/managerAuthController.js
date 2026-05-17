const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Controller: Login hostel manager
exports.loginManager = async (req, res) => {
  try {
    // const { username, password } = req.body;
    const username = req.body.managerHostelName;
    const password = req.body.managerPassword;

    // 1. Validate input
    if (!username || !password) {
      return res.status(400).json({
        error: "Username and password are required",
      });
    }

    // 2. Query database for manager by username
    const query = `
      SELECT *
      FROM hostel_managers
      WHERE username = ?
      LIMIT 1
    `;

    db.query(query, [username], async (err, results) => {
      if (err) {
        console.error(err);
        // Database error handling
        return res.status(500).json({
          error: "Database error",
        });
      }

      // 3. If no manager found, reject login
      if (results.length === 0) {
        return res.status(401).json({
          error: "Invalid username or password",
        });
      }

      const manager = results[0];

      // 4. Compare provided password with stored hash
      const isMatch = await bcrypt.compare(password, manager.password_hash);

      if (!isMatch) {
        // Wrong password
        return res.status(401).json({
          error: "Invalid username or password",
        });
      }

      // 5. Create JWT token with manager ID and hostel ID
      const token = jwt.sign(
        {
          managerId: manager.id,
          hostelId: manager.manager_hostel_id, // ⚠️ ensure this matches your DB column name
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d", // token valid for 7 days
        },
      );

      // 6. Send success response with token and manager info
      return res.status(200).json({
        message: "Login successful",
        token,
        manager: {
          id: manager.id,
          hostel_id: manager.manager_hostel_id, // ⚠️ same note as above
          username: manager.username,
        },
      });
    });
  } catch (error) {
    console.error(error);
    // Catch any unexpected server errors
    return res.status(500).json({
      error: "Server error",
    });
  }
};
