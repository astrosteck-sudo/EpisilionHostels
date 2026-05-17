const express = require("express");

const router = express.Router();

const verifyManagerToken = require("../middleware/verifyManagerToken");

const {
  getManagerDashboard,
} = require("../controllers/managerDashBoardController");

router.get("/dashboard", verifyManagerToken, getManagerDashboard);

const {
  updateManagerHostel,
} = require("../controllers/managerDashBoardController");

router.put("/update-hostel", verifyManagerToken, updateManagerHostel);

module.exports = router;
