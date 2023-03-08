var mongoose = require('mongoose');

const AccessToken = new mongoose.Schema(
  {
    accessToken: String,
    accessTokenExpiresAt: Date,
    clientId: String,
    refreshToken: String,
    refreshTokenExpiresAt: Date,
    userId: mongoose.Schema.Types.ObjectId,
  },
  { timestamps: true },
);

module.exports = mongoose.model('AccessToken', AccessToken);
