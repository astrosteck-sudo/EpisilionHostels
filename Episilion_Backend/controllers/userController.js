const pool = require("../config/db");

const getMe = async (req, res) => {
    
  try {
    const userId = req.user.user_id;
    

    // user info
    const [users] = await pool.execute(
      `
      SELECT
        user_id,
        name,
        email
      FROM users
      WHERE user_id = ?
      `,
      [userId],
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const user = users[0];

    // active subscription
    const [subscriptions] = await pool.execute(
      `
        SELECT *
        FROM subscriptions
        WHERE user_id = ?
        AND status = 'active'
        ORDER BY created_at DESC
        LIMIT 1
        `,
      [userId],
    );

    // default free user
    let subscriptionData = {
      subscribed: false,
      dailyLimit: 0,
      remainingSearches: 0,
      expiresAt: null,
    };

    if (subscriptions.length > 0) {
      const subscription = subscriptions[0];

      const now = new Date();

      const expiresAt = new Date(subscription.expires_at);

      if (now <= expiresAt) {
        const today = new Date().toISOString().split("T")[0];

        const [usageRows] = await pool.execute(
          `
            SELECT *
            FROM usage_logs
            WHERE user_id = ?
            AND usage_date = ?
            `,
          [userId, today],
        );

        let requestsUsed = 0;

        if (usageRows.length > 0) {
          requestsUsed = usageRows[0].requests_used;
        }

        const remainingSearches = Math.max(
          0,
          subscription.daily_limit - requestsUsed,
        );

        subscriptionData = {
          subscribed: true,

          dailyLimit: subscription.daily_limit,

          remainingSearches,

          expiresAt: subscription.expires_at,
        };
      } else {
        await pool.execute(
          `
          UPDATE subscriptions
          SET status = 'expired'
          WHERE id = ?
          `,
          [subscription.id],
        );
      }
    }

    return res.status(200).json({
      id: user.id,

      firstName: user.first_name,

      email: user.email,

      subscription: subscriptionData,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Failed to fetch user profile",
    });
  }
};

module.exports = {
  getMe,
};
