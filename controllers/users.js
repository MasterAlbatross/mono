const pick = require("lodash.pick");

const User = require("../models/user");
const UsernameVerification = require("../models/usernameVerification");
const sendEmail = require("../services/sendEmail");

const httpError = require("../util/errors/httpError");

//Only admin can access all the user
const getAllUser = async (req, res) => {
  //filtering
  let match = {};
  if (req.query.userType) match.userType = req.query.userType;
  if (req.query.email) match.email = req.query.email;
  if (req.query.isActive) match.isActive = req.query.isActive;
  if (req.query.isEmailVerified)
    match.isEmailVerified = req.query.isEmailVerified;

  try {
    const users = await User.find(match)
      .limit(parseInt(req.query.limit))
      .skip(parseInt(req.query.skip));
    res.send(users);
  } catch (error) {
    res
      .status(500)
      .send(
        httpError(
          "internal_server _error",
          "There is some internal server issue.Try again later.",
          error
        )
      );
  }
};

const getSingleUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    res.send(user);
  } catch (error) {
    res.status(404).send(httpError("not_found", "User not found", error));
  }
};

const createUser = async (req, res) => {
  const userInformation = pick(req.body, [
    "email",
    "password",
    "firstName",
    "lastName",
    "userType",
    "isActive",
  ]);
  var user = new User(userInformation);
  try {
    await user.save();
    //! remove password from return;
    //! return id more without recreating the `id` key
    res.status(201).send({
      id: user._id,
      ...userInformation,
    });
  } catch (error) {
    res
      .status(400)
      .send(httpError("bad_request", "Unable to create user", error));
  }
};

const updatePassword = async (req, res) => {
  const userInformation = pick(req.body, [
    "_id",
    "currentPassword",
    "newPassword",
  ]);
  const { _id, currentPassword, newPassword } = userInformation;
  try {
    const user = await User.findOne({ _id, password: currentPassword });
    if (!user) {
      return res
        .status(400)
        .send(
          httpError("bad_request", "password not matched with current one")
        );
    }
    user.password = newPassword;
    await user.save();
    res.send({ message: req.t("password_update_successful") });
  } catch (error) {
    res
      .status(400)
      .send(httpError("bad_request", "Unable to update user", error));
  }
};

const updateProfile = async (req, res) => {
  try {
    //req.body include id
    const userInformation = pick(req.body, ["firstName", "lastName"]);
    const user = await User.findById(req.body._id);
    if (!user) {
      return res
        .status(404)
        .send(httpError("not_found", "User doesn't exist!"));
    }

    const updates = Object.keys(userInformation);
    updates.forEach((update) => {
      user[update] = req.body[update];
    });

    await user.save();
    res.send({ message: req.t("profile_updated_success") });
  } catch (error) {
    res
      .status(400)
      .send(httpError("bad_request", "Unable to update user", error));
  }
};

const verify = async (req, res) => {
  const { verificationCode, verificationId, password } = req.body;
  try {
    const { userId, verificationFor } = await UsernameVerification.findOne({
      _id: verificationId,
      verificationCode,
    });
    if (verificationFor == "username-owner") {
      await User.findByIdAndUpdate(userId, { isEmailVerified: true });
    } else if (verificationFor == "password-recovery") {
      await User.findByIdAndUpdate(userId, { password });
    }
    await UsernameVerification.deleteOne({ _id: verificationId });
    res.status(200).send({
      message: req.t("verification_success"),
    });
  } catch (error) {
    res
      .status(400)
      .send(
        httpError(
          "bad_request",
          `The token has been expire or there is a error while doing the operation`,
          error
        )
      );
  }
};

const passwordRecoveryRequest = async (req, res) => {
  const { username } = req.body;
  try {
    const user = await User.findOne({ email: username });
    if (!user) {
      return res
        .status(404)
        .send(
          httpError("not_found", "User doesn't exist for the given email!")
        );
    }
    const { _id: verificationId } = await createUsernameVerification(
      user,
      "password-recovery"
    );
    res.status(200).send({
      verificationId,
    });
  } catch (error) {
    res
      .status(500)
      .send(
        httpError(
          "internal_server _error",
          "There is some internal server issue.Try again later.",
          error
        )
      );
  }
};

const userNameVerificationRequest = async (req, res) => {
  try {
    const { _id: verificationId } = await createUsernameVerification(
      req.headers.user,
      "username-owner"
    );
    //verificationId send added
    res.status(200).send({
      message: req.t("verification_email_sent"),
      verificationId,
    });
  } catch (error) {
    res
      .status(500)
      .send(
        httpError(
          "internal_server _error",
          "There is some internal server issue.Try again later.",
          error
        )
      );
  }
};

const createUsernameVerification = async (user, verificationFor) => {
  const usernameVerification = new UsernameVerification({
    userId: user._id,
    verificationFor,
  });
  await usernameVerification.save();
  // sending email to user.email
  const html = `<h1>Verification code : ${usernameVerification.verificationCode}</h1>`;
  sendEmail(user.email, "Verification code", html);
  console.log(
    `Sending email to: ${user.email}, Content code:  ${usernameVerification.verificationCode}, verificationId: ${usernameVerification._id} for: ${verificationFor}`
  );
  return usernameVerification;
};

module.exports = {
  getAllUser,
  getSingleUser,
  createUser,
  updatePassword,
  updateProfile,
  passwordRecoveryRequest,
  userNameVerify: verify,
  passwordRecoveryVerify: verify,
  userNameVerificationRequest,
};
