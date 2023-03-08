const express = require("express");
const router = express.Router();
const bp = require("body-parser");

const {
  getAllProduct,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/products");
const upload = require("../middlewares/upload");
const authorization = require("../middlewares/authorization");
const { ADMIN } = require("../const/user");
router.use(bp.urlencoded({ extended: true }));

router.get("/", getAllProduct);
router.get("/:id", getSingleProduct);
router.post(
  "/",
  upload.fields([{ name: "image", maxCount: 3 }]),
  createProduct
);
router.patch(
  "/:id",
  upload.fields([{ name: "image", maxCount: 3 }]),
  updateProduct
);
router.delete("/:id", deleteProduct);

module.exports = router;
