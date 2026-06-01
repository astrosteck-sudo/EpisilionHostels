const pool = require("../config/db.js");

const checkDeviceUsage = async (req, res, next) => {
  try {
    const deviceId = req.headers["x-device-id"];

    if (!deviceId) {
      return res.status(400).json({
        error: "No device ID provided",
      });
    }

    const userId = req.user.user_id;

    // =========================
    // CHECK ACTIVE SUBSCRIPTION
    // =========================

    const [subscriptions] = await pool.query(
      `
      SELECT *
      FROM subscriptions
      WHERE user_id = ?
      AND status = 'active'
      AND expires_at > NOW()
      ORDER BY created_at DESC
      LIMIT 1
      `,
      [userId]
    );

    // =========================
    // PREMIUM USER
    // =========================

    if (subscriptions.length > 0) {
      const subscription = subscriptions[0];

      const today = new Date()
        .toISOString()
        .split("T")[0];

      let [usageRows] = await pool.query(
        `
        SELECT *
        FROM usage_logs
        WHERE user_id = ?
        AND usage_date = ?
        `,
        [userId, today]
      );

      // Create row if it doesn't exist
      if (usageRows.length === 0) {
        await pool.query(
          `
          INSERT INTO usage_logs
          (
            user_id,
            usage_date,
            requests_used
          )
          VALUES (?, ?, 0)
          `,
          [userId, today]
        );

        [usageRows] = await pool.query(
          `
          SELECT *
          FROM usage_logs
          WHERE user_id = ?
          AND usage_date = ?
          `,
          [userId, today]
        );
      }

      const usage = usageRows[0];

      if (
        usage.requests_used >=
        subscription.daily_limit
      ) {
        return res.status(403).json({
          error: "premium_limit_reached",
          message:
            "You have reached your daily AI limit.",
        });
      }

      req.isPremium = true;

      req.aiUsage = {
        requests_used:
          usage.requests_used,

        requests_limit:
          subscription.daily_limit,
      };

      return next();
    }

    // =========================
    // FREE USER
    // =========================

    let [rows] = await pool.query(
      `
      SELECT *
      FROM device_ai_usage
      WHERE device_id = ?
      `,
      [deviceId]
    );

    if (rows.length === 0) {
      await pool.query(
        `
        INSERT INTO device_ai_usage
        (device_id)
        VALUES (?)
        `,
        [deviceId]
      );

      [rows] = await pool.query(
        `
        SELECT *
        FROM device_ai_usage
        WHERE device_id = ?
        `,
        [deviceId]
      );
    }

    const usage = rows[0];

    if (
      usage.requests_used >=
      usage.requests_limit
    ) {
      return res.status(403).json({
        error: "device_limit_reached",
        message:
          "This device has used all free AI requests.",
      });
    }

    req.isPremium = false;

    req.aiUsage = {
      requests_used:
        usage.requests_used,

      requests_limit:
        usage.requests_limit,
    };

    req.deviceUsage = usage;

    next();
  } catch (err) {
    console.error(
      "Device check error:",
      err
    );

    res.status(500).json({
      error: "Device check failed",
    });
  }
};

module.exports = checkDeviceUsage;