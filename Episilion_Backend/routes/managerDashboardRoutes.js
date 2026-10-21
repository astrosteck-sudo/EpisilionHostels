const express = require("express");

const router = express.Router();

const verifyManagerToken = require("../middleware/verifyManagerToken");
const { readLimiter, writeLimiter } = require("../middleware/rateLimiters");

// const {
//   getManagerDashboard,
// } = require("../controllers/managerDashBoardController");



const {
  updateManagerHostel,
  updateManagerPassword,
  getManagerDashboard,
} = require("../controllers/managerDashBoardController");
router.get("/dashboard", readLimiter, verifyManagerToken, getManagerDashboard);
router.put("/update-hostel", writeLimiter, verifyManagerToken, updateManagerHostel);
router.put(
  "/update-hostel-password",
  writeLimiter,
  verifyManagerToken,
  updateManagerPassword,
);

module.exports = router;
