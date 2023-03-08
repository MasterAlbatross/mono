const express = require("express");
const router = express.Router();
const {
  getAllUser,
  getSingleUser,
  createUser,
  updatePassword,
  updateProfile,
  userNameVerificationRequest,
} = require("../controllers/users");
const authorization = require("../middlewares/authorization");
const { ADMIN } = require("../const/user");

/* GET users listing. */
router.get("/", getAllUser);
router.get("/:id", getSingleUser);
router.post("/", createUser);

router.patch("/update-password", updatePassword);
router.patch("/update-profile", updateProfile);

router.post("/username-verification-request", userNameVerificationRequest);

module.exports = router;
