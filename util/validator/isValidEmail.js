var isEmail = require('validator/lib/isEmail');

module.exports = {
  validator: isEmail,
  message: 'Email is not valid',
};
