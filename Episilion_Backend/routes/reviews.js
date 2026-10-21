const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth");
const { readLimiter, writeLimiter } = require("../middleware/rateLimiters");

const {
  addReview,
  getReviews
} = require("../controllers/reviewController");


// POST review (needs login)
router.post("/", writeLimiter, authMiddleware, addReview);

// GET reviews
router.get("/:hostelId", readLimiter, getReviews);

module.exports = router;