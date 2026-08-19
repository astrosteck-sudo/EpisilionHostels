const pool = require("../config/db.js");

const checkDeviceUsage = async (req, res, next) => {
  try {
    const deviceId = req.headers["x-device-id"];

    if (!deviceId) {
      return res.status(400).json({ error: "No device ID provided" });
    }

    // Premium users are already validated by checkAIUsage — device doesn't
    // gate premium accounts, only free-tier abuse.
    if (req.isPremium) {
      return next();
    }

    let [rows] = await pool.query(
      `SELECT * FROM device_ai_usage WHERE device_id = ?`,
      [deviceId]
    );

    if (rows.length === 0) {
      await pool.query(
        `INSERT INTO device_ai_usage (device_id) VALUES (?)`,
        [deviceId]
      );

      [rows] = await pool.query(
        `SELECT * FROM device_ai_usage WHERE device_id = ?`,
        [deviceId]
      );
    }

    const usage = rows[0];

    if (usage.requests_used >= usage.requests_limit) {
      return res.status(403).json({
        error: "device_limit_reached",
        message: "This device has used all free AI requests.",
      });
    }

    req.deviceUsage = usage;
    next();
  } catch (err) {
    console.error("Device check error:", err);
    res.status(500).json({ error: "Device check failed" });
  }
};

module.exports = checkDeviceUsage;