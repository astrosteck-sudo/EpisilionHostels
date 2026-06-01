const pool = require("../config/db.js");

const checkAIUsage = async (req, res, next) => {
  try {
    const userId = req.user.user_id;

    // =========================
    // 1. CHECK SUBSCRIPTION FIRST
    // =========================
    const [subs] = await pool.query(
      `
      SELECT *
      FROM subscriptions
      WHERE user_id = ?
      AND status = 'active'
      AND expires_at > NOW()
      LIMIT 1
      `,
      [userId]
    );

    const today = new Date().toISOString().split("T")[0];

    // =========================
    // 2. PREMIUM USER LOGIC
    // =========================
    if (subs.length > 0) {
      const subscription = subs[0];

      let [usageRows] = await pool.query(
        `
        SELECT *
        FROM usage_logs
        WHERE user_id = ?
        AND usage_date = ?
        `,
        [userId, today]
      );

      // create usage row if missing
      if (usageRows.length === 0) {
        await pool.query(
          `
          INSERT INTO usage_logs (user_id, usage_date, requests_used)
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

      if (usage.requests_used >= subscription.daily_limit) {
        return res.status(403).json({
          error: "premium_limit_reached",
          message: "Daily AI limit reached. Try again tomorrow.",
        });
      }

      req.isPremium = true;

      req.aiUsage = {
        requests_used: usage.requests_used,
        requests_limit: subscription.daily_limit,
      };

      return next();
    }

    // =========================
    // 3. FREE USER LOGIC (DEVICE)
    // =========================
    const deviceId = req.headers["x-device-id"];

    if (!deviceId) {
      return res.status(400).json({
        error: "No device ID provided",
      });
    }

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
        INSERT INTO device_ai_usage (device_id)
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

    const deviceUsage = rows[0];

    if (deviceUsage.requests_used >= deviceUsage.requests_limit) {
      return res.status(403).json({
        error: "device_limit_reached",
        message: "This device has used all free AI requests.",
      });
    }

    req.isPremium = false;

    req.aiUsage = {
      requests_used: deviceUsage.requests_used,
      requests_limit: deviceUsage.requests_limit,
    };

    req.deviceUsage = deviceUsage;

    return next();
  } catch (err) {
    console.error("AI usage check error:", err);

    return res.status(500).json({
      error: "AI usage check failed",
    });
  }
};

module.exports = checkAIUsage;