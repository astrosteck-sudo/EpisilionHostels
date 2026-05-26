const pool = require("../config/db.js"); // ✅ import pool

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

    // ✅ Query database for existing device usage record
    let [rows] = await pool.query(
      `SELECT * FROM device_ai_usage WHERE device_id = ?`,
      [deviceId]
    );

    // If no record exists, insert a new one for this device
    if (rows.length === 0) {
      await pool.query(
        `INSERT INTO device_ai_usage (device_id) VALUES (?)`,
        [deviceId]
      );

      // Fetch the newly created record
      [rows] = await pool.query(
        `SELECT * FROM device_ai_usage WHERE device_id = ?`,
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
    console.error("Device check error:", err);
    res.status(500).json({
      error: "Device check failed",
    });
  }
};

module.exports = checkDeviceUsage;
