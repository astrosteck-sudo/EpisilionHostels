const express = require("express");

const router = express.Router();

const {
  loginManager,
} = require("../controllers/managerAuthController");
const { authLimiter } = require("../middleware/rateLimiters");

router.post("/login", authLimiter, loginManager);

module.exports = router;