const db = require("../config/db.js");

// Helper function to run SQL queries with promises
const query = (sql, values = []) =>
  new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) => {
      if (err) reject(err);   // Reject if query fails
      else resolve(result);   // Resolve with query result
    });
  });

// Middleware to check a user's AI usage quota
const checkAIUsage = async (req, res, next) => {
  try {
    // Get the authenticated user's ID from request object
    const userId = req.user.user_id;
    //console.log(userId)

    // Fetch AI usage record for this user
    const usage = await query(
      `
      SELECT *
      FROM ai_usage
      WHERE user_id = ?
      `,
      [userId]
    );

    // console.log(usage)

    // If no usage record exists, return 404
    if (!usage.length) {
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
    // Log error and return 500 if something goes wrong
    console.log(err);

    res.status(500).json({
      error: "AI usage check failed",
    });
  }
};

// Export middleware for use in routes
module.exports = checkAIUsage;
