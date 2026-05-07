const express = require("express");
const {
  addFavoriteController,
  getFavoritesController,
  removeFavoriteController,
} = require("../controllers/favoritesController");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();

router.post("/:hostelId", verifyToken, addFavoriteController);
router.get("/", verifyToken, getFavoritesController);
router.delete("/:hostelId", verifyToken, removeFavoriteController);

module.exports = router;
