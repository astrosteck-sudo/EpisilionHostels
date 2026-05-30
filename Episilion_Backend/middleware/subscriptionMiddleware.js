const pool = require('../config/db');

const subscriptionMiddleware =
  async (req, res, next) => {
    try {
      const userId = req.user.id;

      const [subscriptions] =
        await pool.execute(
          `SELECT * FROM subscriptions
           WHERE user_id = ?
           AND status = 'active'
           ORDER BY created_at DESC
           LIMIT 1`,
          [userId]
        );

      if (
        subscriptions.length === 0
      ) {
        return res.status(403).json({
          message:
            'No active subscription',
        });
      }

      const subscription =
        subscriptions[0];

      const now = new Date();

      const expiresAt = new Date(
        subscription.expires_at
      );

      if (now > expiresAt) {
        await pool.execute(
          `UPDATE subscriptions
           SET status = 'expired'
           WHERE id = ?`,
          [subscription.id]
        );

        return res.status(403).json({
          message:
            'Subscription expired',
        });
      }

      const today = new Date()
        .toISOString()
        .split('T')[0];

      let [usageRows] =
        await pool.execute(
          `SELECT * FROM usage_logs
           WHERE user_id = ?
           AND usage_date = ?`,
          [userId, today]
        );

      if (
        usageRows.length === 0
      ) {
        await pool.execute(
          `INSERT INTO usage_logs
          (user_id, usage_date, requests_used)
          VALUES (?, ?, 0)`,
          [userId, today]
        );

        [usageRows] =
          await pool.execute(
            `SELECT * FROM usage_logs
             WHERE user_id = ?
             AND usage_date = ?`,
            [userId, today]
          );
      }

      const usage = usageRows[0];

      if (
        usage.requests_used >=
        subscription.daily_limit
      ) {
        return res.status(403).json({
          message:
            'Daily request limit reached',
        });
      }

      req.subscription =
        subscription;

      next();
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        message:
          'Subscription validation failed',
      });
    }
  };

module.exports =
  subscriptionMiddleware;