const db = require("../config/db.js");

// Helper function to run SQL queries with promises
const queryDB = (sql, values = []) =>
  new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) => {
      if (err) reject(err);   // Reject if query fails
      else resolve(result);   // Resolve with query result
    });
  });

// Middleware to check AI usage quota per device
const checkDeviceUsage = async (req, res, next) => {
  try {
    // Get device ID from request headers
    const deviceId = req.headers["x-device-id"];

    // If no device ID is provided, return 400 error
    if (!deviceId) {
      return res.status(400).json({
        error: "No device ID provided",
      });
    }

    // Query database for existing device usage record
    let rows = await queryDB(
      `
      SELECT *
      FROM device_ai_usage
      WHERE device_id = ?
      `,
      [deviceId]
    );

    // If no record exists, insert a new one for this device
    if (rows.length === 0) {
      await queryDB(
        `
        INSERT INTO device_ai_usage
        (device_id)
        VALUES (?)
        `,
        [deviceId]
      );

      // Fetch the newly created record
      rows = await queryDB(
        `
        SELECT *
        FROM device_ai_usage
        WHERE device_id = ?
        `,
        [deviceId]
      );
    }

    // Extract usage record
    const usage = rows[0];

    // Check if device has reached its request limit
    if (usage.requests_used >= usage.requests_limit) {
      return res.status(403).json({
        error: "device_limit_reached",
        message: "This device has used all free AI requests.",
      });
    }

    // Attach usage info to request for downstream handlers
    req.deviceUsage = usage;

    // Allow request to continue
    next();

  } catch (err) {
    // Log error and return 500 if something goes wrong
    console.log(err);

    res.status(500).json({
      error: "Device check failed",
    });
  }
};

// Export middleware for use in routes
module.exports = checkDeviceUsage;
