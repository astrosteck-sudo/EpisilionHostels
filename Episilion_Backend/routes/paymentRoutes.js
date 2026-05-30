const express = require("express");

const router = express.Router();

const {
  initialize,
  verify,
  webhook,
} = require("../controllers/paymentController");

const authMiddleware = require("../middleware/auth.js");

router.post("/initialize", authMiddleware, initialize);

router.get("/verify/:reference", authMiddleware, verify);

router.post("/webhook", webhook);

module.exports = router;
