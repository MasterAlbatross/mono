module.exports = (req, res, next) => {
  if (req.is('json'))
    req.headers['content-type'] = 'application/x-www-form-urlencoded';
  next();
};
