const express = require("express");
const router = express.Router();
const bp = require("body-parser");

const {
  getAllNews,
  getSingleNews,
  createNews,
  updateNews,
  deleteNews,
} = require("../controllers/news");
const upload = require("../middlewares/upload");
const authorization = require("../middlewares/authorization");
const { ADMIN } = require("../const/user");
router.use(bp.urlencoded({ extended: true }));

router.get("/", getAllNews);
router.get("/:id", getSingleNews);
router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "logo", maxCount: 1 },
  ]),
  createNews
);
router.patch(
  "/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "logo", maxCount: 1 },
  ]),
  updateNews
);
router.delete("/:id", deleteNews);

module.exports = router;
