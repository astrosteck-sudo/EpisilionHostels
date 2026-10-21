const express = require("express");
const router = express.Router();

const { searchHostelsAI } = require("../controllers/intentController");

const verifyToken = require("../middleware/verifyToken");
const checkAIUsage = require("../middleware/checkAIUsage");
const checkDeviceUsage = require("../middleware/checkDeviceUsage");
const { aiLimiter } = require("../middleware/rateLimiters");
//const subscriptionMiddleware = require("../middleware/subscriptionMiddleware");

router.post(
  "/search",
  aiLimiter,
  verifyToken,
  checkAIUsage,
  checkDeviceUsage,
  searchHostelsAI,
);

module.exports = router;
