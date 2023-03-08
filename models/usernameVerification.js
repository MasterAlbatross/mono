//  the username could be phone number or email

var mongoose = require('mongoose');

const UsernameVerification = new mongoose.Schema(
  {
    userId: mongoose.Schema.Types.ObjectId,
    verificationCode: {
      type: String,
      default: () => Math.floor(100000 + Math.random() * 900000),
    },
    verificationFor: {
      type: String,
      enum: ['password-recovery', 'username-owner'],
    },
  },
  { timestamps: true, expires: 60 },
);

module.exports = mongoose.model('UsernameVerification', UsernameVerification);
