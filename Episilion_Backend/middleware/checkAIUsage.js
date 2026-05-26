const pool = require("../config/db.js"); // ✅ import pool

// Middleware to check a user's AI usage quota
const checkAIUsage = async (req, res, next) => {
  try {
    // Get the authenticated user's ID from request object
    const userId = req.user.user_id;

    // ✅ Fetch AI usage record for this user
    const [usage] = await pool.query(
      `SELECT * FROM ai_usage WHERE user_id = ?`,
      [userId]
    );

    // If no usage record exists, return 404
    if (usage.length === 0) {
      return res.status(404).json({
        error: "AI usage record not found",
      });
    }

    // Extract the usage row
    const userUsage = usage[0];

    // Check if user has reached their request limit
    if (userUsage.requests_used >= userUsage.requests_limit) {
      return res.status(403).json({
        error: "limit_reached",
        message: "Upgrade to continue using AI search",
      });
    }

    // Attach usage info to request for downstream handlers
    req.aiUsage = userUsage;

    // Allow request to continue
    next();
  } catch (err) {
    console.error("AI usage check error:", err);
    res.status(500).json({
      error: "AI usage check failed",
    });
  }
};

module.exports = checkAIUsage;
