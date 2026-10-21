const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth");
const { readLimiter } = require("../middleware/rateLimiters");

const { getMe } = require("../controllers/userController");

router.get("/me", readLimiter, authMiddleware, getMe);

module.exports = router;
