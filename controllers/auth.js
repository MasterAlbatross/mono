var { v4: uuidv4 } = require('uuid');
var { encrypt } = require('../util/token');
var User = require('../models/user');
var AccessToken = require('../models/accessToken');

module.exports.generateAccessToken = async (client, user, scope) => {
  return encrypt({
    user,
  });
};

module.exports.generateRefreshToken = async (client, user, scope) => {
  return encrypt(uuidv4());
};

module.exports.getClient = async (clientId, clientSecret, callback) => {
  callback(null, {
    clientId,
    clientSecret,
    grants: ['password', 'refresh_token'],
  });
};

module.exports.getUser = async (username, password, callback) => {
  try {
    const user = await User.findOne({ email: username, password });
    callback(null, user);
  } catch (error) {
    callback(null, null);
  }
};

module.exports.saveToken = async (token, client, user, callback) => {
  const { clientId } = client;
  const accessToken = new AccessToken({ ...token, userId: user.id, clientId });
  try {
    await accessToken.save();
    callback(null, { ...accessToken.toJSON(), user, client });
  } catch (error) {
    console.log(error);
    callback(null, null);
  }
};

module.exports.saveAuthorizationCode = async (code, client, user, callback) => {
  callback(null, null);
};

module.exports.getAccessToken = async (bearerToken, callback) => {
  try {
    const { accessToken, accessTokenExpiresAt, userId } =
      await AccessToken.findOne({ accessToken: bearerToken });
    callback(null, {
      accessToken,
      accessTokenExpiresAt,
      user: { id: userId },
    });
  } catch (error) {
    callback(null, null);
  }
};

module.exports.getRefreshToken = async (token, callback) => {
  try {
    const { refreshToken, refreshTokenExpiresAt, userId, clientId } =
      await AccessToken.findOne({ refreshToken: token });

    callback(null, {
      refreshToken,
      refreshTokenExpiresAt,
      user: { id: userId },
      client: { clientId },
    });
  } catch (error) {
    callback(null, null);
  }
};

module.exports.revokeToken = async (token, callback) => {
  const { refreshToken } = token;
  try {
    await AccessToken.remove({ refreshToken });
    callback(null, true);
  } catch (error) {
    callback(null, null);
  }
};
