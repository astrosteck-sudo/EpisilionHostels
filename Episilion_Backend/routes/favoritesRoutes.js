const express = require("express");
const {
  addFavoriteController,
  getFavoritesController,
  removeFavoriteController,
} = require("../controllers/favoritesController");
const verifyToken = require("../middleware/verifyToken");
const { readLimiter, writeLimiter } = require("../middleware/rateLimiters");
const router = express.Router();

router.post("/:hostelId", writeLimiter, verifyToken, addFavoriteController);
router.get("/", readLimiter, verifyToken, getFavoritesController);
router.delete("/:hostelId", writeLimiter, verifyToken, removeFavoriteController);

module.exports = router;
