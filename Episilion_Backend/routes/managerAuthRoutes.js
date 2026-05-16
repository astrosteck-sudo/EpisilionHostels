const express = require("express");

const router = express.Router();

const {
  loginManager,
} = require("../controllers/managerAuthController");

router.post("/login", loginManager);

module.exports = router;