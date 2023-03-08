const express = require("express");
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../../models/user");
const AccessToken = require("../../models/accessToken");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../controllers/auth");

const router = express.Router();

const FACEBOOK_AUTH_OPTIONS = {
  callbackURL: "/auth/facebook/callback",
  clientID: process.env.F_CLIENT_ID,
  clientSecret: process.env.F_CLIENT_SECRET,
  profileFields: [
    "id",
    "displayName",
    "name",
    "gender",
    "picture.type(large)",
    "email",
  ],
};
router.use(passport.initialize());

const facebookVerifyCallback = async (
  accessToken,
  refreshToken,
  profile,
  done
) => {
  const { first_name, last_name, email } = profile._json;
  try {
    var user = await User.findOne({ email });
    if (!user) {
      user = new User();
      user.email = email;
      user.firstName = first_name;
      user.lastName = last_name;
      user.isEmailVerified = true;
      await user.save();
    }
    const token = new AccessToken();
    token.accessToken = await generateAccessToken(null, user);
    token.accessTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000);
    token.refreshToken = await generateRefreshToken();
    token.refreshTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000);
    token.userId = user._id;
    await token.save();
    done(null, token);
  } catch (error) {
    console.log(error);
  }
};
passport.use(
  new FacebookStrategy(FACEBOOK_AUTH_OPTIONS, facebookVerifyCallback)
);

router.get("/", passport.authenticate("facebook", { scope: "email" }));

router.get(
  "/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/",
    session: false,
  }),
  (req, res) => {
    const { accessToken, refreshToken } = req.user;
    //console.log('shamim', req.user);
    res.redirect(
      `${process.env.APP_URL}/?accessToken=${accessToken}&refreshToken=${refreshToken}`
    );
  }
);

module.exports = router;
