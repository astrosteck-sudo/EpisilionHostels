const express = require("express");

const router = express.Router();

const verifyManagerToken = require("../middleware/verifyManagerToken");

const {
  getManagerDashboard,
} = require("../controllers/managerDashBoardController");

router.get("/dashboard", verifyManagerToken, getManagerDashboard);

module.exports = router;
