const express = require("express");
const router = express.Router();

const {
  getAllFavorites,
  createFavorite,
  deleteFavorite,
} = require("../controllers/favorite");
const authorization = require("../middlewares/authorization");
const { ADMIN } = require("../const/user");

router.get("/", getAllFavorites);
router.post("/", createFavorite);
router.delete("/:id", deleteFavorite);

module.exports = router;
