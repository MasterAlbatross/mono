const express = require("express");
const router = express.Router();

const {
  getAllComments,
  createComment,
  updateComment,
  deleteComment,
} = require("../controllers/comments");
const authorization = require("../middlewares/authorization");
const { ADMIN } = require("../const/user");

router.get("/:id", getAllComments);
router.post("/", createComment);
router.patch("/:id", updateComment);
router.delete("/:id", deleteComment);

module.exports = router;
