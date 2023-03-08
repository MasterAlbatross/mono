var { sign, verify } = require('jsonwebtoken');
var { JWT_SIGN_KEY } = require('../config');

module.exports.encrypt = (data) => {
  const jwtToken = sign(data, JWT_SIGN_KEY);
  return Buffer.from(jwtToken, 'utf8').toString('base64');
};

module.exports.decrypt = (token) => {
  const plainToken = Buffer.from(token, 'base64').toString('utf8');
  return verify(plainToken, JWT_SIGN_KEY);
};
