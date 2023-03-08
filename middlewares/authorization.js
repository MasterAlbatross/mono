const httpError = require('../util/errors/httpError');

module.exports = (userType) => {
  return (req, res, next) => {
    let loggedInUserType = 'someDummyType';
    if (req.headers.user) {
      loggedInUserType = req.headers.user.userType;
    }
    if (loggedInUserType !== userType) {
      res
        .status(401)
        .send(
          httpError(
            'unauthorized',
            "You don't have permission to perform this action",
          ),
        );
    } else next();
  };
};
