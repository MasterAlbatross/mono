const express = require("express");
const router = express.Router();

const {
  getAllCategory,
  getSingleCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category");
const authorization = require("../middlewares/authorization");
const { ADMIN } = require("../const/user");

router.get("/", getAllCategory);
router.get("/:id", getSingleCategory);
router.post("/", createCategory);
router.patch("/:id", updateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;
