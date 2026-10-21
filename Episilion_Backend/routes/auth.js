const express = require("express");
const router = express.Router();
const passport = require("passport");

const { signup, login, googleCallback } = require("../controllers/authController");
const { authLimiter } = require("../middleware/rateLimiters");

// AUTH ROUTES
router.post("/signup", authLimiter, signup);
router.post("/login", authLimiter, login);

router.get(
  "/google",
  authLimiter,
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

router.get(
  "/google/callback",
  authLimiter,
  passport.authenticate("google", {
    session: false,
  }),
  googleCallback,
);
module.exports = router;

//KingPin123@gmail.com
