const express = require("express");

const router = express.Router();

const {
  initialize,
  verify,
  webhook,
} = require("../controllers/paymentController");

const authMiddleware = require("../middleware/auth.js");
const { paymentLimiter, webhookLimiter } = require("../middleware/rateLimiters");

router.post("/initialize", paymentLimiter, authMiddleware, initialize);

router.get("/verify/:reference", paymentLimiter, authMiddleware, verify);

router.post("/webhook", webhookLimiter, webhook);

module.exports = router;
