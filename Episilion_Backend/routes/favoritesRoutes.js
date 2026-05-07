const express = require("express");
const { addFavoriteController, getFavoritesController } = require("../controllers/favoritesController");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();


router.post("/:hostelId", verifyToken, addFavoriteController);
router.get("/", verifyToken, getFavoritesController);

module.exports = router;
