const express = require("express");
const router = express.Router();

const {
    subscribeNewsletter,
    joinWaitlist,
} = require("../controllers/subscriberController");
const { subscribeLimiter } = require("../middleware/rateLimiters");

router.post("/newsletter", subscribeLimiter, subscribeNewsletter);

router.post("/waitlist", subscribeLimiter, joinWaitlist);

module.exports = router;