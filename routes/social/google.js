const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../../models/user");
const AccessToken = require("../../models/accessToken");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../controllers/auth");

const router = express.Router();
router.use(passport.initialize());

const GOOGLE_AUTH_OPTIONS = {
  callbackURL: "/auth/google/callback",
  clientID: process.env.G_CLIENT_ID,
  clientSecret: process.env.G_CLIENT_SECRET,
};

const googleVerifyCallback = async (
  accessToken,
  refreshToken,
  profile,
  done
) => {
  const { name, email, email_verified } = profile._json;
  try {
    var user = await User.findOne({ email });
    if (!user) {
      user = new User();
      user.email = email;
      user.firstName = name;
      user.lastName = name;
      user.isEmailVerified = email_verified;
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
passport.use(new GoogleStrategy(GOOGLE_AUTH_OPTIONS, googleVerifyCallback));

router.get(
  "/",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
    session: false,
  }),
  (req, res) => {
    const { accessToken, refreshToken } = req.user;
    //console.log('shamim', req.user);
    //console.log('Google called us back!');
    res.redirect(
      `${process.env.APP_URL}/?accessToken=${accessToken}&refreshToken=${refreshToken}`
    );
  }
);
module.exports = router;
