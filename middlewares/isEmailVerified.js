const httpError = require('../util/errors/httpError');

module.exports = (req, res, next) => {
  if (!req.headers.user.isEmailVerified) {
    return res
      .status(403)
      .send(httpError('forbidden', 'Your Email is not verified!!'));
  }
  next();
};
