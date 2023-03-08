const { decrypt } = require("../util/token");
// this middlewares will extract the token from header and verify
// and push the normalize data to the req.header.user

module.exports = (req, res, next) => {
  const token = req.headers.authorization.substr(7);
  const {user} = decrypt(token);
  req.headers.user = user;
  next();
}