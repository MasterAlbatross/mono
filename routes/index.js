const express = require("express");
const router = express.Router();
const oAuth2Server = require("express-oauth-server");
const allowJson = require("../util/allowJson");
const setDefaultUser = require("../middlewares/setDefaultUser");
const tokenVerifyAndNormalize = require("../middlewares/tokenVerifyAndNormalize");
const AccessToken = require("../models/accessToken");
const httpError = require("../util/errors/httpError");

const {
  createUser,
  passwordRecoveryRequest,
  passwordRecoveryVerify,
  userNameVerify,
} = require("../controllers/users");
const user = require("../models/user");

router.oauth = new oAuth2Server({
  model: require("../controllers/auth"),
});

//public routes
router.use("/login", allowJson, router.oauth.token());
router.use("/register", setDefaultUser, createUser);

router.use("/password-recovery-request", passwordRecoveryRequest);
router.use("/password-recovery-verify", passwordRecoveryVerify);
router.use("/username-verify", userNameVerify);
router.use([router.oauth.authenticate(), tokenVerifyAndNormalize]);

//Logout
router.get("/logout", async (req, res) => {
  try {
    if (req.headers.user) {
      const { _id } = req.headers.user;
      const token = req.header("Authorization").replace("Bearer ", "");
      const accessToken = await AccessToken.findOneAndDelete({
        userId: _id,
        accessToken: token,
      });
    }
    res.send({ message: req.t("logout_success") });
  } catch (error) {
    res
      .status(500)
      .send(
        httpError(
          "internal_server _error",
          "There is some internal server issue.Try again later.",
          error,
        ),
      );
  }
});

//Logout from all logged in account
router.get("/logoutAll", async (req, res) => {
  try {
    if (req.headers.user) {
      const { _id } = req.headers.user;
      console.log(req.headers.user);
      await AccessToken.deleteMany({ userId: _id });
    }
    res.send({ message: req.t("logoutAll_success") });
  } catch (error) {
    res
      .status(500)
      .send(
        httpError(
          "internal_server _error",
          "There is some internal server issue.Try again later.",
          error,
        ),
      );
  }
});

module.exports = router;
