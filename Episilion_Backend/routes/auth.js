const express = require("express");
const router = express.Router();
const passport = require("passport");

const { signup, login, googleCallback } = require("../controllers/authController");

// AUTH ROUTES
router.post("/signup", signup);
router.post("/login", login);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
  }),
  googleCallback,
);
module.exports = router;

//KingPin123@gmail.com
