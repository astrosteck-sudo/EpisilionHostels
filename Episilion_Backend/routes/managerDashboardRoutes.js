const express = require("express");

const router = express.Router();

const verifyManagerToken = require("../middleware/verifyManagerToken");

// const {
//   getManagerDashboard,
// } = require("../controllers/managerDashBoardController");



const {
  updateManagerHostel,
  updateManagerPassword,
  getManagerDashboard,
} = require("../controllers/managerDashBoardController");
router.get("/dashboard", verifyManagerToken, getManagerDashboard);
router.put("/update-hostel", verifyManagerToken, updateManagerHostel);
router.put(
  "/update-hostel-password",
  verifyManagerToken,
  updateManagerPassword,
);

module.exports = router;
