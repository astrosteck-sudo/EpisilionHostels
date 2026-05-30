const express = require("express");
const router = express.Router();

const { searchHostelsAI } = require("../controllers/intentController");

const verifyToken = require("../middleware/verifyToken");
const checkAIUsage = require("../middleware/checkAIUsage");
const checkDeviceUsage = require("../middleware/checkDeviceUsage");
const subscriptionMiddleware = require('../middleware/subscriptionMiddleware')

router.post("/search", verifyToken,checkDeviceUsage, checkAIUsage,subscriptionMiddleware, searchHostelsAI);

module.exports = router;
