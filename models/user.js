var mongoose = require('mongoose');
const isUserEmailExist = require('../util/validator/isUserEmailExist');
const { ADMIN, DRIVER, RIDER } = require('../const/user');
const isValidEmail = require('../util/validator/isValidEmail');

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      validate: [isValidEmail, isUserEmailExist],
      required: [true],
    },
    password: {
      type: String,
      minLength: [8],
      maxLength: [12],
      select: false,
    },
    firstName: {
      type: String,
      minLength: [2],
      maxLength: [12],
      required: [true],
    },
    lastName: {
      type: String,
      minLength: [2],
      maxLength: [12],
      required: [true],
    },
    userType: {
      type: String,
      enum: [ADMIN, DRIVER, RIDER],
      default: RIDER,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('User', UserSchema);
