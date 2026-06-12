const crypto = require('crypto');

const pool = require('../config/db');

const {
  initializePayment,
  verifyPayment,
} = require('../services/paystackService');

const generateReference = require('../utils/generateReference');

const initialize = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const userEmail = req.user.email;
   
    const { planId } = req.body;

    const [plans] = await pool.execute(
      'SELECT * FROM plans WHERE id = ?',
      [planId]
    );

    if (plans.length === 0) {
      return res.status(404).json({
        message: 'Plan not found',
      });
    }

    const plan = plans[0];

    const reference = generateReference();

    await pool.execute(
      `INSERT INTO payments
      (user_id, plan_id, reference_code, amount)
      VALUES (?, ?, ?, ?)`,
      [userId, plan.id, reference, plan.amount]
    );

    const paymentData = {
      email: userEmail,
      amount: plan.amount * 100,
      reference,

      callback_url:
        `https://episilion-backend-2lt0.onrender.com/api/payment/success`,

      metadata: {
        userId,
        planId,
      },
    };

    const paystackResponse =
      await initializePayment(paymentData);

    return res.status(200).json({
      authorization_url:
        paystackResponse.data.authorization_url,

      reference,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: 'Initialization failed',
    });
  }
};

const verify = async (req, res) => {
  try {
    const { reference } = req.params;
    

    const [payments] = await pool.execute(
      'SELECT * FROM payments WHERE reference_code = ?',
      [reference]
    );

    

    if (payments.length === 0) {
      return res.status(404).json({
        message: 'Payment not found',
      });
    }

    const payment = payments[0];

    if (payment.status === 'success') {
      return res.status(200).json({
        message: 'Payment already verified',
      });
    }

    const verification =
      await verifyPayment(reference);

    if (verification.data.status !== 'success') {
        console.log('Payment unsuccessful')
      return res.status(400).json({
        message: 'Payment unsuccessful',
      });
    }

    await pool.execute(
      `UPDATE payments
       SET status = 'success',
           channel = ?,
           paid_at = NOW()
       WHERE reference_code = ?`,
      [verification.data.channel, reference]
    );

    const [plans] = await pool.execute(
      'SELECT * FROM plans WHERE id = ?',
      [payment.plan_id]
    );

    const plan = plans[0];

    const startsAt = new Date();

    const expiresAt = new Date();

    expiresAt.setDate(
      expiresAt.getDate() + plan.duration_days
    );

    await pool.execute(
      `UPDATE subscriptions
       SET status = 'expired'
       WHERE user_id = ?
       AND status = 'active'`,
      [payment.user_id]
    );

    await pool.execute(
      `INSERT INTO subscriptions
      (
        user_id,
        plan_id,
        starts_at,
        expires_at,
        daily_limit,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        payment.user_id,
        payment.plan_id,
        startsAt,
        expiresAt,
        plan.daily_limit,
        'active',
      ]
    );

    return res.status(200).json({
      message: 'Payment verified successfully',
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: 'Verification failed',
    });
  }
};

const webhook = async (req, res) => {
  try {
    const hash = crypto
      .createHmac(
        'sha512',
        process.env.PAYSTACK_SECRET_KEY
      )
      .update(req.body)
      .digest('hex');

    if (
      hash !== req.headers['x-paystack-signature']
    ) {
      return res.sendStatus(401);
    }

    const event = JSON.parse(
      req.body.toString()
    );

    if (event.event === 'charge.success') {
      const paymentData = event.data;

      const reference =
        paymentData.reference;

      const [payments] = await pool.execute(
        `SELECT * FROM payments
         WHERE reference_code = ?`,
        [reference]
      );

      if (payments.length === 0) {
        return res.sendStatus(404);
      }

      const payment = payments[0];

      if (payment.status === 'success') {
        return res.sendStatus(200);
      }

      await pool.execute(
        `UPDATE payments
         SET status = 'success',
             channel = ?,
             paid_at = NOW()
         WHERE reference_code = ?`,
        [paymentData.channel, reference]
      );

      const [plans] = await pool.execute(
        'SELECT * FROM plans WHERE id = ?',
        [payment.plan_id]
      );

      const plan = plans[0];

      const startsAt = new Date();

      const expiresAt = new Date();

      expiresAt.setDate(
        expiresAt.getDate() +
          plan.duration_days
      );

      await pool.execute(
        `UPDATE subscriptions
         SET status = 'expired'
         WHERE user_id = ?
         AND status = 'active'`,
        [payment.user_id]
      );

      await pool.execute(
        `INSERT INTO subscriptions
        (
          user_id,
          plan_id,
          starts_at,
          expires_at,
          daily_limit,
          status
        )
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
          payment.user_id,
          payment.plan_id,
          startsAt,
          expiresAt,
          plan.daily_limit,
          'active',
        ]
      );
    }

    return res.sendStatus(200);
  } catch (error) {
    console.log(error);

    return res.sendStatus(500);
  }
};

module.exports = {
  initialize,
  verify,
  webhook,
};