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
router.get("/", authorization(ADMIN), getAllUser);
router.get("/:id", authorization(ADMIN), getSingleUser);
router.post("/", authorization(ADMIN), createUser);

router.patch("/update-password", updatePassword);
router.patch("/update-profile", updateProfile);

router.post("/username-verification-request", userNameVerificationRequest);

module.exports = router;
