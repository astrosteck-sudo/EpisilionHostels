const express = require("express");
const router = express.Router();

const { getHostels } = require("../controllers/hostelController");
const { readLimiter } = require("../middleware/rateLimiters");

router.get("/", readLimiter, getHostels);

module.exports = router;