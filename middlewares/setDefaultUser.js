var pick = require('lodash.pick');

// this middleware will only keep required field for the user who can create publicly
// and remove other filed that required authentication and authorization
module.exports = (req, res, next) => {
  const publicUserInformation = pick(req.body, [
    'email',
    'password',
    'firstName',
    'lastName',
  ])
  req.body = publicUserInformation;
  next();
}